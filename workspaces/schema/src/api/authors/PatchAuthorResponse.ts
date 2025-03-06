import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author } from '../../models';

export const PatchAuthorResponseSchema = createSelectSchema(author).pick({});

export type PatchAuthorResponse = z.infer<typeof PatchAuthorResponseSchema>;
