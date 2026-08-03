import Link from "next/link";
import { TextBlock } from "@/components/text-block";
import { homeBlocks } from "@/lib/content";
import { HeroBackground } from "@/components/hero-background";

export default function HomePage() {
  return (
    <main className="home-main">
      <HeroBackground />
      <section className="container hero">
        <div>{homeBlocks.map((block, index) => <TextBlock key={block.title} {...block} priority={index === 0} />)}</div>
        <div className="actions"><Link className="button primary" href="/projetos">Ver projetos</Link><Link className="button secondary" href="/contato">Entrar em contato</Link></div>
      </section>
    </main>
  );
}
