# YAATAL Model Inventory, Architecture & Hybrid Configurations

This document outlines the detailed architectures, resource footprints, links, and optional deployment configurations for the YAATAL real-time speech-to-speech translation ecosystem.

---

## 1. Model Matrix & Direct Resources

### 🎙️ Stage 1: Automatic Speech Recognition (ASR)

#### **Nemotron 3.5 ASR (Streaming 0.6B)**
*   **Architecture**: FastConformer encoder with CTC decoder. Uses selective attention context chunks.
*   **Parameter Count**: ~600 Million
*   **Memory Footprint**: 1.2 GB RAM (static weights) + dynamic KV-cache ($O(L)$ space complexity, where $L$ is context length).
*   **Input/Output**: Raw audio stream $\rightarrow$ punctuated, cased text.
*   **Primary Usage**: High-fidelity live transcription.
*   **Optional Usage**: Can be run in **bypassed code-switching mode** (`target_lang=auto`) to automatically transcribe alternating Wolof and French speech in broadcast feeds.
*   **Resources & Links**:
    *   **Inference Hub**: [Hugging Face Model Card](https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b)
    *   **Architecture Reference**: [FastConformer Speech Paper (arXiv)](https://arxiv.org/abs/2305.05077)

#### **Samba-ASR / AuM (Audio Mamba)**
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

#### **Wolof-NMT (NLLB-200 Distilled 600M)**
*   **Architecture**: Dense Transformer Encoder-Decoder.
*   **Parameter Count**: ~615 Million
*   **Memory Footprint**: ~1.3 GB RAM.
*   **Input/Output**: Wolof text $\rightarrow$ French text.
*   **Primary Usage**: Production-grade sentence-level translation.
*   **Optional Usage**: Can be hosted serverless on Hugging Face Inference Endpoints and queried dynamically via n8n workflows for background batch processing.
*   **Resources & Links**:
    *   **Source Code**: [Wolof-NMT Dépôt GitHub](https://github.com/Galsenaicommunity/Wolof-NMT)
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

#### **Mamba-2 Translation Model**
*   **Architecture**: Recurrent State Space sequence translator.
*   **Parameter Count**: ~100 Million
*   **Memory Footprint**: ~200 MB RAM.
*   **Input/Output**: Wolof tokens $\rightarrow$ French tokens.
*   **Primary Usage**: Linear-time recurrent translation with constant latency.
*   **Optional Usage**: Token-by-token streaming translation (sentences translate in real-time as the speaker talks, rather than waiting for pauses).
*   **Resources & Links**:
    *   **Model Source**: [state-spaces/mamba (GitHub)](https://github.com/state-spaces/mamba)

---

### 🔊 Stage 3: Text-To-Speech (TTS)

#### **MOSS-TTS-Nano-100M**
*   **Architecture**: Autoregressive Audio Tokenizer + Lightweight language modeling decoder.
*   **Parameter Count**: ~100 Million
*   **Memory Footprint**: ~220 MB RAM.
*   **Input/Output**: French text $\rightarrow$ 48kHz audio waveform.
*   **Primary Usage**: High-fidelity French speech dubbing.
*   **Optional Usage**: Can be exported directly to ONNX to run locally on standard CPU endpoints.
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
