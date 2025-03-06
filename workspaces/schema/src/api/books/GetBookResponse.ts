import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author, book, episode, image } from '../../models';

export const GetBookResponseSchema = createSelectSchema(book)
  .pick({
    description: true,
    name: true,
  })
  .extend({
    author: createSelectSchema(author)
      .pick({
        id: true,
        name: true,
      })
      .extend({
        image: createSelectSchema(image).pick({
          id: true,
        }),
      }),
    episodes: createSelectSchema(episode)
      .pick({
        chapter: true,
        description: true,
        id: true,
        name: true,
      })
      .extend({
        image: createSelectSchema(image).pick({
          id: true,
        }),
      })
      .array(),
    image: createSelectSchema(image).pick({
      id: true,
    }),
  });

export type GetBookResponse = z.infer<typeof GetBookResponseSchema>;
