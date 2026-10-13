# Fiche Google Business Profile — checklist NLIGHT

Objectif : apparaître dans Google Maps et dans les recherches locales (« thérapeute holistique Lacanau », « test des couleurs Lacanau », « élixir floral Médoc »…), tout en renvoyant vers le site pour la réservation et les séances à distance.

> Rappel des règles de rédaction : parler de **bien-être**, d'**accompagnement**, d'**équilibre**, de **connaissance de soi**. Ne jamais employer de vocabulaire médical ni promettre de résultat (voir section 10.3 du cahier des charges). Écrire « Chromobioénergie® » avec le ®.

## 1. Créer et valider la fiche

- [ ] Se connecter sur https://business.google.com avec le compte Google de Laure.
- [ ] Nom de l'établissement : **NLIGHT – Laure Dupuch** (pas de mots-clés ajoutés au nom : Google le sanctionne).
- [ ] Adresse : `[À COMPLÉTER : adresse du cabinet, Lacanau]`. Cocher « Je propose aussi des services à distance / chez les clients » et indiquer la zone desservie : **France**.
- [ ] Téléphone : `[À COMPLÉTER]` · Site web : `[À COMPLÉTER : https://nom-de-domaine]`.
- [ ] Valider la fiche (courrier, appel ou vidéo selon ce que propose Google).

## 2. Catégories

- **Catégorie principale suggérée** : « Thérapeute holistique » (*Holistic medicine practitioner* n'est pas recommandé : il contient « medicine »). À défaut : « Service de bien-être ».
- **Catégories secondaires** : « Centre de bien-être », « Coach de vie » (si pertinent), « Magasin de produits naturels » (pour la boutique de flacons, uniquement si le retrait au cabinet est proposé).

## 3. Description (686 caractères, limite 750)

> NLIGHT – Laure Dupuch, thérapeute holistique et praticienne en Chromobioénergie®, vous accueille à Lacanau et accompagne à distance partout en France. Le Test de Profil Chromatique utilise vos choix de couleurs pour établir votre profil personnel : un outil de connaissance de soi pour mieux comprendre vos émotions et vos besoins du moment. À partir de ce profil, Laure crée une préparation personnalisée associant fleurs, couleurs, sons et cristaux. Séances au cabinet ou par téléphone, appel découverte de 15 minutes offert, boutique de flacons thématiques en ligne. Une démarche de bien-être et de développement personnel, qui ne remplace pas un suivi médical. Réservation en ligne.

## 4. Services et prix

Prix repris de `config/services.ts` et `config/products.ts` (à mettre à jour sur la fiche si ces fichiers changent).

| Service | Description courte | Prix |
|---|---|---|
| Appel découverte | 15 minutes au téléphone pour faire connaissance et poser vos questions | Offert |
| Test de Profil Chromatique | Votre profil établi à partir de vos choix de couleurs, au cabinet ou à distance | 65 € |
| Pack Test + préparation personnalisée | Le test, puis votre flacon unique créé à partir de votre profil | 85 € |
| Séance de suivi | Accompagnement émotionnel pour faire le point et ajuster votre préparation | 50 € |
| Renouvellement ou ajustement de la préparation | Pour les personnes ayant déjà réalisé leur test | 25 € |
| Flacon thématique prêt à l'emploi (30 ml) | Sérénité, confiance en soi, lâcher-prise, sommeil… | 22 € |

Ajouter pour chaque service l'attribut « Réservation en ligne » et le lien de réservation ci-dessous.

## 5. Lien de prise de rendez-vous

- Lien « Prendre rendez-vous » : `https://[nom-de-domaine]/rendez-vous`
- Lien pour l'appel découverte : `https://[nom-de-domaine]/rendez-vous?service=decouverte`
- Lien boutique (produits) : `https://[nom-de-domaine]/boutique`

## 6. Horaires et attributs

- [ ] Horaires identiques à `config/availability.ts` (`[À COMPLÉTER]`), avec les fermetures exceptionnelles (jours fériés, congés).
- [ ] Attributs : « Sur rendez-vous uniquement », « Services en ligne / à distance », « Paiement par carte », « Accessibilité » (`[À COMPLÉTER]`).

## 7. Photos

- [ ] **Logo** (carré, fond uni) et **photo de couverture** (16:9) : reprendre l'esthétique du site (lumière naturelle, tons pierre, flacons ambrés).
- [ ] **Vraie photo de Laure** (portrait lumineux, regard caméra) : indispensable pour la confiance. Ne jamais utiliser d'image générée par IA pour la représenter.
- [ ] 3 à 5 photos **réelles** du cabinet (intérieur, lumière, table de consultation, support couleurs) et de l'entrée/extérieur pour que l'on trouve facilement le lieu.
- [ ] Photos réelles des flacons (packshots sur fond uni).
- [ ] Format JPG ou PNG, 720 × 720 px minimum, sans texte incrusté ni filtre marqué.
- [ ] Ajouter 1 à 2 nouvelles photos par mois (Google valorise les fiches actives).

## 8. Récolter des avis (dans les règles)

- [ ] Créer le lien d'avis court depuis la fiche (« Demander des avis ») et l'ajouter :
  - en fin d'e-mail de suivi, quelques jours après la séance ;
  - sur une petite carte glissée avec les flacons envoyés ;
  - en signature d'e-mail.
- [ ] Demander à **toutes** les personnes accompagnées, sans sélectionner celles que l'on pense satisfaites, et sans contrepartie (interdit par Google et par le Code de la consommation).
- [ ] Suggérer de décrire l'expérience (accueil, déroulé, séance à distance…) plutôt qu'un « résultat ».
- [ ] Répondre à **chaque** avis, positif ou non, de façon courte et chaleureuse. Ne jamais confirmer publiquement qu'une personne est venue consulter ni évoquer sa situation personnelle.
- [ ] Ne jamais rédiger ni publier de faux avis.

## 9. Publications régulières

- [ ] Publier un « post » Google à chaque nouvel article du Journal (`/journal`), avec le lien.
- [ ] Annoncer les nouveautés de la boutique et les périodes de congés.

## 10. Cohérence NAP

Le **N**om, l'**A**dresse et le **P**hone doivent être strictement identiques sur la fiche Google, le site (`config/site.ts`), Instagram, LinkedIn et les annuaires (Pages Jaunes, annuaires de praticiens bien-être).
