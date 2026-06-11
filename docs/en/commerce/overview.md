# Commerce Lane (BOBO) — Overview

**The promise: be heard by the market in your tongue.** A buyer speaks Wolof, French, or the
natural Dakar mix of both — to find fabric at Sandaga, compare prices, order, and pay — without
typing, without literacy as a gatekeeper.

## How it works

```
Voice (Wolof / wo-fr) → on-device model PROPOSES an action (strict JSON tool-call)
                      → the Engine VALIDATES and EXECUTES (search, order, payment, escrow)
```

The model never touches money, orders or personal data directly — it only *proposes*. The
sovereignty-typed Engine *disposes*. This is what makes a small, phone-sized model trustworthy
for real commerce.

## What exists today

| Piece | Status |
|---|---|
| **BOBO web app** | live (Cloudflare), full round-trip to the Engine on Railway |
| **Engine commerce spine** | live — auth, products, orders, checkout, Wave payments |
| **Edge intent model (prototype)** | qualified — a hybrid sub-2B backbone (Apache-2.0, no license cap), trained on synthetic market utterances, exported to a phone-deployable GGUF |
| **Market-intent dataset** | 6,022 rows (wo / wo-fr / fr / en), augmentation by a Wolof teacher model, native review in progress |
| **Voice (full duplex)** | research lane — a sovereign edge voice model built on the same backbone |

## The honest gate

Synthetic data proved the *pipeline*; **real Dakar field recordings and native review** make the
*model* solid. That collection and review effort is the lane's current frontier — and its moat.

## Subpages in this lane

- **Data Pipeline — Workflows & Registry** — how raw corpora become reviewed training data:
  sources, augmentation, the human review loop, and the attribution ledger.

## Related reading

- *Team Onboarding* (Guides) — the reviewer role is this lane's most valuable contribution.
- The Engine's own docs (`STATE.md`, `ENGINE-MANIFEST`) — canonical architecture and status.
