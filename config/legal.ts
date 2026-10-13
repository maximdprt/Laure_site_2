/**
 * Informations légales utilisées par les mentions légales, les CGV et la politique de confidentialité.
 * ➜ Tout est à compléter avant la mise en ligne.
 */
export const legalConfig = {
  companyName: "NLIGHT – Laure Dupuch",
  legalForm: "[À COMPLÉTER : statut juridique, ex. entreprise individuelle (micro-entreprise)]",
  siret: "[À COMPLÉTER : SIRET]",
  rcsOrRm: "[À COMPLÉTER : immatriculation, si applicable]",
  vatNumber: "[À COMPLÉTER : n° de TVA intracommunautaire ou « non applicable »]",
  legalAddress: "[À COMPLÉTER : adresse légale]",
  email: "[À COMPLÉTER : e-mail]",
  phone: "[À COMPLÉTER : téléphone]",
  publicationDirector: "Laure Dupuch",
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    website: "https://vercel.com",
  },
  mediator: {
    name: "[À COMPLÉTER : médiateur de la consommation]",
    website: "[À COMPLÉTER : site du médiateur]",
    address: "[À COMPLÉTER : adresse du médiateur]",
  },
  trademarkOwner: "[À COMPLÉTER : titulaire de la marque Chromobioénergie®]",
  /** Durées de conservation des données (politique de confidentialité) */
  retention: {
    contact: "3 ans à compter du dernier échange",
    booking: "3 ans à compter du dernier rendez-vous",
    orders: "10 ans (obligation comptable) pour les pièces de facturation",
    newsletter: "jusqu'à la désinscription, ou 3 ans sans interaction",
  },
  lastUpdated: "2026-10-13",
} as const;
