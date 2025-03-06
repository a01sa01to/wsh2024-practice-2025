import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { book } from '../../models';

export const PatchBookResponseSchema = createSelectSchema(book).pick({});

export type PatchBookResponse = z.infer<typeof PatchBookResponseSchema>;
