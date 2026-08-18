# BAD HABITS / DIGITAL AFTER DARK

Personalized interactive commercial proposal for **BAD HABITS, Большевистская 94, Новосибирск**.

The project now contains two independently viewable concepts. The original production remains intact for comparison; the second concept is a more complete client-facing direction built around day/night contrast, cobalt, warm glass-block light, scenario-led UX and a stronger interactive product demonstration.

## Production

- Primary concept: https://mishkacher.github.io/Rima/BAD-HABITS/
- Second concept: https://mishkacher.github.io/Rima/BAD-HABITS/v2/

The source project remains in `MishkaStrategy/BAD-HABITS`. Its production build is generated on every push to `main` and published to the repository's `gh-pages` branch. Because the organization repository cannot create its own Pages site record with the currently installed GitHub App permissions, the compiled production is also imported by the already active `mishkacher/Rima` GitHub Pages workflow and exposed at the URLs above.

## Concepts

### Primary

The first concept treats the venue itself as the design system: raw concrete, cobalt accents, warm illuminated glass blocks, editorial typography and the curved ceiling light become a continuous digital navigation motif.

### Second concept

`v2/` is a separate presentation rather than a cosmetic reskin. It includes:

- split cinematic hero with real BAD HABITS photography;
- cobalt + amber glass-block art direction;
- offline-signal proof section;
- utility → desire commercial argument;
- interactive future-site experience states;
- five visit scenarios;
- five-location network system;
- scope, roadmap and pricing logic;
- final client CTA;
- `noindex` for a private commercial-proposal use case;
- Open Graph metadata;
- keyboard-operable tabs and branch states;
- reduced-motion support;
- dedicated responsive behavior for desktop, tablet and mobile.

## Stack

- semantic HTML5
- TypeScript for the primary concept interactions
- dependency-free JavaScript for the isolated second concept
- custom CSS, no UI kit
- native IntersectionObserver / accessible tab-style interactions
- Sharp build pipeline for optimized AVIF photography
- GitHub Actions production build + GitHub Pages hosting

The runtime is deliberately dependency-light. Editable primary-project data is centralized in `src/data.ts`; the second concept is isolated in `v2/`.

## Local development

```bash
npm install
npm run build
npm run serve
```

Open `http://localhost:4173` for the primary concept or `http://localhost:4173/v2/` for the second concept.

`npm run build` prepares the documented BAD HABITS photography locally as AVIF, compiles TypeScript and assembles `dist/`, including the complete `v2/` subtree.

## Deployment

`.github/workflows/pages.yml` in this repository builds `dist/` on every push to `main` and force-publishes a compiled production snapshot to `gh-pages`.

The public GitHub Pages host is currently the already-enabled `mishkacher/Rima` Pages site. Its workflow pulls the complete current `gh-pages` snapshot from `MishkaStrategy/BAD-HABITS` and publishes it under `/Rima/BAD-HABITS/`.

## Project structure

```text
.
├── .github/workflows/pages.yml
├── public/
│   ├── favicon.svg
│   └── images/            # generated optimized AVIF assets
├── scripts/
│   ├── fetch-images.mjs   # downloads documented sources + optimizes locally
│   └── build.mjs          # assembles both production concepts
├── src/
│   ├── data.ts            # contacts, pricing, branches, scenarios, roadmap
│   ├── main.ts            # primary interactions / scroll state / selectors
│   └── styles-*.css       # primary responsive art direction
├── v2/
│   ├── index.html         # isolated second commercial-proposal concept
│   ├── styles.css
│   └── main.js
├── index.html
├── 404.html
├── SOURCES.md
├── package.json
└── tsconfig.json
```

## Pricing

No approved project price is invented. Both concepts state that final cost is fixed only after the first-version scope, screens and integrations are agreed.

## Images and sources

The build downloads the exact source photographs listed in [`SOURCES.md`](./SOURCES.md), resizes them and writes local AVIF copies to `public/images/` before deployment. Production therefore serves optimized local files rather than hotlinking editorial sources.

## Accessibility / motion

- semantic headings and landmarks
- keyboard-visible focus states
- keyboard-operable tabs
- meaningful image alt text
- `prefers-reduced-motion` support
- understandable interface with motion disabled

## Responsive QA targets

The layout is designed for `1440`, `1280`, `1024`, `768`, `430`, `390` and `360` px, with special handling for horizontal selectors, interactive experience modules, large typography and CTA behavior.
