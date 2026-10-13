import type { NextConfig } from "next";
import path from "node:path";

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
  // Même alias pour `next dev --webpack` (secours si Turbopack ne peut pas lancer ses processus PostCSS)
  webpack: (config: { resolve: { alias: Record<string, string> } }) => {
    config.resolve.alias["next-intl/config"] = path.resolve("./i18n/request.ts");
    return config;
  },
};

export default nextConfig;
