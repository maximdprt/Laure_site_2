import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import { images, type ImageKey } from "@/config/images";

const cache = new Map<ImageKey, boolean>();

/** Le fichier image est-il présent dans public/ ? (sinon on affiche un visuel de remplacement) */
export function imageExists(key: ImageKey): boolean {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  let exists = false;
  try {
    exists = existsSync(path.join(process.cwd(), "public", images[key].src));
  } catch {
    exists = false;
  }
  // En développement, pas de cache : une image ajoutée apparaît sans redémarrer le serveur
  if (process.env.NODE_ENV === "production") cache.set(key, exists);
  return exists;
}

export function imageAvailability(): Partial<Record<ImageKey, boolean>> {
  const result: Partial<Record<ImageKey, boolean>> = {};
  for (const key of Object.keys(images) as ImageKey[]) result[key] = imageExists(key);
  return result;
}
