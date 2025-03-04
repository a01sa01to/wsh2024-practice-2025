const fs = require('node:fs').promises;

const initializePromise = Promise.all([
  fs.readFile(require.resolve('@jsquash/jxl/codec/enc/jxl_enc.wasm')).then((wasmBinary) => {
    return import('@jsquash/jxl/encode.js').then(({ init }) => init(undefined, { wasmBinary }));
  }),
  fs.readFile(require.resolve('@jsquash/jxl/codec/dec/jxl_dec.wasm')).then((wasmBinary) => {
    return import('@jsquash/jxl/decode.js').then(({ init }) => init(undefined, { wasmBinary }));
  }),
]);

const jpegXlConverter = {
  async decode(data) {
    await initializePromise;

    const JPEGXL = await import('@jsquash/jxl');
    return JPEGXL.decode(data);
  },
  async encode(data) {
    await initializePromise;

    const JPEGXL = await import('@jsquash/jxl');
    return JPEGXL.encode(data, {
      effort: 6,
      quality: 80,
    }).then((data) => new Uint8Array(data));
  },
};

(async () => {
  const files = await fs.readdir('tmp/jxl');
  for (const file of files) {
    const [filename, ext] = file.split('.');
    if (ext !== 'jxl') continue;
    console.log(file);
    const data = await fs.readFile(`tmp/jxl/${file}`);
    const decoded = await jpegXlConverter.decode(data);
    const encoded = await jpegXlConverter.encode(decoded);
    await fs.writeFile(`tmp/jxl-c/${filename}.jxl`, encoded);
  }
})();
