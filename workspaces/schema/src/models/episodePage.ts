/* eslint-disable sort/object-properties */
import { randomUUID } from 'node:crypto';

import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const episodePage = sqliteTable(
  'episode_page',
  {
    // primary key
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),

    // columns
    page: integer('page').notNull(),

    // relations
    episodeId: text('episode_id').notNull(),
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
    pageIdx: index('episode_page_page_idx').on(table.page),
    episodeIdIdx: index('episode_page_episode_id_idx').on(table.episodeId),
  }),
);
