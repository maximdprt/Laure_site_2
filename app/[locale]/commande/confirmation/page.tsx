import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { logError } from "@/lib/api";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { retrieveOrder, type OrderSummary } from "@/lib/order";
import { formatPrice } from "@/lib/utils";
import { PageIntro } from "@/components/sections/page-intro";
import { ClearCart } from "@/components/shop/clear-cart";
import { LinkUnderline } from "@/components/ui/button";
import { RuleItem, RuleList } from "@/components/ui/rule-list";
import { Section } from "@/components/ui/section";
import { MonoLabel, Price, SplitTitle } from "@/components/ui/typography";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/commande/confirmation">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const t = await getTranslations({ locale, namespace: "order" });
  return { title: `${t("title")} | NLIGHT`, robots: { index: false, follow: false } };
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: PageProps<"/[locale]/commande/confirmation">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale });
  const sessionId = (await searchParams).session_id;

  let order: OrderSummary | null = null;
  if (typeof sessionId === "string") {
    try {
      order = (await retrieveOrder(sessionId))?.order ?? null;
    } catch (error) {
      logError("order:confirmation", error);
    }
  }

  if (!order) {
    return (
      <PageIntro title={<SplitTitle as="h1" lead={t("order.title")} />}>
        <p>{t("order.notFound")}</p>
        <LinkUnderline href="/boutique" className="mt-8">
          {t("order.continue")}
        </LinkUnderline>
      </PageIntro>
    );
  }

  const price = (cents: number) => formatPrice(cents, locale);

  return (
    <>
      {/* Le panier est vidé à l'arrivée sur la page de confirmation */}
      <ClearCart />
      <PageIntro label={`${t("order.reference")} ${order.reference}`} title={<SplitTitle as="h1" lead={t("order.titleLead")} accent={t("order.titleAccent")} />}>
        <p>{t("order.intro")}</p>
      </PageIntro>
      <Section tight className="pt-0 md:pt-0">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="bg-paper p-6 md:p-10 lg:col-span-7">
            <MonoLabel>{t("order.summary")}</MonoLabel>
            <RuleList className="mt-6">
              {order.items.map((item) => (
                <RuleItem key={item.name} className="flex items-baseline justify-between gap-6 py-5 md:py-5">
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span>{price(item.amountCents)}</span>
                </RuleItem>
              ))}
              <RuleItem className="flex items-baseline justify-between gap-6 py-5 md:py-5">
                <span className="text-ink-muted">
                  {t("order.shipping")}
                  {order.shippingMethod ? ` · ${order.shippingMethod}` : ""}
                </span>
                <span>{price(order.shippingCents)}</span>
              </RuleItem>
              <RuleItem className="flex items-baseline justify-between gap-6 py-5 md:py-5">
                <span>{t("order.total")}</span>
                <Price>{price(order.totalCents)}</Price>
              </RuleItem>
            </RuleList>
            {order.shippingAddress && <p className="mt-6 text-[15px] text-ink-muted">{order.shippingAddress}</p>}
          </div>
          <div className="lg:col-span-5">
            <p className="text-[18px] leading-relaxed">{t("order.next")}</p>
            <LinkUnderline href="/" className="mt-8">
              {t("order.continue")}
            </LinkUnderline>
          </div>
        </div>
      </Section>
    </>
  );
}
