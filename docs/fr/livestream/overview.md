# Voie Livestream — Vue d'ensemble

**La promesse : être compris·e en direct par tous, chacun dans sa langue maternelle.** Une
vendeuse diffuse en wolof ; les spectateurs suivent en français, pulaar ou anglais — en
sous-titres ou en voix doublée — en temps réel.

## Les deux modes de diffusion

| Mode | Ce que reçoit le spectateur |
|---|---|
| **Voie Sous-titres** | transcription en continu avec ponctuation automatique, rendue en sous-titres live |
| **Voie Doublage** | synthèse vocale à faible latence sur l'edge — accessibilité pour les publics non lettrés |

Les deux reposent sur la stratégie **« audio-edge, texte-air »** : l'audio est traité sur
l'appareil, seules de minuscules charges de texte traversent le réseau — environ 99 % d'économie
de bande passante sur la data mobile facturée, et bien plus doux pour les batteries.

## Le différenciateur : la couture de modération auditable

Parce que le pipeline prédit le *texte avant de parler*, il existe un point d'interception naturel
entre la compréhension et la voix. La **couture de modération** y filtre grossièretés, données
personnelles et allégations non autorisées — en moins d'une milliseconde, entièrement journalisé
pour la conformité. C'est ce qui transforme « une démo de traduction de plus » en quelque chose
qu'un diffuseur, une école ou une institution peut réellement déployer.

## Sous-pages de cette voie

- **Inventaire des modèles** — la pile ASR / traduction / TTS, empreintes et configurations.
- **Couture de modération auditable** — l'architecture de filtrage et la journalisation d'audit.
- **Plan Duplex Atlantique** — l'agent vocal interactif de long terme à travers les langues
  atlantiques (wolof, bambara, peul, sérère) et internationales.
- **Analyse LiveKit & StreamSpeech** — la boucle duplex WebRTC et la recherche S2ST simultanée.

## État et socle partagé

Cette voie est au **stade architecture et analyse**. Elle partage son socle avec la voie
Commerce : le même encodeur ASR et les mêmes modèles de traduction, la même fabrique de données
et le même pipeline de révision, et la même discipline de souveraineté — choix de modèles
licence-d'abord compris (les candidats de l'inventaire sont soumis à la même vérification que
les modèles de la voie commerce).
