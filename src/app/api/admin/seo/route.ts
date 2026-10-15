import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getPageSeos, savePageSeo } from "@/lib/database";
const allowedPaths = new Set(["/", "/projetos", "/contato", "/blog"]);
export async function GET() {
  if (!await isAdmin()) return Response.json({ message: "Não autorizado." }, { status: 401 });
  try { return Response.json(await getPageSeos()); }
  catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Erro." }, { status: 503 }); }
}
export async function POST(request: Request) {
  if (!await isAdmin()) return Response.json({ message: "Não autorizado." }, { status: 401 });
  const data = await request.json().catch(() => null);
  if (!data || typeof data.path !== "string" || !allowedPaths.has(data.path) || typeof data.meta_title !== "string" || !data.meta_title.trim() || data.meta_title.length > 180 || typeof data.meta_description !== "string" || !data.meta_description.trim() || data.meta_description.length > 320) return Response.json({ message: "Informe uma página válida, título (até 180 caracteres) e descrição (até 320 caracteres)." }, { status: 400 });
  try {
    const saved = await savePageSeo({ path: data.path, meta_title: data.meta_title.trim(), meta_description: data.meta_description.trim() });
    revalidateTag("sitemap-content");
    revalidatePath("/sitemap.xml");
    return Response.json(saved);
  } catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Erro." }, { status: 503 }); }
}
