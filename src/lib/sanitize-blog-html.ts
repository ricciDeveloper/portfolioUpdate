import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "a", "address", "article", "aside", "b", "blockquote", "br", "caption", "code", "dd", "del", "details", "div", "dl", "dt", "em", "figcaption", "figure", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "i", "img", "kbd", "li", "main", "mark", "nav", "ol", "p", "pre", "s", "samp", "section", "small", "span", "strong", "sub", "summary", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "time", "tr", "u", "ul", "var",
];
const alignmentClasses = ["text-left", "text-center", "text-right", "text-justify"];
const allowedClasses: Record<string, string[]> = Object.fromEntries(
  ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "figure", "figcaption", "aside", "nav", "section"].map((tag) => [tag, alignmentClasses]),
);
const withSafeId = (tagName: string, attribs: Record<string, string>) => {
  const { id, ...rest } = attribs;
  return {
    tagName,
    attribs: id && /^[a-zA-Z][a-zA-Z0-9_.:-]{0,127}$/.test(id) ? { ...rest, id } : rest,
  };
};
function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}
export function sanitizeBlogHtml(input: string) {
  const source = /<[a-z][\s\S]*>/i.test(input)
    ? input
    : input.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
  return sanitizeHtml(source, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      section: ["id", "class"], aside: ["id", "class"], nav: ["id", "class", "aria-label"],
      header: ["id", "class"], footer: ["id", "class"], time: ["datetime"], article: ["id", "class"], main: ["id", "class"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
      p: ["id", "class"], div: ["id", "class"], h1: ["id", "class"], h2: ["id", "class"], h3: ["id", "class"], h4: ["id", "class"], h5: ["id", "class"], h6: ["id", "class"], blockquote: ["id", "class"], figure: ["id", "class"], figcaption: ["id", "class"],
    },
    allowedClasses,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs) => { const safe = { ...attribs }; if (safe.target === "_blank") safe.rel = "noopener noreferrer"; else { delete safe.target; delete safe.rel; } return { tagName: "a", attribs: safe }; },
      h1: (_tagName, attribs) => withSafeId("h2", attribs),
      h2: (_tagName, attribs) => withSafeId("h2", attribs),
      h3: (_tagName, attribs) => withSafeId("h3", attribs),
      h4: (_tagName, attribs) => withSafeId("h4", attribs),
      h5: (_tagName, attribs) => withSafeId("h5", attribs),
      h6: (_tagName, attribs) => withSafeId("h6", attribs),
      section: (_tagName, attribs) => withSafeId("section", attribs),
      aside: (_tagName, attribs) => withSafeId("aside", attribs),
      nav: (_tagName, attribs) => withSafeId("nav", attribs),
      header: (_tagName, attribs) => withSafeId("header", attribs),
      footer: (_tagName, attribs) => withSafeId("footer", attribs),
      article: (_tagName, attribs) => withSafeId("article", attribs),
      main: (_tagName, attribs) => withSafeId("main", attribs),
      p: (_tagName, attribs) => withSafeId("p", attribs),
      div: (_tagName, attribs) => withSafeId("div", attribs),
      blockquote: (_tagName, attribs) => withSafeId("blockquote", attribs),
      figure: (_tagName, attribs) => withSafeId("figure", attribs),
      figcaption: (_tagName, attribs) => withSafeId("figcaption", attribs),
    },
  });
}
