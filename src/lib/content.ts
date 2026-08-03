export type TextBlock = {
  eyebrow?: string;
  title: string;
  body: string;
};

export const homeBlocks: TextBlock[] = [
  {
    eyebrow: "Olá, meu nome é",
    title: "João Ricci",
    body: "Sou desenvolvedor full stack e construo produtos digitais acessíveis, rápidos e centrados nas pessoas.",
  },
  {
    title: "Código com intenção.",
    body: "Transformo requisitos em interfaces claras e serviços confiáveis, com foco em organização, experiência de uso e evolução contínua.",
  },
];

export const productionProjects = [
  { name: "Trends Automation", url: "https://trends-automation.vercel.app/" },
  { name: "SJ Financial AI", url: "https://sjfinancial-ai.vercel.app/" },
  { name: "Frontend DePara", url: "https://frontend-depara-5l4h.vercel.app/" },
  { name: "To-Do List", url: "https://to-do-list-js25.vercel.app/" },
  { name: "Crochês da Cris", url: "https://crochesdacris.vercel.app/" },
  { name: "Gerador de Relatórios", url: "https://gerador-relatorios-canalverdepdf.vercel.app/" },
  { name: "Task Tracking", url: "https://task-tracking-rosy.vercel.app/" },
];
