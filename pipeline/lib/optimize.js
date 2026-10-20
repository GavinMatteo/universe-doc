// Shrink a PNG: resize to a max width (never upscale) and quantize to a palette.
import sharp from 'sharp';

export async function optimize(inputPath, outputPath, { width = 1600 } = {}) {
  const info = await sharp(inputPath)
    .resize({ width, withoutEnlargement: true })
    .png({ palette: true, quality: 80, compressionLevel: 9 })
    .toFile(outputPath);
  return { bytes: info.size, width: info.width, height: info.height };
}
