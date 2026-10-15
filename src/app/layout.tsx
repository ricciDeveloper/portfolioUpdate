import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { authorJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://riccideveloper.vercel.app"),
  title: { default: "João Ricci | Desenvolvedor Full Stack", template: "%s | João Ricci" },
  description: "Portfolio de João Ricci, desenvolvedor full stack.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/assets/images/favicon.ico", sizes: "48x48" },
      { url: "/assets/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/assets/images/apple-touch-icon.png",
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><JsonLd data={websiteJsonLd}/><JsonLd data={authorJsonLd}/><SiteHeader />{children}</body></html>;
}
