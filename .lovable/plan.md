
# Plan — Flacon "3D" par turntable 4 vues + refonte Home

Tu m'as fourni 4 vues du flacon Retatrutide (avant, gauche, arrière, droite). Je peux effectivement créer un **effet 3D convaincant** sans modèle GLB, en utilisant une technique éprouvée (Apple, sites e-commerce premium) : **image turntable interactif avec cross-fade angulaire**. Résultat : on peut faire pivoter le flacon à 360° à la souris, avec un rendu très fluide.

## 1. Effet 3D turntable (Hero)

**Principe**
- Les 4 images (0°, 90°, 180°, 270°) sont mappées sur un cercle de rotation.
- L'angle courant est calculé depuis le drag horizontal de la souris/tactile.
- On affiche les 2 images adjacentes empilées avec un cross-fade proportionnel à la position entre les 2 angles → transitions fluides, illusion de rotation continue.
- Auto-rotation lente (≈ 20 s / tour) quand l'utilisateur n'interagit pas ; pause au hover/drag ; reprise après ~2 s d'inactivité.
- Halo lumineux animé (cyan → bleu → violet) derrière le flacon, souffle doux qui pulse.
- Reflet/ombre douce projetée dessous.
- Curseur `grab` / `grabbing` pour signaler l'interactivité.
- Support tactile (mobile) : swipe horizontal = rotation.

**Limitation honnête** : 4 vues = illusion 360° convaincante mais on ne voit pas les angles intermédiaires réels (les vues à 45°, 135°, etc. sont interpolées par fondu). Pour un vrai lisse parfait à 360°, il faudrait 24–36 vues ou un modèle GLB. Si tu veux monter en gamme plus tard, on pourra remplacer par un GLB sans changer l'interface.

**Assets**
- Upload des 4 PNG via `lovable-assets` (CDN), pointeurs `.asset.json` dans `src/assets/vial/`.
- Preload des 4 images au montage pour éviter tout flash.

## 2. Hero refondu

- **Titre** : `Peptinium` en très grande typo Sora, avec **effet balai lumineux** (shimmer gradient cyan→bleu→violet→magenta qui balaye) — l'effet qu'on avait avant, réintégré.
- **Sous-titre FR** : « Peptides de recherche haute pureté » (modifiable).
- Micro-labels : « Pureté ≥ 99% · Lab-tested · Research Use Only ».
- 2 CTA : « Explorer le catalogue » + « Voir les COA ».
- Flacon turntable à droite (desktop) / sous le texte (mobile).
- Indice visuel discret « Faites glisser pour tourner » qui disparaît à la 1re interaction.

## 3. Restructuration de la Home

```text
1. Header (sticky, glass)
2. Hero              → titre FR shimmer + flacon turntable interactif
3. Trust bar         → RUO · COA · Expédition rapide · Paiement sécurisé
4. Produits phares   → grille 3-4 ProductCard
5. Pourquoi Peptinium → 3 piliers (Pureté 99% · Traçabilité · Support)
6. Process qualité    → Timeline (Synthèse → HPLC → COA → Expédition)
7. Témoignages       → 3 cartes chercheurs + rating
8. FAQ concise       → 5-6 accordéons
9. CTA final         → bandeau gradient
10. RUO Banner + Footer
```

Espace généreux, animations d'apparition au scroll (IntersectionObserver + `fade-in`), micro-interactions Apple-like sur hover.

## 4. Cohérence DA

Palette conservée (cyan/bleu/violet/magenta du logo), thème clair, Sora + Inter. Aucune couleur hors DA.

## Détails techniques

- Nouveaux fichiers :
  - `src/assets/vial/RT_AVANT.png.asset.json` + 3 autres (upload CDN).
  - `src/components/VialTurntable.tsx` — composant turntable drag + autorotate.
  - `src/components/Hero.tsx` — refonte (remplace l'actuel).
  - `src/components/home/TrustBar.tsx`, `Pillars.tsx`, `QualityProcess.tsx`, `Testimonials.tsx`, `HomeFAQ.tsx`, `FinalCTA.tsx`.
- Modifs :
  - `src/routes/index.tsx` : nouvelle structure de sections.
  - `src/styles.css` : classe `shimmer-text` réactivée avec keyframe.
- **Aucune dépendance npm ajoutée** (pas de Three.js) → build léger, zéro impact perf.
- Non touchés : Header, Footer, catalogue, pages produits, blog, calculatrice, tester-fioles.

## Prochaine étape

Si tu approuves, j'implémente tout en un passage. Si tu veux le vrai 3D GLB plus tard, on pourra faire l'upgrade en gardant la même UX.
