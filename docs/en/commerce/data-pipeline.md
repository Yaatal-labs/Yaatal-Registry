# Data Pipeline — Workflows & Registry

How raw Wolof corpora become reviewed, attributable training data. This is the workflow this
portal is named for.

## The pipeline at a glance

```
SOURCE REGISTRY          FACTORY                 AUGMENTATION              REVIEW                    SHELF
(provenance, license,    (reproducible scripts:  (Wolof teacher model      (Supabase queue →         (Hugging Face:
 attribution, review     manifests, splits,       paraphrases with locked   Google Sheets batches →   curated, versioned
 flags per source)    →  leakage checks)       →  labels + an automatic  →  3 verdicts + own       →  datasets with
                                                  guardrail)                phrasings → guardrail     attribution README)
                                                                            re-check on every edit)
```

## The stages

1. **Source registry** — every dataset enters with provenance, license/attribution note, allowed
   and not-allowed uses, and a review flag. Nothing is consumed unregistered.
2. **Factory** — standalone scripts turn registered sources into task-ready sets (ASR manifests,
   translation pairs, intent rows) with strict train/validation/test hygiene: held-out splits are
   never trained on, and paraphrase families never leak across splits.
3. **Augmentation** — a Wolof teacher model generates phrasing variants with the label *locked*;
   an automatic guardrail rejects any variant that loses a required word (product, market, colors,
   number, a meter word). Acceptance went from 6.7% to ~88% through prompt optimization.
4. **Human review** — native speakers judge the *language* in 15-minute Sheet batches (approve /
   fix / reject); the guardrail re-checks every human edit instantly; reviewers' own phrasings
   enter as the highest-value "gold" rows. Slang and deep Wolof are welcome — humans are the
   authority on language, machines only guard labels.
5. **The shelf** — validated sets are published to Hugging Face as private, versioned datasets;
   training and notebooks pull from there.

## Current state

| Asset | Where it stands |
|---|---|
| Market-intent dataset | **6,022 rows** (wo 1,661 · wo-fr 1,863 · fr 1,249 · en 1,249), zero split leakage |
| Teacher-model variants | 829 guardrail-accepted, awaiting native review (batch-001 live) |
| Usable real Wolof corpora | ~115 hours licensed speech + ~150k ASR rows + ~116k translation pairs inventoried |
| Review infrastructure | Supabase schema live · guardrail API deployed · Sheets/n8n conveyor in build |

## The rules (non-negotiable)

- Labels are locked — review edits the *language*, never the label.
- Never train on held-out splits. Synthetic audio is never field audio.
- Everything synthetic stays `needs_review` until native validation.
- **Attribution is a requirement**: GalsenAI · Soynade Research · Baamtu/AI4D · serge-wilson ·
  Alwaly · Masakhane · and the upstream corpora (ALFFA, FLEURS, Common Voice, Kallama, Urban Bus).
