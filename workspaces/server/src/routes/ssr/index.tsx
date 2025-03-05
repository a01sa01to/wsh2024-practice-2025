import fs from 'node:fs/promises';

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import jsesc from 'jsesc';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { SWRConfig, unstable_serialize } from 'swr';

import { bookApiClient } from '@wsh-2024/app/src/features/book/apiClient/bookApiClient';
import { featureApiClient } from '@wsh-2024/app/src/features/feature/apiClient/featureApiClient';
import { rankingApiClient } from '@wsh-2024/app/src/features/ranking/apiClient/rankingApiClient';
import { releaseApiClient } from '@wsh-2024/app/src/features/release/apiClient/releaseApiClient';
import { ClientApp } from '@wsh-2024/app/src/index';
import { getDayOfWeekStr } from '@wsh-2024/app/src/lib/date/getDayOfWeekStr';

import { INDEX_HTML_PATH } from '../../constants/paths';
import { authorApiClient } from '@wsh-2024/app/src/features/author/apiClient/authorApiClient';

const app = new Hono();

async function createInjectDataStr(path: string): Promise<Record<string, unknown>> {
  const json: Record<string, unknown> = {};

  if (path === '/') {
    // release, featureList, rankingList
    const dayOfWeek = getDayOfWeekStr(new Date());
    const releases = await releaseApiClient.fetch({ params: { dayOfWeek } });
    json[unstable_serialize(releaseApiClient.fetch$$key({ params: { dayOfWeek } }))] = releases;

    const features = await featureApiClient.fetchList({ query: {} });
    json[unstable_serialize(featureApiClient.fetchList$$key({ query: {} }))] = features;

    const ranking = await rankingApiClient.fetchList({ query: {} });
    json[unstable_serialize(rankingApiClient.fetchList$$key({ query: {} }))] = ranking;
  }

  if (path === '/search') {
    // bookList
    const bookList = await bookApiClient.fetchList({ query: {} });
    json[unstable_serialize(bookApiClient.fetchList$$key({ query: {} }))] = bookList;
  }

  if (/^\/books\/[^/]+$/.test(path)) { // book detail
    const bookId = path.split('/').pop() ?? "";
    const book = await bookApiClient.fetch({ params: { bookId } });
    json[unstable_serialize(bookApiClient.fetch$$key({ params: { bookId } }))] = book;
  }

  if (/^\/books\/[^/]+\/episodes\/[^/]+$/.test(path)) { // episode detail
    const bookId = path.split('/')[2] ?? "";
    const book = await bookApiClient.fetch({ params: { bookId } });
    json[unstable_serialize(bookApiClient.fetch$$key({ params: { bookId } }))] = book;
  }

  if (/^\/authors\/[^/]+$/.test(path)) { // author detail
    const authorId = path.split('/').pop() ?? "";
    const author = await authorApiClient.fetch({ params: { authorId } });
    json[unstable_serialize(authorApiClient.fetch$$key({ params: { authorId } }))] = author;
  }

  return json;
}

async function createHTML({
  body,
  injectData,
  styleTags,
}: {
  body: string;
  injectData: Record<string, unknown>;
  styleTags: string;
}): Promise<string> {
  const htmlContent = await fs.readFile(INDEX_HTML_PATH, 'utf-8');

  const content = htmlContent
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

  try {
    const body = ReactDOMServer.renderToString(
      sheet.collectStyles(
        <SWRConfig value={{ fallback: injectData }}>
          <StaticRouter location={c.req.path}>
            <ClientApp />
          </StaticRouter>,
        </SWRConfig>
      ),
    );

    const styleTags = sheet.getStyleTags();
    const html = await createHTML({ body, injectData, styleTags });

    return c.html(html);
  } catch (cause) {
    throw new HTTPException(500, { cause, message: 'SSR error.' });
  } finally {
    sheet.seal();
  }
});

export { app as ssrApp };
