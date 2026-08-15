import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const build = path.join(root, '.build');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'assets'), { recursive: true });

for (const file of ['index.html', '404.html']) {
  const src = path.join(root, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dist, file));
}
fs.copyFileSync(path.join(root, 'src', 'styles.css'), path.join(dist, 'assets', 'styles.css'));
for (const file of ['data.js', 'main.js']) {
  fs.copyFileSync(path.join(build, file), path.join(dist, 'assets', file));
}
fs.cpSync(path.join(root, 'public'), dist, { recursive: true });
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log('Built dist/');
