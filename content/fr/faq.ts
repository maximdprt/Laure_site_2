import type { FaqBank } from "../types";

/** Banque de FAQ (section 7.9) — répartie sur les pages via leurs identifiants */
export const faq: FaqBank = {
  "what-is-test": {
    question: "Qu'est-ce que le Test de Profil Chromatique ?",
    answer:
      "Une méthode qui utilise vos choix de couleurs pour établir votre profil personnel. C'est avant tout un outil de connaissance de soi.",
  },
  "need-problem": {
    question: "Faut-il avoir un problème précis pour venir ?",
    answer: "Non. Vous pouvez faire le test simplement parce que vous souhaitez mieux vous connaître.",
  },
  remote: {
    question: "Comment se passe le test à distance ?",
    answer:
      "Après votre réservation, vous recevez votre support couleurs par courrier ou en PDF. Le test se déroule ensuite par téléphone, comme au cabinet.",
  },
  duration: {
    question: "Combien de temps dure une séance ?",
    answer: "Il n'y a pas de durée imposée : nous prenons le temps dont vous avez besoin.",
  },
  "bottle-without-test": {
    question: "Puis-je commander un flacon sans faire le test ?",
    answer:
      "Oui, les flacons thématiques de la boutique sont disponibles sans test. La préparation personnalisée, elle, est créée après votre Test de Profil Chromatique.",
  },
  "blend-evolves": {
    question: "Ma préparation peut-elle évoluer ?",
    answer: "Oui. Si vos besoins évoluent, votre préparation peut être adaptée.",
  },
  "how-to-use": {
    question: "Comment utiliser ma préparation ?",
    answer: "[À COMPLÉTER par Laure : conseils d'utilisation de la préparation]",
  },
  delays: {
    question: "Quels sont les délais de préparation et de livraison ?",
    answer: "[À COMPLÉTER : délais de préparation et de livraison]",
  },
  cancel: {
    question: "Puis-je annuler ou déplacer mon rendez-vous ?",
    answer: "Oui, gratuitement jusqu'à {hours} h avant. Contactez Laure par e-mail ou téléphone.",
  },
  medical: {
    question: "Ces séances remplacent-elles un suivi médical ?",
    answer:
      "Non. Les prestations s'inscrivent dans une démarche de bien-être et de développement personnel. Elles ne remplacent pas un diagnostic, un traitement ou un suivi médical.",
  },
  "colour-blind": {
    question: "Puis-je faire le test si je distingue mal certaines couleurs ?",
    answer: "[À COMPLÉTER : réponse de Laure sur le daltonisme]",
  },
  "no-right-answer": {
    question: "Y a-t-il de bonnes ou de mauvaises réponses ?",
    answer:
      "Non. Il n'y a ni bonne ni mauvaise réponse. Ce qui compte est votre perception personnelle, au moment du test.",
  },
  "bottle-duration": {
    question: "Combien de temps dure un flacon ?",
    answer: "[À COMPLÉTER : durée d'utilisation d'un flacon]",
  },
  deposit: {
    question: "Pourquoi un acompte à la réservation ?",
    answer:
      "L'acompte confirme votre créneau. Il est déduit du prix de la séance et le solde est réglé le jour du rendez-vous. Il est remboursé en cas d'annulation jusqu'à {hours} h avant.",
  },
  "payment-methods": {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "En ligne : carte bancaire, Apple Pay et Google Pay, via un paiement sécurisé. En séance : [À COMPLÉTER : moyens de paiement acceptés au cabinet].",
  },
  "which-service": {
    question: "Par quelle prestation commencer ?",
    answer:
      "Pour une première fois, le **Pack Test + préparation personnalisée** est le plus complet : vous découvrez votre profil et recevez votre flacon. Si vous hésitez, l'appel découverte de 15 minutes est offert.",
  },
};
