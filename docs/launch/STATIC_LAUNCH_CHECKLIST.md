# Breaktest Cost Intelligence — checklist de lancement statique

## Objet

Préparer un test utilisateur réel du calculateur fusionné par la pull request `#16`, sans confondre publication technique et validation commerciale.

Aucune étape externe de cette checklist n'est autorisée sans validation explicite d'Ayman lorsqu'elle implique un domaine, un hébergeur, une collecte de données, un paiement, une dépense ou un engagement juridique.

## 1. État technique requis

- [x] page statique isolée sous `validation_site/` ;
- [x] formules versionnées ;
- [x] cinq scénarios synthétiques testés ;
- [x] tests Chromium 390 / 768 / 1024 / 1440 px ;
- [x] moteur historique inchangé ;
- [x] analytics, email et paiement désactivés ;
- [x] aucune donnée de courtier présentée comme réelle ;
- [x] aucune recommandation d'investissement ;
- [ ] vérification manuelle Safari sur iPhone/iPad ;
- [ ] relecture humaine finale du texte visible ;
- [ ] test chronométré de première utilisation par au moins trois personnes extérieures au projet.

## 2. Configuration minimale autorisée avant publication

Valeurs exigées dans `validation_site/config.js` :

```js
analyticsEnabled: false
emailEndpoint: null
paymentEnabled: false
paymentUrl: null
publicBaseUrl: null
```

Toute activation doit être isolée dans une nouvelle pull request, documenter le fournisseur, les données transmises, la base juridique ou le consentement pertinent, la durée de conservation et le mécanisme de désactivation.

## 3. Options d'hébergement à comparer au moment de la décision

Critères obligatoires :

- coût nul ou très faible pendant le test ;
- HTTPS ;
- déploiement statique ;
- aucune injection publicitaire ;
- aucun tracking imposé au visiteur ;
- rollback simple ;
- possibilité de supprimer rapidement le site ;
- fonctionnement avec un sous-chemin `validation_site/` ou un répertoire racine dédié.

Options possibles à vérifier au moment du lancement : GitHub Pages, Cloudflare Pages, Netlify ou Vercel. Aucun choix n'est arrêté dans ce document, car leurs interfaces, offres et conditions peuvent évoluer.

## 4. Contrôle de contenu avant mise en ligne

- [ ] toutes les démonstrations portent la mention `Exemple synthétique` ;
- [ ] aucune phrase ne promet une économie ou une performance future ;
- [ ] aucune mention de conformité, certification ou validation réglementaire ;
- [ ] formule et version du calcul accessibles ;
- [ ] limites visibles avant le formulaire commercial ;
- [ ] proposition commerciale présentée comme future et non disponible ;
- [ ] aucune rareté artificielle, faux avis, faux utilisateur ou partenaire ;
- [ ] contact et mécanisme de signalement d'erreur définis avant publication publique.

## 5. Confidentialité

- [ ] aucune donnée saisie dans le calculateur n'est transmise ;
- [ ] le texte partagé exclut le capital exact par défaut ;
- [ ] aucun email n'est collecté tant que le formulaire reste désactivé ;
- [ ] aucune donnée financière réelle n'est demandée dans le premier test ;
- [ ] la politique minimale de `docs/launch/PRIVACY_MINIMUM.md` est visible ou liée si une collecte est activée ;
- [ ] aucun secret, token ou identifiant n'est présent côté client.

## 6. Plan de rollback

Avant publication :

1. conserver le commit déployé ;
2. conserver la dernière version validée ;
3. pouvoir désactiver le site sans modifier `main` ;
4. pouvoir revenir à une page informative sans formulaire ;
5. documenter tout incident, sa cause et le correctif ;
6. transformer un défaut confirmé en règle et test de non-régression.

## 7. Critère d'autorisation

Le lancement statique est prêt à être demandé à Ayman uniquement lorsque :

- les contrôles techniques restent verts ;
- le test Safari/iPad est passé ou la limite est explicitement acceptée ;
- l'URL et l'hébergeur ont été vérifiés à jour ;
- aucune collecte externe n'est nécessaire à la première vague, ou sa configuration a fait l'objet d'une validation distincte ;
- le protocole utilisateur et le tableau de mesure sont prêts.

Cette checklist ne constitue pas une autorisation de déploiement.
