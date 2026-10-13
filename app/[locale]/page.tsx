import { resolveLocale } from "@/lib/locale";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  await resolveLocale(params);
  return <div className="container-site py-40">NLIGHT</div>;
}
