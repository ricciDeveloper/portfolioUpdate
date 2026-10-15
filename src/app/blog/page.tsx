import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, type BlogPost } from "@/lib/database";
export const metadata: Metadata = { title: "Blog", description: "Artigos sobre desenvolvimento e produtos digitais." };
export default async function BlogPage() { let posts: BlogPost[] = []; try { posts = await getPosts(); } catch { /* A página permanece disponível enquanto o Supabase é configurado. */ }
return <main className="container page-section"><p className="eyebrow">Ideias e experiências</p><h1>Blog</h1><p className="page-intro">Conteúdo prático sobre desenvolvimento, tecnologia e construção de produtos digitais.</p>{posts.length ? <ul className="card-grid">{posts.map(p => <li className="card" key={p.id}><p className="tag">Desenvolvimento</p><h2>{p.title}</h2><p>{p.excerpt}</p><time>{p.published_at ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(p.published_at)) : ""}</time><Link href={`/blog/${p.slug}`}>Ler artigo →</Link></li>)}</ul> : <p className="empty-state">Em breve, novos artigos por aqui.</p>}</main>; }

