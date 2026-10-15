import "server-only";
const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
type Row = Record<string, unknown>;
export type BlogPost = { id: string; title: string; slug: string; excerpt: string; content: string; status: "draft" | "published"; created_at: string; updated_at: string; published_at: string | null; meta_title?: string | null; meta_description?: string | null };
export type PageContent = { key: string; title: string; body: string; updated_at: string };
export type PageSeo = { path: string; meta_title: string; meta_description: string; updated_at: string };
type RequestOptions = { method?: string; body?: unknown; admin?: boolean; prefer?: string; revalidate?: number; tags?: string[] };
async function request<T>(table: string, query = "", options: RequestOptions = {}): Promise<T> {
  if (!baseUrl || !publicKey) throw new Error("Supabase não está configurado.");
  const key = options.admin ? (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY) : publicKey;
  if (!key) throw new Error("Configure SUPABASE_SECRET_KEY para habilitar o painel administrativo.");
  const cacheOptions = options.revalidate ? { next: { revalidate: options.revalidate, ...(options.tags ? { tags: options.tags } : {}) } } : { cache: "no-store" as const };
  const response = await fetch(`${baseUrl}/rest/v1/${table}${query}`, { method: options.method ?? "GET", headers: { apikey: key, ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}), "Content-Type": "application/json", ...(options.prefer ? { Prefer: options.prefer } : {}) }, ...(options.body ? { body: JSON.stringify(options.body) } : {}), ...cacheOptions });
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
export async function getPageSeos() { return request<PageSeo[]>("page_seo", "?select=*&order=path.asc", { admin: true }); }
export async function getPageSeo(path: string) { try { return (await request<PageSeo[]>("page_seo", `?select=*&path=eq.${encodeURIComponent(path)}&limit=1`, { admin: true }))[0] ?? null; } catch { return null; } }
export async function savePageSeo(seo: Pick<PageSeo, "path" | "meta_title" | "meta_description">) { return request("page_seo", "?on_conflict=path", { method: "POST", body: seo, admin: true, prefer: "resolution=merge-duplicates,return=representation" }); }
export type SitemapData = { posts: Array<Pick<BlogPost, "slug" | "updated_at" | "published_at">>; pages: Array<Pick<PageContent, "key" | "updated_at">>; seo: Array<Pick<PageSeo, "path" | "updated_at">> };
export async function getSitemapData(): Promise<SitemapData> {
  const [posts, pages, seo] = await Promise.all([
    request<SitemapData["posts"]>("blog_posts", "?select=slug,updated_at,published_at&status=eq.published&order=updated_at.desc", { revalidate: 3600, tags: ["sitemap-content"] }),
    request<SitemapData["pages"]>("page_content", "?select=key,updated_at", { admin: true, revalidate: 3600, tags: ["sitemap-content"] }).catch(() => []),
    request<SitemapData["seo"]>("page_seo", "?select=path,updated_at", { admin: true, revalidate: 3600, tags: ["sitemap-content"] }).catch(() => []),
  ]);
  return { posts, pages, seo };
}
