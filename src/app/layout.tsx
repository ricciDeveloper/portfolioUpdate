import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { authorJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://riccideveloper.vercel.app"),
  title: { default: "João Ricci | Desenvolvedor Full Stack", template: "%s | João Ricci" },
  description: "Portfolio de João Ricci, desenvolvedor full stack.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><JsonLd data={websiteJsonLd}/><JsonLd data={authorJsonLd}/><SiteHeader />{children}</body></html>;
}
