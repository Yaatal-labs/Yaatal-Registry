# Bienvenue dans l'équipe YAATAL

> Ce guide vous amène de zéro à votre première contribution en ~30 minutes, que vous soyez
> développeur(euse), réviseur(euse) de données wolof, ML, ou rédacteur(rice). Bienvenue. 🇸🇳

## La mission

**YAATAL est l'ombrelle.** Le SDK, les modèles d'IA, le commerce (**BOBO**) et le
**livestream/traduction** en sont les voies. La mission : **faire tomber les barrières de langues
et de dialectes d'Afrique de l'Ouest**, pour que chacun(e), lettré(e) ou non, de n'importe quelle
communauté ou groupe ethnique, puisse **s'exprimer librement dans sa langue maternelle et être
entendu(e) *et* compris(e) par tous, chacun dans la sienne.**

> **La barrière principale, c'est l'accès et la portée, pas la créativité, la vision ou le talent.**

Un principe d'ingénierie porte tout cela : **« les modèles proposent, l'Engine dispose »**.
L'IA suggère. Seul un backend typé-souveraineté agit, et les données ne quittent jamais le
Sénégal par construction.

## Les deux horloges

Tout le projet avance sur deux horloges parallèles, comprendre cela évite 90 % des confusions :

| Horloge | Quoi | Rythme |
|---|---|---|
| **Plateforme** | l'Engine (backend Rust), BOBO (première app), le portail : *livrable maintenant* avec l'IA cloud existante | rapide, livraisons continues |
| **Recherche** | la pile de modèles wolof souverains (voix edge, ASR, traduction duplex, TTS) | lente, à fort plafond, validée par étapes |

Aucune des deux n'attend l'autre. Les capacités de recherche sont *promues* vers la plateforme
uniquement quand elles sont prouvées.

## La carte du projet — où vit quoi

- **Yaatal-Engine** (Rust / Loco, déployé sur Railway) : la colonne vertébrale : auth, commerce,
  paiements, types de souveraineté, routeur IA en cascade.
- **Yaatal-Registry** (ce portail, React + Vite) : la **Source Unique de Vérité** : documentation,
  architecture, flux de données. Ce que vous lisez en fait partie.
- **BOBO** : la première app (commerce vocal au marché), web sur Cloudflare.
- **La fabrique de données** : scripts reproductibles (`yaatal_df_*`, `yaatal_edge_*`) qui
  transforment les corpus wolof en jeux d'entraînement ; registre des sources avec provenance
  et attribution.
- **Le pipeline de révision** : Supabase (état), Google Sheets (interface réviseurs), n8n
  (convoyeur), Hugging Face (artefacts validés), avec un garde-fou automatique qui protège les
  étiquettes.
- **R&D modèles** : la voie souveraine : SALM-Duplex sur granite-4.0-h-1b (voix edge sans plafond
  de licence), augmentation Oolel, bake-offs sur Modal.

## Les rôles — où vous brancher

### 🗣️ Réviseur(euse) de données (wolof)
Le rôle le plus précieux du projet : **vous jugez la langue, le robot garde les étiquettes.**
- Une session = un Sheet de ~50 phrases ≈ 15 minutes, sur téléphone ou ordinateur.
- Trois verdicts par phrase : ✅ Approuver · ✏️ Corriger la formulation · ❌ Rejeter (avec raison).
- **Règle d'or** : chaque phrase doit garder ses mots verrouillés (produit, marché, couleurs,
  nombre, mot « mètre »). Si votre correction en retire un, le garde-fou vous le signale
  immédiatement, personne n'a besoin d'être parfait.
- **L'or : « ta propre formulation »** : si vous pensez *« nous, on dirait plutôt comme ça »*,
  écrivez-la ! Vos formulations natives sont les données les plus précieuses du pipeline.
- L'argot, les idiomes et le wolof profond sont **bienvenus** : la révision humaine fait autorité
  sur la langue, pas les machines.

### 🦀 Développeur(euse) Rust (Engine)
`cargo fmt --check` · `cargo clippy -- -D warnings` · `cargo test -- --test-threads=1`.
Frontière sacrée : tout ce qui est dans `crates/` reste **agnostique aux apps**. Lire
`CLAUDE.md` et `ENGINE-MANIFEST` avant le premier commit.

### ⚛️ Développeur(euse) React (portail, BOBO)
Ce portail : `npm install && npm run dev`. Les docs vivent dans `docs/{en,fr}/` en markdown pur —
le titre = premier `# titre`. Toute doc ajoutée apparaît automatiquement dans la barre latérale.

### 🧠 ML / Données
Scripts autonomes (`uv run --script`), GPU sur Modal (porte de dépense : jamais de job payant sans
accord explicite), artefacts sur Hugging Face. Lire `WOLOF-DATA-INVENTORY.md` (le vivier de
corpus) et le registre des sources avant d'ajouter une donnée.

### ✍️ Docs & traduction
Tout est bilingue FR/EN, le français d'abord pour les équipes terrain. Ce portail est la SSOT :
si un document contredit le code, le code gagne, et on corrige le document.

## Check-list Jour 1

1. ✅ Compte GitHub ajouté à l'organisation **Yaatal-labs** (demandez au coordinateur).
2. ✅ Compte Google (réviseurs : accès aux Sheets) · WhatsApp ou Telegram (notifications d'équipe).
3. ✅ Lire ce guide, puis la page **Bienvenue** du portail.
4. ✅ Selon votre rôle : `STATE.md` (vision + état), `ENGINE-MANIFEST` (architecture), ou la
   section réviseur ci-dessus.
5. ✅ Première contribution dans la semaine, même minuscule : une phrase révisée, une coquille
   corrigée, un test ajouté. Le mouvement compte plus que la taille.

## Les règles de travail (non négociables)

1. **Les modèles proposent, l'Engine dispose** : aucune IA ne déclenche d'effet réel sans
   validation par le backend.
2. **Jamais d'entraînement sur les données réservées** (validation/test), les splits sont sacrés.
3. **L'audio synthétique n'est jamais de l'audio terrain** : toujours étiqueté, jamais mélangé.
4. **Tout passe par la revue** : une donnée synthétique reste `needs_review` jusqu'à validation
   humaine native.
5. **L'attribution est une exigence** : chaque artefact crédite les communautés sources :
   **GalsenAI, Soynade Research, Baamtu/AI4D, serge-wilson, Alwaly, Masakhane** et les corpus
   amont. La souveraineté inclut d'honorer celles et ceux qui ont construit les données.

## Mini-glossaire

| Terme | Sens |
|---|---|
| **Engine** | le backend Rust : runtime, auth, commerce, « celui qui dispose » |
| **Edge** | sur l'appareil (téléphone) : pas de cloud, pas de réseau requis |
| **Code-switching** | l'alternance wolof↔français naturelle du parler dakarois |
| **Garde-fou** | le validateur automatique qui vérifie les mots verrouillés de chaque phrase |
| **Batch** | un lot de ~50 phrases à réviser = une session de 15 minutes |
| **Variante humaine** | une formulation écrite par un(e) réviseur(euse) : la donnée « or » |
| **SSOT** | Source Unique de Vérité : ce portail |
| **Les deux horloges** | plateforme (livrer maintenant) ∥ recherche (modèles souverains) |

## Contact

Votre point d'entrée : le coordinateur du projet (lien WhatsApp/Telegram fourni à l'arrivée).
Aucune question n'est trop petite, *jërëjëf*, et bienvenue à bord. 🚀
