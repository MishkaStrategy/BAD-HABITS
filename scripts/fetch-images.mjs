import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const out = path.join(root, 'public', 'images');
fs.mkdirSync(out, { recursive: true });

const images = {
  'hero.avif': 'https://gb-arch.ru/images/gb-arch.ru/thumbs/209/wot_jpg1920x1080x3/badhabits_92313e92449abe43ed03170cf975414f.jpg',
  '02.avif': 'https://gb-arch.ru/images/gb-arch.ru/thumbs/209/wot_jpg1920x1080x3/badhabits_8379a2a18727cc736d882827d6ff7f27.jpg',
  '03.avif': 'https://gb-arch.ru/images/gb-arch.ru/thumbs/209/wot_jpg1080x1920x3/badhabits_53b3e57bde3cdf0c5dc9db4500ff9c95.jpg',
  '04.avif': 'https://gb-arch.ru/images/gb-arch.ru/thumbs/209/wot_jpg1080x1920x3/badhabits_f20ef4011f65003b014d08720b36182e.jpg',
  '05.avif': 'https://gb-arch.ru/images/gb-arch.ru/thumbs/209/wot_jpg1080x1920x3/badhabits_c3810bc27f5fe5dcc728532c3ffe77f6.jpg',
  '06.avif': 'https://gb-arch.ru/images/gb-arch.ru/thumbs/209/wot_jpg1920x1080x3/badhabits_7b3aefef76eb2e23e264bcf825759714.jpg'
};

for (const [name, url] of Object.entries(images)) {
  const target = path.join(out, name);
  if (fs.existsSync(target) && fs.statSync(target).size > 10_000) continue;
  const response = await fetch(url, { headers: { 'user-agent': 'BAD-HABITS-proposal-build/1.0' } });
  if (!response.ok) throw new Error(`Image download failed ${response.status}: ${url}`);
  const source = Buffer.from(await response.arrayBuffer());
  const landscape = name === 'hero.avif' || name === '02.avif' || name === '06.avif';
  await sharp(source)
    .rotate()
    .resize({ width: landscape ? 1800 : 1200, height: landscape ? 1200 : 1800, fit: 'inside', withoutEnlargement: true })
    .avif({ quality: 58, effort: 5 })
    .toFile(target);
  console.log(`Prepared ${name}`);
}
