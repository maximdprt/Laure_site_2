import type { NextConfig } from "next";

/**
 * next-intl : on déclare l'alias de configuration à la main plutôt que via
 * `createNextIntlPlugin` (le plugin charge @swc/core, dont le binaire natif
 * refuse de se charger sur certains postes Windows). Effet identique.
 */
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      "next-intl/config": "./i18n/request.ts",
    },
  },
};

export default nextConfig;
