import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { book } from '../../models';

export const PostBookResponseSchema = createSelectSchema(book).pick({});

export type PostBookResponse = z.infer<typeof PostBookResponseSchema>;
