import "server-only";

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type Row = Record<string, unknown>;
export type BlogPost = { id: string; title: string; slug: string; excerpt: string; content: string; status: "draft" | "published"; created_at: string; published_at: string | null };
export type PageContent = { key: string; title: string; body: string; updated_at: string };

async function request<T>(table: string, query = "", options: { method?: string; body?: unknown; admin?: boolean; prefer?: string } = {}): Promise<T> {
  if (!baseUrl || !publicKey) throw new Error("Supabase não está configurado.");
  const key = options.admin ? (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY) : publicKey;
  if (!key) throw new Error("Configure SUPABASE_SECRET_KEY para habilitar o painel administrativo.");
  const response = await fetch(`${baseUrl}/rest/v1/${table}${query}`, { method: options.method ?? "GET", headers: { apikey: key, ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}), "Content-Type": "application/json", ...(options.prefer ? { Prefer: options.prefer } : {}) }, ...(options.body ? { body: JSON.stringify(options.body) } : {}), cache: "no-store" });
  if (!response.ok) throw new Error(`Supabase retornou ${response.status}: ${await response.text()}`);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export async function saveContact(contact: { name: string; email: string; message: string }) { return request("contacts", "", { method: "POST", body: contact, prefer: "return=minimal" }); }
export async function getPosts(publishedOnly = true) { return request<BlogPost[]>("blog_posts", `?select=*&${publishedOnly ? "status=eq.published&" : ""}order=created_at.desc`, { admin: !publishedOnly }); }
export async function getPost(slug: string) { const rows = await request<BlogPost[]>("blog_posts", `?select=*&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`); return rows[0] ?? null; }
export async function savePost(post: Partial<BlogPost> & Pick<BlogPost, "title" | "slug" | "excerpt" | "content" | "status">) { const { id, ...values } = post; const body = { ...values, ...(post.status === "published" && !post.published_at ? { published_at: new Date().toISOString() } : {}) }; return request("blog_posts", "?on_conflict=slug", { method: "POST", body: id ? { ...body, id } : body, admin: true, prefer: "resolution=merge-duplicates,return=representation" }); }
export async function deletePost(id: string) { return request("blog_posts", `?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", admin: true, prefer: "return=minimal" }); }
export async function getPageContents() { return request<PageContent[]>("page_content", "?select=*&order=key.asc", { admin: true }); }
export async function savePageContent(content: Pick<PageContent, "key" | "title" | "body">) { return request("page_content", "?on_conflict=key", { method: "POST", body: content, admin: true, prefer: "resolution=merge-duplicates,return=representation" }); }
export async function getContacts() { return request<Row[]>("contacts", "?select=*&order=created_at.desc", { admin: true }); }
export async function getPageContent(key: string) { try { return (await request<PageContent[]>("page_content", `?select=*&key=eq.${encodeURIComponent(key)}&limit=1`, { admin: true }))[0] ?? null; } catch { return null; } }

