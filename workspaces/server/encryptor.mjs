import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const bin2gray = (bin) => bin ^ (bin >> 1);
const bit_ceil = (n) => {
  let res = 1;
  while (res < n) res <<= 1;
  return res;
};

export const encrypt = (data) => {
  const siz = bit_ceil(data.length);
  const res = new Uint8Array(siz + 4);
  // 最初の 4 byte に元のデータの長さを入れる
  res[0] = data.length & 0xff;
  res[1] = (data.length >> 8) & 0xff;
  res[2] = (data.length >> 16) & 0xff;
  res[3] = (data.length >> 24) & 0xff;
  // それ以降は適当に入れ替え
  for (let i = 0; i < siz; i++) res[bin2gray(i) + 4] = data[i] ?? 0;
  return res;
};

export const decrypt = (data) => {
  let siz = 0;
  for (let i = 0; i < 4; i++) siz |= (data[i] ?? 0) << (i * 8);
  const res = new Uint8Array(siz);
  if (bit_ceil(siz) !== data.length - 4) console.error('なんか変だけど進めるよ');
  for (let i = 0; i < siz; i++) res[i] = data[bin2gray(i) + 4] ?? 0;
  return res;
};

const imgDir = resolve('tmp', 'out2');
const outDir = resolve('tmp', 'out-c');
const checkDir = resolve('tmp', 'out-c-check');

const files = await readdir(imgDir);
let i = 0;
for (const file of files) {
  console.log(`${++i}/${files.length}`, file);
  const basedata = new Uint8Array(await readFile(resolve(imgDir, file)));
  const encrypted = encrypt(basedata);
  await writeFile(resolve(outDir, file), encrypted);
  const decrypted = decrypt(encrypted);
  await writeFile(resolve(checkDir, file), decrypted);
}
