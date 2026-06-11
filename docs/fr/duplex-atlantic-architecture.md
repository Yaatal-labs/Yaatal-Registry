# Plan d'Architecture Duplex Atlantique YAATAL

Ce document définit le plan d'architecture à long terme pour un **Agent Vocal Interactif Duplex** léger, économe en données et respectueux de la batterie, traduisant entre les langues atlantiques d'Afrique de l'Ouest (Wolof, Bambara, Peul/Foula, Sérère, Arabe) et les langues internationales (Anglais, Français).

---

## 1. Le Défi Clé : Faibles Ressources & Contraintes de Données Mobiles

Construire un agent vocal bidirectionnel interactif en temps réel pour l'Afrique de l'Ouest nécessite de surmonter deux contraintes majeures :
1.  **Langues à Faibles Ressources** : Les langues atlantiques manquent de grands volumes de données audio alignées parole-à-parole nécessaires pour entraîner des modèles monolithiques de Speech-to-Speech (S2ST).
2.  **Réalités des Infrastructures** : Les utilisateurs dépendent de forfaits de données mobiles facturés au mégaoctet (Mo) et d'appareils sensibles à l'autonomie de la batterie. L'envoi continu de flux audio bruts vers le cloud est trop coûteux et décharge rapidement les batteries.

---

## 2. La Stratégie de Bande Passante : "Audio à l'Edge, Texte dans les Airs"

Pour minimiser la consommation de données, YAATAL utilise une **Architecture en Cascade Optimisée pour l'Edge** :

```
[L'utilisateur parle]
      │
      ▼ (Traitement CPU local)
[Mamba-ASR Local (Parole-vers-Texte)]
      │
      ▼ (Envoi d'un mini-paquet de TEXTE - 99% d'économie)
   [DONNÉES MOBILES (Réseau)]
      │
      ▼
[Traducteur Cloud/Edge (Mamba-2-MT)]
      │
      ▼ (Retour de la traduction en TEXTE)
   [DONNÉES MOBILES (Réseau)]
      │
      ▼ (Traitement CPU local)
[MOSS-TTS-Nano-100M Local (Texte-vers-Parole)]
      │
      ▼
[Sortie Voix & Interaction Ventes]
```

### Comparatif de Consommation :
*   **Audio-à-Audio Monolithique (Hibiki/Cloud)** : Requiert l'envoi et la réception de flux audio continus. **Débit : ~256 kbps (environ 115 Mo par heure)**.
*   **Cascade Audio-Edge, Texte-Réseau** : Les étapes parole-à-texte et texte-à-parole sont locales. Seul le texte brut transite sur le réseau. **Débit : ~1 kbps (environ 0,45 Mo par heure)**. *Soit une économie de 99,6% sur votre forfait mobile.*

---

## 3. Interaction Duplex & Interruptibilité

Pour obtenir un niveau "Duplex" naturel (où l'agent et l'utilisateur peuvent se couper la parole) :

1.  **Écoute Continue (FastConformer)** :
    *   L'encodeur ASR local est toujours actif et alimente en continu l'espace d'état avec des buffers audio.
2.  **Coupure de Lecture Instantanée** :
    *   Si l'utilisateur commence à parler pendant que le vocoder TTS de l'agent s'exécute, l'ASR local détecte instantanément l'énergie vocale.
    *   L'application suspend le flux audio client (`audioContext.suspend()`), coupant instantanément la voix de l'agent.
3.  **Dualité de l'Espace d'État (Mamba-2)** :
    *   Mamba-2 n'utilisant pas de KV-cache, effacer l'historique lors d'une interruption revient à réinitialiser le vecteur d'état récurrent (complexité constante en $O(1)$), éliminant tout décalage après une coupure.

---

## 4. Matrice de Traduction Multilingue (Cascade vs Monolithique)

Pour $N$ langues, un modèle monolithique doit être entraîné sur $N \times (N-1)$ paires. Pour Peul $\leftrightarrow$ Sérère ou Bambara $\leftrightarrow$ Wolof, ces données n'existent pas.

YAATAL résout cela avec un **Maillage de Traduction basé sur un Pivot** (Français ou Anglais) :

```
   [Wolof]  ◄──►  [Français]  ◄──►  [Bambara]
      ▲              ▲               ▲
      │              │               │
   [Sérère] ◄──►  [Anglais]  ◄──►  [Peul/Foula]
```

*   **Entraînement Modulaire** : Nous entraînons de petits traducteurs **Mamba-2 indépendants de 100M** reliant chaque langue locale au Français ou à l'Anglais servant de pivot.
*   **Composition Dynamique** : Pour traduire du Sérère au Peul, le système enchaîne : `ASR Sérère` $\rightarrow$ `Traduction Sérère-vers-Français` $\rightarrow$ `Traduction Français-vers-Peul` $\rightarrow$ `TTS Peul`.
*   **Latence de Cascade Négligeable** : Chaque étape de traduction Mamba-2 prenant moins de 15ms, cascader deux traducteurs (Sérère $\rightarrow$ Français $\rightarrow$ Peul) n'ajoute que ~30ms de latence, maintenant le pipeline sous le seuil conversationnel critique de **<350ms**.
