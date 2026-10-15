import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ContactForm } from "@/components/contact-form";
import { getPageContent } from "@/lib/database";
import { breadcrumbJsonLd, siteOrigin } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> { return createPageMetadata("/contato", "Contato | João Ricci", "Entre em contato com João Ricci para conversar sobre projetos e oportunidades."); }
export default async function ContactPage() {
 const content = await getPageContent("contact-intro");
 const structured = { "@context":"https://schema.org", "@type":"ContactPage", name:content?.title??"Contato", description:content?.body??"Entre em contato com João Ricci.", url:`${siteOrigin}/contato`, mainEntity:{"@id":`${siteOrigin}/#joao-ricci`} };
 return <><JsonLd data={structured}/><JsonLd data={breadcrumbJsonLd([{name:"Início",path:"/"},{name:"Contato",path:"/contato"}])}/><main className="container page-section contact-layout"><div><p className="eyebrow">Contato</p><h1>{content?.title ?? "Vamos conversar?"}</h1><p className="page-intro">{content?.body ?? "Envie uma mensagem para falar sobre uma oportunidade, projeto ou ideia."}</p><div className="social-links"><a href="https://www.linkedin.com/in/joaoriccideveloper/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/riccideveloper" target="_blank" rel="noreferrer">GitHub ↗</a></div></div><ContactForm /></main></>;
}
