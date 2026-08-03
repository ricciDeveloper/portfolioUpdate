import { saveContact } from "@/lib/database";

export const runtime = "nodejs";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const name = text(payload?.name);
  const email = text(payload?.email);
  const message = text(payload?.message);

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
    return Response.json({ message: "Revise os campos e tente novamente." }, { status: 400 });
  }
  if (name.length > 120 || email.length > 254 || message.length > 5000) {
    return Response.json({ message: "A mensagem excede o tamanho permitido." }, { status: 400 });
  }

  saveContact({ name, email, message });
  return Response.json({ message: "Mensagem enviada. Obrigado pelo contato!" }, { status: 201 });
}
