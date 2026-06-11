# Pipeline de données — Flux & Registre

Comment les corpus wolof bruts deviennent des données d'entraînement révisées et attribuables.
C'est le flux de travail qui donne son nom à ce portail.

## Le pipeline en un coup d'œil

```
REGISTRE DES SOURCES     FABRIQUE                AUGMENTATION              RÉVISION                  ÉTAGÈRE
(provenance, licence,    (scripts reproduc-      (un modèle-enseignant     (file Supabase →          (Hugging Face :
 attribution, drapeaux    tibles : manifestes,    wolof paraphrase avec     lots Google Sheets →      jeux de données
 de révision par      →   splits, contrôles   →   étiquettes verrouillées,→ 3 verdicts + formula- →   curés, versionnés,
 source)                  de fuites)              derrière un garde-fou)    tions propres →           avec README
                                                                            garde-fou à chaque édit)  d'attribution)
```

## Les cinq étapes

1. **Registre des sources.** Chaque jeu de données entre avec provenance, note de licence ou
   d'attribution, usages permis et interdits, et un drapeau de révision. Rien n'est consommé
   sans enregistrement.
2. **Fabrique.** Des scripts autonomes transforment les sources enregistrées en jeux prêts par
   tâche : manifestes ASR, paires de traduction, lignes d'intention. L'hygiène des splits est
   stricte. On n'entraîne jamais sur les splits réservés, et les familles de paraphrases ne
   fuient jamais d'un split à l'autre.
3. **Augmentation.** Un modèle-enseignant wolof génère des variantes de formulation pendant que
   l'étiquette reste verrouillée. Un garde-fou automatique rejette toute variante qui perd un mot
   requis (produit, marché, couleurs, nombre, mot « mètre »). L'optimisation du prompt a fait
   passer l'acceptation de 6,7 % à environ 88 %.
4. **Révision humaine.** Des locuteur(rice)s natifs jugent la langue en lots de 15 minutes sur
   Sheets : approuver, corriger ou rejeter. Le garde-fou revérifie chaque édition humaine
   instantanément. Les réviseur(euse)s peuvent aussi écrire leurs propres formulations, qui
   entrent comme lignes « or », les plus précieuses. L'argot et le wolof profond sont bienvenus.
   L'autorité sur la langue, ce sont les humains. Les machines ne gardent que les étiquettes.
5. **L'étagère.** Les jeux validés sont publiés sur Hugging Face en jeux privés versionnés.
   L'entraînement et les notebooks s'y servent.

## État actuel

| Actif | Où il en est |
|---|---|
| Jeu market-intent | **6 022 lignes** (wo 1 661 · wo-fr 1 863 · fr 1 249 · en 1 249), zéro fuite entre splits |
| Variantes du modèle-enseignant | 829 acceptées par le garde-fou, en attente de révision native (lot-001 en ligne) |
| Corpus wolof réels utilisables | environ 115 h de parole sous licence, 150 k lignes ASR et 116 k paires de traduction inventoriées |
| Infrastructure de révision | Schéma Supabase en ligne · API garde-fou déployée · convoyeur Sheets/n8n en construction |

## Les règles

- Les étiquettes sont verrouillées. La révision corrige la langue, jamais l'étiquette.
- Jamais d'entraînement sur les splits réservés. L'audio synthétique n'est jamais de l'audio terrain.
- Tout le synthétique reste `needs_review` jusqu'à validation native.
- L'attribution est une exigence : GalsenAI · Soynade Research · Baamtu/AI4D · serge-wilson ·
  Alwaly · Masakhane · et les corpus amont (ALFFA, FLEURS, Common Voice, Kallama, Urban Bus).

## Aller plus loin

- [Vue d'ensemble de la voie Commerce](#/doc/commerce-overview) : le produit que ces données servent.
- [Intégration de l'équipe](#/doc/team-onboarding) : comment rejoindre l'équipe de révision.
- [Retour à l'ombrelle](#/doc/welcome)
