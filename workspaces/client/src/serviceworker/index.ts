/// <reference types="@types/serviceworker" />
import PQueue from 'p-queue';

import { transformJpegXLToBmp } from './transformJpegXLToBmp';
import { zstdFetch as fetch } from './zstdFetch';

// ServiceWorker が負荷で落ちないように並列リクエスト数を制限する
const queue = new PQueue({
  concurrency: 5,
});

self.addEventListener('install', (ev: ExtendableEvent) => {
  ev.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (ev: ExtendableEvent) => {
  ev.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (ev: FetchEvent) => {
  const url = new URL(ev.request.url);
  if (url.pathname.startsWith('/images') && url.searchParams.get('format') === 'jxl') {
    ev.respondWith(
      queue.add(() => onFetch(ev.request), {
        throwOnTimeout: true,
      }),
    );
  }
});

async function onFetch(request: Request): Promise<Response> {
  const res = await fetch(request);
  return transformJpegXLToBmp(res);
}
