# Data Pipeline — Workflows & Registry

How raw Wolof corpora become reviewed, attributable training data. This is the workflow this
portal is named for.

## The pipeline at a glance

```
SOURCE REGISTRY          FACTORY                 AUGMENTATION              REVIEW                    SHELF
(provenance, license,    (reproducible scripts:  (a Wolof teacher model    (Supabase queue →         (Hugging Face:
 attribution, review     manifests, splits,       paraphrases with locked   Google Sheets batches →   curated, versioned
 flags per source)    →  leakage checks)       →  labels, behind an      →  3 verdicts + own       →  datasets with an
                                                  automatic guardrail)      phrasings → guardrail     attribution README)
                                                                            re-check on every edit)
```

## The five stages

1. **Source registry.** Every dataset enters with provenance, a license or attribution note,
   allowed and not-allowed uses, and a review flag. Nothing is consumed unregistered.
2. **Factory.** Standalone scripts turn registered sources into task-ready sets: ASR manifests,
   translation pairs, intent rows. Split hygiene is strict. Held-out splits are never trained on,
   and paraphrase families never leak across splits.
3. **Augmentation.** A Wolof teacher model generates phrasing variants while the label stays
   locked. An automatic guardrail rejects any variant that loses a required word (product, market,
   colors, number, a meter word). Prompt optimization took acceptance from 6.7% to roughly 88%.
4. **Human review.** Native speakers judge the language in 15-minute Sheet batches: approve, fix,
   or reject. The guardrail re-checks every human edit instantly. Reviewers can also write their
   own phrasings, which enter as the highest-value "gold" rows. Slang and deep Wolof are welcome.
   Humans are the authority on language. Machines only guard labels.
5. **The shelf.** Validated sets are published to Hugging Face as private, versioned datasets.
   Training and notebooks pull from there.

## Current state

| Asset | Where it stands |
|---|---|
| Market-intent dataset | **6,022 rows** (wo 1,661 · wo-fr 1,863 · fr 1,249 · en 1,249), zero split leakage |
| Teacher-model variants | 829 accepted by the guardrail, awaiting native review (batch-001 live) |
| Usable real Wolof corpora | about 115 hours of licensed speech, 150k ASR rows and 116k translation pairs inventoried |
| Review infrastructure | Supabase schema live · guardrail API deployed · Sheets/n8n conveyor in build |

## The rules

- Labels are locked. Review edits the language, never the label.
- Never train on held-out splits. Synthetic audio is never field audio.
- Everything synthetic stays `needs_review` until native validation.
- Attribution is a requirement: GalsenAI · Soynade Research · Baamtu/AI4D · serge-wilson ·
  Alwaly · Masakhane · and the upstream corpora (ALFFA, FLEURS, Common Voice, Kallama, Urban Bus).

## Know more

- [Commerce Lane overview](#/doc/commerce-overview): the product this data serves.
- [Team Onboarding](#/doc/team-onboarding): how to join the review team.
- [Back to the umbrella](#/doc/welcome)
