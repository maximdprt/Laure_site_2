import { useTranslations } from "next-intl";
import { PageIntro } from "@/components/sections/page-intro";
import { ButtonLink, LinkUnderline } from "@/components/ui/button";
import { SplitTitle } from "@/components/ui/typography";

/** 404 personnalisée : sobre, avec liens vers le test et l'accueil */
export default function NotFound() {
  const t = useTranslations();
  return (
    <PageIntro label="404" title={<SplitTitle as="h1" lead={t("notFound.titleLead")} accent={t("notFound.titleAccent")} />}>
      <p>{t("notFound.text")}</p>
      <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <ButtonLink href="/test-profil-chromatique">{t("notFound.testCta")}</ButtonLink>
        <LinkUnderline href="/">{t("common.backHome")}</LinkUnderline>
      </div>
    </PageIntro>
  );
}
