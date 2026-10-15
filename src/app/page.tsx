import Link from "next/link";
import { TextBlock } from "@/components/text-block";
import { homeBlocks } from "@/lib/content";
import { HeroBackground } from "@/components/hero-background";
import { getPageContent } from "@/lib/database";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  const [first, second] = await Promise.all([getPageContent("home-intro"), getPageContent("home-second")]);
  const blocks = [{ ...homeBlocks[0], title: first?.title ?? homeBlocks[0].title, body: first?.body ?? homeBlocks[0].body }, { ...homeBlocks[1], title: second?.title ?? homeBlocks[1].title, body: second?.body ?? homeBlocks[1].body }];
  return <main className="home-main"><HeroBackground /><section className="container hero"><div>{blocks.map((block,index)=><TextBlock key={block.title} {...block} priority={index===0}/>)}</div><div className="actions"><Link className="button primary" href="/projetos">Ver projetos</Link><Link className="button secondary" href="/contato">Entrar em contato</Link></div></section></main>;
}
