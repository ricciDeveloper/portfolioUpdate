import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";

type BreadcrumbItem = { name: string; path: string };
type BreadcrumbsProps = { items: BreadcrumbItem[]; structuredData?: boolean };

export function Breadcrumbs({ items, structuredData = true }: BreadcrumbsProps) {
  if (!items.length) return null;
  const currentIndex = items.length - 1;
  return <>
    {structuredData && items.length >= 2 ? <JsonLd data={breadcrumbJsonLd(items)} /> : null}
    <div className="container breadcrumb-wrap">
      <nav className="breadcrumb-nav" aria-label="Navegação estrutural">
        <ol className="breadcrumbs">
          {items.map((item, index) => <li key={`${item.path}-${index}`}>
            {index === currentIndex
              ? <span aria-current="page">{item.name}</span>
              : <a href={item.path}>{item.name}</a>}
          </li>)}
        </ol>
      </nav>
    </div>
  </>;
}
