import type { Metadata } from "next";
import { resolveLocale } from "@/lib/locale";
import { CtaFinal } from "@/components/sections/cta-banner";
import { FaqSection } from "@/components/sections/faq-section";
import { PageIntro } from "@/components/sections/page-intro";
import { Button, ButtonLink, LinkUnderline } from "@/components/ui/button";
import { FullBleedImage } from "@/components/ui/full-bleed-image";
import { RuleItem, RuleList } from "@/components/ui/rule-list";
import { Section, SectionHeader } from "@/components/ui/section";
import { MonoLabel, Price, SectionLabel, SplitTitle } from "@/components/ui/typography";
import { StyleguideForm } from "./styleguide-form";

export const metadata: Metadata = {
  title: "Styleguide – NLIGHT",
  robots: { index: false, follow: false },
};

const swatches = [
  ["bg", "#EFEEEA", "Pierre claire – fond"],
  ["paper", "#FFFFFF", "Blocs ponctuels"],
  ["ink", "#111111", "Encre – texte, boutons"],
  ["ink-muted", "#6B6862", "Texte secondaire"],
  ["line", "#CFCBC3", "Filets"],
  ["dark", "#111111", "Footer"],
  ["on-dark", "#BDB9B1", "Texte sur sombre"],
] as const;

/** Page interne (non indexée) qui présente tous les composants de base */
export default async function StyleguidePage({ params }: PageProps<"/[locale]/styleguide">) {
  const l = await resolveLocale(params);

  return (
    <>
      <PageIntro
        label="Interne · non indexé"
        title={<SplitTitle as="h1" lead="Styleguide" accent="NLIGHT" />}
      >
        Tokens, typographie et composants de base de la direction « éditorial photo ». Cette page n&apos;apparaît ni
        dans la navigation ni dans le sitemap.
      </PageIntro>

      <Section tight aria-label="Palette">
        <SectionHeader number="01" label="Palette" title={<SplitTitle lead="Pierre, encre" accent="& blanc." />} />
        <RuleList>
          {swatches.map(([token, hex, label]) => (
            <RuleItem key={token} className="flex items-center gap-6">
              <span className="size-10 shrink-0 border border-line" style={{ background: `var(--color-${token})` }} />
              <span className="flex-1">{label}</span>
              <MonoLabel>
                --color-{token} · {hex}
              </MonoLabel>
            </RuleItem>
          ))}
        </RuleList>
      </Section>

      <Section tight aria-label="Typographie">
        <SectionHeader number="02" label="Typographie" title={<SplitTitle lead="Geist fine," accent="Instrument Serif." />} />
        <div className="flex flex-col gap-10">
          <SectionLabel number="03">Repère Geist Mono 12 px</SectionLabel>
          <SplitTitle as="p" size="h1" lead="Test de Profil Chromatique" accent="& accompagnement émotionnel" breakBefore />
          <SplitTitle as="p" size="h2" lead="Votre flacon" accent="est unique." />
          <SplitTitle as="p" size="h3" lead="Titre de niveau 3" accent="en italique" />
          <p className="text-[clamp(30px,3.6vw,50px)] font-light leading-[1.15] tracking-[-0.02em]">
            Paragraphe manifeste en Geist 300, avec <span className="serif-accent">une phrase en serif italique.</span>
          </p>
          <p className="prose-site">
            Texte courant — Geist 400, 17 px, interlignage 1.65. Le Test de Profil Chromatique vous permet de mieux
            comprendre votre fonctionnement émotionnel à travers votre relation aux couleurs.
          </p>
          <Price>85 €</Price>
        </div>
      </Section>

      <Section tight aria-label="Boutons">
        <SectionHeader number="03" label="Boutons" title={<SplitTitle lead="Pilules" accent="& filets." />} />
        <div className="flex flex-wrap items-center gap-8">
          <Button>Bouton primaire</Button>
          <Button variant="outline">Pilule à contour</Button>
          <LinkUnderline href="/test-profil-chromatique">Découvrir le test</LinkUnderline>
          <ButtonLink href="/rendez-vous">Prendre rendez-vous</ButtonLink>
          <Button disabled>Désactivé</Button>
        </div>
        <div data-tone="dark" className="mt-10 flex flex-wrap items-center gap-8 bg-dark p-10 text-white">
          <Button variant="light">Bouton blanc sur photo</Button>
          <Button variant="outline-light">Contour blanc</Button>
          <LinkUnderline href="/rendez-vous">Lien souligné</LinkUnderline>
        </div>
      </Section>

      <Section tight aria-label="Listes à filets">
        <SectionHeader number="04" label="Listes à filets" title={<SplitTitle lead="Simple" accent="& clair." />} />
        <RuleList>
          {[
            ["Appel découverte", "Téléphone, 15 min", "Offert"],
            ["Test de Profil Chromatique", "Cabinet ou à distance", "65 €"],
            ["Pack Test + préparation personnalisée", "Le plus choisi", "85 €"],
          ].map(([name, desc, price]) => (
            <RuleItem key={name} className="flex items-baseline justify-between gap-6">
              <div>
                <p className="text-[20px] tracking-[-0.01em]">{name}</p>
                <MonoLabel>{desc}</MonoLabel>
              </div>
              <Price>{price}</Price>
            </RuleItem>
          ))}
        </RuleList>
      </Section>

      <Section tight bleed aria-label="Images">
        <div className="container-site">
          <SectionHeader number="05" label="Images" title={<SplitTitle lead="Bord à bord," accent="sans arrondi." />} />
        </div>
        <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
          <FullBleedImage imageKey="univers-fleurs" locale={l} sizes="(min-width: 768px) 25vw, 50vw" />
          <FullBleedImage imageKey="univers-couleurs" locale={l} sizes="(min-width: 768px) 25vw, 50vw" />
          <FullBleedImage imageKey="univers-sons" locale={l} sizes="(min-width: 768px) 25vw, 50vw" />
          <FullBleedImage imageKey="univers-cristaux" locale={l} sizes="(min-width: 768px) 25vw, 50vw" />
        </div>
      </Section>

      <Section tight aria-label="Formulaires">
        <SectionHeader number="06" label="Formulaires" title={<SplitTitle lead="Champs" accent="à filet." />} />
        <StyleguideForm />
      </Section>

      <FaqSection
        number="07"
        items={[
          { question: "Accordéon accessible ?", answer: "Oui : navigation clavier, **aria-expanded** et région associée." },
          { question: "Balisage FAQPage ?", answer: "Oui, généré automatiquement en JSON-LD." },
        ]}
      />
      <CtaFinal
        locale={l}
        title={
          <>
            Mieux vous comprendre, <span className="serif-accent">mieux vous accompagner.</span>
          </>
        }
        primary={{ label: "Prendre rendez-vous", href: "/rendez-vous" }}
        secondary={{ label: "Appel découverte offert", href: "/rendez-vous" }}
      />
    </>
  );
}
