// À faire relire par un professionnel avant mise en ligne
import { legalConfig } from "@/config/legal";
import { readyProducts, RENEWAL_SLUG, getProduct } from "@/config/products";
import { DEPOSIT_CENTS, FREE_CANCELLATION_HOURS, PAYMENT_MODE, services, VAT_NOTICE } from "@/config/services";
import { COLISSIMO, FREE_SHIPPING_THRESHOLD_CENTS, PICKUP, preparationDelay, SHIPPING_COUNTRIES } from "@/config/shipping";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/utils";
import type { LegalContent } from "../legal";

const L = legalConfig;
const eur = (cents: number) => formatPrice(cents, "fr");
const { address } = siteConfig.contact;
const cabinet = `${address.street}, ${address.postalCode} ${address.city}`;
const deposit = eur(DEPOSIT_CENTS);
const readyPrice = readyProducts[0] ? eur(readyProducts[0].priceCents) : "[À COMPLÉTER]";
const renewalPrice = eur(getProduct(RENEWAL_SLUG)?.priceCents ?? 0);
const countries = SHIPPING_COUNTRIES.map((c) => (c === "FR" ? "France métropolitaine" : c)).join(", ");
const wellness =
  "Les prestations proposées s'inscrivent dans une démarche de bien-être et de développement personnel. Elles ne remplacent pas un diagnostic, un traitement ou un suivi médical.";
const updated = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(L.lastUpdated));

export const legalFr: LegalContent = {
  mentions: {
    seoTitle: "Mentions légales | NLIGHT – Laure Dupuch",
    seoDescription: "Mentions légales du site NLIGHT – Laure Dupuch : éditeur, hébergeur, propriété intellectuelle et marque Chromobioénergie®.",
    label: "Informations légales",
    titleLead: "Mentions",
    titleAccent: "légales",
    intro: "Informations relatives à l'éditeur et à l'hébergeur du site, conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.",
    updated,
    sections: [
      {
        heading: "Éditeur du site",
        list: [
          `**Nom commercial** : ${L.companyName}`,
          `**Responsable** : ${siteConfig.practitioner}, ${siteConfig.jobTitle.fr}`,
          `**Statut juridique** : ${L.legalForm}`,
          `**SIRET** : ${L.siret}`,
          `**Immatriculation** : ${L.rcsOrRm}`,
          `**TVA intracommunautaire** : ${L.vatNumber}`,
          `**Adresse** : ${L.legalAddress}`,
          `**E-mail** : ${L.email}`,
          `**Téléphone** : ${L.phone}`,
          `**Directrice de la publication** : ${L.publicationDirector}`,
        ],
      },
      {
        heading: "Hébergement",
        paragraphs: [`Le site est hébergé par **${L.host.name}**, ${L.host.address} (${L.host.website}).`],
      },
      {
        heading: "Propriété intellectuelle",
        paragraphs: [
          "L'ensemble des contenus de ce site (textes, mise en page, logo, mot-symbole NLIGHT, images) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est interdite.",
          `Chromobioénergie® est une marque déposée de ${L.trademarkOwner}.`,
          "Certaines images du site ont été générées par intelligence artificielle et ont une vocation uniquement illustrative. Aucune d'entre elles ne représente Laure Dupuch.",
        ],
      },
      {
        heading: "Données personnelles et cookies",
        paragraphs: [
          "Le site ne dépose aucun cookie publicitaire ni traceur tiers. La mesure d'audience est réalisée par Vercel Analytics, sans cookie et de manière agrégée. Les informations détaillées sur l'utilisation de vos données figurent dans la politique de confidentialité.",
        ],
        links: [{ label: "Politique de confidentialité", href: "/confidentialite" }],
      },
      {
        heading: "Responsabilité",
        paragraphs: [
          "Les informations publiées sur ce site sont fournies à titre indicatif. L'éditeur s'efforce de les tenir à jour mais ne peut garantir leur exhaustivité. Les liens vers des sites externes (Instagram, LinkedIn…) n'engagent pas la responsabilité de l'éditeur quant à leur contenu.",
        ],
      },
      {
        heading: "Une approche de bien-être",
        paragraphs: [wellness],
      },
    ],
  },

  cgv: {
    seoTitle: "Conditions générales de vente | NLIGHT",
    seoDescription: "CGV de NLIGHT – Laure Dupuch : prestations, rendez-vous, acompte, annulation, boutique en ligne, livraison et droit de rétractation.",
    label: "Conditions générales de vente",
    titleLead: "Conditions générales",
    titleAccent: "de vente",
    intro: `Les présentes conditions s'appliquent aux prestations d'accompagnement réservées et aux produits achetés sur le site de ${L.companyName}. Toute réservation ou commande implique leur acceptation.`,
    updated,
    sections: [
      {
        heading: "1. Vendeur",
        list: [
          `${L.companyName} — ${L.legalForm}`,
          `SIRET : ${L.siret}`,
          `Adresse : ${L.legalAddress}`,
          `Contact : ${L.email} · ${L.phone}`,
        ],
      },
      {
        heading: "2. Nature des prestations",
        paragraphs: [
          "Les prestations proposées (appel découverte, Test de Profil Chromatique, préparations personnalisées, séances de suivi) relèvent du bien-être et du développement personnel. Elles reposent sur la méthode de la Chromobioénergie®, qui utilise les propriétés des couleurs et des sons associées aux fleurs, plantes et cristaux.",
          wellness,
          "Aucun résultat particulier n'est garanti : chaque accompagnement est personnel et dépend de la démarche de chacun.",
        ],
      },
      {
        heading: "3. Prix",
        paragraphs: [`Les prix sont indiqués en euros, toutes taxes comprises. ${VAT_NOTICE.fr}. [À COMPLÉTER : vérifier selon le statut fiscal]`],
        list: [
          ...services.map((s) => `${s.name.fr} : ${s.priceCents === 0 ? "offert" : eur(s.priceCents)}`),
          `Flacon thématique prêt à l'emploi : ${readyPrice}`,
          `Renouvellement ou ajustement de la préparation personnalisée : ${renewalPrice}`,
        ],
        after: ["Les prix applicables sont ceux affichés sur le site au moment de la réservation ou de la commande."],
      },
      {
        heading: "4. Réservation et paiement des séances",
        paragraphs: [
          "Les séances se réservent en ligne via l'agenda du site. L'appel découverte est gratuit et confirmé immédiatement.",
          PAYMENT_MODE === "deposit"
            ? `Pour les séances payantes, un **acompte de ${deposit}** est réglé en ligne au moment de la réservation. Il est déduit du prix de la séance ; le solde est réglé lors de la séance.`
            : "Pour les séances payantes, le prix est réglé en totalité en ligne au moment de la réservation.",
          "Le paiement en ligne est sécurisé par Stripe (carte bancaire, Apple Pay, Google Pay). Moyens de paiement acceptés en séance : [À COMPLÉTER]. La réservation est confirmée par e-mail dès la validation du paiement.",
        ],
      },
      {
        heading: "5. Séances à distance",
        paragraphs: [
          "Le Test de Profil Chromatique et le pack Test + préparation personnalisée peuvent être réalisés à distance, par téléphone. Le support couleurs est envoyé au préalable par courrier ou en PDF à l'adresse indiquée lors de la réservation ; la réservation doit donc intervenir au moins cinq jours avant la séance.",
          "Il appartient au client de fournir une adresse postale et un numéro de téléphone exacts, et d'être joignable à l'heure prévue.",
        ],
      },
      {
        heading: "6. Annulation et report des rendez-vous",
        list: [
          `Annulation ou report **gratuits jusqu'à ${FREE_CANCELLATION_HOURS} heures** avant le rendez-vous : l'acompte est remboursé ou reporté sur le nouveau créneau.`,
          `Annulation moins de ${FREE_CANCELLATION_HOURS} heures avant le rendez-vous ou absence : l'acompte est conservé. [À VALIDER]`,
          "Empêchement de la praticienne : le rendez-vous est reporté à une date convenue ensemble ou l'acompte est intégralement remboursé.",
        ],
        after: ["Toute demande d'annulation ou de report se fait par e-mail ou par téléphone, aux coordonnées indiquées ci-dessus."],
      },
      {
        heading: "7. Droit de rétractation — prestations",
        paragraphs: [
          "Conformément aux articles L221-18 et suivants du Code de la consommation, le client dispose d'un délai de quatorze jours à compter de la réservation pour exercer son droit de rétractation, sans avoir à se justifier.",
          "Lorsque le client demande expressément que la séance ait lieu avant la fin de ce délai, il reconnaît qu'en cas de séance entièrement réalisée il perd son droit de rétractation (article L221-28 1°). En cas de rétractation avant la séance, les sommes versées sont remboursées sous quatorze jours.",
        ],
      },
      {
        heading: "8. Boutique en ligne — commandes",
        paragraphs: [
          "La boutique propose des flacons thématiques prêts à l'emploi et le renouvellement ou l'ajustement d'une préparation personnalisée. Ce dernier est réservé aux personnes ayant déjà réalisé leur Test de Profil Chromatique ; le nom utilisé lors du test et sa date approximative sont demandés lors du paiement.",
          "La commande est validée après paiement sécurisé via Stripe. Un e-mail de confirmation récapitule la commande. Un produit indiqué « Bientôt disponible » ne peut pas être commandé.",
        ],
      },
      {
        heading: "9. Livraison et retrait",
        list: [
          `Zone de livraison : ${countries}. [À VALIDER : livraison dans l'Union européenne ?]`,
          `${COLISSIMO.label.fr} : ${eur(COLISSIMO.amountCents)}, offerte dès ${eur(FREE_SHIPPING_THRESHOLD_CENTS)} d'achat.`,
          `${PICKUP.label.fr} : gratuit, sur rendez-vous (${cabinet}).`,
          `Délais : ${preparationDelay.fr}`,
        ],
        after: [
          "En cas de colis endommagé ou de retard important, le client est invité à contacter le vendeur dans les meilleurs délais. Les risques sont transférés au client à la réception des produits.",
        ],
      },
      {
        heading: "10. Droit de rétractation — flacons thématiques",
        paragraphs: [
          "Pour les flacons thématiques prêts à l'emploi, le client dispose d'un délai de **quatorze jours à compter de la réception** pour se rétracter, sans avoir à motiver sa décision. Il lui suffit d'adresser une déclaration claire par e-mail (ou d'utiliser le modèle ci-dessous), puis de retourner les produits non ouverts, dans leur état d'origine, dans les quatorze jours suivant sa déclaration. Les frais de retour sont à la charge du client.",
          "Le remboursement, frais de livraison initiaux inclus (sur la base du mode de livraison standard), intervient dans les quatorze jours suivant la rétractation, par le même moyen de paiement. Il peut être différé jusqu'à la réception des produits retournés.",
          "*Modèle de formulaire de rétractation* : « À l'attention de NLIGHT – Laure Dupuch, [adresse e-mail]. Je vous notifie par la présente ma rétractation du contrat portant sur la vente du bien ci-dessous : [produit], commandé le [date] / reçu le [date]. Nom : … Adresse : … Date : … »",
        ],
      },
      {
        heading: "11. Exception : préparations personnalisées",
        paragraphs: [
          "Conformément à l'**article L221-28 3° du Code de la consommation**, le droit de rétractation ne peut pas être exercé pour la fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés.",
          "Les préparations personnalisées (flacon du pack Test + préparation, renouvellement ou ajustement de la préparation) étant élaborées spécifiquement à partir du profil de chaque client, elles ne peuvent faire l'objet d'aucune rétractation une fois leur préparation commencée.",
        ],
      },
      {
        heading: "12. Garanties légales",
        paragraphs: [
          "Les produits bénéficient de la garantie légale de conformité (articles L217-3 et suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil). Pour toute réclamation, le client contacte le vendeur par e-mail.",
        ],
      },
      {
        heading: "13. Données personnelles",
        paragraphs: ["Les données collectées lors d'une réservation ou d'une commande sont utilisées conformément à la politique de confidentialité."],
        links: [{ label: "Politique de confidentialité", href: "/confidentialite" }],
      },
      {
        heading: "14. Médiation de la consommation",
        paragraphs: [
          "En cas de litige, le client s'adresse d'abord au vendeur afin de rechercher une solution amiable. À défaut, il peut recourir gratuitement au médiateur de la consommation suivant, conformément aux articles L611-1 et suivants du Code de la consommation :",
        ],
        list: [L.mediator.name, L.mediator.website, L.mediator.address],
      },
      {
        heading: "15. Droit applicable",
        paragraphs: ["Les présentes conditions sont soumises au droit français. À défaut de résolution amiable, les tribunaux français sont compétents."],
      },
    ],
  },

  privacy: {
    seoTitle: "Politique de confidentialité | NLIGHT",
    seoDescription: "Comment NLIGHT – Laure Dupuch collecte et utilise vos données : rendez-vous, commandes, contact, newsletter, durées de conservation et droits.",
    label: "Données personnelles",
    titleLead: "Politique de",
    titleAccent: "confidentialité",
    intro: "Cette page explique quelles données sont collectées sur le site, pourquoi, combien de temps elles sont conservées et comment exercer vos droits, conformément au RGPD et à la loi Informatique et Libertés.",
    updated,
    sections: [
      {
        heading: "Responsable des données",
        paragraphs: [`${L.companyName}, ${L.legalAddress}. Contact : ${L.email}.`],
      },
      {
        heading: "Données collectées",
        list: [
          "**Formulaire de contact** : nom, e-mail, téléphone (facultatif), sujet et message.",
          "**Réservation** : prénom, nom, e-mail, téléphone, adresse postale (uniquement pour un test ou un pack à distance, afin d'envoyer le support couleurs) et, si vous le souhaitez, quelques mots sur ce qui vous amène (champ facultatif : n'y indiquez que ce que vous souhaitez partager).",
          "**Commande** : nom, e-mail, adresse de livraison et, pour un renouvellement de préparation, le nom utilisé lors du test et sa date approximative. Les données de paiement sont saisies directement chez Stripe et ne sont jamais conservées par NLIGHT.",
          "**Newsletter** : e-mail et prénom (facultatif).",
          "**Mesure d'audience** : statistiques de visite anonymes et agrégées (Vercel Analytics, sans cookie).",
        ],
      },
      {
        heading: "Finalités et bases légales",
        list: [
          "Répondre à vos messages : mesures précontractuelles et intérêt légitime.",
          "Gérer vos rendez-vous, vos commandes et leur suivi : exécution du contrat.",
          "Tenir la comptabilité et les factures : obligation légale.",
          "Vous adresser la newsletter : consentement, retirable à tout moment.",
          "Améliorer le site grâce à des statistiques anonymes : intérêt légitime.",
        ],
      },
      {
        heading: "Durées de conservation",
        list: [
          `Messages de contact : ${L.retention.contact}.`,
          `Rendez-vous : ${L.retention.booking}.`,
          `Commandes : ${L.retention.orders}.`,
          `Newsletter : ${L.retention.newsletter}.`,
        ],
      },
      {
        heading: "Destinataires et sous-traitants",
        paragraphs: [
          "Vos données sont destinées uniquement à Laure Dupuch. Elles ne sont jamais vendues ni cédées. Les prestataires techniques suivants interviennent pour le fonctionnement du site :",
        ],
        list: [
          "**Vercel Inc.** — hébergement du site et mesure d'audience anonyme.",
          "**Stripe** — paiement en ligne sécurisé.",
          "**Google (Google Agenda)** — gestion des rendez-vous.",
          "**Resend** — envoi des e-mails de confirmation et de notification.",
        ],
        after: [
          "Certains de ces prestataires sont établis hors de l'Union européenne (États-Unis). Les transferts sont encadrés par le cadre de protection des données UE–États-Unis ou par les clauses contractuelles types de la Commission européenne.",
        ],
      },
      {
        heading: "Cookies et stockage local",
        paragraphs: [
          "Le site ne dépose aucun cookie publicitaire, aucun traceur tiers et n'utilise pas de cookie de mesure d'audience : aucun bandeau de consentement n'est donc nécessaire.",
          "Votre panier est enregistré dans le stockage local de votre navigateur, uniquement pour le conserver d'une visite à l'autre. La page de paiement Stripe peut utiliser ses propres cookies, strictement nécessaires à la sécurité du paiement.",
        ],
      },
      {
        heading: "Vos droits",
        paragraphs: [
          `Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement et de définir des directives relatives au sort de vos données après votre décès. Pour les exercer, écrivez à ${L.email}. Une réponse vous est apportée dans un délai d'un mois.`,
          "Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (www.cnil.fr, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07).",
        ],
      },
      {
        heading: "Sécurité",
        paragraphs: [
          "Le site est servi exclusivement en HTTPS. L'accès aux données est limité à Laure Dupuch et aux prestataires listés ci-dessus, pour les seuls besoins du service.",
        ],
      },
    ],
  },
};
