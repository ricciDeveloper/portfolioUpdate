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

## Supabase e painel administrativo

1. No SQL Editor do projeto Supabase, execute `supabase/schema.sql`. Isso cria `contacts`, `blog_posts` e `page_content`, habilita RLS e inclui um artigo inicial.
2. Copie `.env.example` para `.env.local` e configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Configure `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` e `ADMIN_SESSION_SECRET` somente no ambiente do servidor (Vercel/local). Nunca exponha a chave service role no navegador.
4. Abra `/admin` para editar os textos das páginas, criar/editar/publicar posts e consultar mensagens enviadas pelo formulário de contato.

A chave publishable pode ficar no cliente por definição; as políticas RLS limitam visitantes à inserção de contatos e leitura de posts publicados. O painel usa a service role apenas em rotas de servidor protegidas por senha.
