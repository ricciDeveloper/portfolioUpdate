import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization") ?? "";
  const expected = secret ? `Bearer ${secret}` : "";
  const actualBytes = Buffer.from(authorization);
  const expectedBytes = Buffer.from(expected);
  if (!secret || actualBytes.length !== expectedBytes.length || !timingSafeEqual(actualBytes, expectedBytes)) {
    return Response.json({ message: "Não autorizado." }, { status: secret ? 401 : 503 });
  }
  revalidateTag("sitemap-content");
  revalidatePath("/sitemap.xml");
  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
