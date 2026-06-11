# Inventaire des Modèles, Architectures & Configurations Hybrides YAATAL

Ce document présente les détails d'architecture, l'empreinte de ressources, les liens et les configurations de déploiement optionnelles pour l'écosystème de traduction parole-à-parole en temps réel de YAATAL.

---

## 1. Matrice des Modèles & Ressources Directes

### 🎙️ Étape 1 : Reconnaissance Automatique de la Parole (ASR)

#### **Nemotron 3.5 ASR (Streaming 0.6B)**
*   **Architecture** : Encodeur FastConformer avec décodeur CTC. Utilise des fenêtres d'attention sélectives.
*   **Taille des Paramètres** : ~600 Millions
*   **Empreinte Mémoire** : ~1,2 Go de RAM (poids statiques) + KV-cache dynamique (complexité spatiale en $O(L)$, où $L$ est la longueur du contexte).
*   **Entrée/Sortie** : Flux audio brut $\rightarrow$ texte ponctué et cased.
*   **Usage Principal** : Transcription en direct haute fidélité.
*   **Usage Optionnel** : Peut fonctionner avec la détection automatique (`target_lang=auto`) pour transcrire le code-switching Wolof-Français à la volée.
*   **Ressources & Liens** :
    *   **Inférence** : [Fiche Modèle Hugging Face](https://huggingface.co/nvidia/nemotron-3.5-asr-streaming-0.6b)
    *   **Référence d'Architecture** : [Publication FastConformer Speech (arXiv)](https://arxiv.org/abs/2305.05077)

#### **Samba-ASR / AuM (Audio Mamba)**
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

#### **Wolof-NMT (NLLB-200 Distilled 600M)**
*   **Architecture** : Transformer Encoder-Decoder dense.
*   **Taille des Paramètres** : ~615 Millions
*   **Empreinte Mémoire** : ~1,3 Go de RAM.
*   **Entrée/Sortie** : Texte Wolof $\rightarrow$ texte Français.
*   **Usage Principal** : Traduction de niveau production.
*   **Usage Optionnel** : Peut être hébergé sans serveur (Inference Endpoints Hugging Face) et requêté par n8n pour les tâches de fond.
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

#### **Modèle de Traduction Mamba-2**
*   **Architecture** : Traducteur séquentiel récurrent State Space.
*   **Taille des Paramètres** : ~100 Millions
*   **Empreinte Mémoire** : ~200 Mo de RAM.
*   **Entrée/Sortie** : Tokens Wolof $\rightarrow$ tokens Français.
*   **Usage Principal** : Traduction récurrente en temps linéaire à latence constante.
*   **Usage Optionnel** : Traduction en continu flux de tokens par tokens (traduit au fur et à mesure que la personne parle).
*   **Ressources & Liens** :
    *   **Code Source** : [Dépôt GitHub Mamba (state-spaces/mamba)](https://github.com/state-spaces/mamba)

---

### 🔊 Étape 3 : Synthèse Vocale (TTS)

#### **MOSS-TTS-Nano-100M**
*   **Architecture** : Tokeniseur Audio Autoregressif + Décodeur LLM léger.
*   **Taille des Paramètres** : ~100 Millions
*   **Empreinte Mémoire** : ~220 Mo de RAM.
*   **Entrée/Sortie** : Texte Français $\rightarrow$ forme d'onde audio 48kHz.
*   **Usage Principal** : Doublage vocal français haute fidélité.
*   **Usage Optionnel** : Exportable vers ONNX pour s'exécuter localement sur des processeurs CPU standards.
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
