import fs from 'node:fs/promises';

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import jsesc from 'jsesc';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { SWRConfig, unstable_serialize } from 'swr';

import { AdminApp } from '@wsh-2024/admin/src/index';
import { ClientApp } from '@wsh-2024/app/src/index';
import { getDayOfWeekStr } from '@wsh-2024/app/src/lib/date/getDayOfWeekStr';

import { INDEX_HTML_PATH } from '../../constants/paths';
import {
  authorRepository,
  bookRepository,
  episodeRepository,
  featureRepository,
  rankingRepository,
  releaseRepository,
} from '../../repositories';

const app = new Hono();

async function createInjectDataStr(path: string): Promise<Record<string, unknown>> {
  const json: Record<string, unknown> = {};

  if (path === '/') {
    // release, featureList, rankingList
    const dayOfWeek = getDayOfWeekStr(new Date());
    const c = await releaseRepository.read({ params: { dayOfWeek } });
    if (c.isOk())
      json[unstable_serialize({ params: { dayOfWeek }, requestUrl: `/api/v1/releases/:dayOfWeek` })] = c.value;

    const d = await featureRepository.readAll({ query: {} });
    if (d.isOk()) json[unstable_serialize({ query: {}, requestUrl: `/api/v1/features` })] = d.value;

    const e = await rankingRepository.readAll({ query: {} });
    if (e.isOk()) json[unstable_serialize({ query: {}, requestUrl: `/api/v1/rankings` })] = e.value;
  }

  if (path === '/search') {
    const c = await bookRepository.readAll({ query: {} });
    // bookList
    if (c.isOk()) json[unstable_serialize({ query: {}, requestUrl: `/api/v1/books` })] = c.value;
  }

  if (/^\/books\/[^/]+$/.test(path)) {
    // book detail
    const bookId = path.split('/').pop() ?? '';
    const c = await bookRepository.read({ params: { bookId } });
    if (c.isOk()) json[unstable_serialize({ params: { bookId }, requestUrl: `/api/v1/books/:bookId` })] = c.value;
  }

  if (/^\/books\/[^/]+\/episodes\/[^/]+$/.test(path)) {
    // episode detail
    const bookId = path.split('/')[2] ?? '';
    const c = await episodeRepository.readAll({ query: { bookId } });
    if (c.isOk()) json[unstable_serialize({ query: { bookId }, requestUrl: `/api/v1/episodes` })] = c.value;
  }

  if (/^\/authors\/[^/]+$/.test(path)) {
    // author detail
    const authorId = path.split('/').pop() ?? '';
    const c = await authorRepository.read({ params: { authorId } });
    if (c.isOk()) json[unstable_serialize({ params: { authorId }, requestUrl: `/api/v1/authors` })] = c.value;
  }

  return json;
}

async function createHTML({
  body,
  injectData,
  isAdmin,
  styleTags,
}: {
  body: string;
  injectData: Record<string, unknown>;
  isAdmin: boolean;
  styleTags: string;
}): Promise<string> {
  const htmlContent = await fs.readFile(INDEX_HTML_PATH, 'utf-8');

  const content = htmlContent
    .replaceAll('client.global.js', isAdmin ? 'admin.global.js' : 'app.global.js')
    .replaceAll('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replaceAll('<style id="tag"></style>', styleTags)
    .replaceAll(
      '<script id="inject-data" type="application/json"></script>',
      `<script id="inject-data" type="application/json">
        ${jsesc(injectData, {
        isScriptContext: true,
        json: true,
        minimal: true,
      })}
      </script>`,
    );

  return content;
}

app.get('*', async (c) => {
  const injectData = await createInjectDataStr(c.req.path);
  const sheet = new ServerStyleSheet();
  const isAdmin = c.req.path.startsWith('/admin');

  try {
    const body = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <SWRConfig value={{ fallback: injectData }}>
          <StaticRouter location={c.req.path}>{isAdmin ? <AdminApp /> : <ClientApp />}</StaticRouter>,
        </SWRConfig>,
      ),
    );

    const styleTags = sheet.getStyleTags();
    const html = await createHTML({ body, injectData, isAdmin, styleTags });

    return c.html(html);
  } catch (cause) {
    throw new HTTPException(500, { cause, message: 'SSR error.' });
  } finally {
    sheet.seal();
  }
});

export { app as ssrApp };
