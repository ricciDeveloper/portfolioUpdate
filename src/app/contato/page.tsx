import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { getPageContent } from "@/lib/database";
export const metadata: Metadata = { title: "Contato" };
export const dynamic = "force-dynamic";
export default async function ContactPage() {
 const content = await getPageContent("contact-intro");
 return <main className="container page-section contact-layout"><div><p className="eyebrow">Contato</p><h1>{content?.title ?? "Vamos conversar?"}</h1><p className="page-intro">{content?.body ?? "Envie uma mensagem para falar sobre uma oportunidade, projeto ou ideia."}</p><div className="social-links"><a href="https://www.linkedin.com/in/joaoriccideveloper/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/riccideveloper" target="_blank" rel="noreferrer">GitHub ↗</a></div></div><ContactForm /></main>;
}
