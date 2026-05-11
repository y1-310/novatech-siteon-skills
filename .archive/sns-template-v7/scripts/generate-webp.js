import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function convertToWebP(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  if (files.length === 0) {
    console.log('PNGファイルが見つかりません');
    return;
  }
  for (const file of files) {
    const src = path.join(dir, file);
    const dest = src.replace('.png', '.webp');
    await sharp(src).webp({ quality: 90 }).toFile(dest);
    console.log(`✅ ${file} → ${path.basename(dest)}`);
  }
}

// CLI実行時
const dir = process.argv[2];
if (dir) {
  convertToWebP(dir).catch(err => {
    console.error('❌', err.message);
    process.exit(1);
  });
}
