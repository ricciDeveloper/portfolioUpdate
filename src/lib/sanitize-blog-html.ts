import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "a", "address", "article", "b", "blockquote", "br", "caption", "code", "dd", "del", "details", "div", "dl", "dt", "em", "figcaption", "figure", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "img", "kbd", "li", "mark", "ol", "p", "pre", "s", "samp", "small", "span", "strong", "sub", "summary", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "u", "ul", "var",
];
const alignmentClasses = ["text-left", "text-center", "text-right", "text-justify"];
const allowedClasses: Record<string, string[]> = Object.fromEntries(
  ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "figure", "figcaption"].map((tag) => [tag, alignmentClasses]),
);
function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
export function sanitizeBlogHtml(input: string) {
  const source = /<[a-z][\s\S]*>/i.test(input)
    ? input
    : input.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
  return sanitizeHtml(source, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "width", "height"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan", "scope"],
      p: ["class"], div: ["class"], h1: ["class"], h2: ["class"], h3: ["class"], h4: ["class"], h5: ["class"], h6: ["class"], blockquote: ["class"], figure: ["class"], figcaption: ["class"],
    },
    allowedClasses,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: { h1: "h2" },
  });
}
