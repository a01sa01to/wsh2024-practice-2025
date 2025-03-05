import fs from 'node:fs/promises';

import { Hono } from 'hono';

import { INDEX_HTML_PATH } from '../../constants/paths';

const app = new Hono();

app.get('/admin', async (c) => {
  const html = await fs.readFile(INDEX_HTML_PATH, 'utf-8');
  return c.html(html.replace('client.global.js', 'admin.global.js'));
});

app.get('/admin/*', async (c) => {
  const html = await fs.readFile(INDEX_HTML_PATH, 'utf-8');
  return c.html(html.replace('client.global.js', 'admin.global.js'));
});

export { app as adminApp };
