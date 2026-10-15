import type { MetadataRoute } from "next";
import { getSitemapData } from "@/lib/database";
export const revalidate = 86400;
const baseUrl = "https://riccideveloper.vercel.app";
function validDate(value: string | null | undefined): Date | undefined { if (!value) return undefined; const date = new Date(value); return Number.isNaN(date.getTime()) ? undefined : date; }
function newest(...values: Array<string | null | undefined>) { return values.map(validDate).filter((date): date is Date => Boolean(date)).sort((a,b)=>b.getTime()-a.getTime())[0]; }
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 let data = { posts: [], pages: [], seo: [] } as Awaited<ReturnType<typeof getSitemapData>>;
 try { data = await getSitemapData(); } catch { /* Keep the static sitemap available when the database is unavailable. */ }
 const routeDate=(path:string,...keys:string[])=>newest(...data.pages.filter(page=>keys.includes(page.key)).map(page=>page.updated_at),...data.seo.filter(entry=>entry.path===path).map(entry=>entry.updated_at));
 const latestPost=newest(...data.posts.flatMap(post=>[post.updated_at,post.published_at]),routeDate("/blog")?.toISOString());
 const entries:MetadataRoute.Sitemap=[
  {url:`${baseUrl}/`,lastModified:routeDate("/","home-intro","home-second")},
  {url:`${baseUrl}/projetos`,lastModified:routeDate("/projetos","projects-intro")},
  {url:`${baseUrl}/contato`,lastModified:routeDate("/contato","contact-intro")},
  {url:`${baseUrl}/blog`,lastModified:latestPost},
  ...data.posts.map(post=>({url:`${baseUrl}/blog/${encodeURIComponent(post.slug)}`,lastModified:newest(post.updated_at,post.published_at)})),
 ];
 return entries.map(entry=>entry.lastModified?entry:{...entry,lastModified:undefined});
}
