import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPost } from "@/lib/database";
import { siteOrigin, authorJsonLd } from "@/lib/seo";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
 const { slug } = await params; const post = await getPost(slug); if (!post) return { title: "Artigo não encontrado" };
 const title = post.meta_title?.trim() || post.title; const description = post.meta_description?.trim() || post.excerpt; const canonical = `/blog/${encodeURIComponent(post.slug)}`;
 return { title: { absolute: title }, description, alternates: { canonical }, openGraph: { title, description, url: `${siteOrigin}${canonical}`, type: "article", locale: "pt_BR", siteName: "João Ricci", ...(post.published_at ? { publishedTime: post.published_at } : {}), ...(post.updated_at ? { modifiedTime: post.updated_at } : {}) }, twitter: { card: "summary", title, description } };
}
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params; let post; try { post = await getPost(slug); } catch { notFound(); } if (!post) notFound();
 const description = post.meta_description?.trim() || post.excerpt;
 const structured = { "@context":"https://schema.org", "@type":"BlogPosting", headline:post.title, description, url:`${siteOrigin}/blog/${encodeURIComponent(post.slug)}`, mainEntityOfPage:{"@type":"WebPage","@id":`${siteOrigin}/blog/${encodeURIComponent(post.slug)}`}, author:{"@id":authorJsonLd["@id"]}, publisher:{"@id":authorJsonLd["@id"]}, inLanguage:"pt-BR", ...(post.published_at?{datePublished:post.published_at}:{}), ...(post.updated_at?{dateModified:post.updated_at}:{}) };
 return <><JsonLd data={structured}/><Breadcrumbs items={[{name:"Início",path:"/"},{name:"Blog",path:"/blog"},{name:post.title,path:`/blog/${encodeURIComponent(post.slug)}`}]}/><main className="container page-section article"><p className="eyebrow">Blog</p><h1>{post.title}</h1><p className="page-intro">{post.excerpt}</p><article className="blog-content" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }} /></main></>;
}
