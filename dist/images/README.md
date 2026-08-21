# Production images

`npm run build` runs `scripts/fetch-images.mjs`, downloads the documented BAD HABITS source photographs, resizes them and writes optimized AVIF files into this directory before assembling `dist/`.

The deployed site therefore serves local image files and does not hotlink editorial sources. Exact source URLs and credits are in `/SOURCES.md`.
