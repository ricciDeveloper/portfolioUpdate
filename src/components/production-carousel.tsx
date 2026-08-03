"use client";

import { useRef } from "react";
import type { productionProjects } from "@/lib/content";

type ProductionCarouselProps = { projects: typeof productionProjects };

export function ProductionCarousel({ projects }: ProductionCarouselProps) {
  const track = useRef<HTMLUListElement>(null);
  const move = (direction: "previous" | "next") => track.current?.scrollBy({ left: direction === "next" ? 290 : -290, behavior: "smooth" });

  return <div className="carousel" aria-label="Projetos em produção">
    <div className="carousel-controls"><button type="button" onClick={() => move("previous")} aria-label="Ver projetos anteriores">←</button><button type="button" onClick={() => move("next")} aria-label="Ver próximos projetos">→</button></div>
    <ul className="production-carousel" ref={track}>{projects.map((project) => <li key={project.url}><a href={project.url} target="_blank" rel="noreferrer" aria-label={`Visitar ${project.name}`}><span className="project-icon" aria-hidden>{project.name.slice(0, 1)}</span><span>{project.name}</span><span className="visit-label">Visitar ↗</span></a></li>)}</ul>
  </div>;
}
