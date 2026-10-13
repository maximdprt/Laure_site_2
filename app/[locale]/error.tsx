"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SplitTitle } from "@/components/ui/typography";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("error");
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="bg-bg pt-[calc(var(--header-h)+16px)]">
      <div className="container-site py-24 md:py-32">
        <SplitTitle as="h1" lead={t("titleLead")} accent={t("titleAccent")} />
        <p className="mt-6 max-w-xl text-lead text-ink-muted">{t("text")}</p>
        <Button onClick={reset} className="mt-10">
          {t("retry")}
        </Button>
      </div>
    </section>
  );
}
