import type { TextBlock as TextBlockData } from "@/lib/content";

type TextBlockProps = TextBlockData & { priority?: boolean };

// Server Component: its text is included in the initial HTML response.
export function TextBlock({ eyebrow, title, body, priority = false }: TextBlockProps) {
  const Heading = priority ? "h1" : "h2";

  return (
    <article className="text-block">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Heading>{title}</Heading>
      <p>{body}</p>
    </article>
  );
}
