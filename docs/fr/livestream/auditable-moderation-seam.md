# Seuil de Modération Auditable YAATAL : Filtrage & Censure en Temps Réel

Ce document présente l'architecture pour introduire un **Seuil de Modération Auditable en Temps Réel** dans le pipeline de traduction YAATAL. Il permet de filtrer la vulgarité, les contenus toxiques, les fausses allégations commerciales et les données personnelles (PII) avant qu'ils ne soient prononcés (doublage) ou affichés à l'écran (sous-titres).

---

## 1. Emplacement du Seuil : Pourquoi l'interception de texte est la clé

Dans un pipeline en cascade en temps réel (Parole $\rightarrow$ Texte $\rightarrow$ Traduction $\rightarrow$ Parole), le **texte issu de la traduction** est l'emplacement le plus efficace pour insérer un filtre de modération. L'analyse de texte prend moins d'une milliseconde, offre une précision maximale et génère des journaux d'audit clairs pour la conformité avant que le moteur Text-to-Speech (TTS) ne génère les formes d'onde audio.

```
                  [1. Entrée Audio Wolof]
                             │
                             ▼
                    [2. Transcription ASR]
                             │
                             ▼
                  [3. Traduction Automatique]
                             │
                             ▼ (Interception)
             ┌─────────────────────────────┐
             │ SEUIL DE MODÉRATION AUDIT   │
             │ • Trie : Gros mots          │──► [Logs vers Supabase 'moderation_audits']
             │ • Regex : Données PII       │
             │ • Classifieurs Garde-fous   │
             └─────────────────────────────┘
                             │
                             ▼ (Texte Modéré)
                    [4. Text-to-Speech (TTS)]
                             │
                             ▼
              [5. Web Audio API Navigateur]  ──► (L'OscillatorNode injecte un bip sur les mots censurés)
```

---

## 2. Mécanismes du Moteur de Modération

Le seuil de modération exécute en parallèle trois filtres séquentiels sur le texte traduit pour maintenir la latence en dessous de **25ms** :

1.  **Filtre Lexical basé sur un Trie (latence 0ms)** :
    *   Utilise un arbre de préfixes (Trie) pour faire correspondre instantanément les mots interdits, les noms de concurrents ou le vocabulaire inapproprié dans la langue cible (Français/Anglais).
    *   *Action* : Remplace les correspondances par des tokens `[REDACTED]`.
2.  **Rédacteur de Données PII basé sur des Regex (latence 1ms)** :
    *   Applique des expressions régulières pour identifier les numéros de téléphone, adresses e-mail, numéros de carte bancaire ou adresses physiques.
    *   *Action* : Masque les données sensibles avec des tokens génériques (ex : `[PHONE]`, `[EMAIL]`).
3.  **Classifieur de Garde-fous Léger (latence 20ms)** :
    *   Exécute un modèle de classification local léger (ONNX) pour évaluer la toxicité, les allégations commerciales mensongères ou agressives.
    *   *Action* : Coupe le segment audio si la toxicité dépasse un seuil défini.

---

## 3. Censure au Niveau Audio (Bip en Direct)

Pour le doublage audio, sauter simplement des mots rendrait la parole hachée et confuse. YAATAL gère la censure via un **bip audio dynamique côté navigateur** :

1.  **Alignement Temporel** : Le moteur TTS (MOSS-TTS-Nano-100M) fournit des tokens audio alignés avec des horodatages (timestamps) pour chaque mot.
2.  **Atténuation & Oscillateur (Bip)** :
    *   Lorsqu'un mot est signalé comme censuré, l'API Web Audio du navigateur joue le segment audio.
    *   Au timestamp exact du mot censuré, l'application atténue (mute) le canal audio du TTS et active un **`OscillatorNode` sinusoïdal de 1kHz** (le bip classique).
    *   Une fois le timestamp du mot dépassé, le bip s'arrête et le canal TTS est réactivé.

---

## 4. Audit & Historique (Supabase + n8n)

Chaque événement de censure est enregistré pour le contrôle qualité et la conformité :

### Table Supabase : `moderation_audits`
Nous enregistrons l'événement avec la structure suivante :
*   `id` (UUID) : Clé primaire.
*   `session_id` (UUID) : Lien vers la session de vente en direct.
*   `source_transcript` (Text) : La transcription brute en Wolof.
*   `original_translation` (Text) : La traduction française non censurée.
*   `moderated_translation` (Text) : La traduction finale censurée.
*   `violation_type` (Text) : ex : `PROFANITY`, `PII`, `CLAIM_VIOLATION`.
*   `created_at` (Timestamp).

### Pipeline de Conformité n8n :
1.  **Déclencheur** : Webhook de base de données Supabase s'activant lors de chaque nouvel audit.
2.  **Notification** : Si le type d'infraction est une allégation mensongère (ex: prix erroné lors d'une vente en direct), n8n envoie une alerte sur le canal Slack/Discord de l'équipe de modération.
3.  **Boucle d'Entraînement** : Les données enregistrées sont analysées pour affiner le modèle de traduction afin d'éviter qu'il ne génère cette allégation erronée à l'avenir.
