import { chromium } from "@playwright/test";
const [,, outDir] = process.argv;
const pages = ["/", "/test-profil-chromatique", "/accompagnement-emotionnel", "/preparations-personnalisees", "/a-propos", "/tarifs", "/boutique", "/boutique/sommeil", "/rendez-vous", "/journal", "/journal/que-revelent-vos-couleurs-preferees", "/cgv", "/en", "/en/book", "/en/shop", "/nexiste-pas"];
const b = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  for (const path of pages) {
    const errors = [];
    p.removeAllListeners("console"); p.removeAllListeners("pageerror");
    p.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
    p.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
    const res = await p.goto("http://localhost:3100" + path, { waitUntil: "networkidle", timeout: 120000 });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(600);
    const info = await p.evaluate(() => ({ overflow: document.documentElement.scrollWidth - window.innerWidth, h1: document.querySelectorAll("h1").length, title: document.title }));
    const name = `${tag}-${path.replace(/\//g, "_") || "_"}.png`;
    await p.screenshot({ path: `${outDir}/${name}`, fullPage: true });
    console.log(tag, res?.status(), path, JSON.stringify(info), errors.length ? JSON.stringify(errors) : "");
  }
  await p.close();
}
await b.close();
