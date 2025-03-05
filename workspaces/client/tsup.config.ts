import path from 'node:path';

import { polyfillNode } from 'esbuild-plugin-polyfill-node';
import findPackageDir from 'pkg-dir';
import { defineConfig } from 'tsup';
import type { Options } from 'tsup';

export default defineConfig(async (): Promise<Options[]> => {
  const PACKAGE_DIR = (await findPackageDir(process.cwd()))!;

  const OUTPUT_DIR = path.resolve(PACKAGE_DIR, './dist');

  return [
    {
      bundle: true,
      clean: true,
      entry: {
        admin: path.resolve(PACKAGE_DIR, './src/index.admin.tsx'),
        app: path.resolve(PACKAGE_DIR, './src/index.app.tsx'),
        serviceworker: path.resolve(PACKAGE_DIR, './src/serviceworker/index.ts'),
      },
      env: {
        API_URL: "",
        NODE_ENV: process.env['NODE_ENV'] || 'development',
      },
      esbuildOptions(options) {
        options.define = {
          ...options.define,
          global: 'globalThis',
        };
        options.publicPath = '/';
      },
      esbuildPlugins: [
        polyfillNode({
          globals: {
            process: false,
          },
          polyfills: {
            events: true,
            fs: true,
            path: true,
          },
        }),
      ],
      format: 'iife',
      metafile: true,
      outDir: OUTPUT_DIR,
      platform: 'browser',
      target: ['chrome123'],
    },
  ];
});
