import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { deletePost, getPosts, savePost } from "@/lib/database";
import { sanitizeBlogHtml } from "@/lib/sanitize-blog-html";
export const runtime = "nodejs";
function refreshSitemap() { revalidateTag("sitemap-content"); revalidatePath("/sitemap.xml"); }
export async function GET() {
  if (!await isAdmin()) return Response.json({ message: "Não autorizado." }, { status: 401 });
  try { return Response.json(await getPosts(false)); }
  catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Erro." }, { status: 503 }); }
}
export async function POST(request: Request) {
  if (!await isAdmin()) return Response.json({ message: "Não autorizado." }, { status: 401 });
  const data = await request.json().catch(() => null);
  if (!data || !["title", "slug", "excerpt", "content"].every((key) => typeof data[key] === "string" && data[key].trim()) || !["draft", "published"].includes(data.status)) return Response.json({ message: "Preencha título, slug, resumo, conteúdo e status." }, { status: 400 });
  if (data.content.length > 300000) return Response.json({ message: "O conteúdo HTML deve ter até 300 mil caracteres." }, { status: 400 });
  const metaTitle = data.meta_title ?? "";
  const metaDescription = data.meta_description ?? "";
  if (typeof metaTitle !== "string" || metaTitle.length > 180 || typeof metaDescription !== "string" || metaDescription.length > 320) return Response.json({ message: "Meta title deve ter até 180 caracteres e meta description até 320." }, { status: 400 });
  try {
    const result = await savePost({ ...data, content: sanitizeBlogHtml(data.content), meta_title: metaTitle.trim() || null, meta_description: metaDescription.trim() || null, title: data.title.trim(), slug: data.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") });
    refreshSitemap();
    return Response.json(result, { status: 201 });
  } catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Erro." }, { status: 503 }); }
}
export async function DELETE(request: Request) {
  if (!await isAdmin()) return Response.json({ message: "Não autorizado." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ message: "ID ausente." }, { status: 400 });
  try { await deletePost(id); refreshSitemap(); return Response.json({ message: "Post removido." }); }
  catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Erro." }, { status: 503 }); }
}
