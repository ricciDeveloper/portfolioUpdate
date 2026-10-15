import type { Metadata } from "next";
import { getPageSeo } from "@/lib/database";
const origin = "https://riccideveloper.vercel.app";
export async function createPageMetadata(path: string, defaultTitle: string, defaultDescription: string, kind: "website" | "article" = "website"): Promise<Metadata> {
  const saved = await getPageSeo(path);
  const title = saved?.meta_title.trim() || defaultTitle;
  const description = saved?.meta_description.trim() || defaultDescription;
  const url = `${origin}${path}`;
  return {
    title: { absolute: title }, description,
    alternates: { canonical: path },
    openGraph: { title, description, url, type: kind, locale: "pt_BR", siteName: "João Ricci" },
    twitter: { card: "summary", title, description },
  };
}
export const siteOrigin = origin;
export const authorJsonLd = {
  "@context": "https://schema.org", "@type": "Person", "@id": `${origin}/#joao-ricci`,
  name: "João Ricci", url: origin, jobTitle: "Desenvolvedor Full Stack",
  sameAs: ["https://www.linkedin.com/in/joaoriccideveloper/", "https://github.com/riccideveloper"],
  knowsAbout: ["Desenvolvimento web", "Desenvolvimento full stack", "Produtos digitais"],
};
export const websiteJsonLd = {
  "@context": "https://schema.org", "@type": "WebSite", "@id": `${origin}/#website`,
  url: origin, name: "João Ricci | Desenvolvedor Full Stack", inLanguage: "pt-BR",
  publisher: { "@id": `${origin}/#joao-ricci` },
};
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  if (items.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(index < items.length - 1 ? { item: `${origin}${item.path}` } : {}),
    })),
  };
}
