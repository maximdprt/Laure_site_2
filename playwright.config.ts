import { defineConfig, devices } from "@playwright/test";

/**
 * Tests de bout en bout (parcours réservation et achat).
 * - En local : `pnpm build && pnpm test:e2e` (le serveur de production est démarré automatiquement).
 * - Avec des clés Stripe de TEST dans .env.local, le parcours d'achat va jusqu'à la page Stripe Checkout.
 * - Contre un déploiement : `E2E_BASE_URL=https://… pnpm test:e2e`.
 */
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3200";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL, trace: "retain-on-failure", locale: "fr-FR", timezoneId: "Europe/Paris" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "pnpm exec next start -p 3200", url: baseURL, reuseExistingServer: true, timeout: 120_000 },
});
