import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/database";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = await getPost(slug); return { title: post?.title ?? "Artigo", description: post?.excerpt }; }
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; let post; try { post = await getPost(slug); } catch { notFound(); } if (!post) notFound(); return <main className="container page-section article"><p className="eyebrow">Blog</p><h1>{post.title}</h1><p className="page-intro">{post.excerpt}</p><article>{post.content.split(/\n{2,}/).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</article></main>; }
