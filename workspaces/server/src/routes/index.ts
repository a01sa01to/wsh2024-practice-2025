import path from 'node:path';

import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { secureHeaders } from 'hono/secure-headers';

import { IMG_STATIC_PATH } from '../constants/paths';
import { cacheControlMiddleware } from '../middlewares/cacheControlMiddleware';
import { compressMiddleware } from '../middlewares/compressMiddleware';

import { adminApp } from './admin';
import { apiApp } from './api';
import { ssrApp } from './ssr';
import { staticApp } from './static';

const app = new Hono();

app.use(secureHeaders());
app.use(
  cors({
    allowHeaders: ['Content-Type', 'Accept-Encoding', 'X-Accept-Encoding', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    exposeHeaders: ['Content-Encoding', 'X-Content-Encoding'],
    origin: (origin) => origin,
  }),
);
app.use(compressMiddleware);
app.use(cacheControlMiddleware);

app.use(
  '/img/*',
  (c, next) => {
    if (c.req.path.endsWith('jxl')) c.header('Content-Type', 'image/jxl');
    return next();
  },
  serveStatic({
    root: path.relative(process.cwd(), IMG_STATIC_PATH.replaceAll('\\', '/').replace('/img', '')),
  }),
);

app.get('/healthz', (c) => {
  return c.body('live', 200);
});
app.route('/', staticApp);
app.route('/', apiApp);
app.route('/', adminApp);
app.route('/', ssrApp);

app.onError((cause) => {
  console.error(cause);

  if (cause instanceof HTTPException) {
    return cause.getResponse();
  }

  const err = new HTTPException(500, {
    cause: cause,
    message: 'Internal server error.',
  });
  return err.getResponse();
});

export { app };
