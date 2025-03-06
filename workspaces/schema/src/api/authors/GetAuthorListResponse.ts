import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, image } from '../../models';

export const GetAuthorListResponseSchema = createSelectSchema(author)
  .pick({
    description: true,
    id: true,
    name: true,
  })
  .extend({
    books: createSelectSchema(book)
      .pick({
        id: true,
        name: true,
      })
      .array(),
    image: createSelectSchema(image).pick({
      id: true,
    }),
  })
  .array();

export type GetAuthorListResponse = z.infer<typeof GetAuthorListResponseSchema>;
