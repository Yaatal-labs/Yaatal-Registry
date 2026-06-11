# Voie Commerce (BOBO) — Vue d'ensemble

La promesse : **être entendu(e) par le marché dans sa langue.** L'acheteur(euse) parle wolof,
français, ou le mélange naturel des deux à Dakar. Elle trouve du tissu à Sandaga, compare les
prix, commande et paie. Pas de clavier, et l'alphabétisation n'est jamais un péage.

## Comment ça marche

```
Voix (wolof / wo-fr) → le modèle sur l'appareil PROPOSE une action (tool-call JSON strict)
                     → l'Engine VALIDE et EXÉCUTE (recherche, commande, paiement, séquestre)
```

Le modèle ne touche jamais directement l'argent, les commandes ou les données personnelles. Il
ne fait que proposer. L'Engine typé-souveraineté dispose. Cette séparation rend un petit modèle
de la taille d'un téléphone digne de confiance pour du vrai commerce.

## Ce qui existe aujourd'hui

| Pièce | État |
|---|---|
| **App web BOBO** | en ligne sur Cloudflare, aller-retour complet vers l'Engine sur Railway |
| **Colonne commerce de l'Engine** | en ligne : auth, produits, commandes, checkout, paiements Wave |
| **Modèle d'intention edge (prototype)** | qualifié. Backbone hybride de moins de 2 Md de paramètres sous Apache-2.0 (sans plafond de licence), entraîné sur des énoncés de marché synthétiques, exporté en GGUF prêt pour téléphone |
| **Jeu de données market-intent** | 6 022 lignes (wo / wo-fr / fr / en). Augmentation par modèle-enseignant terminée, révision native en cours |
| **Voix (full duplex)** | voie recherche : un modèle vocal edge souverain bâti sur le même backbone |

## La porte honnête

Le synthétique a prouvé le pipeline. Ce sont les enregistrements de terrain à Dakar et la
révision native qui rendront le modèle solide. Cette collecte et cette révision sont la frontière
actuelle de la voie, et son fossé défensif.

## Aller plus loin

- [Pipeline de données, flux & registre](#/doc/data-pipeline) : comment les corpus bruts
  deviennent des données d'entraînement révisées et attribuables.
- [Intégration de l'équipe](#/doc/team-onboarding) : le rôle de réviseur(euse) est aujourd'hui la
  contribution la plus précieuse de cette voie.
- [Retour à l'ombrelle](#/doc/welcome)
