# YAATAL Team Onboarding · Intégration de l'équipe

> **EN** — From zero to your first contribution in ~30 minutes, whatever your role.
> **FR** — De zéro à votre première contribution en ~30 minutes, quel que soit votre rôle.

---

# 🇬🇧 ENGLISH

## The mission

**YAATAL is the umbrella** — the SDK, the AI models, Commerce (**BOBO**), and
**Livestream/Translation** are its lanes. The mission: **removing West African language and
dialect barriers** — so that anyone, literate or not, from any community or ethnic group, can
**express themselves freely in their mother tongue and be heard *and* understood by everyone —
each in their own.**

> **The main barrier is Access and Reach — not Creativity, Vision or Talent.**

The engineering principle underneath it all: **"models propose, the Engine disposes"** — AI
suggests, only a sovereignty-typed backend acts, and data is compiled to never leave Senegal.

## The two clocks

Everything runs on two parallel clocks — internalize this and 90% of the project makes sense:

| Clock | What | Pace |
|---|---|---|
| **Platform** | the Engine (Rust backend), BOBO (first app), this portal — *shippable now* on off-the-shelf cloud AI | fast, continuous |
| **Research** | the sovereign Wolof model stack (edge voice, ASR, duplex translation, TTS) | slow, high-ceiling, gated |

Neither waits for the other. Research capabilities are *promoted* into the platform only once proven.

## The map — where things live

- **Yaatal-Engine** (Rust/Loco on Railway) — the spine: auth, commerce, payments, sovereignty
  types, the cascading AI router.
- **Yaatal-Registry** (this portal, React + Vite) — the **Single Source of Truth**: docs,
  architecture, data workflows.
- **BOBO** — the first app (voice market commerce), web on Cloudflare.
- **The data factory** — reproducible scripts that turn Wolof corpora into training sets, with a
  source registry tracking provenance and attribution.
- **The review pipeline** — Supabase (state) → Google Sheets (reviewer surface) → n8n (conveyor)
  → Hugging Face (validated artifacts), with an automatic guardrail protecting every label.
- **Model R&D** — the sovereign lane: SALM-Duplex on granite-4.0-h-1b (cap-free edge voice),
  Oolel augmentation, Modal bake-offs.

## Roles — where to plug in

- **🗣️ Wolof data reviewer** — the most valuable role: *you judge the language, the robot guards
  the labels.* One session = a ~50-sentence Sheet ≈ 15 minutes, phone-friendly. Three verdicts
  (✅ approve · ✏️ fix wording · ❌ reject + reason). Keep each sentence's locked words (product,
  market, colors, number, a "meter" word) — the guardrail flags you instantly if a fix drops one.
  **The gold: "your own phrasing"** — if you'd say it differently, write it; native phrasings are
  the most precious data in the pipeline. Slang and deep Wolof are *welcome* — humans, not
  machines, are the authority on language.
- **🦀 Rust engineer (Engine)** — gates: `cargo fmt --check` · `clippy -D warnings` ·
  `test -- --test-threads=1`. Sacred boundary: everything in `crates/` stays app-agnostic.
- **⚛️ React engineer (portal, BOBO)** — this portal: `npm install && npm run dev`. Docs are plain
  markdown in `docs/{en,fr}/`; the first `# heading` is the title; the sidebar picks new files up
  automatically.
- **🧠 ML / data** — standalone `uv run` scripts, GPU on Modal (spend gate: no paid job without
  explicit approval), artifacts on Hugging Face. Read the Wolof data inventory before adding any
  source.
- **✍️ Docs & translation** — everything ships bilingual FR/EN, French first for field teams. If a
  doc contradicts the code, the code wins — fix the doc.

## Day-1 checklist

1. ✅ GitHub account added to **Yaatal-labs** (ask the coordinator).
2. ✅ Google account (reviewers: Sheets access) · WhatsApp or Telegram (team pings).
3. ✅ Read this guide, then the portal's **Welcome** page.
4. ✅ Role-specific: `STATE.md` (vision + status), `ENGINE-MANIFEST` (architecture), or the
   reviewer section above.
5. ✅ First contribution within the week — however small. Motion beats size.

## Working agreements (non-negotiable)

1. **Models propose, the Engine disposes** — no AI triggers a real-world effect unvalidated.
2. **Never train on held-out splits** — validation/test are sacred.
3. **Synthetic audio is never field audio** — always labeled, never mixed.
4. **Everything passes review** — synthetic data stays `needs_review` until native human validation.
5. **Attribution is a requirement** — every artifact credits the source communities:
   **GalsenAI, Soynade Research, Baamtu/AI4D, serge-wilson, Alwaly, Masakhane** and upstream
   corpora. Sovereignty includes honoring those who built the data.

## Mini-glossary

| Term | Meaning |
|---|---|
| **Engine** | the Rust backend — runtime, auth, commerce; "the one that disposes" |
| **Edge** | on-device (phone) — no cloud, no network required |
| **Code-switching** | the natural Wolof↔French mixing of Dakar speech |
| **Guardrail** | the automatic validator checking each sentence's locked words |
| **Batch** | ~50 sentences to review = one 15-minute session |
| **Human variant** | a phrasing written by a reviewer — the "gold" data |
| **SSOT** | Single Source of Truth — this portal |
| **Two clocks** | platform (ship now) ∥ research (sovereign models) |

## Contact

Your entry point: the project coordinator (WhatsApp/Telegram link provided on arrival). No
question is too small — welcome aboard. 🚀

---

# 🇫🇷 FRANÇAIS

## La mission

**YAATAL est l'ombrelle** — le SDK, les modèles d'IA, le commerce (**BOBO**) et le
**livestream/traduction** en sont les voies. La mission : **faire tomber les barrières de langues
et de dialectes d'Afrique de l'Ouest** — pour que chacun·e, lettré·e ou non, de n'importe quelle
communauté ou groupe ethnique, puisse **s'exprimer librement dans sa langue maternelle et être
entendu·e *et* compris·e par tous — chacun dans la sienne.**

> **La barrière principale, c'est l'accès et la portée — pas la créativité, la vision ou le talent.**

Le principe d'ingénierie qui porte tout cela : **« les modèles proposent, l'Engine dispose »** —
l'IA suggère, seul un backend typé-souveraineté agit, et les données sont compilées pour ne jamais
quitter le Sénégal.

## Les deux horloges

Tout avance sur deux horloges parallèles — comprenez cela et 90 % du projet devient clair :

| Horloge | Quoi | Rythme |
|---|---|---|
| **Plateforme** | l'Engine (backend Rust), BOBO (première app), ce portail — *livrable maintenant* | rapide, continu |
| **Recherche** | la pile de modèles wolof souverains (voix edge, ASR, traduction duplex, TTS) | lent, haut plafond, validé par étapes |

Aucune n'attend l'autre. Les capacités de recherche sont *promues* vers la plateforme uniquement
une fois prouvées.

## La carte — où vit quoi

- **Yaatal-Engine** (Rust/Loco sur Railway) — la colonne vertébrale : auth, commerce, paiements,
  types de souveraineté, routeur IA en cascade.
- **Yaatal-Registry** (ce portail, React + Vite) — la **Source Unique de Vérité** : docs,
  architecture, flux de données.
- **BOBO** — la première app (commerce vocal au marché), web sur Cloudflare.
- **La fabrique de données** — scripts reproductibles transformant les corpus wolof en jeux
  d'entraînement, avec un registre des sources (provenance + attribution).
- **Le pipeline de révision** — Supabase (état) → Google Sheets (interface réviseurs) → n8n
  (convoyeur) → Hugging Face (artefacts validés), avec un garde-fou automatique protégeant chaque
  étiquette.
- **R&D modèles** — la voie souveraine : SALM-Duplex sur granite-4.0-h-1b (voix edge sans plafond
  de licence), augmentation Oolel, bake-offs sur Modal.

## Les rôles — où vous brancher

- **🗣️ Réviseur·euse de données wolof** — le rôle le plus précieux : *vous jugez la langue, le
  robot garde les étiquettes.* Une session = un Sheet de ~50 phrases ≈ 15 minutes, sur téléphone.
  Trois verdicts (✅ approuver · ✏️ corriger · ❌ rejeter + raison). Gardez les mots verrouillés de
  chaque phrase (produit, marché, couleurs, nombre, mot « mètre ») — le garde-fou vous signale
  immédiatement toute omission. **L'or : « ta propre formulation »** — si vous le diriez autrement,
  écrivez-le ; les formulations natives sont les données les plus précieuses du pipeline. L'argot
  et le wolof profond sont *bienvenus* — l'autorité sur la langue, ce sont les humains.
- **🦀 Ingénieur·e Rust (Engine)** — portes : `cargo fmt --check` · `clippy -D warnings` ·
  `test -- --test-threads=1`. Frontière sacrée : tout `crates/` reste agnostique aux apps.
- **⚛️ Ingénieur·e React (portail, BOBO)** — ce portail : `npm install && npm run dev`. Les docs
  sont du markdown pur dans `docs/{en,fr}/` ; le premier `# titre` = le titre ; la barre latérale
  détecte les nouveaux fichiers automatiquement.
- **🧠 ML / données** — scripts autonomes `uv run`, GPU sur Modal (porte de dépense : aucun job
  payant sans accord explicite), artefacts sur Hugging Face. Lire l'inventaire des données wolof
  avant d'ajouter une source.
- **✍️ Docs & traduction** — tout est bilingue FR/EN, le français d'abord pour le terrain. Si un
  document contredit le code, le code gagne — corrigez le document.

## Check-list Jour 1

1. ✅ Compte GitHub ajouté à **Yaatal-labs** (demandez au coordinateur).
2. ✅ Compte Google (réviseurs : accès Sheets) · WhatsApp ou Telegram (notifications).
3. ✅ Lire ce guide, puis la page **Bienvenue** du portail.
4. ✅ Selon le rôle : `STATE.md` (vision + état), `ENGINE-MANIFEST` (architecture), ou la section
   réviseur ci-dessus.
5. ✅ Première contribution dans la semaine — même minuscule. Le mouvement compte plus que la taille.

## Les règles de travail (non négociables)

1. **Les modèles proposent, l'Engine dispose** — aucun effet réel sans validation backend.
2. **Jamais d'entraînement sur les splits réservés** — validation/test sont sacrés.
3. **L'audio synthétique n'est jamais de l'audio terrain** — toujours étiqueté, jamais mélangé.
4. **Tout passe par la revue** — une donnée synthétique reste `needs_review` jusqu'à validation
   humaine native.
5. **L'attribution est une exigence** — chaque artefact crédite les communautés sources :
   **GalsenAI, Soynade Research, Baamtu/AI4D, serge-wilson, Alwaly, Masakhane** et les corpus
   amont. La souveraineté inclut d'honorer celles et ceux qui ont construit les données.

## Mini-glossaire

| Terme | Sens |
|---|---|
| **Engine** | le backend Rust — runtime, auth, commerce ; « celui qui dispose » |
| **Edge** | sur l'appareil (téléphone) — pas de cloud requis |
| **Code-switching** | l'alternance wolof↔français naturelle du parler dakarois |
| **Garde-fou** | le validateur automatique des mots verrouillés |
| **Batch** | ~50 phrases à réviser = une session de 15 minutes |
| **Variante humaine** | une formulation écrite par un·e réviseur·euse — la donnée « or » |
| **SSOT** | Source Unique de Vérité — ce portail |
| **Les deux horloges** | plateforme (livrer maintenant) ∥ recherche (modèles souverains) |

## Contact

Votre point d'entrée : le coordinateur du projet (lien WhatsApp/Telegram fourni à l'arrivée).
Aucune question n'est trop petite — *jërëjëf*, et bienvenue à bord. 🚀
