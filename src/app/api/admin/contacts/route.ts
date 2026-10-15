import { isAdmin } from "@/lib/admin-auth";
import { getContacts } from "@/lib/database";
export async function GET() { if (!await isAdmin()) return Response.json({ message: "Não autorizado." }, { status: 401 }); try { return Response.json(await getContacts()); } catch (e) { return Response.json({ message: e instanceof Error ? e.message : "Erro." }, { status: 503 }); } }
