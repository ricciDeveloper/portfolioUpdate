import type { Metadata } from "next";
import { ProductionCarousel } from "@/components/production-carousel";
import { productionProjects } from "@/lib/content";

type GithubRepository = { id: number; name: string; description: string | null; html_url: string; language: string | null; updated_at: string; fork: boolean };

export const metadata: Metadata = { title: "Projetos", description: "Projetos em produção e repositórios públicos de João Ricci." };

async function getRepositories(): Promise<GithubRepository[]> {
  const response = await fetch("https://api.github.com/users/riccideveloper/repos?sort=updated&per_page=100", { next: { revalidate: 3600 } });
  if (!response.ok) return [];
  return (await response.json() as GithubRepository[]).filter((repository) => !repository.fork);
}

export default async function ProjectsPage() {
  const repositories = await getRepositories();
  return <main className="container page-section">
    <p className="eyebrow">Portfólio</p>
    <h1>Projetos</h1>
    <p className="page-intro">Uma seleção de produtos publicados e projetos em código que mostram como transformo ideias em experiências digitais.</p>
    <section className="projects-section" aria-labelledby="production-title">
      <h2 id="production-title">Projetos em produção</h2>
      <p>Produtos que estão no ar e podem ser explorados agora.</p>
      <ProductionCarousel projects={productionProjects} />
    </section>
    <section className="projects-section" aria-labelledby="code-title">
      <h2 id="code-title">Projetos em código</h2>
      <p>Repositórios públicos, atualizados no servidor a cada hora.</p>
      {repositories.length ? <ul className="card-grid">{repositories.map((repository) => <li className="card" key={repository.id}><p className="tag">{repository.language ?? "Código aberto"}</p><h3>{repository.name}</h3><p>{repository.description ?? "Sem descrição disponível."}</p><time dateTime={repository.updated_at}>Atualizado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(repository.updated_at))}</time><a href={repository.html_url} target="_blank" rel="noreferrer">Ver no GitHub <span aria-hidden>↗</span></a></li>)}</ul> : <p className="empty-state">Não foi possível carregar os projetos agora. Tente novamente em breve.</p>}
    </section>
  </main>;
}
