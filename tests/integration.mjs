import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const port = 3210;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [resolve("node_modules/next/dist/bin/next"), "start", "-p", String(port)], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: "ignore",
});

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch { /* server is still starting */ }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("O servidor de produção não iniciou a tempo.");
}

try {
  await waitForServer();

  // 1. Verify Home Page serves Next.js React app
  const home = await fetch(baseUrl);
  assert.equal(home.status, 200);
  const homeHtml = await home.text();
  assert.match(homeHtml, /João Ricci/);
  assert.match(homeHtml, /__NEXT_DATA__|self\.__next_f/); // Next.js React hydration payload

  // 2. Verify Projects Page
  const projects = await fetch(`${baseUrl}/projetos`);
  assert.equal(projects.status, 200);
  const projectsHtml = await projects.text();
  assert.match(projectsHtml, /Projetos em produção/);
  assert.match(projectsHtml, /Projetos em código/);

  // 3. Verify Contact Page
  const contact = await fetch(`${baseUrl}/contato`);
  assert.equal(contact.status, 200);
  assert.match(await contact.text(), /Vamos conversar\?/);

  // 4. Verify Dynamic SEO Metadata Routes
  const robots = await fetch(`${baseUrl}/robots.txt`);
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /User-[aA]gent:\s*\*/i);

  const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /<urlset/);

  // 5. Verify Legacy routes are cleanly 404
  const retiredRoute = await fetch(`${baseUrl}/producao`);
  assert.equal(retiredRoute.status, 404);

  const legacyPagesRoute = await fetch(`${baseUrl}/pages/projetos`);
  assert.equal(legacyPagesRoute.status, 404);

  // 6. Verify Contact API validation and successful submission
  const invalidContact = await fetch(`${baseUrl}/api/contatos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "a", email: "inválido", message: "curta" }),
  });
  assert.equal(invalidContact.status, 400);

  const validContact = await fetch(`${baseUrl}/api/contatos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Teste Integração",
      email: "teste@example.com",
      message: "Esta é uma mensagem de teste para validação da API de contato.",
    }),
  });
  assert.equal(validContact.status, 201);

  console.log("Integração: todas as verificações passaram com sucesso!");
} finally {
  server.kill();
  await new Promise((resolve) => server.once("exit", resolve));
}

