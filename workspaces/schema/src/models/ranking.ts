/* eslint-disable sort/object-properties */
import { randomUUID } from 'node:crypto';

import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const ranking = sqliteTable(
  'ranking',
  {
    // primary key
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    // columns
    rank: integer('rank').notNull(),

    // relations
    bookId: text('book_id').notNull(),

    // metadata
    createdAt: text('created_at')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    rankIdx: index('ranking_rank_idx').on(table.rank),
    bookIdIdx: index('ranking_book_id_idx').on(table.bookId),
  }),
);
