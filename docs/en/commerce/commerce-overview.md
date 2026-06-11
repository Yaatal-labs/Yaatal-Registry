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
| **BOBO web app** | live on Cloudflare, full round-trip to the Engine on Railway |
| **Engine commerce spine** | live: auth, products, orders, checkout, Wave payments |
| **Edge intent model (prototype)** | qualified. A hybrid sub-2B backbone under Apache-2.0 (no license cap), trained on synthetic market utterances, exported to a phone-ready GGUF |
| **Market-intent dataset** | 6,022 rows (wo / wo-fr / fr / en). Teacher-model augmentation done, native review in progress |
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
