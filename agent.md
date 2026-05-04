# Contexte projet: visualdon-projet

## But du projet
- Projet de cours "VisualDon" (visualisation de donnees), rendu via repo GitHub + presentation en classe.
- Objectif: scrollytelling sur 30 ans de Pokemon pour mettre en evidence un paradoxe: succes commercial vs stagnation critique/technique percue.
- Le discours doit suivre les donnees (pas de modification des donnees par manque de temps). On adapte le storytelling pour rester coherent avec les chiffres.
- Le projet vise aussi un rendu portfolio: propre, clair, maintenable.

## Public cible
- Classe et jury de cours (presentation du concept et de la visualisation, pas du code).
- Secondaire: recruteurs/portfolio.

## Contraintes et non-buts
- Pas de backend, pas d'API live: tout est statique.
- Donnees saisies a la main dans les fichiers JSON.
- Desktop only: pas d'objectif mobile.
- Pas d'exigences fortes d'accessibilite.
- Priorite: clarte du code + apprentissage pas a pas.

## Stack technique et raisons
- HTML/CSS/JS vanilla: vu en cours, lisible, simple a maintenir, faible overhead.
- Vite: dev server rapide + build statique simple pour hebergement.
- D3 (npm local): charts data-driven vus en cours.
- GSAP + ScrollTrigger (npm local): animations et scrollytelling (conseille par le prof et IA).
- JSON local: sources heterogenes normalisees manuellement pour le rendu.

## Structure et flux principal
- index.html: structure des sections, scene sticky (charts + console), overlays fixes (prof/pokedex).
- src/js/main.js: entree. Charge les donnees puis init Pokedex + scroll.
- src/js/data.js: fetch src/data/data.json, reverse l'ordre pour un parcours chronologique.
- src/js/scroll.js: genere les sections de jeux et configure les triggers ScrollTrigger.
- src/js/charts.js: dessine les graphes (ventes, scores, duree de vie).
- src/js/transitions.js: transitions de console + grille de Pikachu.
- src/js/pokedex.js: ouverture/drag/animation et rendu des infos Pokedex.
- src/data/data.json: source unique des donnees (games[]).
- src/assets: images consoles, pokedex, professeur.

## Donnees (pipeline)
- Collecte manuelle depuis des sources officielles et communautaires.
- Nettoyage/normalisation a la main dans data.json.
- Pas de pipeline automatique: toute mise a jour se fait en editant le JSON.

## Regles pour les agents (important)
- Expliquer chaque etape de maniere pedagogique (l'equipe veut apprendre).
- Preferer des modifications petites et incrementales.
- Ne pas ajouter de framework ou de dependance lourde sans discussion.
- Eviter de modifier le schema des donnees si ce n'est pas indispensable.
- Garder la coherence visuelle et narrative (l'histoire est prioritaire).
- Desktop-first: pas de travail mobile a prioriser.

## Commands
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview

## Deploiement attendu
- Build Vite puis hebergement statique (ex: GitHub Pages).
