import "server-only";

import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

let database: Database.Database | undefined;

function getDatabase() {
  if (database) return database;

  const directory = process.env.VERCEL ? tmpdir() : join(process.cwd(), "data");

  try {
    mkdirSync(directory, { recursive: true });
    database = new Database(join(directory, "portfolio.db"));
  } catch {
    const fallbackDir = tmpdir();
    mkdirSync(fallbackDir, { recursive: true });
    database = new Database(join(fallbackDir, "portfolio.db"));
  }

  database.pragma("journal_mode = WAL");
  database.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return database;
}

export function saveContact(contact: ContactInput) {
  const statement = getDatabase().prepare(
    "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
  );
  return statement.run(contact.name, contact.email, contact.message);
}

