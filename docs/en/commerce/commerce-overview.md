# Commerce Lane (BOBO) — Overview

The promise: **be heard by the market in your tongue.** A buyer speaks Wolof, French, or the
natural Dakar mix of both. They find fabric at Sandaga, compare prices, order and pay. No typing,
and literacy is never a gatekeeper.

## How it works

```
Voice (Wolof / wo-fr) → the on-device model PROPOSES an action (strict JSON tool-call)
                      → the Engine VALIDATES and EXECUTES (search, order, payment, escrow)
```

The model never touches money, orders or personal data directly. It only proposes. The
sovereignty-typed Engine disposes. That separation is what makes a small, phone-sized model
trustworthy for real commerce.

## What exists today

| Piece | Status |
|---|---|
| **BOBO web app** | live on Cloudflare, full round-trip to the Engine (engine.njooba.com) |
| **Engine commerce spine** | live: auth, products, orders, checkout, Wave payments |
| **Edge intent model** | teacher live: DeepSeek V4 Flash (Ollama Cloud, 1.5s latency, natural Wolof/French). Students: Qwen3-Omni-30B-A3B (Apache, cloud vLLM) + MiniMind-O (~0.5B, Apache, edge). DeepSeek serves as the live commerce assistant on Telegram (@Shoptal_bot) and WhatsApp. Students not trained yet — GPU-gated |
| **Market-intent dataset (v1, GPT-4o)** | 6,022 rows (wo 1,661 · wo-fr 1,863 · fr 1,249 · en 1,249), zero split leakage. Teacher augmentation done, native review in progress |
| **Wolof commerce SFT (v2, DeepSeek)** | 3,721 generated → 2,176 kept (58.5% pass). 4 tracks: distillation (Kallaama), back-translation (Alpaca), Hermes tool calls, T2A augmentation. Published as MOH749/wolof-commerce-sft on HF (private) |
| **Voice (full duplex)** | research lane: a sovereign edge voice model built on the same backbone |

## The honest gate

Synthetic data proved the pipeline. Real Dakar field recordings and native review are what make
the model solid. That collection and review effort is the lane's current frontier, and its moat.

## Know more

- [Data Pipeline, workflows & registry](#/doc/data-pipeline): how raw corpora become reviewed,
  attributable training data.
- [Team Onboarding](#/doc/team-onboarding): the reviewer role is this lane's most valuable
  contribution right now.
- [Back to the umbrella](#/doc/welcome)
