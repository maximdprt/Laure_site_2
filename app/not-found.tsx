import Link from "next/link";
import "./globals.css";

/** 404 hors des routes localisées (rare : le proxy ajoute toujours une langue) */
export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body className="grid min-h-screen place-items-center bg-bg p-8 text-center">
        <div>
          <h1 className="font-serif text-4xl">Page introuvable</h1>
          <p className="mt-4">
            <Link href="/" className="underline">
              Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
