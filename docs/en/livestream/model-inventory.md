# YAATAL Model Inventory, Architecture & Hybrid Configurations

This document outlines the detailed architectures, resource footprints, links, and optional deployment configurations for the YAATAL real-time speech-to-speech translation ecosystem.

> **Verification pass 2026-06-11.** Every entry now carries a status tag:
> ✅ verified on Hugging Face with a clean license · ⚠️ usable with a named caveat ·
> ❌ research reference only (no released checkpoint).
> Promotion rule: a candidate enters the decided lineup only when a pipeline actually consumes it
> and its license chain is clean. See the Data Pipeline page for the same rule on datasets.

---

## 1. Model Matrix & Direct Resources

### 🎙️ Stage 1: Automatic Speech Recognition (ASR)

#### **Nemotron 3.5 ASR (Streaming 0.6B)** ✅ verified · OpenMDW-1.1 (no cap)
*   **Architecture**: Cache-Aware FastConformer with **RNNT** decoder (per the model card). Uses selective attention context chunks.
*   **Parameter Count**: ~600 Million
*   **Wolof status**: not among its ~40 locales; requires the low-resource adaptation described in `SALM-ON-GRANITE-350M.md` (97.9h Wolof-ASR-Data corpus)
*   **Memory Footprint**: 1.2 GB RAM (static weights) + dynamic KV-cache ($O(L)$ space complexity, where $L$ is context length).
*   **Input/Output**: Raw audio stream $\rightarrow$ punctuated, cased text.
*   **Primary Usage**: High-fidelity live transcription.
*   **Optional Usage**: Can be run in **bypassed code-switching mode** (`target_lang=auto`) to automatically transcribe alternating Wolof and French speech in broadcast feeds.
*   **Resources & Links**:
    *   **Inference Hub**: [Hugging Face Model Card](https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b)
    *   **Architecture Reference**: [FastConformer Speech Paper (arXiv)](https://arxiv.org/abs/2305.05077)

#### **Samba-ASR / AuM (Audio Mamba)** ❌ research reference — no released checkpoint (checked 2026-06-11)
*   **Architecture**: Structured State Space Model (SSM / Mamba-2) blocks replacing traditional self-attention.
*   **Parameter Count**: ~50 Million - 120 Million
*   **Memory Footprint**: **~200 MB RAM (static)**. Constant-size recurrent state space ($O(1)$ space complexity).
*   **Input/Output**: Raw audio stream $\rightarrow$ text tokens.
*   **Primary Usage**: Ultra-lightweight, zero-KV-cache streaming ASR on edge devices.
*   **Optional Usage**: Ideal for **low-power CPU deployment** (e.g. mobile apps, browser extensions) during multi-hour broadcasts to prevent memory leakages.
*   **Resources & Links**:
    *   **Mamba-ASR Research**: [Samba-ASR Paper (arXiv:2501.02832)](https://arxiv.org/abs/2501.02832)
    *   **SSD Framework**: [Mamba-2 Paper (arXiv:2405.21060)](https://arxiv.org/abs/2405.21060)

---

### 🔀 Stage 2: Machine Translation (MT)

#### **MADLAD-400-3B-MT** ✅ verified · Apache-2.0 — primary candidate
*   **Architecture**: T5 encoder-decoder trained on MADLAD-400.
*   **Parameter Count**: ~3 Billion (7B and 10B siblings exist as a quality ladder).
*   **Language coverage**: natively includes **Wolof (`wo`), Bambara (`bm`), Fula (`ff`), Serer (`srr`), Dyula (`dyu`), Hausa (`ha`)** among 400+ — the Atlantic list this lane targets.
*   **Primary Usage**: server-side translation seam and synthetic target-text generation; the clean-license replacement for NLLB in both roles.
*   **Deploy**: GGUF builds exist; CTranslate2 serving is proven in community spaces.
*   **Resources & Links**: [google/madlad400-3b-mt (Hugging Face)](https://huggingface.co/google/madlad400-3b-mt)

#### **M2M100-418M** ✅ verified · MIT — small clean option
*   **Architecture**: many-to-many Transformer, includes `wo`.
*   **Parameter Count**: ~418 Million.
*   **Primary Usage**: small-footprint MT, fine-tuned on the ~116k FR↔WO pairs from the data inventory; later a distillation student of MADLAD.
*   **Resources & Links**: [facebook/m2m100_418M (Hugging Face)](https://huggingface.co/facebook/m2m100_418M)

#### **Wolof-NMT (NLLB-200 Distilled 600M)** ⚠️ baseline / research — NC weights
*   **Architecture**: Dense Transformer Encoder-Decoder.
*   **Parameter Count**: ~615 Million
*   **Caveat**: the GalsenAI wrapper is MIT, but the underlying **NLLB-200 weights are CC-BY-NC** — fine as an R&D baseline and quality reference, not for shipping. MADLAD-400 (above) covers both of its roles with a clean license.
*   **Primary Usage**: eval baseline; historical engine of the synthetic FR↔WO pairs.
*   **Resources & Links**:
    *   **Source Code**: [Wolof-NMT GitHub](https://github.com/Galsenaicommunity/Wolof-NMT)
    *   **Underlying Model**: [Meta NLLB-200 (Hugging Face)](https://huggingface.co/facebook/nllb-200-distilled-600m)

#### **MarianMT (Quantized ONNX INT4)**
*   **Architecture**: Optimized Seq2Seq Transformer.
*   **Parameter Count**: ~50 Million
*   **Memory Footprint**: **~38 MB RAM** (using 4-bit integer quantization).
*   **Input/Output**: Wolof text $\rightarrow$ French text.
*   **Primary Usage**: Client-side offline browser translation via WebAssembly.
*   **Optional Usage**: Can act as a **local edge fallback** if internet connectivity to the main cloud API drops.
*   **Resources & Links**:
    *   **Wasm Inference Engine**: [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)

#### **Mamba-2 Translation Model** ❌ concept — no checkpoint exists (checked 2026-06-11)
*   **Idea**: a recurrent state-space translator with constant-latency token-by-token streaming. Nothing released matches this; it stays a design north star. If it ever materializes (or we distill one), it slots here.
*   **Resources & Links**: [state-spaces/mamba (GitHub)](https://github.com/state-spaces/mamba) (framework only)

---

### 🔊 Stage 3: Text-To-Speech (TTS)

#### **MOSS-TTS-Nano-100M** ✅ verified · Apache-2.0 (with one caveat)
*   **Architecture**: Autoregressive Audio Tokenizer + Lightweight language modeling decoder (`moss_tts_nano`, `custom_code`).
*   **Parameter Count**: ~100 Million
*   **Memory Footprint**: ~220 MB RAM.
*   **Input/Output**: French text $\rightarrow$ 48kHz audio waveform. 20 languages on the card (French yes, **no Wolof** — Wolof dubbing stays with `galsenai/xTTS-v2-wolof` or future fine-tunes).
*   **Primary Usage**: High-fidelity French speech dubbing.
*   **Caveat**: ships as `custom_code` (no llama.cpp path); the ONNX export claim needs its own verification before the pure-edge config relies on it.
*   **Resources & Links**:
    *   **Inference Hub**: [OpenMOSS-Team/MOSS-TTS-Nano-100M (Hugging Face)](https://huggingface.co/OpenMOSS-Team/MOSS-TTS-Nano-100M)
    *   **Repository**: [OpenMOSS/MOSS-TTS-Nano (GitHub)](https://github.com/OpenMOSS/MOSS-TTS-Nano)

#### **Multi-Band MelGAN / Vocos**
*   **Architecture**: Parallel Generative Adversarial Network (GAN) vocoder.
*   **Parameter Count**: ~4 Million - 8 Million
*   **Memory Footprint**: **~15 MB RAM**.
*   **Input/Output**: Mel-spectrogram/audio tokens $\rightarrow$ raw audio.
*   **Primary Usage**: Low-latency waveform synthesis.
*   **Optional Usage**: Can be integrated into a hybrid local vocoder pipeline to run on mobile browser CPUs with sub-millisecond execution times.

---

### 🧠 Stage 4: LLM Backbone / Duplex Agent — shared with the Commerce lane

#### **Granite 4.0 H (350M / 1B)** ✅ verified · Apache-2.0
*   **Architecture**: dense Mamba2 + attention hybrid (`granitehybrid`), native function-calling.
*   **Role here**: the LLM backbone of the **SALM-Duplex composition** — the interactive duplex
    translation agent this lane's Atlantic blueprint describes. The same backbone serves the
    Commerce lane's voice agent: one model family, one license chain, both lanes.
*   **Status**: the 1B is qualified (smoke-scale bake-off, 2026-06-10); the 350M is the
    aggressive-edge candidate (~210 MB at Q4), pending its LoRA smoke. Full composition and build
    plan: `SALM-ON-GRANITE-350M.md` in the Engine repo.
*   **Resources & Links**: [granite-4.0-h-350m](https://huggingface.co/ibm-granite/granite-4.0-h-350m) · [granite-4.0-h-1b](https://huggingface.co/ibm-granite/granite-4.0-h-1b)

---

## 2. Hybrid Deployment Configurations

Depending on your hardware budget, latency targets, and target audience, the YAATAL architecture can be configured in three distinct ways:

### A. The "Pure Edge" Recurrent Cascade (Lowest Memory & Offline)
*   **ASR**: Samba-ASR (recurrent SSM)
*   **MT**: Local MarianMT (ONNX INT4 Wasm)
*   **TTS**: MOSS-TTS-Nano (ONNX CPU) + Vocos
*   **Total RAM**: **~450 MB**
*   **Features**: Runs entirely in the client's browser. Zero server costs. Works offline.
*   **Trade-off**: Lower translation accuracy for highly complex metaphors compared to large NLLB models.

### B. The "Hybrid Edge Ingestion" Mode (Optimal Latency/Quality)
*   **Client Side**: Local Phrase Cache (Trie database, 0ms) + MarianMT.
*   **Server Side**: Supabase hosted NMT API + Hugging Face Inference Endpoints.
*   **Flow**:
    1. The client transcribes locally.
    2. Common greetings and short idioms are instantly translated via local cache.
    3. Long, complex sentences are offloaded to **Supabase Edge Functions** which query the **Hugging Face NLLB-600M** endpoint.
*   **Features**: Maintains conversational speed while keeping high linguistic translation quality.

### C. The "Batch Pipeline / Curation" Mode (n8n Orchestration)
*   **Ingestion**: Audio uploaded to **Supabase Storage**.
*   **Orchestrator**: **n8n** triggers on upload.
*   **Inference**: n8n sends batches to **Hugging Face MOSS-Audio-4B-Instruct** for speaker profiling, timestamp matching, and cataloging.
*   **Features**: Ideal for compiling post-broadcast archives, semantic index searches, and gathering training datasets.
