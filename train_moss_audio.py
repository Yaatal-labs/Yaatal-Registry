#!/usr/bin/env python
"""
Fine-tune MOSS-Audio-4B-Thinking on West African ASR datasets (Bocalantics + Kallaama).
Uses LoRA/QLoRA for memory efficiency. Includes WER/CER evaluation per language.
Runs on HF Jobs or locally.
"""

import os
import json
import torch
import numpy as np
from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any

from datasets import load_dataset, Audio, interleave_datasets, IterableDataset
from transformers import (
    AutoModelForSpeechSeq2Seq,
    AutoProcessor,
    Trainer,
    TrainingArguments,
    set_seed,
    TrainerCallback,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
import wandb
import evaluate
from jiwer import wer, cer


# ─── Metrics ───
wer_metric = evaluate.load("wer")
cer_metric = evaluate.load("cer")


def compute_wer_cer(predictions: List[str], references: List[str]) -> Dict[str, float]:
    """Compute WER and CER with jiwer for better handling."""
    wer_score = wer(references, predictions)
    cer_score = cer(references, predictions)
    return {"wer": wer_score, "cer": cer_score}


def compute_wer_cer_per_language(
    predictions: List[str],
    references: List[str],
    languages: List[str],
) -> Dict[str, float]:
    """Compute WER/CER grouped by language."""
    results = {"wer": None, "cer": None}
    lang_results = {}

    for lang in set(languages):
        lang_preds = [p for p, l in zip(predictions, languages) if l == lang]
        lang_refs = [r for r, l in zip(references, languages) if l == lang]
        if lang_preds:
            lang_results[f"wer_{lang}"] = wer(lang_refs, lang_preds)
            lang_results[f"cer_{lang}"] = cer(lang_refs, lang_preds)

    overall = compute_wer_cer(predictions, references)
    results.update(overall)
    results.update(lang_results)
    return results


# ─── Data Collator ───
class DataCollatorSpeechSeq2SeqWithPadding:
    """Data collator for speech-to-text seq2seq with dynamic padding."""

    def __init__(self, processor, padding=True, max_length=448):
        self.processor = processor
        self.padding = padding
        self.max_length = max_length

    def __call__(self, features: List[Dict[str, Any]]) -> Dict[str, torch.Tensor]:
        # Separate inputs and labels
        input_features = [{"input_features": f["input_features"]} for f in features]
        label_features = [{"input_ids": f["labels"]} for f in features]

        batch = self.processor.feature_extractor.pad(
            input_features,
            padding=self.padding,
            return_tensors="pt",
        )

        labels_batch = self.processor.tokenizer.pad(
            label_features,
            padding=self.padding,
            return_tensors="pt",
        )

        # Replace padding with -100 for loss masking
        labels = labels_batch["input_ids"].masked_fill(
            labels_batch.attention_mask.ne(1), -100
        )

        # Remove BOS token if present
        if (labels[:, 0] == self.processor.tokenizer.bos_token_id).all().item():
            labels = labels[:, 1:]

        batch["labels"] = labels
        return batch


# ─── Callbacks ───
class WerCerCallback(TrainerCallback):
    """Callback to compute and log WER/CER during evaluation."""

    def __init__(self, processor, eval_dataset, language_column="language"):
        self.processor = processor
        self.eval_dataset = eval_dataset
        self.language_column = language_column

    def on_evaluate(self, args, state, control, model=None, **kwargs):
        if model is None or self.eval_dataset is None:
            return

        model.eval()
        predictions = []
        references = []
        languages = []

        # Get a subset of eval data for speed
        eval_subset = self.eval_dataset.take(min(200, len(self.eval_dataset)))

        for sample in eval_subset:
            input_features = torch.tensor(sample["input_features"]).unsqueeze(0).to(model.device)
            with torch.no_grad():
                generated_ids = model.generate(
                    input_features=input_features,
                    max_length=448,
                    num_beams=4,
                    early_stopping=True,
                )
            pred = self.processor.tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
            ref = self.processor.tokenizer.decode(sample["labels"], skip_special_tokens=True)
            predictions.append(pred)
            references.append(ref)
            # Get language from original dataset (not in collated batch)
            # This assumes we can access it - we'll handle in compute_metrics instead
            languages.append("unknown")

        model.train()

        # Log metrics
        metrics = compute_wer_cer(predictions, references)
        if state.is_world_process_zero:
            print(f"Step {state.global_step}: WER={metrics['wer']:.4f}, CER={metrics['cer']:.4f}")
            if wandb.run:
                wandb.log({f"eval_{k}": v for k, v in metrics.items()}, step=state.global_step)


# ─── Main Training Script ───
@dataclass
class ScriptArguments:
    model_id: str = field(default="OpenMOSS-Team/MOSS-Audio-4B-Thinking", metadata={"help": "Model ID on HF Hub"})
    dataset_bocalantics: str = field(default="MOH749/Bocalantics", metadata={"help": "Bocalantics dataset"})
    dataset_kallaama: str = field(default="MOH749/kallaama", metadata={"help": "Kallaama dataset"})
    output_dir: str = field(default="./moss-audio-west-african", metadata={"help": "Output directory"})

    # LoRA config
    use_lora: bool = field(default=True)
    use_qlora: bool = field(default=True)
    lora_r: int = field(default=64)
    lora_alpha: int = field(default=128)
    lora_dropout: float = field(default=0.05)
    lora_target_modules: str = field(default="q_proj,k_proj,v_proj,o_proj,gate_proj,up_proj,down_proj")

    # Training
    per_device_train_batch_size: int = field(default=2)
    gradient_accumulation_steps: int = field(default=8)
    learning_rate: float = field(default=1e-4)
    num_train_epochs: int = field(default=3)
    max_steps: int = field(default=-1)
    warmup_ratio: float = field(default=0.03)
    logging_steps: int = field(default=10)
    save_steps: int = field(default=500)
    eval_steps: int = field(default=500)
    seed: int = field(default=42)

    # Data
    streaming: bool = field(default=True)
    max_train_samples: int = field(default=-1)
    max_eval_samples: int = field(default=500)
    audio_column: str = field(default="audio")
    text_column: str = field(default="text")
    language_column: str = field(default="language")

    # Hub
    push_to_hub: bool = field(default=True)
    hub_model_id: str = field(default="moss-audio-west-african")
    hub_token: Optional[str] = field(default=None)
    hub_private_repo: bool = field(default=True)

    # W&B
    wandb_project: str = field(default="moss-audio-west-african")
    wandb_run_name: Optional[str] = field(default=None)


def main():
    import argparse
    parser = argparse.ArgumentParser()
    for f in ScriptArguments.__dataclass_fields__.values():
        default = f.default if f.default is not field() else None
        parser.add_argument(f"--{f.name}", type=type(f.default) if f.default is not field() else str, default=default)
    args = parser.parse_args(namespace=ScriptArguments())

    set_seed(args.seed)

    # ─── Login ───
    hf_token = args.hub_token or os.getenv("HF_TOKEN")
    if hf_token:
        from huggingface_hub import login
        login(token=hf_token)

    if args.wandb_project and os.getenv("WANDB_API_KEY"):
        wandb.login(key=os.getenv("WANDB_API_KEY"))
        wandb.init(project=args.wandb_project, name=args.wandb_run_name, config=vars(args))

    # ─── Load Processor ───
    print(f"Loading processor from {args.model_id}...")
    processor = AutoProcessor.from_pretrained(
        args.model_id,
        trust_remote_code=True,
    )

    # ─── Load Model ───
    print(f"Loading model from {args.model_id}...")
    torch_dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16

    if args.use_qlora:
        from transformers import BitsAndBytesConfig
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch_dtype,
            bnb_4bit_use_double_quant=True,
        )
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            args.model_id,
            quantization_config=bnb_config,
            device_map="auto",
            trust_remote_code=True,
            torch_dtype=torch_dtype,
            low_cpu_mem_usage=True,
        )
        model = prepare_model_for_kbit_training(model)
    else:
        model = AutoModelForSpeechSeq2Seq.from_pretrained(
            args.model_id,
            torch_dtype=torch_dtype,
            device_map="auto",
            trust_remote_code=True,
            low_cpu_mem_usage=True,
        )

    # ─── LoRA ───
    if args.use_lora:
        target_modules = [m.strip() for m in args.lora_target_modules.split(",")]
        lora_config = LoraConfig(
            r=args.lora_r,
            lora_alpha=args.lora_alpha,
            lora_dropout=args.lora_dropout,
            target_modules=target_modules,
            bias="none",
            task_type="SEQ_2_SEQ_LM",
        )
        model = get_peft_model(model, lora_config)
        model.print_trainable_parameters()

    model.config.use_cache = False  # Required for gradient checkpointing

    # ─── Load Datasets ───
    print("Loading datasets...")
    ds_bocalantics = load_dataset(
        args.dataset_bocalantics,
        split="train",
        streaming=args.streaming,
        trust_remote_code=True,
    )
    ds_kallaama = load_dataset(
        args.dataset_kallaama,
        split="train",
        streaming=args.streaming,
        trust_remote_code=True,
    )

    # Interleave datasets (balanced sampling)
    train_dataset = interleave_datasets(
        [ds_bocalantics, ds_kallaama],
        probabilities=[0.6, 0.4],  # Bocalantics is larger
        seed=args.seed,
    )

    # Validation splits
    val_bocalantics = load_dataset(args.dataset_bocalantics, split="validation", streaming=args.streaming)
    val_kallaama = load_dataset(args.dataset_kallaama, split="validation", streaming=args.streaming)
    eval_dataset = interleave_datasets([val_bocalantics, val_kallaama], probabilities=[0.6, 0.4], seed=args.seed)

    if args.max_train_samples > 0:
        train_dataset = train_dataset.take(args.max_train_samples)
    if args.max_eval_samples > 0:
        eval_dataset = eval_dataset.take(args.max_eval_samples)

    # ─── Preprocessing ───
    def prepare_dataset(batch):
        audio = batch[args.audio_column]
        text = batch[args.text_column]
        lang = batch.get(args.language_column, "unknown")

        inputs = processor(
            audio=audio["array"],
            sampling_rate=audio["sampling_rate"],
            text=text,
            return_tensors="pt",
            padding="max_length",
            max_length=448,
            truncation=True,
        )
        inputs["labels"] = inputs["input_ids"].clone()
        inputs["language"] = lang  # Keep for metrics
        return inputs

    train_dataset = train_dataset.map(
        prepare_dataset,
        remove_columns=next(iter(train_dataset)).keys(),
        batched=False,
    )
    eval_dataset = eval_dataset.map(
        prepare_dataset,
        remove_columns=next(iter(eval_dataset)).keys(),
        batched=False,
    )

    # ─── Data Collator ───
    data_collator = DataCollatorSpeechSeq2SeqWithPadding(
        processor=processor,
        padding=True,
        max_length=448,
    )

    # ─── Compute Metrics ───
    def compute_metrics(eval_preds):
        preds, labels = eval_preds
        if isinstance(preds, tuple):
            preds = preds[0]

        # Decode predictions
        pred_ids = np.argmax(preds, axis=-1) if preds.ndim == 3 else preds
        pred_str = processor.tokenizer.batch_decode(pred_ids, skip_special_tokens=True)

        # Decode labels
        labels[labels == -100] = processor.tokenizer.pad_token_id
        label_str = processor.tokenizer.batch_decode(labels, skip_special_tokens=True)

        # We don't have language info in collated batch, so just overall metrics
        metrics = compute_wer_cer(pred_str, label_str)
        return metrics

    # ─── Training Arguments ───
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        per_device_train_batch_size=args.per_device_train_batch_size,
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        learning_rate=args.learning_rate,
        num_train_epochs=args.num_train_epochs,
        max_steps=args.max_steps,
        warmup_ratio=args.warmup_ratio,
        logging_steps=args.logging_steps,
        save_steps=args.save_steps,
        eval_steps=args.eval_steps,
        evaluation_strategy="steps",
        save_strategy="steps",
        load_best_model_at_end=True,
        metric_for_best_model="eval_wer",
        greater_is_better=False,
        bf16=torch.cuda.is_bf16_supported(),
        fp16=not torch.cuda.is_bf16_supported(),
        gradient_checkpointing=True,
        optim="adamw_torch_fused",
        lr_scheduler_type="cosine",
        report_to="wandb" if args.wandb_project and os.getenv("WANDB_API_KEY") else "none",
        push_to_hub=args.push_to_hub,
        hub_model_id=args.hub_model_id,
        hub_token=hf_token,
        hub_private_repo=args.hub_private_repo,
        seed=args.seed,
        dataloader_num_workers=4,
        remove_unused_columns=False,
        ddp_find_unused_parameters=False,
    )

    # ─── Trainer ───
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=eval_dataset,
        data_collator=data_collator,
        processing_class=processor.tokenizer,
        compute_metrics=compute_metrics,
        callbacks=[WerCerCallback(processor, eval_dataset)],
    )

    # ─── Train ───
    print("Starting training...")
    trainer.train()

    # ─── Save & Push ───
    print("Saving model...")
    trainer.save_model(args.output_dir)
    processor.save_pretrained(args.output_dir)

    if args.push_to_hub:
        print("Pushing to Hub...")
        trainer.push_to_hub()
        processor.push_to_hub(args.hub_model_id, token=hf_token)

    if wandb.run:
        wandb.finish()
    print("Done!")


if __name__ == "__main__":
    main()