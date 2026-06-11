# Technical Integration Analysis: LiveKit & StreamSpeech

This document analyzes the open-source frameworks **LiveKit (agents/livestream)** and **StreamSpeech**, exploring how we can leverage their features to build a lightweight, battery-aware, and interruptible West African Duplex Voice Agent.

---

## 1. LiveKit: WebRTC and Duplex Loop Orchestration

### A. Real-Time Livestreaming (`livekit-examples/livestream`)
*   **WebRTC SFU Architecture**: Standard livestreaming (HLS/RTMP) introduces 2–10 seconds of latency, which destroys interactive sales dialogs. LiveKit uses WebRTC, achieving **sub-100ms streaming latency** between the seller and the audience.
*   **Ingress & Egress**: LiveKit supports RTMP/WHIP ingress (allowing sellers to stream from OBS Studio) and distributes WebRTC feeds to thousands of mobile clients efficiently.

### B. Voice Agent Orchestration (`livekit/agents`)
*   **VAD (Voice Activity Detection)**: The `livekit/agents` framework includes highly optimized, local VAD models (like Silero VAD) that detect speech energy instantly.
*   **Interruption Handling (Duplex Control)**: This framework provides a ready-made **duplex control loop**. When the user interrupts the agent:
    1.  The VAD fires a speech detection event.
    2.  The server immediately stops transmitting audio packets.
    3.  The agent cancels the pending translation/synthesis tasks and resets the conversational context.
*   **Edge/Server Pipeline**: We can write a custom LiveKit Agent in Python or JS that connects to our **Hugging Face** model stack (Nemotron, Wolof-NMT, MOSS-TTS-Nano-100M) and publishes the audio to a LiveKit Room.

---

## 2. StreamSpeech: Simultaneous S2ST (Speech-to-Speech)

StreamSpeech is an "All-in-One" model for simultaneous speech recognition, translation, and synthesis:

*   **Interleaved Output (Bypassing Serialization Delay)**:
    *   In a traditional cascade, you must wait for the ASR to finish transcribing a sentence, then wait for the MT to translate, and then wait for the TTS to synthesize audio.
    *   StreamSpeech outputs translation text and TTS audio tokens **simultaneously** in a single autoregressive step. The synthesis starts **before the speaker has even finished their sentence**.
*   **Unified Tokenizer Space**:
    *   StreamSpeech shows that speech and text can be mapped to the same vocabulary space. We can utilize this approach to train a lightweight Mamba-2 model that outputs French text and MOSS-TTS-Nano audio tokens simultaneously, shaving off another 100ms of cascade delay.

---

## 3. The Combined YAATAL Architecture Strategy

To build a lightweight, battery-aware, and data-conscious duplex agent, we can merge the strengths of both repositories:

```
  [LiveKit WebRTC Stream] (Seller Audio Ingest)
           │
           ▼
  [LiveKit Agents VAD] (Detects User Interruptions)
           │
           ▼ (Trigger)
  [StreamSpeech Style Joint Decoder (Mamba-2)]
           │
           ├──► Outputs Text Captions (99% data savings)
           └──► Outputs Audio Tokens (MOSS-TTS-Nano-100M)
```

1.  **Transport (LiveKit WebRTC)**: Handles low-latency audio transmission and viewer distribution.
2.  **Orchestration (LiveKit Agents)**: Runs on the server to coordinate VAD, detect interruptions, and stream synthesized tokens back to the clients.
3.  **Core Model (StreamSpeech + Mamba-2)**: A joint Mamba-2 SSM model that accepts ASR audio tokens and directly decodes translation text and synthesis tokens concurrently, ensuring maximum CPU/battery efficiency on mobile devices.
