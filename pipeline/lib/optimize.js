// Shrink a PNG: resize to a max width (never upscale) and quantize to a palette.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// quality and dither feed libimagequant: photo-heavy captures that overflow the size
// budget get a second pass at quality 50 without dithering (see screenshots.js).
export async function optimize(inputPath, outputPath, { width = 1600, quality = 80, dither = 1 } = {}) {
  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  const info = await sharp(inputPath)
    .resize({ width, withoutEnlargement: true })
    .png({ palette: true, quality, dither, compressionLevel: 9 })
    .toFile(outputPath);
  return { bytes: info.size, width: info.width, height: info.height };
}
