# Livestream Lane — Overview

The promise: **be understood live by everyone, each in their own mother tongue.** A seller
streams in Wolof. Viewers follow in French, Pulaar or English, as captions or as dubbed voice,
in real time.

## The two delivery modes

| Mode | What the viewer gets |
|---|---|
| **Caption Lane** | streaming speech-to-text with auto-punctuation, rendered as live subtitles |
| **Dub Lane** | low-latency speech synthesis on the edge, built for non-literate audiences |

Both ride the **"audio-edge, text-air"** strategy. Audio is processed on the device and only tiny
text payloads cross the network. That saves about 99% of bandwidth on metered mobile data and is
far gentler on batteries.

## The differentiator: the auditable moderation seam

The pipeline predicts text before it speaks. That creates a natural interception point between
understanding and voicing. The moderation seam filters profanity, PII and unauthorized claims
right there, in under a millisecond, with every decision logged for compliance. It is what turns
a translation demo into something a broadcaster, a school or an institution can actually deploy.

## Status and shared foundations

This lane is at the architecture and analysis stage. It shares its substrate with the
[Commerce lane](#/doc/commerce-overview): the same ASR encoder and translation models, the same
[data factory and review pipeline](#/doc/data-pipeline), and the same license-first sovereignty
discipline. Candidates in the model inventory go through the same verification as the commerce
lane's models.

## Know more

- [Model Inventory](#/doc/model-inventory): the ASR / translation / TTS stack, footprints and
  configurations.
- [Auditable Moderation Seam](#/doc/auditable-moderation-seam): the filtering architecture and
  audit logging.
- [Duplex Atlantic Blueprint](#/doc/duplex-atlantic-architecture): the long-term interactive
  voice agent across Atlantic and international languages.
- [LiveKit & StreamSpeech Analysis](#/doc/livekit-streamspeech-analysis): the WebRTC duplex loop
  and simultaneous-S2ST research.
- [Back to the umbrella](#/doc/welcome)
