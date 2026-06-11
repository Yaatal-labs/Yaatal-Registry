# Livestream Lane — Overview

**The promise: be understood live by everyone, each in their own mother tongue.** A seller
streams in Wolof; viewers follow in French, Pulaar or English — as captions or dubbed voice —
in real time.

## The two delivery modes

| Mode | What the viewer gets |
|---|---|
| **Caption Lane** | streaming speech-to-text with auto-punctuation, rendered as live subtitles |
| **Dub Lane** | low-latency speech synthesis on the edge — accessibility for non-literate audiences |

Both ride the **"audio-edge, text-air"** strategy: audio is processed on the device, only tiny
text payloads cross the network — about 99% bandwidth savings on metered mobile data, and far
gentler on batteries.

## The differentiator: the auditable moderation seam

Because the pipeline predicts *text before it speaks*, there is a natural interception point
between understanding and voicing. The **moderation seam** filters profanity, PII and unauthorized
claims there — sub-millisecond, fully logged for compliance. It is what turns "another translation
demo" into something a broadcaster, school or institution can actually deploy.

## Subpages in this lane

- **Model Inventory** — the ASR / translation / TTS stack, footprints and configurations.
- **Auditable Moderation Seam** — the filtering architecture and audit logging.
- **Duplex Atlantic Blueprint** — the long-term interactive voice agent across Atlantic languages
  (Wolof, Bambara, Fula, Serer) and international ones.
- **LiveKit & StreamSpeech Analysis** — the WebRTC duplex loop and simultaneous-S2ST research.

## Status and what it shares

This lane is at the **architecture and analysis stage**. It shares its substrate with the
Commerce lane: the same ASR encoder and translation models, the same data factory and review
pipeline, and the same sovereignty discipline — license-first model choices included (candidates
in the inventory are subject to the same verification that governs the commerce lane's models).
