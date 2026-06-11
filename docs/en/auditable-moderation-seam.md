# YAATAL Auditable Moderation Seam: Real-Time Filtering & Censorship

This document outlines the architecture for introducing a **Real-Time Auditable Moderation Seam** inside the YAATAL translation pipeline. It allows filtering profanity, toxic content, unauthorized sales claims, and Personally Identifiable Information (PII) before it is spoken (voiced out) or displayed on-screen.

---

## 1. The Seam Placement: Why Text-Interception is Key

In a real-time cascading pipeline (Speech $\rightarrow$ Text $\rightarrow$ Translation $\rightarrow$ Speech), the **text translation output** is the most effective place to insert a moderation seam. Text analysis is sub-millisecond, highly precise, and keeps clear logs for compliance auditing before the Text-to-Speech (TTS) engine generates audio waveforms.

```
                  [1. Wolof Audio Input]
                            │
                            ▼
                  [2. ASR Transcription]
                            │
                            ▼
                  [3. Machine Translation]
                            │
                            ▼ (Interception)
             ┌─────────────────────────────┐
             │   AUDITABLE MODERATION SEAM  │
             │  • Trie-based Profanity     │──► [Logs to Supabase 'moderation_audits']
             │  • Regex PII Redaction      │
             │  • Guardrail Classifiers    │
             └─────────────────────────────┘
                            │
                            ▼ (Moderated Text)
                  [4. Text-to-Speech (TTS)]
                            │
                            ▼
              [5. Browser Web Audio API]  ──► (OscillatorNode injects beep over censored words)
```

---

## 2. Moderation Engine Mechanics

The Moderation Seam runs three sequential filters on the translated text in parallel to keep latency under **25ms**:

1.  **Trie-Based Lexicon Filter (0ms latency)**:
    *   Uses a prefix tree (Trie) to match high-frequency banned words, competitor names, or inappropriate terminology in the target language (French/English).
    *   *Action*: Replaces matches with `[REDACTED]` tokens.
2.  **Regex PII Redactor (1ms latency)**:
    *   Applies regular expressions to identify phone numbers, email addresses, credit card numbers, or physical addresses.
    *   *Action*: Masks them with generic tokens (e.g. `[PHONE]`, `[EMAIL]`).
3.  **Lightweight Guardrail Classifier (20ms latency)**:
    *   Runs a tiny, local classification head (or ONNX model) to evaluate toxic intent, unauthorized medical/financial sales claims, or aggressive language.
    *   *Action*: Mutes the segment if toxicity exceeds a predefined threshold.

---

## 3. Web-Audio Level Censorship (Live Bleeping)

For audio dubbing, simply skipping words makes the speech sound disjointed and confused. YAATAL handles censorship using **browser-side audio bleeping**:

1.  **Aligned Tokens**: The TTS engine (MOSS-TTS-Nano-100M) outputs audio tokens aligned with word timestamps.
2.  **Muting & Injected Oscillator (Beep)**:
    *   When a word is flagged as censored (e.g., a profanity or competitor name), the browser’s Web Audio API plays the audio segment.
    *   At the exact timestamp of the flagged word, the app suspends/mutes the TTS audio channel and triggers a **1kHz sine wave `OscillatorNode`** (the classic bleep sound).
    *   Once the timestamp passes, the oscillator is stopped and the TTS channel is unmuted.

---

## 4. Auditing & Logging (Supabase + n8n)

Every flagged event is audited for quality assurance and compliance:

### Supabase Table: `moderation_audits`
We log the event with the following schema:
*   `id` (UUID): Primary key.
*   `session_id` (UUID): Links to the livestream sales session.
*   `source_transcript` (Text): The raw Wolof speech transcription.
*   `original_translation` (Text): The unmoderated French translation.
*   `moderated_translation` (Text): The final censored translation shown/voiced.
*   `violation_type` (Text): e.g., `PROFANITY`, `PII`, `CLAIM_VIOLATION`.
*   `created_at` (Timestamp).

### n8n Compliance Workflow:
1.  **Trigger**: Supabase database webhook triggers on a new entry in `moderation_audits`.
2.  **Review**: If the violation type is a `CLAIM_VIOLATION` (e.g. false pricing in livestream sales), n8n pushes a notification to the manager’s Slack/Discord channel.
3.  **Feedback Loop**: The logged data is flagged for review to determine if the translation model requires fine-tuning to avoid generating the false claim in the future.
