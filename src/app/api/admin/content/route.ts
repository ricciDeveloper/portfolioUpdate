import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getPageContents, savePageContent } from "@/lib/database";
export async function GET() {
  if (!await isAdmin()) return Response.json({ message: "Não autorizado." }, { status: 401 });
  try { return Response.json(await getPageContents()); }
  catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Erro." }, { status: 503 }); }
}
export async function POST(request: Request) {
  if (!await isAdmin()) return Response.json({ message: "Não autorizado." }, { status: 401 });
  const data = await request.json().catch(() => null);
  if (!data || !["key", "title", "body"].every((key) => typeof data[key] === "string" && data[key].trim())) return Response.json({ message: "Preencha todos os campos." }, { status: 400 });
  try {
    const result = await savePageContent(data);
    revalidateTag("sitemap-content");
    revalidatePath("/sitemap.xml");
    return Response.json(result);
  } catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Erro." }, { status: 503 }); }
}
