import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { author } from '../../models';

export const PostAuthorResponseSchema = createSelectSchema(author).pick({});

export type PostAuthorResponse = z.infer<typeof PostAuthorResponseSchema>;
