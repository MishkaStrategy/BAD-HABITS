# BAD HABITS / DIGITAL AFTER DARK

Personalized interactive commercial proposal for **BAD HABITS, Большевистская 94, Новосибирск**.

The concept treats the venue itself as the design system: raw concrete, cobalt accents, warm illuminated glass blocks, editorial typography and the curved ceiling light become a continuous digital navigation motif. The presentation moves from research → opportunity → interactive future-product prototype → network architecture → business rationale → roadmap → project scope → CTA.

## Production

Target GitHub Pages URL: https://mishkastrategy.github.io/BAD-HABITS/

The production build is already published to the repository's `gh-pages` branch. GitHub Pages itself still requires the repository's one-time publishing-source setting to be enabled before the URL becomes public.

## Stack

- semantic HTML5
- TypeScript for progressive interaction
- custom CSS, no UI kit
- native IntersectionObserver / accessible tab-style interactions
- Sharp build pipeline for optimized AVIF photography
- GitHub Actions + `gh-pages` production branch

The runtime is deliberately dependency-light: the proposal keeps its editorial art direction custom and ships very little JavaScript. Editable project data is centralized in `src/data.ts`.

## Local development

```bash
npm install
npm run build
npm run serve
```

Open `http://localhost:4173`.

`npm run build` prepares the documented BAD HABITS photography locally as AVIF, compiles TypeScript and assembles `dist/`.

## Deployment

`.github/workflows/pages.yml` builds `dist/` on every push to `main` and force-publishes the production output to the `gh-pages` branch. Once GitHub Pages is enabled for this repository with `gh-pages` / `(root)` as the publishing source, future pushes remain synchronized automatically.

## Project structure

```text
.
├── .github/workflows/pages.yml
├── public/
│   ├── favicon.svg
│   └── images/            # generated optimized AVIF assets
├── scripts/
│   ├── fetch-images.mjs   # downloads documented sources + optimizes locally
│   └── build.mjs          # assembles production output
├── src/
│   ├── data.ts            # contacts, pricing, branches, scenarios, roadmap
│   ├── main.ts            # interactions / scroll state / selectors
│   └── styles-*.css       # responsive art direction, concatenated on build
├── index.html
├── 404.html
├── SOURCES.md
├── package.json
└── tsconfig.json
```

## Where to change prices

`src/data.ts` → `proposal.pricing`.

No approved project price is invented. The production UI explicitly states that final cost is fixed after the v1 scope is agreed.

## Where to change contacts

`src/data.ts` → `proposal.contact`.

The commercial-proposal CTA is separate from BAD HABITS public booking contacts.

## Where to change branches / scenarios / roadmap

`src/data.ts` contains network branches, visit scenarios, roadmap and scope data. Visible narrative markup remains in `index.html` so the editorial composition can stay intentionally art-directed.

## Images and sources

The build downloads the exact source photographs listed in [`SOURCES.md`](./SOURCES.md), resizes them and writes local AVIF copies to `public/images/` before deployment. The production site therefore serves its own optimized files rather than hotlinking the editorial sources.

## Accessibility / motion

- semantic headings and landmarks
- keyboard-visible focus states
- native keyboard-operable buttons
- meaningful image alt text
- `prefers-reduced-motion` support
- understandable interface with motion disabled

## Responsive QA targets

The layout is explicitly tuned for `1440`, `1280`, `1024`, `768`, `430`, `390` and `360` px, with special handling for horizontal selectors, mockups, large typography and CTA behavior.
