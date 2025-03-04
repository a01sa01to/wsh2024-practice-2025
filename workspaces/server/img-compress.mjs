import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import sharp from 'sharp';

// jpg 画像はサムネ・アバターで png はマンガ (たぶん)
const sizeThumb = [
  [32, 32],
  [64, 64],
  [96, 96],
  [128, 128],
  [200, 200],
];
const sizeComicCover = [
  [192, 128],
  [192, 256],
];
// const sizeComicMain = [
//   [600, 850]
// ]

const imgDir = resolve('seeds', 'images');
const outDir = resolve('seeds', 'images', 'out');
// const imgDir = resolve("tmp")
// const outDir = resolve("tmp", "out")

const files = await readdir(imgDir);
let i = 0;
for (const file of files) {
  const [filename, ext] = file.split('.');
  if (ext !== 'jpg' && ext !== 'png') continue;
  console.log(`${++i}/${files.length}`, file);
  for (const [width, height] of ext === 'jpg' ? sizeThumb : [...sizeThumb, ...sizeComicCover]) {
    // for (const [width, height] of sizeComicMain) {
    await sharp(resolve(imgDir, file))
      .resize(width, height)
      .avif({ effort: 9, quality: 80 })
      .toFile(resolve(outDir, `${filename}-${width}x${height}.avif`));
    // .png({ compressionLevel: 9, effort: 6, quality: 80 })
    // .toFile(resolve(outDir, `${filename}-${width}x${height}.png`))
  }
}
