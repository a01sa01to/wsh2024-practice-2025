import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episodePage } from '../../models';

export const PatchEpisodePageResponseSchema = createSelectSchema(episodePage).pick({});

export type PatchEpisodePageResponse = z.infer<typeof PatchEpisodePageResponseSchema>;
