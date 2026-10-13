import { expect, test } from "@playwright/test";

const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_"));

test.describe("Parcours d'achat", () => {
  test("ajout au panier, modification et passage au paiement", async ({ page }) => {
    await page.goto("/boutique");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("flacons");

    // Ajout d'un flacon depuis la grille : le tiroir panier s'ouvre
    await page.getByRole("button", { name: /Ajouter au panier/ }).first().click();
    const drawer = page.getByRole("dialog", { name: "Votre panier" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("Sérénité & détente")).toBeVisible();

    // Quantité + 1 → sous-total 44 €
    await drawer.getByRole("button", { name: "Augmenter la quantité" }).click();
    await expect(drawer.getByText("44 €").first()).toBeVisible();

    // Le compteur du header reflète le panier
    await drawer.getByRole("button", { name: "Fermer" }).click();
    await expect(page.getByRole("button", { name: /Ouvrir le panier – 2 articles/ })).toBeVisible();

    // Passage au paiement (on remonte en haut de page : le header se masque en descendant)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("button", { name: /Ouvrir le panier/ }).click();
    await page.getByRole("button", { name: "Commander" }).click();
    if (stripeConfigured) {
      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });
      // Paiement de test : carte 4242 4242 4242 4242 sur la page Stripe (non automatisé ici)
    } else {
      // Sans clé Stripe, l'API répond 503 et un message d'erreur s'affiche
      await expect(page.getByRole("alert")).toContainText("Le paiement n'a pas pu être lancé");
    }
  });

  test("les prix sont relus côté serveur", async ({ request }) => {
    const res = await request.post("/api/shop/checkout", {
      data: { lines: [{ slug: "inconnu", quantity: 1 }], locale: "fr" },
    });
    expect(res.status()).toBe(400);
  });

  test("fiche produit : quantité et mention bien-être", async ({ page }) => {
    await page.goto("/boutique/sommeil");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sommeil");
    await expect(page.getByText(/ne remplacent pas un diagnostic/).first()).toBeVisible();
    await page.getByRole("button", { name: "Augmenter la quantité" }).click();
    await page.getByRole("button", { name: "Ajouter au panier", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "Votre panier" })).toContainText("Sommeil");
  });
});
