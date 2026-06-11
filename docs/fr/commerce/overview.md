# Voie Commerce (BOBO) — Vue d'ensemble

**La promesse : être entendu·e par le marché dans sa langue.** L'acheteur·euse parle wolof,
français, ou le mélange naturel des deux à Dakar — pour trouver du tissu à Sandaga, comparer les
prix, commander et payer — sans clavier, sans que l'alphabétisation soit un péage.

## Comment ça marche

```
Voix (wolof / wo-fr) → le modèle sur l'appareil PROPOSE une action (tool-call JSON strict)
                     → l'Engine VALIDE et EXÉCUTE (recherche, commande, paiement, séquestre)
```

Le modèle ne touche jamais directement l'argent, les commandes ou les données personnelles — il
ne fait que *proposer*. L'Engine typé-souveraineté *dispose*. C'est ce qui rend un petit modèle
de la taille d'un téléphone digne de confiance pour du vrai commerce.

## Ce qui existe aujourd'hui

| Pièce | État |
|---|---|
| **App web BOBO** | en ligne (Cloudflare), aller-retour complet vers l'Engine sur Railway |
| **Colonne commerce de l'Engine** | en ligne — auth, produits, commandes, checkout, paiements Wave |
| **Modèle d'intention edge (prototype)** | qualifié — backbone hybride < 2 Md de paramètres (Apache-2.0, sans plafond de licence), entraîné sur des énoncés de marché synthétiques, exporté en GGUF déployable sur téléphone |
| **Jeu de données market-intent** | 6 022 lignes (wo / wo-fr / fr / en), augmentation par un modèle-enseignant wolof, révision native en cours |
| **Voix (full duplex)** | voie recherche — un modèle vocal edge souverain bâti sur le même backbone |

## La porte honnête

Le synthétique a prouvé le *pipeline* ; **les enregistrements de terrain à Dakar et la révision
native** rendront le *modèle* solide. Cette collecte et cette révision sont la frontière actuelle
de la voie — et son fossé défensif.

## Sous-pages de cette voie

- **Pipeline de données — Flux & Registre** — comment les corpus bruts deviennent des données
  d'entraînement révisées : sources, augmentation, boucle de révision humaine, et registre
  d'attribution.

## À lire aussi

- *Intégration de l'équipe* (Guides) — le rôle de réviseur·euse est la contribution la plus
  précieuse de cette voie.
- Les docs de l'Engine (`STATE.md`, `ENGINE-MANIFEST`) — architecture et état canoniques.
