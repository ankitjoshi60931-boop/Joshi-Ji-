import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imageBuffer = fs.readFileSync(path.resolve('public/joshi.jpg'));

async function generate() {
  // 192x192
  await sharp(imageBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/pwa-192x192.png'));

  // 512x512
  await sharp(imageBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/pwa-512x512.png'));

  // 512x512 maskable (with safe-zone 12% padding)
  await sharp(imageBuffer)
    .resize(450, 450)
    .extend({
      top: 31,
      bottom: 31,
      left: 31,
      right: 31,
      background: { r: 76, g: 29, b: 149, alpha: 1 } // #4c1d95
    })
    .png()
    .toFile(path.resolve('public/pwa-maskable-512x512.png'));

  // apple-touch-icon 180x180
  await sharp(imageBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve('public/apple-touch-icon.png'));

  console.log('PWA icons successfully generated from user logo!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
