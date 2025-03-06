import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episode, episodePage, image } from '../../models';

export const GetEpisodeListResponseSchema = createSelectSchema(episode)
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
    pages: createSelectSchema(episodePage)
      .pick({})
      .extend({
        image: createSelectSchema(image).pick({
          id: true,
        }),
      })
      .array(),
  })
  .array();

export type GetEpisodeListResponse = z.infer<typeof GetEpisodeListResponseSchema>;
