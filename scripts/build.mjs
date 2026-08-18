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

const styleParts = ['styles-01.css', 'styles-02.css', 'styles-03.css', 'styles-04.css'];
const css = styleParts.map(file => fs.readFileSync(path.join(root, 'src', file), 'utf8')).join('\n');
fs.writeFileSync(path.join(dist, 'assets', 'styles.css'), css);

for (const file of ['data.js', 'main.js']) {
  fs.copyFileSync(path.join(build, file), path.join(dist, 'assets', file));
}

fs.cpSync(path.join(root, 'public'), dist, { recursive: true });

const secondConcept = path.join(root, 'v2');
if (fs.existsSync(secondConcept)) {
  fs.cpSync(secondConcept, path.join(dist, 'v2'), { recursive: true });
}

fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log('Built dist/ with primary and second concepts');
