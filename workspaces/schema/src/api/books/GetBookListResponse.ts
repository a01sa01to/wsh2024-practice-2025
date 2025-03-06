import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { book, image } from '../../models';

export const GetBookListResponseSchema = createSelectSchema(book)
  .pick({
    description: true,
    id: true,
    name: true,
    nameRuby: true,
  })
  .extend({
    image: createSelectSchema(image).pick({
      id: true,
    }),
  })
  .array();

export type GetBookListResponse = z.infer<typeof GetBookListResponseSchema>;
