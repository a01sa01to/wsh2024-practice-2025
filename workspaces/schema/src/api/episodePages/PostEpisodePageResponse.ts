import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episodePage } from '../../models';

export const PostEpisodePageResponseSchema = createSelectSchema(episodePage).pick({});

export type PostEpisodePageResponse = z.infer<typeof PostEpisodePageResponseSchema>;
