// Icon and share image placement. Run by hand after a capture:
// `node scripts/og.mjs`. It does not drive a browser.
// It reads the screenshots that the Playwright MCP wrote to .scratch/shots/,
// copies og.png and apple-touch-icon.png into public/, and wraps the 48 px PNG
// in a 22 byte ICO header to make public/favicon.ico. Node built-ins only.
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const shotsDir = resolve(rootDir, '.scratch/shots');
const publicDir = resolve(rootDir, 'public');

const COPIES = [
  ['og.png', 'og.png'],
  ['icon-180.png', 'apple-touch-icon.png'],
];
const ICO_SOURCE = 'icon-48.png';
const ICO_TARGET = 'favicon.ico';
const ICO_SIZE = 48;

// Wraps PNG bytes in an ICO container. The format has allowed a raw PNG
// payload since Vista, so no image library is needed. A size of 256 is
// written as 0, which is why only sizes below 256 are accepted here.
export function pngToIco(png, size) {
  if (size < 1 || size > 255) throw new Error(`icon size ${size} is out of range`);
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(size, 6); // width
  header.writeUInt8(size, 7); // height
  header.writeUInt8(0, 8); // palette colours
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14); // payload size
  header.writeUInt32LE(header.length, 18); // payload offset
  return Buffer.concat([header, png]);
}

function main() {
  for (const [source, target] of COPIES) {
    copyFileSync(resolve(shotsDir, source), resolve(publicDir, target));
  }
  const png = readFileSync(resolve(shotsDir, ICO_SOURCE));
  writeFileSync(resolve(publicDir, ICO_TARGET), pngToIco(png, ICO_SIZE));
  console.log(`og: placed ${COPIES.length + 1} files in public/`);
}

main();
