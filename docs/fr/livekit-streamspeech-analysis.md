# Analyse d'Intégration Technique : LiveKit & StreamSpeech

Ce document analyse les frameworks open-source **LiveKit (agents/livestream)** et **StreamSpeech**, en explorant comment nous pouvons exploiter leurs fonctionnalités pour concevoir un agent vocal duplex d'Afrique de l'Ouest léger, économe en données et réactif aux interruptions.

---

## 1. LiveKit : Orchestration WebRTC et Boucle Duplex

### A. Diffusion en Temps Réel (`livekit-examples/livestream`)
*   **Architecture SFU WebRTC** : Les protocoles de diffusion classiques (HLS/RTMP) introduisent 2 à 10 secondes de latence, ce qui rend le dialogue de vente interactif impossible. LiveKit utilise WebRTC, atteignant une **latence de streaming inférieure à 100ms** entre le vendeur et l'audience.
*   **Ingress & Egress** : LiveKit prend en charge l'ingress RTMP/WHIP (permettant aux vendeurs de diffuser depuis OBS Studio) et distribue les flux WebRTC à des milliers de clients mobiles de manière optimale.

### B. Orchestration de l'Agent Vocal (`livekit/agents`)
*   **VAD (Détection d'Activité Vocale)** : Le framework `livekit/agents` intègre des modèles VAD locaux hautement optimisés (comme Silero VAD) qui détectent instantanément l'énergie vocale.
*   **Gestion des Interruptions (Contrôle Duplex)** : Ce framework fournit une **boucle de contrôle duplex** clé en main. Lorsque l'utilisateur interrompt l'agent :
    1.  Le VAD détecte la parole.
    2.  Le serveur arrête immédiatement de transmettre les paquets audio de l'agent.
    3.  L'agent annule les tâches de traduction/synthèse en cours et réinitialise le contexte de la discussion.
*   **Pipeline Serveur/Edge** : Nous pouvons écrire un agent LiveKit personnalisé en Python ou JS qui se connecte à notre pile de modèles **Hugging Face** (Nemotron, Wolof-NMT, MOSS-TTS-Nano-100M) et publie l'audio généré dans une salle LiveKit.

---

## 2. StreamSpeech : Traduction Parole-à-Parole (S2ST) Simultanée

StreamSpeech est un modèle "Tout-en-Un" pour la reconnaissance, la traduction et la synthèse vocale simultanées :

*   **Sortie Entrelacée (Évitement du Délai de Sérialisation)** :
    *   Dans une cascade traditionnelle, vous devez attendre la fin de la phrase ASR pour traduire, puis attendre la traduction pour synthétiser.
    *   StreamSpeech produit la traduction textuelle et les tokens audio TTS **simultanément** en une seule étape autorégressive. La synthèse commence **avant même que le locuteur ait terminé sa phrase**.
*   **Espace de Tokenisation Unifié** :
    *   StreamSpeech démontre que la parole et le texte peuvent être projetés dans le même vocabulaire. Nous pouvons utiliser cette approche pour entraîner un modèle Mamba-2 léger qui produit en parallèle du texte français et des tokens audio MOSS-TTS-Nano, éliminant 100ms supplémentaires de délai.

---

## 3. Stratégie d'Architecture Mixte YAATAL

Pour concevoir un agent duplex léger, économe en Mo et en batterie, nous combinons les forces des deux technologies :

```
  [Flux WebRTC LiveKit] (Entrée audio du vendeur)
           │
           ▼
  [VAD Agents LiveKit] (Détecte les interruptions de l'utilisateur)
           │
           ▼ (Déclencheur)
  [Décodeur Conjoint type StreamSpeech (Mamba-2)]
           │
           ├──► Sortie Sous-Titres Texte (99% d'économie de Mo)
           └──► Sortie Tokens Audio (MOSS-TTS-Nano-100M)
```

1.  **Transport (LiveKit WebRTC)** : Gère la transmission audio à ultra-faible latence et la distribution aux spectateurs.
2.  **Orchestration (LiveKit Agents)** : S'exécute sur le serveur pour coordonner la détection de parole (VAD), couper le flux audio lors des interruptions et envoyer les tokens audio aux clients.
3.  **Modèle Décisionnel (StreamSpeech + Mamba-2)** : Un modèle Mamba-2 SSM conjoint qui accepte les tokens audio Wolof et décode directement la traduction française et les tokens de synthèse vocale en parallèle, garantissant une efficacité CPU/batterie maximale sur mobile.
