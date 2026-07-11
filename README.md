# MOSS-Audio-4B-Thinking Fine-tuning for West African ASR

Fine-tunes `OpenMOSS-Team/MOSS-Audio-4B-Thinking` on West African languages (Wolof, Pulaar, Bambara) using:
- **Bocalantics** (`MOH749/Bocalantics`) - normalized speech corpus
- **Kallaama** (`MOH749/kallaama`) - complementary dataset

Uses **LoRA/QLoRA** for memory-efficient training (4B params → ~20M trainable).

---

## Quick Start

### Local GPU
```bash
# 1. Clone and setup
git clone <your-fork> moss-audio-ft
cd moss-audio-ft
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# 2. Authenticate
hf auth login
export WANDB_API_KEY=xxx  # optional, for logging

# 3. Train (LoRA + QLoRA, 24GB VRAM)
python train_moss_audio.py \
  --use_qlora \
  --per_device_train_batch_size 2 \
  --gradient_accumulation_steps 8 \
  --num_train_epochs 3 \
  --hub_model_id your-username/moss-audio-west-african
```

### HF Jobs (Recommended)
```bash
# Set secrets
export HF_TOKEN=hf_xxx
export WANDB_API_KEY=xxx

# Single GPU (L4, ~$0.70/hr) - LoRA/QLoRA
hf jobs run \
  --flavor l4x1 \
  --env HF_TOKEN=$HF_TOKEN \
  --env WANDB_API_KEY=$WANDB_API_KEY \
  "pip install -r requirements.txt && python train_moss_audio.py \
    --use_qlora \
    --hub_model_id your-username/moss-audio-west-african"

# Multi-GPU (A100 80GB, ~$3/hr) - Full fine-tune
hf jobs run \
  --flavor a100-large \
  --env HF_TOKEN=$HF_TOKEN \
  --env WANDB_API_KEY=$WANDB_API_KEY \
  "pip install -r requirements.txt && python train_moss_audio.py \
    --use_lora --use_qlora=false \
    --per_device_train_batch_size 4 \
    --gradient_accumulation_steps 4 \
    --hub_model_id your-username/moss-audio-west-african-ft"
```

### Docker
```bash
# Build
docker build -t moss-audio-ft .

# Run locally
docker run --gpus all -e HF_TOKEN -e WANDB_API_KEY moss-audio-ft \
  python train_moss_audio.py --use_qlora --hub_model_id your-username/...
```

---

## Key Configuration

| Parameter | Default | Notes |
|-----------|---------|-------|
| `--use_qlora` | `True` | 4-bit quantization + LoRA |
| `--use_lora` | `True` | LoRA adapters |
| `--lora_r` | `64` | LoRA rank |
| `--lora_alpha` | `128` | LoRA alpha |
| `--per_device_train_batch_size` | `2` | Adjust for VRAM |
| `--gradient_accumulation_steps` | `8` | Effective batch = 2×8=16 |
| `--learning_rate` | `1e-4` | Standard for LoRA |
| `--num_train_epochs` | `3` | |
| `--max_length` | `448` | MOSS-Audio max seq len |

---

## Evaluation Metrics

The script logs **WER** and **CER** during evaluation:
- Overall WER/CER
- Per-language WER/CER (Wolof, Pulaar, Bambara)

Logged to Weights & Biases if `WANDB_API_KEY` is set.

---

## Model Architecture Notes

- **MOSS-Audio-4B-Thinking**: Custom encoder-decoder with chain-of-thought reasoning
- **Processor**: `AutoProcessor` handles both audio features and text tokenization
- **Task type**: `SEQ_2_SEQ_LM` for LoRA (encoder-decoder)
- **Trust remote code**: Required for custom modeling files

---

## Expected Results

| Config | VRAM | Time (3 epochs) | Expected WER |
|--------|------|-----------------|--------------|
| QLoRA (L4 24GB) | ~18GB | ~4-6 hrs | 15-25% |
| LoRA (A100 80GB) | ~60GB | ~2-3 hrs | 10-20% |
| Full FT (A100 80GB) | ~80GB | ~8-12 hrs | 8-15% |

---

## Troubleshooting

**OOM Errors:**
- Reduce `--per_device_train_batch_size` to 1
- Increase `--gradient_accumulation_steps` to 16
- Use `--use_qlora` (4-bit)

**Slow Training:**
- Ensure `bf16=True` on Ampere+ GPUs (A100, H100, L4)
- Set `dataloader_num_workers=4`
- Use `optim="adamw_torch_fused"`

**Dataset Loading:**
- Datasets stream from Hub (no local download)
- Ensure `trust_remote_code=True` for custom dataset scripts

---

## Project Structure

```
moss-audio-ft/
├── train_moss_audio.py    # Main training script
├── requirements.txt       # Python dependencies
├── Dockerfile             # Container for HF Jobs/local
├── .gitignore
└── README.md
```

---

## License

- Model: Apache-2.0 (MOSS-Audio)
- Datasets: CC-BY-SA-4.0 (Bocalantics), check Kallaama
- Code: MIT