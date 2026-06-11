# Voie Livestream — Vue d'ensemble

La promesse : **être compris(e) en direct par tous, chacun dans sa langue maternelle.** Une
vendeuse diffuse en wolof. Les spectateurs suivent en français, pulaar ou anglais, en sous-titres
ou en voix doublée, en temps réel.

## Les deux modes de diffusion

| Mode | Ce que reçoit le spectateur |
|---|---|
| **Voie Sous-titres** | transcription en continu avec ponctuation automatique, rendue en sous-titres live |
| **Voie Doublage** | synthèse vocale à faible latence sur l'edge, pensée pour les publics non lettrés |

Les deux reposent sur la stratégie **« audio-edge, texte-air »**. L'audio est traité sur
l'appareil et seules de minuscules charges de texte traversent le réseau. Cela économise environ
99 % de bande passante sur la data mobile facturée et ménage beaucoup mieux les batteries.

## Le différenciateur : la couture de modération auditable

Le pipeline prédit le texte avant de parler. Cela crée un point d'interception naturel entre la
compréhension et la voix. La couture de modération y filtre grossièretés, données personnelles et
allégations non autorisées, en moins d'une milliseconde, chaque décision étant journalisée pour
la conformité. C'est ce qui transforme une démo de traduction en quelque chose qu'un diffuseur,
une école ou une institution peut réellement déployer.

## État et socle partagé

Cette voie est au stade architecture et analyse. Elle partage son socle avec la
[voie Commerce](#/doc/commerce-overview) : le même encodeur ASR et les mêmes modèles de
traduction, la même [fabrique de données et le même pipeline de révision](#/doc/data-pipeline),
et la même discipline de souveraineté licence-d'abord. Les candidats de l'inventaire passent par
la même vérification que les modèles de la voie commerce.

## Aller plus loin

- [Inventaire des modèles](#/doc/model-inventory) : la pile ASR / traduction / TTS, empreintes et
  configurations.
- [Couture de modération auditable](#/doc/auditable-moderation-seam) : l'architecture de filtrage
  et la journalisation d'audit.
- [Plan Duplex Atlantique](#/doc/duplex-atlantic-architecture) : l'agent vocal interactif de long
  terme à travers les langues atlantiques et internationales.
- [Analyse LiveKit & StreamSpeech](#/doc/livekit-streamspeech-analysis) : la boucle duplex WebRTC
  et la recherche S2ST simultanée.
- [Retour à l'ombrelle](#/doc/welcome)
