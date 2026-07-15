# Breaktest — standard des livrables HTML hors ligne

## 1. Décision

Les livrables de critique destinés à Ayman ne doivent pas se limiter à des captures d'écran.

Lorsque le fond du produit aura franchi les gates de calcul, de cohérence, d'expérience et de non-régression, la livraison principale prendra la forme d'une expérience HTML réellement navigable, utilisable sans connexion internet et sans installation lourde.

Les images restent autorisées comme preuves de revue visuelle et artefacts de test, mais ne remplacent jamais le livrable interactif.

## 2. Format privilégié

Ordre de préférence :

1. **un fichier HTML autonome** lorsque la taille et la maintenabilité restent raisonnables ;
2. **un dossier hors ligne compressé en ZIP** contenant `index.html` et uniquement des ressources relatives locales lorsque plusieurs fichiers sont techniquement plus sûrs ;
3. une PWA installable uniquement plus tard, si son besoin est démontré et si elle conserve un mode hors ligne réel.

Le choix entre fichier unique et bundle local est technique. Il doit privilégier :

- ouverture simple depuis ChatGPT, Fichiers, Safari, Chrome ou un ordinateur ;
- fonctionnement sous `file://` lorsque les restrictions du navigateur le permettent ;
- absence de serveur local obligatoire ;
- inspection facile du code et des hypothèses ;
- reproductibilité du comportement ;
- portabilité iPad, mobile et desktop.

Pour une remise directe à Ayman, le fichier primaire doit être le HTML autonome exact testé. Un ZIP multifichier reste utile comme paquet d'audit ou solution de repli, mais son ouverture dans un lecteur mobile ne démontre pas que les scripts relatifs seront exécutés. Le nom, le hash et le comportement du fichier directement remis doivent appartenir aux preuves du run exact.

## 3. Livrables attendus à terme

La livraison critique finale du prochain jalon devra comprendre plusieurs objets cohérents, sans duplication trompeuse :

### A. Démonstrateur produit interactif

Une expérience navigable permettant de :

- saisir et modifier les hypothèses ;
- utiliser les modes seuil, valeur ponctuelle et fourchette validés ;
- parcourir les résultats, contraintes, provenance, méthode et limites ;
- charger des scénarios synthétiques explicitement marqués ;
- tester les erreurs essentielles ;
- observer le comportement responsive.

### B. Vue preuve et méthodologie

Une vue HTML navigable, intégrée au même livrable ou séparée, présentant :

- version du moteur ;
- définitions et formules ;
- unités et dénominateurs ;
- provenance des entrées ;
- scénarios de référence ;
- invariants et réconciliations ;
- validations réellement exécutées ;
- limites non validées.

Cette vue ne doit pas prétendre exécuter des tests qui ne sont pas embarqués. Elle distingue preuves issues de la CI, contrôles exécutables localement et simples documents.

### C. Package de revue

Lorsque plusieurs fichiers sont nécessaires :

```text
breaktest-review/
  index.html
  assets/
  README.txt ou README.html
  MANIFEST.json
```

Le manifeste contient au minimum :

- nom et version du livrable ;
- date de génération ;
- commit source exact ;
- fichiers inclus ;
- empreintes SHA-256 ;
- navigateurs effectivement testés ;
- fonctionnalités validées ;
- limites connues.

## 4. Contraintes hors ligne

Le livrable ne doit dépendre d'aucune ressource distante pour fonctionner.

Sont interdits dans le package critique :

- CDN ;
- police distante ;
- script tiers ;
- iframe distante ;
- requête API ;
- analytics ;
- collecte email ;
- paiement ;
- authentification ;
- stockage distant ;
- données réelles non nécessaires ;
- téléchargement implicite au premier lancement.

Les ressources locales doivent utiliser des chemins relatifs. Les erreurs réseau doivent être impossibles dans le parcours normal.

## 5. Exigences fonctionnelles

Un livrable HTML n'est recevable que si :

- les calculs sont ceux du moteur validé, sans copie divergente non testée ;
- les entrées invalides sont refusées explicitement ;
- zéro, absence et invalidité restent distincts ;
- aucune valeur `NaN`, `Infinity` ou `-0` n'est affichée ;
- les scénarios synthétiques sont marqués ;
- la provenance, les conventions et les limites restent accessibles ;
- le clavier, le focus et les annonces accessibles fonctionnent ;
- aucun débordement horizontal n'apparaît aux largeurs validées ;
- les préférences de réduction des animations sont respectées ;
- les interactions sont réelles et non simulées visuellement.

Le démarrage fait partie du contrat fonctionnel. Si JavaScript local est désactivé, bloqué ou échoue avant l'initialisation :

- aucun bouton d'analyse ne doit provoquer la soumission native ou le rechargement du formulaire ;
- les valeurs déjà saisies doivent rester présentes ;
- aucun résultat ne doit être fabriqué ;
- une limite visible doit expliquer qu'il faut ouvrir le fichier autonome dans une application autorisant JavaScript local.

## 6. Exigences d'expérience et de design

Le livrable doit conserver le langage visuel financier épuré déjà retenu :

- hiérarchie typographique nette ;
- densité progressive ;
- données et preuves avant décoration ;
- palette sobre ;
- espacements cohérents ;
- composants fonctionnels ;
- aucun aspect casino, crypto promotionnelle, terminal institutionnel factice ou dashboard générique d'IA ;
- aucun élément donnant une apparence de maturité supérieure aux capacités réelles.

Le livrable doit permettre une critique du produit complet, pas seulement du rendu graphique.

## 7. Gates avant génération

Aucun « livrable final » ne doit être produit uniquement parce qu'une maquette est présentable.

La génération critique intervient seulement après :

1. contrat financier stabilisé pour le jalon ;
2. oracles et invariants verts ;
3. non-régressions historiques, Q0 et Capital Efficiency vertes ;
4. revue responsive et accessibilité exécutées ;
5. corrections des défauts découverts rétrospectivement ;
6. synchronisation des fichiers canoniques ;
7. décision explicite que le fond est suffisamment mûr pour la critique d'Ayman.

Un package peut porter le statut `internal_review`, mais jamais `final`, `production_ready` ou `commercially_validated` sans preuves correspondantes.

## 8. Validation du package

Le pipeline devra vérifier au minimum :

- absence d'URL réseau active dans les ressources exécutables ;
- ouverture du point d'entrée en environnement local ;
- navigation entre les vues ;
- exécution des scénarios de référence ;
- correspondance de la version embarquée avec le commit source ;
- intégrité des fichiers du manifeste ;
- comportement à 390, 768, 1024 et 1440 pixels ;
- syntaxe JavaScript ;
- poids total déclaré ;
- absence de secrets et de données personnelles.

Il doit aussi ouvrir le fichier autonome direct comme point d'entrée réel, vérifier qu'il n'émet qu'une requête locale sous `file://`, puis exécuter un scénario JavaScript désactivé qui prouve l'absence de rechargement et la conservation d'une valeur saisie.

Une vérification Safari/iPad reste requise avant d'appeler le package « testé iPad ». Chromium seul ne suffit pas à cette revendication.

## 9. Rôle des captures

Les captures servent uniquement à :

- inspecter automatiquement des états précis ;
- comparer les régressions visuelles ;
- documenter une validation ;
- préparer une revue rapide.

Elles ne constituent ni le produit, ni la livraison critique principale.

## 10. Interdiction de livraison prématurée

Tant que le noyau Edge Survival Envelope et l'expérience correspondante ne sont pas rigoureusement stabilisés, le travail reste en mode `work`.

La prochaine livraison à Ayman doit être suffisamment complète pour qu'il puisse :

- l'ouvrir directement ;
- naviguer sans internet ;
- modifier les hypothèses ;
- vérifier les explications et limites ;
- critiquer le fond, l'expérience et le design à partir du même objet fonctionnel.
