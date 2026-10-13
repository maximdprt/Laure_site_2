import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { imageAvailability } from "@/lib/images";
import { siteConfig } from "@/config/site";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileCta } from "@/components/layout/mobile-cta";
import { CartDrawer } from "@/components/shop/cart-drawer";
import "../globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-geist-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  display: "swap",
  variable: "--font-instrument",
});

export const viewport: Viewport = {
  themeColor: "#efeeea",
  colorScheme: "light",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("defaultTitle"), template: "%s" },
    description: t("defaultDescription"),
    applicationName: siteConfig.fullName,
    authors: [{ name: siteConfig.practitioner }],
    creator: siteConfig.practitioner,
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "a11y" });

  return (
    <html lang={locale} className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <body>
        <NextIntlClientProvider>
          <a
            href="#contenu"
            className="sr-only z-[60] rounded-full bg-ink px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {t("skipToContent")}
          </a>
          <Header />
          <main id="contenu" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <MobileCta />
          <CartDrawer imageAvailability={imageAvailability()} />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
