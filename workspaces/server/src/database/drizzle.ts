import Database from 'better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from '@wsh-2024/schema/src/models';

import { DATABASE_PATH } from '../constants/paths';

let sqlite: Database.Database | null = null;
let database: BetterSQLite3Database<typeof schema> | null = null;

export function initializeDatabase() {
  if (sqlite != null) {
    sqlite.close();
    sqlite = null;
    database = null;
  }

  sqlite = new Database(DATABASE_PATH, {
    readonly: false,
  });

  // index
  sqlite.exec('CREATE INDEX IF NOT EXISTS author_created_at_idx ON author (created_at);');
  sqlite.exec('CREATE INDEX IF NOT EXISTS book_created_at_idx ON book (created_at);');
  sqlite.exec('CREATE INDEX IF NOT EXISTS episode_chapter_idx ON episode (chapter);');
  sqlite.exec('CREATE INDEX IF NOT EXISTS episode_page_page_idx ON episode_page (page);');
  sqlite.exec('CREATE INDEX IF NOT EXISTS feature_created_at_idx ON feature (created_at);');
  sqlite.exec('CREATE INDEX IF NOT EXISTS ranking_rank_idx ON ranking (rank);');

  database = drizzle(sqlite, { schema });
}

export function getDatabase() {
  if (sqlite == null || database == null) {
    throw new Error('Database is not initialized');
  }

  return database;
}
