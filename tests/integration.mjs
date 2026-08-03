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
  const home = await fetch(baseUrl);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /João Ricci/);

  const projects = await fetch(`${baseUrl}/projetos`);
  assert.equal(projects.status, 200);
  const projectsHtml = await projects.text();
  assert.match(projectsHtml, /Projetos em produção/);
  assert.match(projectsHtml, /Projetos em código/);

  const retiredRoute = await fetch(`${baseUrl}/producao`);
  assert.equal(retiredRoute.status, 404);

  const invalidContact = await fetch(`${baseUrl}/api/contatos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "a", email: "inválido", message: "curta" }) });
  assert.equal(invalidContact.status, 400);
  console.log("Integração: todas as verificações passaram.");
} finally {
  server.kill();
  await new Promise((resolve) => server.once("exit", resolve));
}
