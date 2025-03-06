import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { episode } from '../../models';

export const PatchEpisodeResponseSchema = createSelectSchema(episode).pick({});

export type PatchEpisodeResponse = z.infer<typeof PatchEpisodeResponseSchema>;
