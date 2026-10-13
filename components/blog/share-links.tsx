"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

/** Partage : e-mail, LinkedIn, copie du lien */
export function ShareLinks({ url, title }: { url: string; title: string }) {
  const t = useTranslations("journal");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      /* presse-papiers indisponible : rien à faire */
    }
  }

  const linkClass = "link-underline text-[14px]";
  return (
    <div>
      <p className="label-mono mb-3 text-ink-muted">{t("share")}</p>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 lg:flex-col">
        <li>
          <a
            className={linkClass}
            href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
            aria-label={t("shareEmail")}
          >
            E-mail
          </a>
        </li>
        <li>
          <a
            className={linkClass}
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("shareLinkedin")}
          >
            LinkedIn ↗
          </a>
        </li>
        <li>
          <button type="button" onClick={copy} className={`${linkClass} cursor-pointer`}>
            {copied ? t("copied") : t("copyLink")}
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? t("copied") : ""}
          </span>
        </li>
      </ul>
    </div>
  );
}
