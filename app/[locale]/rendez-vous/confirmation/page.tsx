import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FREE_CANCELLATION_HOURS, formatLabels, getService } from "@/config/services";
import { logError } from "@/lib/api";
import { cabinetAddress, formatDateTime, fromStripeMetadata, verifyRef, type BookingRef } from "@/lib/booking";
import { getEvent, isCalendarConfigured } from "@/lib/google-calendar";
import { metadataLocale, resolveLocale } from "@/lib/locale";
import { buildMetadata } from "@/lib/seo";
import { getStripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageIntro } from "@/components/sections/page-intro";
import { LinkUnderline } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { SectionLabel, SplitTitle } from "@/components/ui/typography";

export async function generateMetadata({ params }: PageProps<"/[locale]/rendez-vous/confirmation">): Promise<Metadata> {
  const locale = await metadataLocale(params);
  const t = await getTranslations({ locale, namespace: "bookingConfirmation" });
  return buildMetadata({ locale, href: "/rendez-vous/confirmation", title: t("metaTitle"), noIndex: true });
}

type Lookup =
  | { state: "confirmed"; booking: BookingRef; paidCents: number; icsQuery: string; webhookPending: boolean }
  | { state: "pending" }
  | { state: "not-found" };

async function lookup(sessionId: string | undefined, refToken: string | undefined): Promise<Lookup> {
  const ref = verifyRef(refToken);
  if (ref) {
    return { state: "confirmed", booking: ref, paidCents: 0, icsQuery: `ref=${encodeURIComponent(refToken ?? "")}`, webhookPending: false };
  }
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return { state: "not-found" };
  const stripe = getStripe();
  if (!stripe) return { state: "not-found" };
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const record = fromStripeMetadata(session.metadata);
    if (!record) return { state: "not-found" };
    if (session.payment_status !== "paid") return { state: "pending" };
    let webhookPending = false;
    if (isCalendarConfigured()) {
      const event = await getEvent(record.eventId).catch(() => null);
      webhookPending = event?.props.status === "hold";
    }
    return {
      state: "confirmed",
      booking: record,
      paidCents: session.amount_total ?? 0,
      icsQuery: `session_id=${encodeURIComponent(sessionId)}`,
      webhookPending,
    };
  } catch (error) {
    logError("booking:confirmation", error);
    return { state: "not-found" };
  }
}

/** Page de confirmation : récapitulatif, ajout à l'agenda (.ics), ce qu'il faut préparer */
export default async function BookingConfirmationPage({
  params,
  searchParams,
}: PageProps<"/[locale]/rendez-vous/confirmation">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("bookingConfirmation");
  const tb = await getTranslations("booking");
  const tn = await getTranslations("nav");
  const query = await searchParams;
  const result = await lookup(
    typeof query.session_id === "string" ? query.session_id : undefined,
    typeof query.ref === "string" ? query.ref : undefined,
  );

  const breadcrumbs = (
    <Breadcrumbs
      items={[
        { label: tn("book"), href: "/rendez-vous" },
        { label: t("label"), href: "/rendez-vous/confirmation" },
      ]}
    />
  );

  if (result.state !== "confirmed") {
    const pending = result.state === "pending";
    return (
      <>
        <PageIntro
          label={t("label")}
          title={<SplitTitle as="h1" size="h2" lead={pending ? t("pendingTitle") : t("notFoundTitle")} />}
          breadcrumbs={breadcrumbs}
        >
          {pending ? t("pending") : t("notFound")}
        </PageIntro>
        <Section tight>
          <LinkUnderline href="/rendez-vous">{t("bookAgain")}</LinkUnderline>
        </Section>
      </>
    );
  }

  const { booking, paidCents } = result;
  const service = getService(booking.serviceId);
  const free = !service.requiresPayment;
  const prepare =
    booking.format === "cabinet"
      ? t("prepareCabinet", { address: cabinetAddress() })
      : booking.format === "distance"
        ? t("prepareDistance")
        : t("preparePhone");

  const rows: { label: string; value: string }[] = [
    { label: tb("summaryService"), value: service.name[locale] },
    { label: tb("summaryDate"), value: formatDateTime(booking.start, locale) },
    { label: tb("summaryFormat"), value: formatLabels[booking.format][locale] },
    ...(paidCents > 0 ? [{ label: t("paidOnline"), value: formatPrice(paidCents, locale) }] : []),
  ];

  return (
    <>
      <PageIntro
        label={t("label")}
        title={
          <SplitTitle
            as="h1"
            size="h1"
            lead={free ? t("titleLeadFree") : t("titleLead")}
            accent={t("titleAccent")}
            breakBefore
          />
        }
        breadcrumbs={breadcrumbs}
      >
        {t("intro")}
        {result.webhookPending && <span className="mt-3 block text-[15px]">{t("pending")}</span>}
      </PageIntro>

      <Section tight>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <SectionLabel number="01">{t("summaryTitle")}</SectionLabel>
          </div>
          <div className="lg:col-span-6">
            <dl className="bg-paper px-6 py-2 md:px-10 md:py-4">
              {rows.map((row, i) => (
                <div key={row.label} className={i < rows.length - 1 ? "border-b border-line py-5" : "py-5"}>
                  <dt className="label-mono text-ink-muted">{row.label}</dt>
                  <dd className="mt-1.5 text-[18px] first-letter:uppercase">{row.value}</dd>
                </div>
              ))}
            </dl>
            <a href={`/api/booking/ics?${result.icsQuery}`} download className="link-underline mt-8 text-[15px]">
              {t("addToCalendar")} <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </Section>

      <Section tight>
        <div className="grid gap-8 border-t border-ink pt-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel number="02">{t("prepareTitle")}</SectionLabel>
          </div>
          <div className="space-y-5 lg:col-span-6">
            <p className="text-lead">{prepare}</p>
            <p className="text-ink-muted">{t("prepareGeneral")}</p>
            <p className="text-ink-muted">{t("cancellation", { hours: FREE_CANCELLATION_HOURS })}</p>
            <LinkUnderline href="/" className="mt-4">
              {tn("home")}
            </LinkUnderline>
          </div>
        </div>
      </Section>
    </>
  );
}
