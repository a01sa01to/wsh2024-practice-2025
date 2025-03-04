/* eslint-disable sort/object-properties */
import { randomUUID } from 'node:crypto';

import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const author = sqliteTable(
  'author',
  {
    // primary key
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    // columns
    name: text('name').notNull(),
    description: text('description').notNull(),

    // relations
    imageId: text('image_id').notNull(),

    // metadata
    createdAt: text('created_at')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    createdAtIdx: index('author_created_at_idx').on(table.createdAt),
  }),
);
