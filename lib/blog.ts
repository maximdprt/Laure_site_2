import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import { cache } from "react";
import { images, type ImageKey } from "@/config/images";
import type { Locale } from "@/i18n/routing";
import { mdxComponents } from "@/components/blog/mdx-components";

/**
 * Articles du Journal : fichiers MDX dans content/blog/{fr,en}/.
 * Un même nom de fichier dans les deux dossiers = un article et sa traduction.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  slug: string;
  lang: Locale;
  cover: ImageKey;
  keywords: string[];
  readingTime: number;
  category: string;
};

export type PostMeta = PostFrontmatter & {
  /** Nom du fichier sans extension : identifiant commun aux deux langues */
  translationKey: string;
};

export type PostHeading = { id: string; text: string; level: 2 | 3 };

export type Post = PostMeta & {
  content: ReactElement;
  headings: PostHeading[];
};

/** Identifiant d'ancre à partir d'un intertitre */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isImageKey(value: unknown): value is ImageKey {
  return typeof value === "string" && value in images;
}

function parseFrontmatter(raw: Record<string, unknown>, file: string): PostFrontmatter {
  const str = (key: string): string => {
    const value = raw[key];
    if (typeof value !== "string" || value.trim() === "") throw new Error(`[blog] ${file} : « ${key} » manquant`);
    return value;
  };
  const date = raw.date instanceof Date ? raw.date.toISOString().slice(0, 10) : str("date");
  const lang = str("lang");
  if (lang !== "fr" && lang !== "en") throw new Error(`[blog] ${file} : langue invalide`);
  const cover = raw.cover;
  if (!isImageKey(cover)) throw new Error(`[blog] ${file} : « cover » doit être une clé de config/images.ts`);
  const keywords = Array.isArray(raw.keywords) ? raw.keywords.filter((k): k is string => typeof k === "string") : [];
  const readingTime = typeof raw.readingTime === "number" ? raw.readingTime : Number(raw.readingTime ?? 5);
  return {
    title: str("title"),
    description: str("description"),
    date,
    slug: str("slug"),
    lang,
    cover,
    keywords,
    readingTime: Number.isFinite(readingTime) ? readingTime : 5,
    category: str("category"),
  };
}

function listFiles(locale: Locale): string[] {
  try {
    return readdirSync(path.join(BLOG_DIR, locale)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
}

function readSource(locale: Locale, file: string): string {
  return readFileSync(path.join(BLOG_DIR, locale, file), "utf8");
}

/** Intertitres H2/H3 du texte source (sommaire) */
function extractHeadings(source: string): PostHeading[] {
  const headings: PostHeading[] = [];
  let inCode = false;
  for (const line of source.split(/\r?\n/)) {
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match?.[1] || !match[2]) continue;
    const text = match[2].replace(/[*_`]/g, "");
    headings.push({ id: slugify(text), text, level: match[1].length === 2 ? 2 : 3 });
  }
  return headings;
}

const compilePost = cache(async (locale: Locale, file: string): Promise<Post> => {
  const source = readSource(locale, file);
  const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
    source,
    components: mdxComponents,
    options: { parseFrontmatter: true },
  });
  const meta = parseFrontmatter(frontmatter, `${locale}/${file}`);
  return {
    ...meta,
    lang: locale,
    translationKey: file.replace(/\.mdx$/, ""),
    content,
    headings: extractHeadings(source),
  };
});

/** Tous les articles d'une langue, du plus récent au plus ancien */
export const getAllPosts = cache(async (locale: Locale): Promise<PostMeta[]> => {
  const posts = await Promise.all(listFiles(locale).map((file) => compilePost(locale, file)));
  return posts
    .map(({ content: _content, headings: _headings, ...meta }) => meta)
    .sort((a, b) => b.date.localeCompare(a.date));
});

export async function getPostBySlug(locale: Locale, slug: string): Promise<Post | null> {
  for (const file of listFiles(locale)) {
    const post = await compilePost(locale, file);
    if (post.slug === slug) return post;
  }
  return null;
}

/** Version de l'article dans une autre langue (même nom de fichier) */
export async function getTranslation(translationKey: string, locale: Locale): Promise<PostMeta | null> {
  const posts = await getAllPosts(locale);
  return posts.find((p) => p.translationKey === translationKey) ?? null;
}

/** Articles liés : les plus récents hors article courant */
export async function getRelatedPosts(locale: Locale, translationKey: string, count = 2): Promise<PostMeta[]> {
  const posts = await getAllPosts(locale);
  return posts.filter((p) => p.translationKey !== translationKey).slice(0, count);
}
