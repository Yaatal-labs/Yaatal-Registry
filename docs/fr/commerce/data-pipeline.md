# Pipeline de données — Flux & Registre

Comment les corpus wolof bruts deviennent des données d'entraînement révisées et attribuables.
C'est le flux de travail qui donne son nom à ce portail.

## Le pipeline en un coup d'œil

```
REGISTRE DES SOURCES     FABRIQUE                AUGMENTATION              RÉVISION                  ÉTAGÈRE
(provenance, licence,    (scripts reproduc-      (modèle-enseignant        (file Supabase →          (Hugging Face :
 attribution, drapeaux    tibles : manifestes,    wolof paraphrase avec     lots Google Sheets →      jeux de données
 de révision par      →   splits, contrôles   →   étiquettes verrouillées → 3 verdicts + formula- →   curés, versionnés,
 source)                  de fuites)              + garde-fou automatique)  tions propres →           avec README
                                                                            garde-fou à chaque édit)  d'attribution)
```

## Les étapes

1. **Registre des sources** — chaque jeu de données entre avec provenance, note de
   licence/attribution, usages permis et interdits, et un drapeau de révision. Rien n'est
   consommé sans enregistrement.
2. **Fabrique** — des scripts autonomes transforment les sources enregistrées en jeux prêts par
   tâche (manifestes ASR, paires de traduction, lignes d'intention) avec une hygiène stricte
   train/validation/test : on n'entraîne jamais sur les splits réservés, et les familles de
   paraphrases ne fuient jamais entre les splits.
3. **Augmentation** — un modèle-enseignant wolof génère des variantes de formulation avec
   l'étiquette *verrouillée* ; un garde-fou automatique rejette toute variante qui perd un mot
   requis (produit, marché, couleurs, nombre, mot « mètre »). L'acceptation est passée de 6,7 %
   à ~88 % par optimisation du prompt.
4. **Révision humaine** — des locuteur·rice·s natifs jugent la *langue* en lots de 15 minutes
   sur Sheets (approuver / corriger / rejeter) ; le garde-fou revérifie chaque édition humaine
   instantanément ; leurs propres formulations entrent comme lignes « or », les plus précieuses.
   L'argot et le wolof profond sont bienvenus — l'autorité sur la langue, ce sont les humains ;
   les machines ne gardent que les étiquettes.
5. **L'étagère** — les jeux validés sont publiés sur Hugging Face en jeux privés versionnés ;
   l'entraînement et les notebooks s'y servent.

## État actuel

| Actif | Où il en est |
|---|---|
| Jeu market-intent | **6 022 lignes** (wo 1 661 · wo-fr 1 863 · fr 1 249 · en 1 249), zéro fuite entre splits |
| Variantes du modèle-enseignant | 829 acceptées par le garde-fou, en attente de révision native (lot-001 en ligne) |
| Corpus wolof réels utilisables | ~115 h de parole sous licence + ~150 k lignes ASR + ~116 k paires de traduction inventoriées |
| Infrastructure de révision | Schéma Supabase en ligne · API garde-fou déployée · convoyeur Sheets/n8n en construction |

## Les règles (non négociables)

- Les étiquettes sont verrouillées — la révision corrige la *langue*, jamais l'étiquette.
- Jamais d'entraînement sur les splits réservés. L'audio synthétique n'est jamais de l'audio terrain.
- Tout le synthétique reste `needs_review` jusqu'à validation native.
- **L'attribution est une exigence** : GalsenAI · Soynade Research · Baamtu/AI4D · serge-wilson ·
  Alwaly · Masakhane · et les corpus amont (ALFFA, FLEURS, Common Voice, Kallama, Urban Bus).
