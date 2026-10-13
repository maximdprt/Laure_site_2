import { expect, test, type Page } from "@playwright/test";

/** Sélectionne le premier jour disponible du calendrier (en passant au mois suivant si besoin) */
async function pickFirstAvailableDay(page: Page) {
  const grid = page.getByRole("grid");
  await expect(grid).toBeVisible();
  for (let i = 0; i < 3; i++) {
    // Attend la fin du chargement des disponibilités du mois
    await page.waitForFunction(() => !document.querySelector("[role=grid] .animate-pulse"), undefined, { timeout: 20_000 });
    const day = grid.locator('button:not([aria-disabled="true"]):not([disabled])').first();
    if (await day.count()) {
      await day.click();
      return;
    }
    await page.getByRole("button", { name: "Mois suivant" }).click();
  }
  throw new Error("Aucun jour disponible dans les 3 prochains mois");
}

test.describe("Parcours de réservation", () => {
  test("appel découverte : réservation de bout en bout (sans paiement)", async ({ page }) => {
    test.skip(
      process.env.E2E_BASE_URL !== undefined && !process.env.E2E_ALLOW_BOOKING,
      "Crée un vrai rendez-vous : à lancer seulement sur un agenda de test (E2E_ALLOW_BOOKING=1)",
    );

    await page.goto("/rendez-vous?service=decouverte");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("rendez-vous");

    // Prestation présélectionnée via ?service= et format unique (téléphone) : on arrive directement au calendrier
    await pickFirstAvailableDay(page);
    await page.locator('label[for^="slot-"]').first().click();
    await page.getByRole("button", { name: "Continuer" }).click();

    // Étape 4 : coordonnées (dans le module de réservation : la page contient aussi le formulaire de contact)
    const booking = page.getByRole("region", { name: "Réservation" });
    await booking.getByLabel("Prénom").fill("Test");
    await booking.getByLabel("Nom", { exact: true }).fill("Playwright");
    await booking.getByLabel("E-mail").fill("test@example.com");
    await booking.getByLabel("Téléphone").fill("06 00 00 00 00");
    await booking.getByRole("checkbox", { name: /conditions générales de vente/ }).check();
    await booking.getByRole("checkbox", { name: /politique de confidentialité/ }).check();
    await booking.getByRole("button", { name: "Continuer" }).click();

    // Récapitulatif puis confirmation directe (pas de paiement pour l'appel découverte)
    await expect(page.getByText("Vérifiez votre réservation")).toBeVisible();
    await page.getByRole("button", { name: "Confirmer mon appel découverte" }).click();
    await page.waitForURL(/\/rendez-vous\/confirmation/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Ajouter à mon agenda/ })).toBeVisible();
  });

  test("API de disponibilités : créneaux au format attendu", async ({ request }) => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const res = await request.get(`/api/availability?service=test&format=cabinet&month=${month}`);
    expect([200, 503]).toContain(res.status());
    if (res.status() === 200) {
      const body = (await res.json()) as { days: Record<string, string[]> };
      expect(typeof body.days).toBe("object");
    }
  });

  test("validation serveur : un créneau passé est refusé", async ({ request }) => {
    const res = await request.post("/api/booking/checkout", {
      data: {
        serviceId: "test",
        format: "cabinet",
        start: "2020-01-07T09:00:00.000Z",
        firstName: "A",
        lastName: "B",
        email: "a@example.com",
        phone: "0600000000",
        addressLine: "",
        postalCode: "",
        city: "",
        message: "",
        terms: true,
        consent: true,
        website: "",
        locale: "fr",
      },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
