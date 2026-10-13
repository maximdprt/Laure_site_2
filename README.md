# NLIGHT · Laure Dupuch — site web

Site vitrine bilingue (français / anglais) de **NLIGHT – Laure Dupuch**, thérapeute holistique et praticienne en Chromobioénergie® :
prise de rendez-vous avec agenda et acompte en ligne, boutique de flacons, journal (blog).

Ce guide est écrit pour une personne **non développeuse**. Suivez les étapes dans l'ordre.

---

## Sommaire

1. [Ce dont vous avez besoin](#1-ce-dont-vous-avez-besoin)
2. [Installer le projet sur votre ordinateur](#2-installer-le-projet-sur-votre-ordinateur)
3. [Stripe (paiements)](#3-stripe-paiements)
4. [Google Agenda (réservations)](#4-google-agenda-réservations)
5. [Resend (e-mails)](#5-resend-e-mails)
6. [Mettre en ligne sur Vercel et brancher le nom de domaine](#6-mettre-en-ligne-sur-vercel-et-brancher-le-nom-de-domaine)
7. [Modifier un prix, un texte, un produit ou les horaires](#7-modifier-un-prix-un-texte-un-produit-ou-les-horaires)
8. [Ajouter les images et le logo](#8-ajouter-les-images-et-le-logo)
9. [Informations encore à compléter](#9-informations-encore-à-compléter)
10. [Pour la personne qui maintient le code](#10-pour-la-personne-qui-maintient-le-code)

---

## 1. Ce dont vous avez besoin

- Un ordinateur avec **Node.js 22** ou plus récent ([nodejs.org](https://nodejs.org), version « LTS »).
- **pnpm** : une fois Node installé, ouvrez un terminal et tapez `npm install -g pnpm`.
- Des comptes gratuits : **GitHub**, **Vercel**, **Stripe**, **Google** (l'agenda de Laure), **Resend**.

## 2. Installer le projet sur votre ordinateur

```bash
git clone https://github.com/maximdprt/Laure_site_2.git
cd Laure_site_2
pnpm install
```

Copiez le fichier `.env.example` en `.env.local`, puis remplissez les valeurs au fur et à mesure des étapes 3 à 5.

Lancer le site en local :

```bash
pnpm dev
```

Puis ouvrez http://localhost:3000.
Sans clés Google, l'agenda est **simulé** en local (tous les créneaux d'ouverture sont libres et les rendez-vous sont seulement affichés dans le terminal) : pratique pour tester.
Sans clé Resend, les e-mails ne partent pas : ils sont simplement affichés dans le terminal.

## 3. Stripe (paiements)

Stripe encaisse l'acompte des séances et les commandes de la boutique (carte bancaire, Apple Pay, Google Pay).

1. Créez un compte sur [dashboard.stripe.com](https://dashboard.stripe.com). Restez d'abord en **mode test** (interrupteur « Test mode » en haut à droite).
2. **Développeurs → Clés API** : copiez la clé secrète `sk_test_…` dans `STRIPE_SECRET_KEY` et la clé publiable `pk_test_…` dans `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. **Développeurs → Webhooks → Ajouter un endpoint** :
   - URL : `https://VOTRE-DOMAINE/api/stripe/webhook`
   - Événements : `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`
   - Copiez le « secret de signature » `whsec_…` dans `STRIPE_WEBHOOK_SECRET`.
4. **Paramètres → Moyens de paiement** : activez Apple Pay et Google Pay (activés par défaut le plus souvent).
5. Testez un paiement avec la carte de test `4242 4242 4242 4242`, n'importe quelle date future et n'importe quel code.
6. **Passage en réel** : désactivez le mode test, refaites les étapes 2 et 3 avec les clés `sk_live_…` / `pk_live_…` et un nouveau webhook, puis remplacez les valeurs dans Vercel.

Aucun produit n'est à créer dans Stripe : les prix sont lus dans le site (`config/`).

## 4. Google Agenda (réservations)

Le Google Agenda de Laure est la **source de vérité** : tout événement présent dans son agenda (rendez-vous, congés, indisponibilités) bloque automatiquement les créneaux correspondants sur le site.

1. Allez sur [console.cloud.google.com](https://console.cloud.google.com) et créez un projet (ex. « NLIGHT site »).
2. **API et services → Bibliothèque** : activez **Google Calendar API**.
3. **API et services → Identifiants → Créer des identifiants → Compte de service**. Donnez-lui un nom (ex. « nlight-agenda »).
4. Ouvrez le compte de service → onglet **Clés** → **Ajouter une clé → JSON**. Un fichier est téléchargé.
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (copiez la valeur entière, avec `-----BEGIN PRIVATE KEY-----`)
5. Dans **Google Agenda** (calendar.google.com), ouvrez les **Paramètres de l'agenda** de Laure → **Partager avec des personnes spécifiques** → ajoutez l'e-mail du compte de service avec le droit **« Apporter des modifications aux événements »**.
6. Dans ces mêmes paramètres, section **Intégrer l'agenda**, copiez l'**ID de l'agenda** dans `GOOGLE_CALENDAR_ID`.

Fonctionnement : quand quelqu'un réserve, un événement « ⏳ En attente » bloque le créneau pendant le paiement (32 min). Une fois l'acompte payé, il devient « ✅ … » avec toutes les coordonnées. S'il n'est pas payé, il est supprimé.

## 5. Resend (e-mails)

1. Créez un compte sur [resend.com](https://resend.com).
2. **Domains → Add domain** : ajoutez le nom de domaine du site et ajoutez chez votre registraire les enregistrements DNS indiqués (vérification en quelques minutes à quelques heures).
3. **API Keys → Create** : copiez la clé dans `RESEND_API_KEY`.
4. `EMAIL_FROM` : par exemple `NLIGHT – Laure Dupuch <contact@votre-domaine.fr>` (domaine vérifié à l'étape 2).
5. `EMAIL_LAURE` : l'adresse où Laure reçoit les notifications (réservations, commandes, contact, newsletter).

## 6. Mettre en ligne sur Vercel et brancher le nom de domaine

1. Sur [vercel.com](https://vercel.com), **Add New → Project** et importez le dépôt GitHub `Laure_site_2`. Laissez les réglages par défaut (Vercel détecte Next.js).
2. **Settings → Environment Variables** : ajoutez **toutes** les variables de `.env.example` :
   - `NEXT_PUBLIC_SITE_URL` = `https://votre-domaine.fr` (sans `/` final)
   - les clés Stripe, Google et Resend des étapes 3 à 5
   - `CRON_SECRET` et `SIGNING_SECRET` : deux longues phrases aléatoires différentes (ex. générées sur [1password.com/password-generator](https://1password.com/password-generator))
3. **Deploy**.
4. **Settings → Domains** : ajoutez votre nom de domaine et suivez les instructions DNS de Vercel.
5. Mettez à jour l'URL du webhook Stripe avec le vrai domaine.
6. **Analytics** : dans l'onglet Analytics du projet Vercel, cliquez sur **Enable** (statistiques sans cookie : aucune bannière cookies n'est nécessaire).

**Tâche planifiée (nettoyage des réservations non payées)** : le fichier `vercel.json` la lance une fois par jour, ce que permet le forfait gratuit de Vercel. Avec un forfait Pro, vous pouvez la passer toutes les 15 minutes en remplaçant `"0 4 * * *"` par `"*/15 * * * *"`. Dans tous les cas, Stripe libère déjà le créneau dès que le paiement expire : la tâche n'est qu'un filet de sécurité.

## 7. Modifier un prix, un texte, un produit ou les horaires

Chaque information vit dans **un seul fichier**. Après une modification, enregistrez, puis envoyez sur GitHub (`git add -A`, `git commit -m "…"`, `git push`) : Vercel remet le site en ligne automatiquement.

| Je veux modifier… | Fichier | Remarque |
|---|---|---|
| Le prix d'une séance, l'acompte, le délai d'annulation | `config/services.ts` | Prix en centimes : `6500` = 65 €. `DEPOSIT_CENTS`, `PAYMENT_MODE` (`"deposit"` ou `"full"`) |
| Le prix, le texte ou le stock d'un flacon | `config/products.ts` | `inStock: false` → « Bientôt disponible » |
| Ajouter un flacon | `config/products.ts` + `config/images.ts` | Copier un bloc existant et changer le `slug` |
| Les frais et modes de livraison | `config/shipping.ts` | Seuil de livraison offerte, pays livrés |
| Les jours et horaires d'ouverture, les congés | `config/availability.ts` | Les rendez-vous du Google Agenda sont retirés automatiquement |
| Téléphone, e-mail, adresse, réseaux sociaux | `config/site.ts` | |
| Mentions légales, SIRET, médiateur | `config/legal.ts` | |
| Les textes d'une page | `content/fr/<page>.ts` (et `content/en/<page>.ts` pour l'anglais) | `home`, `test`, `support` (accompagnement), `blends` (préparations), `about`, `pricing`, `shop`, `faq` |
| Les questions fréquentes | `content/fr/faq.ts` et `content/en/faq.ts` | |
| Les boutons, menus et messages des formulaires | `messages/fr.json` et `messages/en.json` | |
| Un article du Journal | `content/blog/fr/*.mdx` et `content/blog/en/*.mdx` | Même nom de fichier dans les deux langues |
| Les pages légales | `content/fr/legal.ts` et `content/en/legal.ts` | À faire relire par un professionnel |

Mise en forme dans les textes : `**gras**`, `*italique en serif*`. Une ligne vide sépare deux paragraphes.

**Règles de rédaction (obligatoires)** : les prestations relèvent du bien-être. N'utilisez jamais : *soigner, guérir, traiter, traitement, soin médical, patient, diagnostic, maladie, symptôme, remède, efficace contre, prouvé* (ni leurs équivalents anglais), sauf dans la mention bien-être déjà présente.

## 8. Ajouter les images et le logo

- **Images** : elles sont dans `public/images/` (hero, test, 4 univers, préparation, Lacanau, distance, section finale, 8 flacons, cabinet, flacons du cabinet, chemin de Lacanau). Pour en remplacer une, déposez un fichier **du même nom** et adaptez son texte alternatif dans `config/images.ts`. Si un fichier manque, un dégradé avec l’étiquette « IMAGE 0X — NOM » s’affiche à sa place.
- **Portrait** : `public/images/laure-portrait.jpg` doit rester une **vraie photo** de Laure (jamais une image générée).
- **Logo** : déposez `logo.svg` (noir) et `logo-blanc.svg` dans `public/brand/`, puis passez `logo: { useSvg: true }` dans `config/site.ts`.
- Textes alternatifs (accessibilité) des images : `config/images.ts`.

## 9. Informations encore à compléter

Cherchez `[À COMPLÉTER` (et `[TO COMPLETE` pour l'anglais) dans le projet. Récapitulatif :

| # | Information | Où |
|---|---|---|
| 1 | Logo SVG / PNG | `public/brand/`, `config/site.ts` |
| 2 | E-mail, téléphone, adresse du cabinet, horaires indicatifs | `config/site.ts` |
| 3 | Statut juridique, SIRET, adresse légale, médiateur de la consommation, titulaire de la marque Chromobioénergie® | `config/legal.ts` |
| 4 | Validation des prix, de l'acompte (20 €) et de l'annulation (48 h) ; mention TVA (art. 293 B) | `config/services.ts`, `config/products.ts`, `content/*/pricing.ts` |
| 5 | Frais, zone (France / UE) et délais de livraison | `config/shipping.ts` |
| 6 | Composition, contenance et conseils d'utilisation des 8 flacons | `config/products.ts` |
| 7 | Parcours, formation, organisme de certification | `content/*/about.ts` |
| 8 | Signification du nom NLIGHT | `content/*/about.ts` |
| 10 | Nom de domaine | Vercel, `NEXT_PUBLIC_SITE_URL` |
| 11 | Réponses aux FAQ (utilisation, délais, durée d'un flacon, daltonisme, paiement au cabinet) | `content/*/faq.ts` |
| 12 | Horaires réels et congés | `config/availability.ts` |
| 13 | Relecture de la traduction anglaise (fichiers marqués `EN: à faire relire`) | `content/en`, `content/blog/en`, `messages/en.json` |
| 14 | Relecture des pages légales par un professionnel | `content/*/legal.ts` |

Fiche Google Business Profile : voir `docs/google-business-checklist.md`.

## 10. Pour la personne qui maintient le code

- **Stack** : Next.js 16 (App Router, `proxy.ts`), TypeScript strict, Tailwind CSS v4, next-intl 4 (FR à la racine, EN sous `/en`, slugs traduits dans `i18n/routing.ts`), Radix UI, motion, react-hook-form + zod, Stripe Checkout, Google Calendar API (compte de service), Resend + react-email, zustand, date-fns + @date-fns/tz (Europe/Paris), Vercel Analytics.
- **Direction artistique** « éditorial photo » : tokens dans `app/globals.css`, composants dans `components/ui` (Button, LinkUnderline, SectionLabel, RuleList, Accordion, FullBleedImage, SplitTitle, Field). Page interne non indexée : `/styleguide`.
- **Commandes**

  | Commande | Rôle |
  |---|---|
  | `pnpm dev` | Développement (http://localhost:3000) |
  | `pnpm dev:webpack` | Même chose avec webpack : à utiliser si `pnpm dev` affiche l'erreur `0xc0000142` (Windows à court de mémoire, Turbopack ne peut plus lancer PostCSS) |
  | `pnpm build` / `pnpm start` | Build et serveur de production |
  | `pnpm lint` | ESLint, zéro avertissement |
  | `pnpm typecheck` | Types des routes + TypeScript |
  | `pnpm test` | Vitest (calcul des créneaux, changements d'heure, .ics) |
  | `pnpm test:e2e` | Playwright (parcours achat et réservation, desktop + mobile). Contre le serveur de dev : `E2E_BASE_URL=http://localhost:3000 E2E_ALLOW_BOOKING=1 pnpm test:e2e` |

- **Paiements** : les prix sont toujours relus côté serveur (`lib/shop.ts`, `config/`). Webhook unique `app/api/stripe/webhook`, idempotent.
- **Créneaux** : `lib/slots.ts` (fonction pure testée) ; double réservation impossible (revérification + événement provisoire + contrôle de concurrence).
- **next-intl** : l'alias `next-intl/config` est déclaré à la main dans `next.config.ts` (le plugin officiel charge `@swc/core`, dont le binaire natif refuse de se charger sur certains postes Windows).
- **Évolution prévue** : lien signé d'annulation en libre-service (`lib/booking.ts` signe déjà les liens), visuel 3D du hero via la prop `visual` du composant `Hero` (`dynamic(..., { ssr: false })`), passage de la newsletter à Brevo (`lib/newsletter.ts`).
