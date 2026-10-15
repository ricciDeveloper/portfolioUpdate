import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { getPosts, type BlogPost } from "@/lib/database";
import { breadcrumbJsonLd, siteOrigin, authorJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/seo";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> { return createPageMetadata("/blog", "Blog | João Ricci", "Artigos sobre desenvolvimento, tecnologia e produtos digitais."); }
export default async function BlogPage() {
 let posts: BlogPost[] = []; try { posts = await getPosts(); } catch { /* Mantém a página renderizável durante uma indisponibilidade do banco. */ }
 const structured = { "@context":"https://schema.org", "@type":"Blog", name:"Blog de João Ricci", url:`${siteOrigin}/blog`, inLanguage:"pt-BR", author:{"@id":authorJsonLd["@id"]}, blogPost:posts.map(post=>({"@type":"BlogPosting",headline:post.title,description:post.meta_description||post.excerpt,url:`${siteOrigin}/blog/${encodeURIComponent(post.slug)}`,...(post.published_at?{datePublished:post.published_at}:{}),...(post.updated_at?{dateModified:post.updated_at}:{})})) };
 return <><JsonLd data={structured}/><JsonLd data={breadcrumbJsonLd([{name:"Início",path:"/"},{name:"Blog",path:"/blog"}])}/><main className="container page-section"><p className="eyebrow">Ideias e experiências</p><h1>Blog</h1><p className="page-intro">Conteúdo prático sobre desenvolvimento, tecnologia e construção de produtos digitais.</p>{posts.length?<ul className="card-grid">{posts.map(post=><li className="card" key={post.id}><p className="tag">Desenvolvimento</p><h2>{post.title}</h2><p>{post.excerpt}</p><time>{post.published_at?new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium"}).format(new Date(post.published_at)):""}</time><Link href={`/blog/${post.slug}`}>Ler artigo →</Link></li>)}</ul>:<p className="empty-state">Em breve, novos artigos por aqui.</p>}</main></>;
}

