import { getLocale, getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { footerNav, legalNav } from "@/config/nav";
import { isPlaceholder, siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { BackToTop } from "@/components/motion/back-to-top";
import { Reveal } from "@/components/ui/reveal";
import { NewsletterForm } from "./newsletter-form";

/** Footer sombre : baseline, 3 colonnes, mot-symbole géant, mention bien-être et liens légaux */
export async function Footer() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const { contact, social } = siteConfig;
  const year = new Date().getFullYear();
  const linkClass = "link-underline text-[15px] text-white after:scale-x-0 hover:after:scale-x-100";

  return (
    <footer data-tone="dark" className="bg-dark text-on-dark">
      <div className="container-site pb-10 pt-20 md:pt-28">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="serif-accent max-w-4xl text-[clamp(30px,3.6vw,52px)] leading-[1.08] text-white">
              {siteConfig.baseline[locale]}
            </p>
          </Reveal>
          <BackToTop className="shrink-0 self-start md:self-auto" />
        </div>

        <div className="mt-16 grid gap-12 border-t border-white/15 pt-12 md:mt-24 md:grid-cols-3 md:gap-8">
          <Reveal>
            <nav aria-label={t("a11y.footerNav")}>
              <h2 className="label-mono mb-5 text-on-dark">{t("footer.navTitle")}</h2>
              <ul className="flex flex-col gap-1">
                {footerNav.map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className={linkClass}>
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <Reveal index={1}>
            <h2 className="label-mono mb-5 text-on-dark">{t("footer.contactTitle")}</h2>
            <address className="flex flex-col gap-3 text-[15px] not-italic">
              <span>
                {contact.address.street}
                <br />
                {contact.address.postalCode} {contact.address.city}
              </span>
              <span>{t("footer.remote")}</span>
              {isPlaceholder(contact.email) ? (
                <span>{contact.email}</span>
              ) : (
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {contact.email}
                </a>
              )}
              {contact.phoneHref ? (
                <a href={`tel:${contact.phoneHref}`} className={linkClass}>
                  {contact.phone}
                </a>
              ) : (
                <span>{contact.phone}</span>
              )}
            </address>
            <ul className="mt-6 flex gap-6">
              <li>
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("footer.instagram")} ${t("a11y.externalLink")}`}
                  className={linkClass}
                >
                  Instagram ↗
                </a>
              </li>
              <li>
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("footer.linkedin")} ${t("a11y.externalLink")}`}
                  className={linkClass}
                >
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal index={2}>
            <h2 className="label-mono mb-5 text-on-dark">{t("footer.newsletterTitle")}</h2>
            <p className="mb-6 text-[15px]">{t("footer.newsletterText")}</p>
            <NewsletterForm tone="dark" />
          </Reveal>
        </div>
      </div>

      <p
        aria-hidden
        data-reveal="letters"
        className="select-none overflow-hidden whitespace-nowrap pb-[0.04em] text-center text-[clamp(80px,21vw,300px)] font-light leading-[0.8] tracking-[-0.04em] text-white"
      >
        {Array.from("NLIGHT", (letter, i) => (
          <span key={i} className="inline-block" style={{ "--i": i } as CSSProperties}>
            {letter}
          </span>
        ))}
      </p>

      <div className="container-site flex flex-col gap-5 pb-28 pt-10 text-[12px] leading-relaxed lg:pb-10">
        <p className="max-w-3xl">{t("wellness.notice")}</p>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>{t("footer.copyright", { year })}</p>
          <nav aria-label={t("a11y.legalNav")}>
            <ul className="flex flex-wrap gap-x-6">
              {legalNav.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className="inline-flex min-h-11 items-center hover:text-white">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
