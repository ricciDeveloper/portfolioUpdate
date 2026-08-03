import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://riccideveloper.vercel.app";
  return ["", "/projetos", "/contato"].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));
}
