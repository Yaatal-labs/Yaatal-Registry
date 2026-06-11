# YAATAL Atlantic Duplex Architecture Blueprint

This document defines the long-term architectural blueprint for a lightweight, data-conscious, and battery-aware **Interactive Duplex Voice Agent** translating across West African Atlantic languages (Wolof, Bambara, Fula, Serer, Arabic) and international languages (English, French).

---

## 1. The Core Challenge: Low Resource + Mobile Data Constraints

Building a real-time, two-way conversational voice agent for West Africa requires overcoming two main constraints:
1.  **Low-Resource Languages**: Atlantic languages lack the massive bilingual audio datasets needed to train monolithic Speech-to-Speech (S2ST) models.
2.  **Infrastructure Realities**: Users rely on cellular mobile data (metered by Megabytes) and battery-sensitive mobile devices. Sending continuous high-quality raw audio streams to the cloud is cost-prohibitive and drains battery.

---

## 2. The "Audio-Edge, Text-Air" Bandwidth Strategy

To minimize data usage, YAATAL utilizes an **Edge-First Cascaded Pipeline**:

```
[User Speaks]
      │
      ▼ (Edge CPU Processing)
[Local Mamba-ASR (Speech-to-Text)]
      │
      ▼ (Transmits tiny TEXT payload - 99% bandwidth savings)
   [OVER THE AIR (Mobile Data)]
      │
      ▼
[Cloud/Edge Translator (Mamba-2-MT)]
      │
      ▼ (Returns TEXT translation)
   [OVER THE AIR]
      │
      ▼ (Edge CPU Processing)
[Local MOSS-TTS-Nano-100M (Text-to-Speech)]
      │
      ▼
[Voiced Output & Sales Interaction]
```

### Bandwidth Comparison:
*   **Monolithic Audio-to-Audio (Hibiki/Cloud)**: Requires streaming 16-bit audio up and down continuously. **Bandwidth: ~256 kbps (approx. 115 MB per hour)**.
*   **Audio-Edge, Text-Air Cascade**: Audio-to-Text and Text-to-Speech are done locally. Only raw text characters are sent over the air. **Bandwidth: ~1 kbps (approx. 0.45 MB per hour)**. *This represents a 99.6% bandwidth saving.*

---

## 3. Duplex Interaction & Interruptibility

To achieve a true "Duplex" tier (where the agent and user can talk at the same time and interrupt each other naturally):

1.  **Continuous Listening (FastConformer)**:
    *   The local ASR encoder is always active, feeding audio buffers into the state space.
2.  **Instant Playback Cutoff**:
    *   If the user begins speaking while the TTS vocoder is playing back, the local ASR immediately detects user speech energy.
    *   The app triggers an instant `audioContext.suspend()` call client-side, cutting off the agent's voice and letting the user speak uninterrupted.
3.  **State Space Duality (Mamba-2)**:
    *   Because Mamba-2 SSMs do not use KV-caches, clearing the history when a user interrupts the agent is a simple reset of the recurrent state vector ($O(1)$ complexity), preventing latency lag after interruptions.

---

## 4. Multilingual Translation Matrix (Cascade vs. Monolithic)

For $N$ languages, a monolithic model must be trained on all $N \times (N-1)$ pairs simultaneously. For Fula $\leftrightarrow$ Serer or Bambara $\leftrightarrow$ Wolof, this data does not exist. 

YAATAL solves this by using a **Pivot Translation Cascaded Mesh**:

```
   [Wolof]  ◄──►  [French]  ◄──►  [Bambara]
      ▲              ▲               ▲
      │              │               │
   [Serer]  ◄──►  [English] ◄──►   [Fula]
```

*   **Modular Training**: We train tiny, independent **100M Mamba-2** translation models linking individual languages to French or English as a pivot.
*   **Dynamic Composition**: To translate Serer to Fula, the coordinator pipes: `Serer ASR` $\rightarrow$ `Serer-to-French MT` $\rightarrow$ `French-to-Fula MT` $\rightarrow$ `Fula TTS`.
*   **Zero-Overhead Cascade**: Because each Mamba-2 translation step takes less than 15ms, cascading two steps (Serer $\rightarrow$ French $\rightarrow$ Fula) only adds ~30ms of translation latency, keeping the pipeline well within the **conversational target budget (<350ms)**.
