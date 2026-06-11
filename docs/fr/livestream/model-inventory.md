# Inventaire des Modèles, Architectures & Configurations Hybrides YAATAL

Ce document présente les détails d'architecture, l'empreinte de ressources, les liens et les configurations de déploiement optionnelles pour l'écosystème de traduction parole-à-parole en temps réel de YAATAL.

> **Passe de vérification du 2026-06-11.** Chaque entrée porte désormais un tag de statut :
> ✅ vérifié sur Hugging Face avec licence propre · ⚠️ utilisable avec une réserve nommée ·
> ❌ référence de recherche uniquement (aucun checkpoint publié).
> Règle de promotion : un candidat n'entre dans la pile décidée que lorsqu'un pipeline le consomme
> réellement et que sa chaîne de licence est propre. La même règle s'applique aux données (voir la
> page Pipeline de données).

---

## 1. Matrice des Modèles & Ressources Directes

### 🎙️ Étape 1 : Reconnaissance Automatique de la Parole (ASR)

#### **Nemotron 3.5 ASR (Streaming 0.6B)** ✅ vérifié · OpenMDW-1.1 (sans plafond)
*   **Architecture** : Cache-Aware FastConformer avec décodeur **RNNT** (selon la fiche modèle). Utilise des fenêtres d'attention sélectives.
*   **Taille des Paramètres** : ~600 Millions
*   **Statut Wolof** : absent de ses ~40 locales ; nécessite l'adaptation basse-ressource décrite dans `SALM-ON-GRANITE-350M.md` (corpus Wolof-ASR-Data de 97,9 h)
*   **Empreinte Mémoire** : ~1,2 Go de RAM (poids statiques) + KV-cache dynamique (complexité spatiale en $O(L)$, où $L$ est la longueur du contexte).
*   **Entrée/Sortie** : Flux audio brut $\rightarrow$ texte ponctué et cased.
*   **Usage Principal** : Transcription en direct haute fidélité.
*   **Usage Optionnel** : Peut fonctionner avec la détection automatique (`target_lang=auto`) pour transcrire le code-switching Wolof-Français à la volée.
*   **Ressources & Liens** :
    *   **Inférence** : [Fiche Modèle Hugging Face](https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b)
    *   **Référence d'Architecture** : [Publication FastConformer Speech (arXiv)](https://arxiv.org/abs/2305.05077)

#### **Samba-ASR / AuM (Audio Mamba)** ❌ référence de recherche — aucun checkpoint publié (vérifié 2026-06-11)
*   **Architecture** : Blocs Structured State Space Model (SSM / Mamba-2) remplaçant l'attention classique.
*   **Taille des Paramètres** : ~50 Millions - 120 Millions
*   **Empreinte Mémoire** : **~200 Mo de RAM (statique)**. Espace d'état récurrent constant (complexité spatiale en $O(1)$).
*   **Entrée/Sortie** : Flux audio brut $\rightarrow$ tokens de texte.
*   **Usage Principal** : ASR en continu ultra-léger sans KV-cache sur les terminaux clients (edge).
*   **Usage Optionnel** : Idéal pour un **déploiement CPU à faible puissance** (applications mobiles, extensions de navigateur) pour des livestreams de longue durée.
*   **Ressources & Liens** :
    *   **Recherche Mamba-ASR** : [Publication Samba-ASR (arXiv:2501.02832)](https://arxiv.org/abs/2501.02832)
    *   **Framework SSD** : [Publication Mamba-2 (arXiv:2405.21060)](https://arxiv.org/abs/2405.21060)

---

### 🔀 Étape 2 : Traduction Automatique (MT)

#### **MADLAD-400-3B-MT** ✅ vérifié · Apache-2.0 — candidat principal
*   **Architecture** : Encoder-decoder T5 entraîné sur MADLAD-400.
*   **Taille des Paramètres** : ~3 Milliards (des variantes 7B et 10B existent comme échelle de qualité).
*   **Couverture linguistique** : inclut nativement **le wolof (`wo`), le bambara (`bm`), le peul (`ff`), le sérère (`srr`), le dioula (`dyu`), le haoussa (`ha`)** parmi plus de 400 langues : la liste atlantique que vise cette voie.
*   **Usage Principal** : couture de traduction côté serveur et génération de texte cible synthétique ; le remplaçant à licence propre de NLLB dans les deux rôles.
*   **Déploiement** : des builds GGUF existent ; le serving CTranslate2 est éprouvé en communauté.
*   **Ressources & Liens** : [google/madlad400-3b-mt (Hugging Face)](https://huggingface.co/google/madlad400-3b-mt)

#### **M2M100-418M** ✅ vérifié · MIT — petite option propre
*   **Architecture** : Transformer many-to-many, inclut `wo`.
*   **Taille des Paramètres** : ~418 Millions.
*   **Usage Principal** : MT à petite empreinte, affiné sur les ~116 k paires FR↔WO de l'inventaire de données ; plus tard élève de distillation de MADLAD.
*   **Ressources & Liens** : [facebook/m2m100_418M (Hugging Face)](https://huggingface.co/facebook/m2m100_418M)

#### **Wolof-NMT (NLLB-200 Distilled 600M)** ⚠️ référence / R&D — poids NC
*   **Architecture** : Transformer Encoder-Decoder dense.
*   **Taille des Paramètres** : ~615 Millions
*   **Réserve** : le wrapper GalsenAI est MIT, mais les **poids NLLB-200 sous-jacents sont CC-BY-NC** : très bien comme référence R&D et étalon de qualité, pas pour la livraison. MADLAD-400 (ci-dessus) couvre ses deux rôles avec une licence propre.
*   **Usage Principal** : étalon d'évaluation ; moteur historique des paires FR↔WO synthétiques.
*   **Ressources & Liens** :
    *   **Code Source** : [Dépôt GitHub Wolof-NMT](https://github.com/Galsenaicommunity/Wolof-NMT)
    *   **Modèle de Base** : [Meta NLLB-200 (Hugging Face)](https://huggingface.co/facebook/nllb-200-distilled-600m)

#### **MarianMT (Quantifié ONNX INT4)**
*   **Architecture** : Transformer Seq2Seq optimisé.
*   **Taille des Paramètres** : ~50 Millions
*   **Empreinte Mémoire** : **~38 Mo de RAM** (via quantification entière 4-bit).
*   **Entrée/Sortie** : Texte Wolof $\rightarrow$ texte Français.
*   **Usage Principal** : Traduction locale dans le navigateur via WebAssembly.
*   **Usage Optionnel** : Sert de **fallback local** en cas de coupure réseau vers l'API Cloud.
*   **Ressources & Liens** :
    *   **Moteur d'Inférence Wasm** : [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/)

#### **Modèle de Traduction Mamba-2** ❌ concept — aucun checkpoint n'existe (vérifié 2026-06-11)
*   **Idée** : un traducteur récurrent state-space à latence constante, token par token. Rien de publié n'y correspond ; cela reste un cap de conception. Si un tel modèle apparaît (ou si nous en distillons un), il prendra cette place.
*   **Ressources & Liens** : [state-spaces/mamba (GitHub)](https://github.com/state-spaces/mamba) (framework uniquement)

---

### 🔊 Étape 3 : Synthèse Vocale (TTS)

#### **MOSS-TTS-Nano-100M** ✅ vérifié · Apache-2.0 (avec une réserve)
*   **Architecture** : Tokeniseur Audio Autoregressif + Décodeur LLM léger (`moss_tts_nano`, `custom_code`).
*   **Taille des Paramètres** : ~100 Millions
*   **Empreinte Mémoire** : ~220 Mo de RAM.
*   **Entrée/Sortie** : Texte Français $\rightarrow$ forme d'onde audio 48kHz. 20 langues sur la fiche (français oui, **pas de wolof** : le doublage wolof reste sur `galsenai/xTTS-v2-wolof` ou de futurs affinages).
*   **Usage Principal** : Doublage vocal français haute fidélité.
*   **Réserve** : livré en `custom_code` (pas de voie llama.cpp) ; l'export ONNX annoncé doit être vérifié avant que la configuration « pur edge » ne s'y appuie.
*   **Ressources & Liens** :
    *   **Inférence** : [OpenMOSS-Team/MOSS-TTS-Nano-100M (Hugging Face)](https://huggingface.co/OpenMOSS-Team/MOSS-TTS-Nano-100M)
    *   **Dépôt GitHub** : [OpenMOSS/MOSS-TTS-Nano](https://github.com/OpenMOSS/MOSS-TTS-Nano)

#### **Multi-Band MelGAN / Vocos**
*   **Architecture** : Vocoder GAN (Generative Adversarial Network) parallèle.
*   **Taille des Paramètres** : ~4 Millions - 8 Millions
*   **Empreinte Mémoire** : **~15 Mo de RAM**.
*   **Entrée/Sortie** : Mel-spectrogramme/tokens audio $\rightarrow$ audio brut.
*   **Usage Principal** : Synthèse de forme d'onde à très faible latence.
*   **Usage Optionnel** : S'intègre dans un pipeline de synthèse mobile pour s'exécuter sur le CPU du client avec des temps de calcul inférieurs à la milliseconde.

---

### 🧠 Étape 4 : Backbone LLM / Agent Duplex — partagé avec la voie Commerce

#### **Granite 4.0 H (350M / 1B)** ✅ vérifié · Apache-2.0
*   **Architecture** : hybride dense Mamba2 + attention (`granitehybrid`), function-calling natif.
*   **Rôle ici** : le backbone LLM de la **composition SALM-Duplex**, l'agent de traduction duplex
    interactif que décrit le Plan Atlantique de cette voie. Le même backbone sert l'agent vocal de
    la voie Commerce : une famille de modèles, une chaîne de licence, les deux voies.
*   **Statut** : le 1B est qualifié (bake-off à l'échelle smoke, 2026-06-10) ; le 350M est le
    candidat edge agressif (~210 Mo en Q4), en attente de son smoke LoRA. Composition complète et
    plan de construction : `SALM-ON-GRANITE-350M.md` dans le dépôt Engine.
*   **Ressources & Liens** : [granite-4.0-h-350m](https://huggingface.co/ibm-granite/granite-4.0-h-350m) · [granite-4.0-h-1b](https://huggingface.co/ibm-granite/granite-4.0-h-1b)

---

## 2. Configurations de Déploiement Hybrides

Selon votre budget matériel, vos exigences de latence et votre public cible, l'architecture YAATAL peut être configurée de trois façons :

### A. La Cascade Récurrente "Pur Edge" (Mémoire minimale & Hors-ligne)
*   **ASR** : Samba-ASR (SSM récurrent)
*   **MT** : MarianMT local (ONNX INT4 Wasm)
*   **TTS** : MOSS-TTS-Nano (ONNX CPU) + Vocos
*   **RAM Totale** : **~450 Mo**
*   **Avantages** : S'exécute à 100% dans le navigateur du client. Aucun coût de serveur. Fonctionne hors-ligne.

### B. Le Mode "Ingestion Hybride à l'Edge" (Compromis Vitesse/Qualité)
*   **Client** : Cache de phrases local (Trie, 0ms) + MarianMT local.
*   **Serveur** : API de traduction Supabase + Hugging Face Inference Endpoints.
*   **Fonctionnement** :
    1. Le client effectue la transcription et la traduction locale instantanée pour les expressions courantes.
    2. Les phrases longues et complexes sont renvoyées via des **Supabase Edge Functions** vers le traducteur **Hugging Face NLLB-600M**.
*   **Avantages** : Garantit une fluidité conversationnelle tout en préservant la fidélité de traduction.

### C. Le Mode "Pipeline de Traitement / Curation" (Orchestration n8n)
*   **Ingestion** : Fichier audio déposé sur **Supabase Storage**.
*   **Orchestrateur** : Déclenchement d'un workflow **n8n** sur événement d'upload.
*   **Inference** : Envoi par n8n au modèle **Hugging Face MOSS-Audio-4B-Instruct** pour analyser les locuteurs, indexer les timestamps et classifier le contenu.
*   **Avantages** : Idéal pour l'indexation sémantique des archives, le catalogage et la constitution de jeux de données d'entraînement.
