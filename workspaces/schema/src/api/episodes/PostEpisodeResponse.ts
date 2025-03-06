import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episode } from '../../models';

export const PostEpisodeResponseSchema = createSelectSchema(episode).pick({
  id: true,
});

export type PostEpisodeResponse = z.infer<typeof PostEpisodeResponseSchema>;
