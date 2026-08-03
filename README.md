# Portfólio — João Ricci

Refatoração do portfólio para React, TypeScript e renderização no servidor com Next.js.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Arquitetura

- `src/app`: rotas, metadados e Server Components.
- `src/components`: componentes visuais reutilizáveis.
- `src/lib/content.ts`: blocos de texto renderizados no servidor.
- `src/app/api/contatos/route.ts`: endpoint que valida os dados do formulário.
- `src/lib/database.ts`: conexão SQLite e criação da tabela `contacts`.

No ambiente local, o banco é criado automaticamente em `data/portfolio.db`. Esse arquivo é ignorado pelo Git para não expor mensagens recebidas.

## Observação para deploy

SQLite depende de um filesystem persistente. A Vercel oferece funções sem estado e filesystem temporário/imutável; por isso, para produção, substitua apenas o adaptador em `src/lib/database.ts` por Turso, Neon, Supabase ou outro banco remoto compatível.
