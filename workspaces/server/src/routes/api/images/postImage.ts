import fs from 'node:fs/promises';
import path from 'node:path';

import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import sharp from 'sharp';

import { encrypt } from '@wsh-2024/image-encrypt/src/encdec';
import { PostImageRequestBodySchema } from '@wsh-2024/schema/src/api/images/PostImageRequestBody';
import { PostImageResponseSchema } from '@wsh-2024/schema/src/api/images/PostImageResponse';

import { IMAGES_PATH, IMG_STATIC_PATH } from '../../../constants/paths';
import { authMiddleware } from '../../../middlewares/authMiddleware';
import { imageRepository } from '../../../repositories';

const app = new OpenAPIHono();

const route = createRoute({
  method: 'post',
  path: '/api/v1/images',
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: PostImageRequestBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: PostImageResponseSchema,
        },
      },
      description: 'Create image.',
    },
  },
  tags: ['[Admin] Images API'],
});

app.use(route.getRoutingPath(), authMiddleware);
app.openapi(route, async (c) => {
  const formData = c.req.valid('form');

  const result = await imageRepository.create({
    body: {
      alt: formData.alt,
    },
  });

  if (result.isErr()) {
    throw result.error;
  }

  await fs.mkdir(IMAGES_PATH, {
    recursive: true,
  });
  await fs.mkdir(path.resolve(IMAGES_PATH, 'out'), {
    recursive: true,
  });

  const sizes = [
    [32, 32],
    [64, 64],
    [96, 96],
    [128, 128],
    [200, 200],
    [192, 128],
    [192, 256],
  ];
  await Promise.all([
    (async () => {
      await fs.writeFile(
        path.resolve(IMAGES_PATH, `./${result.value.id}.jpg`),
        Buffer.from(await formData.content.arrayBuffer()),
      );
    })(),
    ...sizes.map(async ([width, height]) => {
      await fs.writeFile(
        path.resolve(IMG_STATIC_PATH, `./${result.value.id}-${width}x${height}.avif`),
        Buffer.from(
          await sharp(Buffer.from(await formData.content.arrayBuffer()))
            .resize(width, height)
            .avif({ effort: 3, quality: 80 })
            .toBuffer(),
        ),
      );
    }),
    (async () => {
      const buf = await sharp(Buffer.from(await formData.content.arrayBuffer()))
        .resize(600, 850)
        .avif({ effort: 3, quality: 80 })
        .toBuffer();
      const enc = encrypt(new Uint8Array(buf));
      await fs.writeFile(path.resolve(IMG_STATIC_PATH, `./${result.value.id}-600x850.avif`), Buffer.from(enc));
    })(),
  ]);

  return c.json(result.value);
});

export { app as postImageApp };
