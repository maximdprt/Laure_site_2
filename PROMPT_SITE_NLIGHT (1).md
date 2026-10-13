# PROMPT — Site web NLIGHT · Laure Dupuch

> **Comment l'utiliser dans Cursor**
> 1. Crée un dossier vide `nlight-site`, ouvre-le dans Cursor et dépose ce fichier à la racine sous le nom `PROMPT.md`.
> 2. Dépose le logo exporté depuis Illustrator dans `public/brand/` (`logo.svg` et `logo-blanc.svg`, plus un `logo.png` de 1024 px sur fond transparent). Dépose aussi les images générées avec `PROMPTS_IMAGES_NLIGHT.md` dans `public/images/`.
> 3. Dans le chat Agent de Cursor, avec un modèle Claude, écris :
>    `Lis entièrement PROMPT.md, puis exécute uniquement la PHASE 1. Arrête-toi à la fin de la phase et montre-moi le résultat.`
> 4. Valide chaque phase avant de lancer la suivante : « Exécute la PHASE 2 », etc.
> 5. Remplace au fur et à mesure tous les `[À COMPLÉTER]` (liste complète en section 15).

---

## 1. Ton rôle et ta mission

Tu es un **développeur full-stack senior** doublé d'un **directeur artistique web**. Tu es spécialisé dans les sites de praticiens du bien-être qui convertissent : prise de rendez-vous et vente en ligne.

Ta mission : concevoir et coder **de A à Z** le site de **NLIGHT – Laure Dupuch**. C'est un site vitrine bilingue (FR/EN) avec :
- un **agenda de réservation codé sur mesure** et un paiement Stripe ;
- une **boutique** de flacons ;
- un **blog**.

Le site est hébergé sur Vercel.

Règles de travail :
- Tu travailles **par phases** (section 13). À la fin de chaque phase, le projet doit compiler sans erreur (`pnpm build`, `pnpm lint`, `pnpm typecheck`).
- Tu fais un commit git propre par étape logique.
- Tu ne demandes pas de confirmation pour les choix techniques déjà tranchés ici. Si une information manque, tu mets un placeholder `[À COMPLÉTER : …]` bien visible dans le code et tu continues.
- Tu n'inventes **jamais** de faits sur Laure : diplômes, années d'expérience, témoignages, chiffres. Tu laisses des placeholders.
- Tu respectes **strictement** les règles de rédaction de la section 10.3 (conformité bien-être).
- Code en TypeScript strict, composants petits et réutilisables, aucun `any`, aucune clé secrète dans le code.

---

## 2. Contexte client

| Élément | Valeur |
|---|---|
| Marque | **NLIGHT** (toujours en majuscules) |
| Praticienne | **Laure Dupuch** |
| Titre affiché | **Thérapeute holistique – Praticienne en Chromobioénergie®** |
| Méthode | La **Chromobioénergie®** : propriétés des couleurs et des sons, associées aux fleurs, plantes et cristaux |
| Offre phare | **Test de Profil Chromatique**, suivi d'une **préparation personnalisée** (flacon unique) |
| Univers | Fleurs · Couleurs · Sons · Cristaux |
| Lieu | Cabinet à **Lacanau** (Gironde) + **à distance partout en France** (par téléphone, avec un support couleurs envoyé au préalable) |
| Instagram | https://www.instagram.com/laure_dupuch/ |
| LinkedIn | https://www.linkedin.com/in/laure-dupuch-179019207/ |
| E-mail / Téléphone / Adresse | `[À COMPLÉTER]` |
| Langues | Français (par défaut) + anglais |

**Baseline (signature de marque)** :
> Découvrez votre Profil Chromatique. Comprenez vos besoins. Recevez votre préparation personnalisée.

**Phrase de positionnement** :
> Je commence par établir votre Profil Chromatique, puis je crée une préparation personnalisée à partir de ce profil.

**Cibles (toutes prioritaires)** :
1. Femmes de 30 à 60 ans en quête d'équilibre émotionnel et de connaissance de soi.
2. Tout public adulte traversant une période de stress, de changement ou de questionnement.
3. Habitants de Lacanau, du Médoc et vacanciers de passage.
4. Personnes partout en France, via les séances à distance et la boutique en ligne.

---

## 3. Objectifs du site

1. **Prise de rendez-vous** : Test de Profil Chromatique, séances de suivi, appel découverte gratuit.
2. **Vente en ligne** :
   - les flacons thématiques prêts à l'emploi ;
   - les préparations personnalisées (après le test) ;
   - le pack « Test + préparation personnalisée ».
3. **Référencement national** sur le Test de Profil Chromatique, les élixirs personnalisés et l'accompagnement émotionnel à distance, en gardant un ancrage local à Lacanau.
4. **Capter des contacts** grâce à l'inscription à la newsletter.

Chaque page doit mener à **une action claire** : réserver (prioritaire), acheter ou s'inscrire.

---

## 4. Stack technique (imposée)

- **Framework** : dernière version stable de **Next.js** (App Router, React Server Components), **TypeScript strict**, gestionnaire de paquets **pnpm**.
- **Style** : **Tailwind CSS v4**. Les design tokens sont déclarés en variables CSS (section 5). Composants accessibles via **Radix UI** (accordéon, dialog, drawer), **entièrement restylés** au style éditorial de la section 5 : aucun look shadcn/Radix par défaut.
- **Animations** : librairie `motion` (ex-Framer Motion), usage **discret** uniquement (section 5.5).
- **Internationalisation** : `next-intl`, routes localisées. FR à la racine `/`, EN sous `/en`, slugs traduits (section 6).
- **Contenus** : **fichiers dans le code**, pas de CMS.
  - `content/` : textes de pages en TS/JSON par langue.
  - `content/blog/{fr,en}/*.mdx` : articles en MDX.
  - `config/*.ts` : produits, prestations, tarifs, disponibilités, informations légales.
  - Objectif : modifier un prix ou un texte = modifier **un seul fichier**.
- **Formulaires** : `react-hook-form` + `zod` (validation partagée client/serveur).
- **Paiement** : **Stripe Checkout** (mode `payment`) + webhooks (CB, Apple Pay, Google Pay).
- **Agenda** : **Google Calendar API** comme source de vérité, via un compte de service (section 8.1). Laure gère ses indisponibilités directement dans son Google Agenda.
- **E-mails transactionnels** : **Resend** + `react-email` (gabarits aux couleurs du site).
- **Panier** : `zustand` avec persistance `localStorage` (enveloppée dans try/catch).
- **Dates et fuseau horaire** : `date-fns` + `@date-fns/tz`, fuseau **Europe/Paris** partout.
- **Statistiques** : **Vercel Analytics**, sans cookie, donc pas de bannière cookies nécessaire. N'ajoute **aucun** traceur tiers.
- **Images** : `next/image`, formats AVIF/WebP, `placeholder="blur"`.
- **Tests** : Playwright (parcours réservation et achat en mode test Stripe) + Vitest pour la logique de créneaux.
- **Hébergement** : **Vercel**. Nom de domaine à acheter (ex. `nlight-laure-dupuch.fr`) : `[À COMPLÉTER]`.
- **Three.js : NE PAS l'implémenter maintenant.** Prévois seulement que le composant `Hero` accepte une prop `visual?: ReactNode`, afin de brancher plus tard un visuel 3D (flacon en verre ou fond de couleurs fluides) chargé en `dynamic(..., { ssr: false })`.

### Arborescence attendue

```
app/
  [locale]/
    layout.tsx
    page.tsx                         # Accueil
    test-profil-chromatique/page.tsx
    accompagnement-emotionnel/page.tsx
    preparations-personnalisees/page.tsx
    boutique/page.tsx
    boutique/[slug]/page.tsx
    a-propos/page.tsx
    tarifs/page.tsx
    rendez-vous/page.tsx             # Contact / Rendez-vous (agenda + formulaire)
    rendez-vous/confirmation/page.tsx
    commande/confirmation/page.tsx
    journal/page.tsx                 # Blog (lien dans le footer)
    journal/[slug]/page.tsx
    mentions-legales/page.tsx
    cgv/page.tsx
    confidentialite/page.tsx
  api/
    availability/route.ts            # GET créneaux libres
    booking/checkout/route.ts        # POST crée la réservation provisoire + session Stripe
    shop/checkout/route.ts           # POST panier -> session Stripe
    stripe/webhook/route.ts          # checkout.session.completed / expired
    contact/route.ts
    newsletter/route.ts
  sitemap.ts
  robots.ts
  opengraph-image.tsx
components/ (ui/, layout/, sections/, booking/, shop/, blog/)
config/ (site.ts, services.ts, products.ts, availability.ts, shipping.ts, legal.ts, nav.ts)
content/ (fr/, en/, blog/)
emails/ (BookingConfirmation, BookingNotification, OrderConfirmation, OrderNotification, ContactNotification, NewsletterNotification)
lib/ (stripe.ts, google-calendar.ts, slots.ts, resend.ts, seo.ts, schema.ts)
messages/ (fr.json, en.json)
public/brand/, public/images/
```

---

## 5. Direction artistique — « éditorial photo »

> Une maquette validée de ce style existe (accueil desktop, accueil mobile, page de rendez-vous). Reproduis fidèlement les règles ci-dessous.

### 5.1 Intention
On veut un site **éditorial, façon magazine** : de très grandes photos, souvent pleine largeur, une typographie fine et très grande, peu d'éléments par écran et beaucoup d'air. Les références d'esprit sont les sites de marques comme Aesop ou Kinfolk.
- **Les couleurs viennent des photos**, pas de l'interface. L'interface reste quasi monochrome : pierre claire, encre noire, blanc.
- La structure repose sur des **listes séparées par de fins filets** (1 px). **Pas de cartes ni de boîtes arrondies, pas d'ombres, pas d'icônes décoratives.**
- Chaque section porte un repère numéroté en police mono : `(01) La méthode`, `(02) Comment ça fonctionne`…
- Les titres alternent une **sans-serif très fine** et un mot ou une fin de phrase en **serif italique** : « Votre flacon *est unique.* »
- À ÉVITER absolument :
  - le look « template bien-être » (beige et vert sauge, cartes arrondies, pastilles, icônes) ;
  - les dégradés arc-en-ciel dans l'interface ;
  - les emojis ;
  - les polices Inter, Roboto, Montserrat ou Cormorant.

### 5.2 Palette (design tokens dans `app/globals.css`)

```css
:root {
  --color-bg:        #EFEEEA; /* pierre claire – fond principal */
  --color-paper:     #FFFFFF; /* blocs ponctuels (récapitulatif de réservation) */
  --color-ink:       #111111; /* texte, boutons primaires, filets forts */
  --color-ink-muted: #6B6862; /* texte secondaire, repères (01) */
  --color-line:      #CFCBC3; /* filets fins */
  --color-dark:      #111111; /* footer */
  --color-on-dark:   #BDB9B1; /* texte sur fond sombre */
}
```
- Le **texte sur photo** est blanc. Chaque photo qui porte du texte reçoit un voile en dégradé noir, de 0 à 55-65 % d'opacité vers le bas, pour garantir un contraste WCAG AA.
- Les **boutons primaires** sont noirs sur fond clair et blancs sur photo, en forme de pilule. Les **boutons secondaires** sont un simple texte souligné d'un filet d'1 px.
- Pas de mode sombre.
- La seule couleur décorative autorisée est la lueur colorée **derrière les flacons**, et seulement dans les photos.

### 5.3 Typographie (via `next/font/google`)
- **Display et texte** : `Geist`, graisses 300, 400 et 500.
  - H1 : 300, `clamp(48px, 7.4vw, 112px)`, interlignage 0.98, letter-spacing -0.035em.
  - H2 : 300, de 40 à 76 px, letter-spacing -0.03em.
  - Corps : 400, 17 px, interlignage 1.65, couleur `--color-ink`. Le texte secondaire est en `--color-ink-muted`.
- **Accent** : `Instrument Serif` en **italique**. On l'utilise pour la 2ᵉ partie des titres, les prix, les grandes citations et la liste des « périodes de vie ». Jamais pour un paragraphe entier.
- **Repères et labels** : `Geist Mono` 400, 12 px, MAJUSCULES, letter-spacing 0.1em, couleur `--color-ink-muted`.
- **Logo** : le SVG fourni. En attendant, mot-symbole « NLIGHT » en Geist 500, letter-spacing 0.32em.

### 5.4 Mise en page et composants
- Conteneur de 1360 px maximum, marges latérales de 32 px (20 px sur mobile). Les sections sont **très espacées** : 140 à 180 px sur desktop, 80 à 100 px sur mobile.
- **Images pleine largeur ou demi-écran bord à bord.** Une gouttière de 4 px seulement entre deux images voisines. Aucun arrondi sur les images.
- **Header** : transparent par-dessus l'image du hero, texte blanc. Au défilement, il devient fond pierre translucide (backdrop-blur), texte noir, et se masque en descendant pour réapparaître en remontant. Il contient :
  - le mot-symbole à gauche ;
  - la navigation au centre (14 px) ;
  - à droite, `FR / EN`, `Panier (n)` en texte, et le bouton « Prendre rendez-vous » (pilule à contour).

  Sur mobile : burger en 2 traits, qui ouvre un menu plein écran sur fond pierre, liens en Geist 300 de 40 px.
- **CTA RDV fixe sur mobile** : un bouton pilule pleine largeur en bas d'écran, blanc sur les sections photo et noir sur fond clair. Il est masqué sur `/rendez-vous` et pendant le paiement.
- **Listes à filets** : utilisées pour les étapes, les tarifs, la FAQ, la sélection de prestation et les coordonnées. Chaque ligne est séparée par un filet `--color-line`. La liste commence par un filet `--color-ink`.
- **Formulaires** : un champ = un label de 13 px en `--color-ink-muted` + une saisie de 18 px **sans bordure**, avec seulement un filet en dessous. Focus : filet noir de 2 px.
- **Footer** : fond `#111111`. Il contient :
  - la baseline en Instrument Serif ;
  - 3 colonnes : Explorer / Contact (Instagram, LinkedIn) / Newsletter (champ sur filet + « S'inscrire → ») ;
  - un **mot-symbole NLIGHT géant** en Geist 300 sur toute la largeur (`clamp(80px, 21vw, 300px)`) ;
  - la mention bien-être et les liens légaux en 12 px.
- **Panier** : tiroir latéral sur fond pierre, articles en liste à filets.

### 5.5 Animations (niveau : discret)
- Apparition au défilement : fondu + translation de 16 px, 0.8 s, easing `[0.22, 1, 0.36, 1]`, une seule fois. Les titres apparaissent ligne par ligne.
- Images : très léger zoom-out à l'apparition (scale 1.06 → 1, 1.4 s) et léger parallaxe sur le hero (10 % maximum).
- Survol : les filets des liens soulignés s'étirent, les lignes de liste se décalent de 6 px.
- **Respect absolu de `prefers-reduced-motion`**. Aucun carrousel automatique, aucune popup, aucun son.

### 5.6 Images
Les images sont générées par IA par le client, à partir du fichier **`PROMPTS_IMAGES_NLIGHT.md`**. Tant qu'elles ne sont pas fournies, affiche des **placeholders en dégradés sombres ou chauds évoquant chaque photo**, avec une étiquette `IMAGE 0X — NOM` en Geist Mono 11 px.

| N° | Fichier (`public/images/`) | Emplacement | Ratio |
|---|---|---|---|
| 01 | `hero.jpg` / `hero-mobile.jpg` | Hero plein écran (accueil) | 16:9 / 9:16 |
| 02 | `test-couleurs.jpg` | Accueil « Comment ça fonctionne » + page Test | 4:5 |
| 03-06 | `univers-fleurs.jpg`, `univers-couleurs.jpg`, `univers-sons.jpg`, `univers-cristaux.jpg` | Bande des 4 univers (accueil + Préparations) | 3:4 |
| 07 | `preparation.jpg` | « Votre flacon est unique » + page Préparations | 3:4 |
| 08 | `lacanau.jpg` | Bloc « À Lacanau » | 4:5 |
| 09 | `distance.jpg` | Bloc « À distance » + page Test | 4:5 |
| 10 | `cta.jpg` | Section finale plein écran | 16:9 |
| 11-18 | `flacon-<slug>.jpg` | Boutique | 4:5 |
| — | `laure-portrait.jpg` | À propos | **vraie photo** `[À COMPLÉTER]` |

Les pages intérieures (Test, Accompagnement, Préparations, À propos, Tarifs) commencent par un **hero demi-hauteur** (60vh) qui réutilise l'une de ces images, avec le titre en blanc dessus.

Chaque image a un `alt` descriptif en FR et en EN. Aucune image IA ne représente Laure.

### 5.7 Structure de l'accueil (telle que dans la maquette)
1. **Hero plein écran** (image 01) :
   - repère mono « Laure Dupuch — Thérapeute holistique · Chromobioénergie® » ;
   - H1 « Test de Profil Chromatique » + ligne en serif italique « & accompagnement émotionnel » ;
   - à droite : texte court, bouton blanc « Prendre rendez-vous » et lien souligné « Découvrir le test ».
2. **(01) La méthode** : un grand paragraphe manifeste en Geist 300 de 50 px, avec une phrase en serif italique.
3. **(02) Comment ça fonctionne** : image 02 en demi-écran bord à bord à gauche, 3 étapes en liste à filets à droite.
4. **(03) Fleurs, couleurs, sons & cristaux** : titre + 4 images verticales bord à bord, avec une légende sous chacune.
5. **(04) Votre flacon est unique** : très grand titre + liste des périodes de vie en serif + bouton noir, image 07 à droite.
6. **À Lacanau / À distance** : 2 grandes images cliquables côte à côte, texte blanc en bas.
7. **(05) Boutique** : 4 packshots en 4:5, nom et prix sous l'image, lien « Ajouter au panier ».
8. **(06) Tarifs** : liste à filets (prestation à gauche, prix en Instrument Serif à droite, toute la ligne cliquable).
9. **(07) Questions fréquentes** : accordéon à filets.
10. **Section finale plein écran** (image 10) : « Mieux vous comprendre, *mieux vous accompagner.* » + boutons.
11. **Footer**.

---

## 6. Arborescence et navigation

| Page | Route FR | Route EN | Navigation |
|---|---|---|---|
| Accueil | `/` | `/en` | logo |
| Le Test de Profil Chromatique | `/test-profil-chromatique` | `/en/chromatic-profile-test` | « Le Test » |
| L'accompagnement émotionnel | `/accompagnement-emotionnel` | `/en/emotional-support` | « Accompagnement » |
| Les Préparations personnalisées | `/preparations-personnalisees` | `/en/personalised-blends` | « Préparations » |
| Boutique | `/boutique` | `/en/shop` | « Boutique » |
| À propos | `/a-propos` | `/en/about` | « À propos » |
| Tarifs | `/tarifs` | `/en/pricing` | « Tarifs » |
| Contact / Rendez-vous | `/rendez-vous` | `/en/book` | bouton CTA « Prendre rendez-vous » |
| Journal (blog) | `/journal` | `/en/journal` | footer uniquement |
| Mentions légales / CGV / Confidentialité | `/mentions-legales`, `/cgv`, `/confidentialite` | `/en/legal`, `/en/terms`, `/en/privacy` | footer |

- Fil d'Ariane sur toutes les pages sauf l'accueil.
- Le sélecteur de langue renvoie vers la page équivalente, pas vers l'accueil.
- La version anglaise est une **traduction soignée** (anglais britannique, ton sobre) générée par toi. Ajoute un commentaire `// EN: à faire relire` dans chaque fichier de contenu EN.

---

## 7. Contenu page par page

**Ton** : sobre, professionnel, bienveillant ; **vouvoiement** ; phrases courtes. Les textes ci-dessous sont **validés par la cliente** : reprends-les fidèlement. Tu peux seulement resserrer légèrement la formulation et ajouter des titres de section. Chaque page se termine par une **FAQ** (accordéon, 4 à 6 questions, balisage `FAQPage`) puis un **bandeau CTA final**.

### 7.1 Accueil `/`

**SEO** – Title : `Test de Profil Chromatique | Accompagnement émotionnel à Lacanau et à distance` · Meta description : `Profil chromatique, florathérapie et préparations personnalisées à base de fleurs, couleurs, sons et cristaux. À Lacanau et à distance partout en France.`

> La mise en forme suit la **section 5.7**. Ci-dessous, le contenu de chaque bloc. Le contenu marqué *(page Test)* ou *(page À propos)* n'apparaît pas sur l'accueil, mais sur la page indiquée.

1. **Hero plein écran** (image 01)
   - Repère mono : `LAURE DUPUCH — THÉRAPEUTE HOLISTIQUE · CHROMOBIOÉNERGIE®`
   - H1 : **Test de Profil Chromatique**, suivi en Instrument Serif italique de *& accompagnement émotionnel*.
   - Texte : Comprendre vos émotions grâce aux couleurs, et recevoir une préparation créée pour vous. À Lacanau et à distance partout en France.
   - Bouton blanc **Prendre rendez-vous** → `/rendez-vous` · lien souligné **Découvrir le test** → `/test-profil-chromatique`
2. **(01) La méthode**, paragraphe manifeste :
   > Certaines couleurs nous attirent immédiatement, d'autres nous laissent indifférents. *Ces réactions racontent quelque chose de nous.* Le Test de Profil Chromatique s'en sert pour mieux vous comprendre, et mieux vous accompagner.

   Lien souligné : « Comment se déroule le test ».
   *(page Test : l'accroche « Vous vous sentez stressé(e), bloqué(e), fatigué(e) émotionnellement… » et le texte « Le Test de Profil Chromatique : qu'est-ce que c'est ? »)*
3. **(02) Comment ça fonctionne** : titre « De vos couleurs *à votre flacon* », image 02, liste à filets :
   - **01 · Vous réalisez votre test.** Nous échangeons sur votre situation, puis vous choisissez différentes couleurs selon vos ressentis.
   - **02 · Nous découvrons votre profil.** Vos choix établissent votre profil chromatique. Nous regardons ensemble ce qu'il met en évidence.
   - **03 · Je crée votre préparation.** Fleurs, couleurs, sons et cristaux, sélectionnés à partir de votre profil.
4. **(03) Fleurs, couleurs, *sons & cristaux*** : texte d'introduction « Une méthode qui associe les propriétés des couleurs et des sons aux fleurs, aux plantes et aux cristaux. », puis les 4 images 03 à 06, avec ces légendes :
   - **Fleurs** : Les élixirs floraux, dans une démarche de bien-être et d'accompagnement émotionnel.
   - **Couleurs** : Au cœur de la méthode : vos réactions aux couleurs établissent votre profil.
   - **Sons** : Des élixirs associés aux sons et aux fréquences.
   - **Cristaux** : Pour compléter la préparation, dans une démarche d'harmonisation.
5. **(04) Votre flacon *est unique.*** (image 07) : Il n'existe pas de préparation identique pour tout le monde. La vôtre est élaborée à partir de votre profil chromatique, de votre situation et de votre objectif, pour accompagner :
   - Liste en Instrument Serif de 26 px, sous forme de phrase : *le stress, la confiance en soi, le lâcher-prise, les peurs, les périodes de changement, les relations, le besoin de sérénité, la connaissance de soi.*
   - Bouton noir **Demander une préparation**.
6. **À *Lacanau*** / **À *distance*** (images 08 et 09, cliquables vers `/rendez-vous`) :
   - « Au cabinet — Sur rendez-vous » ;
   - « Par téléphone — Votre support couleurs vous est envoyé ».
7. **(05) Les flacons *thématiques*** : 4 flacons (Sérénité & détente, Confiance en soi, Lâcher-prise, Sommeil) + lien « Voir les 8 flacons ».
8. **(06) Tarifs — Simple *& clair*** : liste à filets reprenant tous les tarifs (section 7.7) + « Acompte de 20 € à la réservation, déduit du prix. Pas de durée imposée : nous prenons le temps dont vous avez besoin. »
9. **(07) Questions fréquentes** : les 5 premières questions de la section 7.9.
10. **Section finale plein écran** (image 10) : « Mieux vous comprendre, *mieux vous accompagner.* » + bouton blanc **Prendre rendez-vous** + lien « Appel découverte offert ».
11. **Footer**, avec la mention bien-être : Les prestations proposées s'inscrivent dans une démarche de bien-être et de développement personnel. Elles ne remplacent pas un diagnostic, un traitement ou un suivi médical.

*(page À propos : « Pour qui ? » et « Un accompagnement entièrement personnalisé ». Reprends ces textes depuis la page Test de Profil Chromatique d'origine de la cliente : « Je ne propose pas une solution identique pour tout le monde… Votre profil détermine votre accompagnement. »)*

### 7.2 Le Test de Profil Chromatique `/test-profil-chromatique`

**SEO** – Title : `Test de Profil Chromatique : ce que vos couleurs disent de vous | NLIGHT` · Description : `Découvrez votre Profil Chromatique avec Laure Dupuch, praticienne en Chromobioénergie®. Un outil de connaissance de soi par les couleurs, à Lacanau ou à distance.`

1. **Hero** : H1 **Test de Profil Chromatique** · Sous-titre : Découvrez ce que vos couleurs disent de votre profil. · CTA **Réserver mon test**.
2. Intro : Le Test de Profil Chromatique est une méthode basée sur votre perception et votre choix des couleurs. Pendant le test, vous êtes invité(e) à choisir différentes couleurs selon votre attirance ou votre ressenti. Vos réponses permettent d'établir votre Profil Chromatique personnel.
3. **Pourquoi faire un Test de Profil Chromatique ?** Nous avons tous une relation différente aux couleurs. Certaines nous attirent immédiatement. D'autres nous laissent indifférents ou peuvent même provoquer un rejet. Le Test de Profil Chromatique utilise ces réactions pour établir une lecture personnalisée de votre profil. Il permet d'ouvrir une réflexion sur (liste en 2 colonnes à filets) : vos émotions · vos besoins du moment · vos ressources personnelles · certains blocages · votre manière de fonctionner · vos aspirations.
   **Le test est avant tout un outil de connaissance de soi.**
4. **Comment se déroule le test ?** (frise verticale en 4 étapes)
   1. **L'échange** : Nous faisons le point sur votre situation et sur ce qui vous amène à consulter.
   2. **Le test des couleurs** : Vous choisissez différentes couleurs selon votre ressenti. Il n'y a ni bonne ni mauvaise réponse. Ce qui compte est votre perception personnelle.
   3. **Votre profil** : Vos choix permettent d'établir votre Profil Chromatique. Nous analysons ensemble les différentes informations qui ressortent du test.
   4. **Votre accompagnement** : À partir de votre profil, nous déterminons les outils qui peuvent vous accompagner au mieux. Une préparation personnalisée peut alors être créée.
   - Note : *Pas de durée imposée : nous prenons le temps dont vous avez besoin.*
5. **Et après le test ?** Le test n'est pas une fin en soi. Il constitue le point de départ d'un accompagnement personnalisé. Selon votre profil et votre objectif, je peux vous proposer une préparation associant **Fleurs · Couleurs · Sons · Cristaux**. Votre préparation est élaborée spécifiquement pour vous. → lien vers Préparations.
6. **Le test peut-il être réalisé à distance ?** Oui. Le Test de Profil Chromatique peut être réalisé à distance, où que vous soyez en France. Mini-processus en 3 temps : (1) vous réservez votre créneau et indiquez votre adresse postale ; (2) vous recevez votre support couleurs par courrier ou en PDF ; (3) nous réalisons le test ensemble par téléphone.
7. Tarif rappelé (lu depuis `config/services.ts`) + CTA **Prendre rendez-vous**.
8. FAQ (test, déroulé, distance, pas de « bonne réponse », daltonisme `[À COMPLÉTER : réponse de Laure]`).

### 7.3 L'accompagnement émotionnel `/accompagnement-emotionnel`

**SEO** – Title : `Accompagnement émotionnel personnalisé à Lacanau et à distance | NLIGHT` · Description : `Stress, confiance en soi, lâcher-prise, périodes de changement : un accompagnement émotionnel personnalisé, basé sur votre Profil Chromatique.`

1. **Hero** : H1 **Accompagnement émotionnel** · Sous-titre : Un espace pour prendre du recul, mieux vous comprendre et avancer.
2. Intro : Certaines périodes de vie nous amènent à nous poser beaucoup de questions. Stress, changement, manque de confiance, difficultés relationnelles, peur, fatigue émotionnelle… Parfois, nous avons simplement besoin de nous arrêter et de comprendre ce qui se passe en nous. Je vous propose un accompagnement personnalisé basé sur votre Profil Chromatique et sur votre ressenti.
3. **Dans quelles situations venir ?** (grille de 10 tuiles) la confiance en soi · la gestion des émotions · les peurs · le stress · le lâcher-prise · les relations · les périodes de changement · les difficultés à avancer · la connaissance de soi · le développement personnel.
   Encadré : *Il n'est pas nécessaire d'avoir une problématique précise. Vous pouvez également faire le test simplement parce que vous souhaitez mieux vous connaître.*
4. **Une approche personnalisée** : Je prends le temps de vous écouter et de comprendre ce que vous vivez. Le Profil Chromatique constitue ensuite un support pour personnaliser votre accompagnement. Selon vos besoins, celui-ci peut être complété par une préparation personnalisée à base de fleurs, couleurs, sons et cristaux.
5. **Votre parcours commence par vous** : Il n'existe pas de parcours identique pour tout le monde. Votre histoire, votre personnalité et votre situation sont uniques. Mon rôle est de vous accompagner avec une approche personnalisée et bienveillante.
6. Séance de suivi (tarif depuis la config) + CTA **Prendre rendez-vous**.
7. FAQ.

### 7.4 Les Préparations personnalisées `/preparations-personnalisees`

**SEO** – Title : `Préparation personnalisée : élixirs de fleurs, couleurs, sons et cristaux | NLIGHT` · Description : `Un flacon créé spécialement pour vous à partir de votre Profil Chromatique : élixirs floraux, couleurs, sons et cristaux selon la méthode Chromobioénergie®.`

1. **Hero** : H1 **Préparations personnalisées** · Sous-titre : Un flacon créé spécialement pour vous.
2. Intro : À la suite de votre Test de Profil Chromatique, je peux créer une préparation personnalisée en fonction de votre profil et de vos besoins. Chaque préparation est différente. Elle peut associer plusieurs familles d’élixirs : Fleurs · Couleurs · Sons · Cristaux.
3. **Pourquoi une préparation personnalisée ?** Nous ne réagissons pas tous de la même manière face aux situations de la vie. Une même situation peut provoquer de la peur chez une personne, du stress chez une autre, ou au contraire de la colère ou du découragement. C'est pourquoi je ne propose pas un flacon identique pour tout le monde. Votre préparation est construite à partir de votre profil et de ce que vous souhaitez travailler.
4. **Les 4 familles** (4 blocs alternés image/texte) :
   - **Les fleurs** : Les élixirs floraux sont utilisés traditionnellement pour accompagner différents états émotionnels. Ils peuvent notamment être intégrés dans une démarche autour de la confiance en soi, des peurs, du stress, du changement ou du lâcher-prise.
   - **Les couleurs** : Les couleurs sont au cœur de mon approche. Chaque couleur possède ses propres caractéristiques. Votre profil permet de déterminer les couleurs qui occupent une place particulière dans votre équilibre personnel.
   - **Les sons** : Certains élixirs sont également associés à des fréquences sonores. Ils complètent le travail réalisé avec les couleurs et les fleurs.
   - **Les cristaux** : Les élixirs de cristaux peuvent également entrer dans la composition de votre préparation. Ils sont utilisés dans une démarche de bien-être et d'harmonisation.
   - Mention : *C'est la méthode de la Chromobioénergie®, qui utilise les propriétés des couleurs et des sons associées aux fleurs, plantes et cristaux.*
5. **Votre préparation évolue avec vous** : Votre première préparation correspond à votre profil et à votre situation au moment du test. Si vos besoins évoluent, votre préparation peut également être adaptée. L'objectif est de vous accompagner au plus près de votre parcours.
6. **Comment commander ?** (liste à filets de 3 lignes cliquables)
   - **Première fois** → réservez le **Pack Test + préparation personnalisée** (`/rendez-vous`). *Au préalable, prenez rendez-vous pour faire le Test de Profil Chromatique ; après l'analyse, votre préparation personnalisée est créée.*
   - **Vous avez déjà fait votre test** → **Renouveler ou ajuster ma préparation** (produit boutique, section 7.6).
   - **Vous souhaitez commencer simplement** → **Découvrir les flacons thématiques** (`/boutique`).
7. CTA **Demander une préparation** → `/rendez-vous?service=pack`.
8. FAQ (utilisation `[À COMPLÉTER]`, durée d'un flacon `[À COMPLÉTER]`, évolution, délai de préparation `[À COMPLÉTER]`).

### 7.5 À propos `/a-propos`

**SEO** – Title : `Laure Dupuch, thérapeute holistique et praticienne en Chromobioénergie® | NLIGHT`

Rédige la page à partir de la trame ci-dessous. Garde le « je », un ton sobre et chaleureux, **sans inventer de faits** :

1. Portrait `[À COMPLÉTER : vraie photo]` + H1 **Laure Dupuch** + sous-titre *Thérapeute holistique – Praticienne en Chromobioénergie®*.
2. **Mon approche** : « Je crois qu'il n'existe pas de solution identique pour tout le monde. Chaque personne possède son propre profil, son histoire et ses besoins. C'est pour cela que mon accompagnement commence toujours par l'écoute, puis par votre Profil Chromatique. »
3. **Mon parcours** : `[À COMPLÉTER : parcours, déclic, années de pratique]`. Laisse 2 à 3 phrases génériques clairement marquées comme placeholder.
4. **Ma formation** : Praticienne en Chromobioénergie® `[À COMPLÉTER : organisme, année, autres formations (florathérapie, etc.)]`.
5. **NLIGHT** : signification du nom `[À COMPLÉTER]` + baseline.
6. **Mes valeurs** (3 colonnes séparées par des filets verticaux) : Écoute · Personnalisation · Bienveillance.
7. **Où me trouver** : cabinet à Lacanau (adresse `[À COMPLÉTER]`) + carte statique légère (image ou lien Google Maps, **pas** d'iframe Google qui dépose des cookies) + séances à distance partout en France.
8. Liens Instagram et LinkedIn.
9. CTA **Prendre rendez-vous** / **Réserver un appel découverte**.

### 7.6 Boutique `/boutique` et fiches produits `/boutique/[slug]`

**SEO** – Title : `Boutique : flacons d'élixirs thématiques et préparations personnalisées | NLIGHT`

- **Intro** : Des flacons thématiques prêts à l'emploi, élaborés par Laure, pour accompagner un besoin du moment. Pour une préparation entièrement adaptée à votre profil, commencez par le Test de Profil Chromatique.
- **Grille produits** (2 colonnes en mobile, 4 en desktop) + filtres simples par thème. Les données viennent de `config/products.ts`.

**Flacons thématiques prêts à l'emploi** (8 produits, `type: "ready"`) :

| Slug | Nom | Accroche (bien-être, sans allégation de santé) | Élément visuel |
|---|---|---|---|
| `serenite-detente` | Sérénité & détente | Pour accompagner les moments où vous souhaitez retrouver calme et douceur. | plume, bleu brume |
| `confiance-en-soi` | Confiance en soi | Pour accompagner une démarche d'affirmation et d'estime de soi. | or doux |
| `lacher-prise` | Lâcher-prise | Pour accompagner les périodes où l'on souhaite relâcher le contrôle. | feuille qui tombe |
| `sommeil` | Sommeil | Pour accompagner votre rituel du soir et vos moments de détente. | lune, lavande |
| `gestion-des-emotions` | Gestion des émotions | Pour accompagner les périodes émotionnellement chargées. | eau, rose poudré |
| `energie-vitalite` | Énergie & vitalité | Pour accompagner les moments où vous souhaitez retrouver de l'élan. | soleil, agrumes |
| `protection` | Protection | Pour accompagner un besoin de se sentir centré(e) et préservé(e). | tourmaline noire |
| `ressource` | Ressource | Pour accompagner les périodes où l'on souhaite se ressourcer. | galet, mousse |

Chaque produit contient les champs suivants : `slug, name{fr,en}, tagline{fr,en}, description{fr,en}, composition [À COMPLÉTER], usage [À COMPLÉTER], volume "30 ml" [À COMPLÉTER], priceCents, image, color, inStock: boolean`.

**Produits liés au test** :
- `preparation-personnalisee-renouvellement` (`type: "custom"`) : **Renouveler ou ajuster ma préparation personnalisée**. Achetable **uniquement** par les personnes ayant déjà réalisé leur test. Champ obligatoire dans Stripe Checkout (`custom_fields`) : « Nom utilisé lors du test + date approximative du test ». Une mention visible indique : *Réservé aux personnes ayant déjà réalisé leur Test de Profil Chromatique. Première préparation ? Choisissez le Pack Test + préparation.*
- Le **Pack Test + préparation personnalisée** n'est **pas** dans la boutique : il se réserve dans l'agenda (section 8.1). La boutique affiche un bandeau image (image 07) qui renvoie vers la réservation.

**Fiche produit** : galerie, nom, prix, volume, accroche, description, composition, conseils d'utilisation, sélecteur de quantité, bouton **Ajouter au panier**, réassurance (livraison, retrait à Lacanau, paiement sécurisé), mention bien-être, produits associés. Balisage `Product` + `Offer`.

**Panier** : tiroir latéral (drawer) avec récapitulatif, modification des quantités, sous-total et bouton **Commander**, qui ouvre Stripe Checkout (section 8.2).

### 7.7 Tarifs `/tarifs`

**SEO** – Title : `Tarifs : Test de Profil Chromatique, accompagnement et préparations | NLIGHT`

> **Proposition de prix alignée sur le marché du bien-être en France, à faire valider par Laure.** Tous les prix vivent dans `config/services.ts` et `config/products.ts`. Affiche « TVA non applicable, art. 293 B du CGI » si Laure est en micro-entreprise `[À COMPLÉTER : statut]`.

| Prestation | Format | Prix proposé |
|---|---|---|
| Appel découverte | Téléphone, 15 min | **Offert** |
| Test de Profil Chromatique | Cabinet (Lacanau) ou à distance (téléphone + support couleurs envoyé) | **65 €** |
| **Pack Test + préparation personnalisée** ⭐ (mis en avant) | Cabinet ou à distance, flacon envoyé ou remis | **85 €** |
| Séance de suivi / accompagnement émotionnel | Cabinet ou téléphone | **50 €** |
| Renouvellement ou ajustement de la préparation personnalisée | Flacon, sans séance | **25 €** |
| Flacon thématique prêt à l'emploi (30 ml) | Boutique | **22 €** |
| Livraison | Colissimo suivi (France) | **5,90 €**, offerte dès 60 € `[À VALIDER]` |
| Retrait | Au cabinet à Lacanau | **Gratuit** |

- Présentation en **liste à filets** (pas de cartes) : prestation et description à gauche, prix en Instrument Serif à droite, ligne entière cliquable. Le pack porte la mention « Le plus choisi » en Geist Mono.
- **Acompte** : les séances payantes se réservent avec un **acompte de 20 €** payé en ligne et déduit du prix ; le solde est réglé en séance. Le mode est configurable : `PAYMENT_MODE = "deposit" | "full"` et `DEPOSIT_CENTS` dans `config/services.ts`.
- **Annulation** : gratuite jusqu'à 48 h avant le rendez-vous (acompte remboursé) ; au-delà, l'acompte est conservé `[À VALIDER]`.
- Moyens de paiement acceptés : CB, Apple Pay, Google Pay (en ligne) ; en séance `[À COMPLÉTER]`.
- FAQ tarifs.

### 7.8 Contact / Rendez-vous `/rendez-vous`

**SEO** – Title : `Prendre rendez-vous : Test de Profil Chromatique à Lacanau ou à distance | NLIGHT`

1. H1 **Prendre rendez-vous** + phrase : Choisissez votre prestation, votre format et votre créneau. Vous recevez une confirmation par e-mail immédiatement.
2. **Module de réservation** (section 8.1) en évidence.
3. **Vous préférez échanger d'abord ?** → réserver l'appel découverte gratuit (préselectionné via `?service=decouverte`).
4. **Formulaire de contact** : nom, e-mail, téléphone (facultatif), sujet (Question / Préparation / Boutique / Autre), message, case de consentement RGPD, champ honeypot anti-spam.
5. **Coordonnées** : téléphone, e-mail, adresse du cabinet `[À COMPLÉTER]`, horaires indicatifs `[À COMPLÉTER]`, liens Instagram et LinkedIn.

### 7.9 Banque de FAQ (à répartir sur les pages)

1. **Qu'est-ce que le Test de Profil Chromatique ?** Une méthode qui utilise vos choix de couleurs pour établir votre profil personnel. C'est avant tout un outil de connaissance de soi.
2. **Faut-il avoir un problème précis pour venir ?** Non. Vous pouvez faire le test simplement parce que vous souhaitez mieux vous connaître.
3. **Comment se passe le test à distance ?** Après votre réservation, vous recevez votre support couleurs par courrier ou en PDF. Le test se déroule ensuite par téléphone, comme au cabinet.
4. **Combien de temps dure une séance ?** Il n'y a pas de durée imposée : nous prenons le temps dont vous avez besoin.
5. **Puis-je commander un flacon sans faire le test ?** Oui, les flacons thématiques de la boutique sont disponibles sans test. La préparation personnalisée, elle, est créée après votre Test de Profil Chromatique.
6. **Ma préparation peut-elle évoluer ?** Oui. Si vos besoins évoluent, votre préparation peut être adaptée.
7. **Comment utiliser ma préparation ?** `[À COMPLÉTER par Laure]`
8. **Quels sont les délais de préparation et de livraison ?** `[À COMPLÉTER]`
9. **Puis-je annuler ou déplacer mon rendez-vous ?** Oui, gratuitement jusqu'à 48 h avant. Contactez Laure par e-mail ou téléphone.
10. **Ces séances remplacent-elles un suivi médical ?** Non. Les prestations s'inscrivent dans une démarche de bien-être et de développement personnel. Elles ne remplacent pas un diagnostic, un traitement ou un suivi médical.

### 7.10 Journal (blog) `/journal`

- Page liste : articles en grille éditoriale, sans cartes (image 3:2, catégorie en Geist Mono, titre en Geist 300, extrait, temps de lecture). Fiche article : sommaire, temps de lecture, partage, encadré auteur (Laure), CTA en fin d'article vers le test, 2 articles liés. Balisage `Article` + `BreadcrumbList`.
- **Rédige 3 articles complets** en FR (900 à 1 200 mots chacun), puis leur traduction EN. Ton sobre et pédagogique, sans allégation de santé, avec des intertitres H2/H3, une conclusion et un CTA :
  1. **« Que révèlent vos couleurs préférées sur vos émotions ? »** · mots-clés : *couleurs et émotions, test des couleurs, profil chromatique, signification des couleurs*. Plan : notre relation intime aux couleurs ; attirance, indifférence, rejet ; ce que la couleur peut ouvrir comme réflexion ; le Test de Profil Chromatique ; CTA.
  2. **« Élixirs floraux : comment est créée une préparation personnalisée ? »** · mots-clés : *élixir floral personnalisé, florathérapie, flacon personnalisé, fleurs couleurs sons cristaux*. Plan : pourquoi une préparation unique ; les 4 familles ; du profil au flacon ; une préparation qui évolue ; CTA.
  3. **« Test de Profil Chromatique à distance : comment ça se passe ? »** · mots-clés : *test de profil chromatique à distance, accompagnement émotionnel à distance, séance par téléphone*. Plan : pour qui ; réception du support couleurs ; déroulé par téléphone ; réception de la préparation ; CTA.
- Format MDX avec frontmatter : `title, description, date, slug, lang, cover, keywords, readingTime`.

### 7.11 Pages légales
- **Mentions légales**, **CGV** (prestations + vente à distance) et **Politique de confidentialité** : crée des gabarits complets dont les variables sont lues depuis `config/legal.ts`. Toutes les données sont `[À COMPLÉTER]` : statut, SIRET, adresse, e-mail, hébergeur Vercel Inc.
- Points obligatoires des CGV :
  - droit de rétractation de 14 jours pour les flacons thématiques ;
  - **exception** pour les préparations personnalisées (biens confectionnés selon les spécifications du consommateur, art. L221-28 3° du Code de la consommation) ;
  - conditions d'annulation des rendez-vous ;
  - médiateur de la consommation `[À COMPLÉTER]` ;
  - mention bien-être.
- Ajoute un commentaire en tête de chaque page : `// À faire relire par un professionnel avant mise en ligne`.

---

## 8. Fonctionnalités

### 8.1 Agenda de réservation codé + Stripe

**Prestations** (`config/services.ts`) :

| id | Nom | Format(s) | Bloc agenda | Paiement |
|---|---|---|---|---|
| `decouverte` | Appel découverte | téléphone | 15 min | aucun |
| `test` | Test de Profil Chromatique | cabinet / distance | 120 min (configurable) | acompte ou total |
| `pack` | Pack Test + préparation personnalisée | cabinet / distance | 120 min | acompte ou total |
| `suivi` | Séance de suivi | cabinet / téléphone | 90 min | acompte ou total |

- Côté client, la durée est affichée comme « durée adaptée à vos besoins ». Le bloc agenda sert uniquement à réserver le temps dans l'agenda.
- Délai minimum de réservation : 24 h pour le cabinet et le téléphone, **5 jours pour un test ou un pack à distance**, le temps d'envoyer le support couleurs (configurable).
- Horaires d'ouverture configurables dans `config/availability.ts` : jours, plages, pauses, jours fériés et congés `[À COMPLÉTER]`. Fenêtre de réservation : 60 jours.

**Parcours utilisateur** (stepper de 4 étapes, accessible au clavier, barre de progression) :
1. **Prestation** : liste à filets avec bouton radio, nom, description et prix en Instrument Serif. Préselection possible via `?service=`.
2. **Format** : Cabinet à Lacanau / À distance (téléphone).
3. **Date et créneau** : calendrier mensuel (jours sans créneau grisés) + liste des créneaux horaires du jour, en heure de Paris.
4. **Vos coordonnées** : prénom, nom, e-mail, téléphone, **adresse postale** (obligatoire pour un test ou un pack à distance), « Ce qui vous amène » (facultatif, 500 caractères), acceptation des CGV, consentement RGPD.
5. Récapitulatif, puis :
   - **appel découverte** : confirmation directe ;
   - **autres prestations** : bouton **Payer l'acompte et confirmer**, qui redirige vers Stripe Checkout.

**Logique serveur** :
- `GET /api/availability?service=&format=&month=` calcule les créneaux = horaires d'ouverture − événements occupés de Google Agenda (`freebusy.query`) − délai minimum. La logique est isolée dans `lib/slots.ts` et testée avec Vitest (changements d'heure été/hiver compris).
- `POST /api/booking/checkout` :
  1. valide les données avec zod ;
  2. **revérifie** que le créneau est libre ;
  3. crée un événement **provisoire** dans Google Agenda (titre `⏳ En attente – {prestation} – {nom}`, `extendedProperties.private.holdUntil` = maintenant + 30 min) ;
  4. crée une session Stripe Checkout (`expires_at` = 30 min, métadonnées avec l'id de l'événement) ;
  5. renvoie l'URL de la session.
- Webhook `checkout.session.completed` :
  1. passe l'événement en confirmé (titre `✅ {prestation} – {format} – {nom}`, description avec toutes les coordonnées) ;
  2. envoie l'e-mail de confirmation au client (récapitulatif, pièce jointe `.ics`, adresse du cabinet ou modalités à distance, politique d'annulation) ;
  3. envoie l'e-mail de notification à Laure. Pour un rendez-vous à distance, ajoute un rappel : « Envoyer le support couleurs à : {adresse} ».
- Webhook `checkout.session.expired` : supprime l'événement provisoire.
- Tâche planifiée Vercel Cron (toutes les 15 min) : supprime les événements provisoires dont `holdUntil` est dépassé (filet de sécurité).
- Appel découverte : création directe de l'événement + e-mails, avec une protection anti-abus (rate limit par IP et par e-mail).
- Vérification de la signature du webhook Stripe, idempotence (ne pas traiter deux fois la même session), journalisation des erreurs.
- Page `/rendez-vous/confirmation?session_id=` : récapitulatif, bouton « Ajouter à mon agenda » (.ics) et rappel de ce qu'il faut préparer.
- **Annulation et report** en v1 : par contact direct avec Laure (indiqué dans l'e-mail). En v2 (hors périmètre, à préparer dans le code) : lien signé d'annulation en libre-service.

### 8.2 Boutique et paiement
- `POST /api/shop/checkout` reçoit uniquement les `slug` et les quantités du panier. Les **prix sont toujours relus côté serveur** depuis `config/products.ts`, jamais depuis le client.
- Stripe Checkout configuré avec `price_data` en ligne (aucun produit à créer dans Stripe), `shipping_address_collection` (France `[À VALIDER : UE ?]`) et `shipping_options` lus depuis `config/shipping.ts` :
  - Colissimo suivi ;
  - livraison offerte au-delà du seuil ;
  - retrait au cabinet à Lacanau (0 €).
- `custom_fields` pour le produit `preparation-personnalisee-renouvellement`.
- Webhook `checkout.session.completed` (type `shop`) : e-mail de confirmation au client et e-mail détaillé à Laure (articles, adresse, mode de livraison, champ personnalisé). Le panier est vidé à l'arrivée sur la page de confirmation.
- Le stock est géré par un simple booléen `inStock` : un produit indisponible affiche « Bientôt disponible » et son bouton est désactivé.

### 8.3 Newsletter (stockage simple)
- Formulaire dans le footer et sur la page Journal : e-mail + prénom (facultatif) + case de consentement explicite.
- `POST /api/newsletter` envoie un e-mail à Laure : « Nouvelle inscription newsletter : {prénom} {email} {date} {langue} ». Message de remerciement côté client, honeypot + rate limit.
- Le code est prêt à être remplacé plus tard par Brevo : abstraction `lib/newsletter.ts`.

### 8.4 Formulaire de contact
- `POST /api/contact` avec validation zod, honeypot, rate limit, e-mail à Laure (avec `reply-to` = e-mail du visiteur) et accusé de réception au visiteur.

### 8.5 Divers
- Bouton « Prendre rendez-vous » fixe sur mobile (section 5.4).
- Page 404 personnalisée (sobre, avec liens vers le test et l'accueil).
- États de chargement (skeletons), d'erreur et de succès soignés pour tous les formulaires et pour l'agenda.

---

## 9. SEO

**Objectif** : visibilité **nationale** (séances à distance + boutique), avec un ancrage local à Lacanau.

- **Mots-clés principaux** : test de profil chromatique · chromobioénergie · élixir floral personnalisé · préparation personnalisée fleurs couleurs sons cristaux · florathérapie à distance · accompagnement émotionnel à distance · thérapeute holistique Lacanau · test des couleurs émotions · flacon élixir personnalisé.
- Pour chaque page : `title` unique de 60 caractères maximum, `meta description` de 155 caractères maximum, un seul H1, hiérarchie Hn propre, URL canonique, `hreflang` fr/en/x-default et Open Graph + Twitter Card. Les images OG sont générées dynamiquement (`opengraph-image.tsx`), au design de la marque.
- **Données structurées JSON-LD** (`lib/schema.ts`) :
  - `ProfessionalService` (nom NLIGHT, adresse Lacanau, `areaServed` = France, `priceRange`, `sameAs` = Instagram + LinkedIn) ;
  - `Person` (Laure Dupuch, `jobTitle`) ;
  - `Service` pour chaque prestation, avec `offers` ;
  - `Product` + `Offer` pour chaque flacon ;
  - `FAQPage` ;
  - `Article` ;
  - `BreadcrumbList`.
- `sitemap.ts` (toutes les pages, les deux langues, articles) + `robots.ts`.
- Maillage interne : chaque page renvoie vers le test, les préparations et la réservation ; les articles renvoient vers les pages services.
- Performance au service du SEO : Core Web Vitals au vert (section 11).
- **Fiche Google Business Profile à créer** : génère un fichier `docs/google-business-checklist.md` qui contient :
  - catégorie suggérée ;
  - description de 750 caractères ;
  - liste des services avec prix ;
  - consignes photo ;
  - lien de prise de rendez-vous ;
  - conseils pour récolter des avis.

---

## 10. Conformité et rédaction

### 10.1 RGPD
- Pas de cookie non essentiel, donc pas de bannière cookies. Si un traceur est ajouté plus tard, il faudra une bannière conforme CNIL.
- Une case de consentement (non précochée) sur chaque formulaire, avec un lien vers la politique de confidentialité.
- Données collectées réduites au strict nécessaire. Le message « Ce qui vous amène » est facultatif et signalé comme tel. La durée de conservation est indiquée dans la politique de confidentialité.

### 10.2 Accessibilité
- WCAG 2.2 niveau AA :
  - navigation clavier complète, focus visible (anneau noir de 2 px, décalé de 3 px) ;
  - `aria-*` corrects sur l'accordéon, le stepper, le drawer et le calendrier ;
  - labels sur tous les champs, messages d'erreur liés aux champs ;
  - attribut `lang` correct ;
  - lien d'évitement « Aller au contenu ».

### 10.3 Règles de rédaction bien-être (obligatoires)
- Les prestations relèvent du **bien-être et du développement personnel**. Utiliser : *accompagner, bien-être, équilibre, harmonisation, connaissance de soi, démarche*.
- **Mots interdits** dans tous les textes, alt et métadonnées (FR et EN) : *soigner, guérir, traiter, traitement (sauf dans la mention), soin médical, patient, diagnostic (sauf dans la mention), maladie, symptôme, remède, efficace contre, prouvé*. Aucune promesse de résultat.
- Mention affichée **en pied de chaque page** :
  > Les prestations proposées s'inscrivent dans une démarche de bien-être et de développement personnel. Elles ne remplacent pas un diagnostic, un traitement ou un suivi médical.
- Mention répétée sur chaque fiche produit et dans l'e-mail de confirmation.
- « Chromobioénergie® » s'écrit toujours avec ®. Ajoute en mentions légales : *Chromobioénergie® est une marque déposée de [À COMPLÉTER : titulaire].*

---

## 11. Performance et qualité

- Lighthouse mobile ≥ 95 en Performance, Accessibilité, Bonnes pratiques et SEO.
- LCP < 2,0 s, CLS < 0,05, INP < 200 ms.
- Polices Geist, Geist Mono et Instrument Serif via `next/font` (auto-hébergées, `display: swap`), images `next/image` avec `sizes` corrects, priorité sur l'image du hero.
- Composants serveur par défaut. JavaScript client limité aux zones interactives : agenda, panier, formulaires, menu, accordéon.
- Responsive testé à 360, 390, 768, 1024, 1280 et 1536 px. Aucun défilement horizontal.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` et `pnpm build` passent sans erreur ni avertissement.

---

## 12. Variables d'environnement (`.env.example`)

```
NEXT_PUBLIC_SITE_URL=https://[À COMPLÉTER]
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_CALENDAR_ID=
RESEND_API_KEY=
EMAIL_FROM="NLIGHT – Laure Dupuch <contact@[domaine]>"
EMAIL_LAURE=[À COMPLÉTER]
CRON_SECRET=
```

Rédige aussi un `README.md` en français, pas à pas, pour une personne non développeuse :
- installer le projet ;
- créer le compte Stripe (mode test, puis mode live) et le webhook ;
- créer le compte de service Google et partager l'agenda avec lui (droit « Apporter des modifications aux événements ») ;
- configurer Resend et vérifier le domaine ;
- déployer sur Vercel et brancher le nom de domaine ;
- **modifier un prix, un texte, un produit ou les horaires** : indiquer quel fichier toucher.

---

## 13. Plan de travail par phases

Arrête-toi après chaque phase, résume ce qui a été fait et liste les `[À COMPLÉTER]` ajoutés.

- **PHASE 1 – Fondations** :
  - initialisation Next.js, TypeScript strict, Tailwind v4, tokens, polices, `next-intl` (FR/EN, slugs localisés) ;
  - layout, header (avec logo SVG), menu mobile, footer, CTA mobile fixe ;
  - composants UI de base (Button, LinkUnderline, SectionLabel « (01) », RuleList, Accordion, FullBleedImage avec voile et placeholder, SplitTitle sans-serif + serif italique, Field à filet) ;
  - page `/styleguide` (non indexée) qui montre tous les composants.
- **PHASE 2 – Pages de contenu** : Accueil, Test, Accompagnement, Préparations, À propos, Tarifs (tous les textes de la section 7, FAQ, placeholders d'images), versions EN, SEO de base.
- **PHASE 3 – Boutique** : `config/products.ts`, grille, fiche produit, panier (drawer), checkout Stripe, webhook commande, e-mails, page de confirmation.
- **PHASE 4 – Réservation** : `config/services.ts` et `config/availability.ts`, `lib/slots.ts` + tests, intégration Google Agenda, stepper, checkout acompte, webhooks, e-mails + .ics, cron de nettoyage, page de confirmation.
- **PHASE 5 – Contact, newsletter, blog** : formulaires + API, Journal + les 3 articles FR/EN.
- **PHASE 6 – SEO et légal** : JSON-LD complet, sitemap, robots, hreflang, images OG, pages légales, checklist Google Business.
- **PHASE 7 – Finitions et recette** :
  - animations discrètes, 404, états de chargement ;
  - audit accessibilité ;
  - Lighthouse ;
  - tests Playwright des parcours achat et réservation (Stripe en mode test) ;
  - README ;
  - liste finale des `[À COMPLÉTER]`.

---

## 14. Critères d'acceptation

- [ ] Toutes les pages FR et EN existent, avec le contenu de la section 7 et des slugs traduits.
- [ ] Le design respecte la section 5 : éditorial photo, typographie Geist fine + Instrument Serif italique, listes à filets, pas de cartes, aucun look « template ».
- [ ] Réservation de bout en bout : créneau libre → acompte Stripe → événement confirmé dans Google Agenda → e-mails client et Laure avec .ics. Aucune double réservation possible.
- [ ] Achat de bout en bout : panier → Stripe → e-mails → panier vidé. Prix relus côté serveur.
- [ ] Contact et newsletter : e-mails reçus par Laure, anti-spam actif.
- [ ] Mention bien-être en pied de chaque page, aucun mot interdit (vérifier avec une recherche dans le code).
- [ ] JSON-LD valide (Rich Results Test), sitemap, hreflang.
- [ ] Lighthouse mobile ≥ 95 sur les 4 axes, WCAG AA.
- [ ] Modifier un prix = modifier un seul fichier de `config/`.
- [ ] README clair pour une non-développeuse.

---

## 15. Informations à compléter (récapitulatif)

| # | Information | Où |
|---|---|---|
| 1 | Logo SVG/PNG exporté d'Illustrator | `public/brand/` |
| 1 bis | Images générées (01 à 18) avec `PROMPTS_IMAGES_NLIGHT.md` | `public/images/` |
| 2 | E-mail, téléphone, adresse du cabinet, horaires | `config/site.ts` |
| 3 | Statut juridique, SIRET, adresse légale, médiateur de la consommation | `config/legal.ts` |
| 4 | Validation des prix proposés, de l'acompte et de la politique d'annulation | `config/services.ts`, `config/products.ts` |
| 5 | Frais et modes de livraison définitifs, zone (France / UE), délais | `config/shipping.ts` |
| 6 | Composition, contenance et conseils d'utilisation des 8 flacons | `config/products.ts` |
| 7 | Parcours, formation, organisme de certification Chromobioénergie® et titulaire de la marque | À propos, mentions légales |
| 8 | Signification du nom NLIGHT | À propos |
| 9 | Vraie photo de Laure (et idéalement du cabinet et des flacons) | `public/images/` |
| 10 | Nom de domaine acheté | `.env`, `config/site.ts` |
| 11 | Réponses de Laure aux FAQ marquées `[À COMPLÉTER]` | `content/` |
| 12 | Relecture de la traduction anglaise | `content/en`, `messages/en.json` |
