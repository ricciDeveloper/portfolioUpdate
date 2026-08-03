import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://riccideveloper.vercel.app"),
  title: { default: "João Ricci | Fullstack Developer", template: "%s | João Ricci" },
  description: "Portfólio de João Ricci, desenvolvedor full stack.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><SiteHeader />{children}</body></html>;
}
