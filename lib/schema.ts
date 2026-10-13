import { images } from "@/config/images";
import type { Product } from "@/config/products";
import { services, type Service } from "@/config/services";
import { isPlaceholder, siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { absolute, localizedPath } from "./seo";

/**
 * Données structurées schema.org (JSON-LD).
 * À valider avec https://search.google.com/test/rich-results après mise en ligne.
 */

const ORG_ID = `${siteConfig.url}/#organisation`;
const PERSON_ID = `${siteConfig.url}/#laure-dupuch`;

const price = (cents: number) => (cents / 100).toFixed(2);

export function organizationSchema(locale: Locale) {
  const { contact } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: siteConfig.brand,
    alternateName: siteConfig.fullName,
    description: siteConfig.baseline[locale],
    url: absolute(localizedPath("/", locale)),
    logo: absolute("/brand/logo.svg"),
    image: absolute(images.hero.src),
    ...(isPlaceholder(contact.email) ? {} : { email: contact.email }),
    ...(isPlaceholder(contact.phone) ? {} : { telephone: contact.phone }),
    address: {
      "@type": "PostalAddress",
      ...(isPlaceholder(contact.address.street) ? {} : { streetAddress: contact.address.street }),
      postalCode: contact.address.postalCode,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      addressCountry: contact.address.country,
    },
    geo: { "@type": "GeoCoordinates", ...contact.geo },
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "City", name: "Lacanau" },
    ],
    priceRange: "0 € – 85 €",
    currenciesAccepted: "EUR",
    founder: { "@id": PERSON_ID },
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
    knowsAbout: ["Chromobioénergie®", "Test de Profil Chromatique", "florathérapie", "élixirs floraux"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "fr" ? "Prestations" : "Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name[locale] },
        price: price(s.priceCents),
        priceCurrency: "EUR",
      })),
    },
  };
}

export function personSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteConfig.practitioner,
    jobTitle: siteConfig.jobTitle[locale],
    worksFor: { "@id": ORG_ID },
    url: absolute(localizedPath("/a-propos", locale)),
    sameAs: [siteConfig.social.instagram, siteConfig.social.linkedin],
    address: { "@type": "PostalAddress", addressLocality: "Lacanau", addressCountry: "FR" },
  };
}

export function serviceSchema(service: Service, locale: Locale, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name[locale],
    description: service.shortDescription[locale],
    serviceType: service.name[locale],
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "France" },
    url,
    offers: {
      "@type": "Offer",
      price: price(service.priceCents),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: absolute(localizedPath("/rendez-vous", locale)),
    },
  };
}

export function productSchema(product: Product, locale: Locale) {
  const url = absolute(localizedPath({ pathname: "/boutique/[slug]", params: { slug: product.slug } }, locale));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name[locale],
    description: product.description[locale],
    image: absolute(images[product.image].src),
    sku: product.slug,
    brand: { "@type": "Brand", name: siteConfig.brand },
    url,
    offers: {
      "@type": "Offer",
      price: price(product.priceCents),
      priceCurrency: "EUR",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
      seller: { "@id": ORG_ID },
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer.replace(/\*\*?/g, "") },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  date: string;
  path: string;
  image: string;
  locale: Locale;
  keywords: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    dateModified: input.date,
    inLanguage: input.locale === "fr" ? "fr-FR" : "en-GB",
    mainEntityOfPage: absolute(input.path),
    image: absolute(input.image),
    keywords: input.keywords.join(", "),
    author: { "@id": PERSON_ID, "@type": "Person", name: siteConfig.practitioner },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: siteConfig.brand,
      logo: { "@type": "ImageObject", url: absolute("/brand/logo.svg") },
    },
  };
}
