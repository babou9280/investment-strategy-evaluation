# Breaktest Cost Intelligence — recommandation d'hébergement du premier test

## Statut

- Date de vérification : 13 juillet 2026.
- Statut : recommandation préparée, non validée par Ayman.
- Aucune publication, dépense, collecte ou création de compte n'est autorisée par ce document.

## Besoin exact

Publier temporairement le contenu statique de `validation_site/` afin de le partager avec une première vague de cinq testeurs, sans :

- domaine payant ;
- connexion automatique au dépôt ;
- analytics ;
- collecte email ;
- paiement ;
- backend ;
- stockage applicatif ;
- nouvelle fonctionnalité.

## Option recommandée

**Cloudflare Pages — Direct Upload par glisser-déposer, sur l'offre gratuite, avec une URL `pages.dev`.**

### Pourquoi

1. le dossier ou une archive ZIP préconstruite peuvent être déposés directement depuis le tableau de bord ;
2. aucune autorisation d'accès au dépôt GitHub n'est nécessaire ;
3. aucun déploiement automatique n'est créé lors de futurs commits ;
4. le projet de test peut être supprimé ou remplacé rapidement ;
5. le site actuel est très inférieur aux limites publiées de l'offre gratuite ;
6. le produit reste un site statique sans Functions ni service applicatif.

### Limite assumée

L'URL `pages.dev` est publiquement accessible à toute personne qui la connaît. Elle doit être considérée comme **non secrète**. La première diffusion restera limitée aux cinq testeurs prévus, sans donnée confidentielle dans le site.

Un contrôle d'accès ajouterait une dépendance et une friction inutiles pour ce premier test ; il ne sera envisagé que si le contenu devient confidentiel.

## Option écartée pour ce test : GitHub Pages

GitHub Pages est techniquement capable d'héberger du HTML, CSS et JavaScript statiques. Toutefois, sa documentation indique que le service gratuit n'est pas destiné ou autorisé à exploiter une activité en ligne, un site de commerce ou un logiciel commercial fourni comme service.

Breaktest ayant une intention commerciale explicite, GitHub Pages n'est pas retenu comme hébergement de validation.

## Option différée : intégration Git Cloudflare Pages

L'intégration Git automatise les déploiements après les pushes et peut générer des URLs de prévisualisation. Elle est utile après validation du produit, mais présente aujourd'hui des coûts de contrôle inutiles :

- autorisation d'accès au dépôt ;
- déploiements automatiques ;
- URLs de preview publiques par défaut ;
- configuration de branches à maintenir.

Pour cinq testeurs et un prototype statique, Direct Upload est plus simple et plus réversible.

## Configuration proposée

- fournisseur : Cloudflare Pages ;
- méthode : Direct Upload, glisser-déposer ;
- offre : Free ;
- projet : nom provisoire `breaktest-cost-intelligence` si disponible ;
- contenu : uniquement les fichiers actifs de `validation_site/` ;
- domaine : aucun achat, URL `pages.dev` ;
- analytics : désactivé ;
- email : désactivé ;
- paiement : désactivé ;
- Functions : aucune ;
- cookies applicatifs : aucun ;
- première population : cinq participants du protocole versionné ;
- rollback : suppression du projet ou nouveau déploiement de la dernière archive validée.

## Conditions avant mise en ligne

1. produire une archive ZIP contenant les fichiers du dossier `validation_site/` à sa racine ;
2. vérifier l'empreinte et le contenu de l'archive ;
3. réaliser une vérification Safari/iPad sur l'URL publiée avant d'inviter d'autres utilisateurs ;
4. confirmer que la page publiée correspond au commit validé ;
5. ne saisir aucune donnée financière réelle pendant le contrôle initial ;
6. conserver la diffusion limitée à la première vague ;
7. documenter l'URL et la date de retrait possible.

## Sources officielles vérifiées

- Cloudflare Pages Direct Upload : `https://developers.cloudflare.com/pages/get-started/direct-upload/`
- Limites Cloudflare Pages : `https://developers.cloudflare.com/pages/platform/limits/`
- Déploiements de prévisualisation Cloudflare : `https://developers.cloudflare.com/pages/configuration/preview-deployments/`
- Limites GitHub Pages : `https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits`

## Décision requise

Recommandation : autoriser un déploiement Direct Upload Cloudflare Pages gratuit, sans domaine ni intégration active, limité au test de cinq utilisateurs.

Réponse attendue d'Ayman : `valide` ou `refuse`.
