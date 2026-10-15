import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin-panel";
export const metadata: Metadata = { title: "Administração" };
export default function AdminPage() { return <main className="container page-section"><p className="eyebrow">Área restrita</p><h1>Painel administrativo</h1><p className="page-intro">Gerencie os artigos do blog. As alterações são salvas no Supabase.</p><AdminPanel /></main>; }
