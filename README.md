# BAD HABITS / DIGITAL AFTER DARK

Personalized interactive commercial proposal for **BAD HABITS, Большевистская 94, Новосибирск**.

The concept treats the venue itself as the design system: raw concrete, cobalt accents, warm illuminated glass blocks, editorial typography and the curved ceiling light become a continuous digital navigation motif. The presentation moves from research → opportunity → interactive future-product prototype → network architecture → business rationale → roadmap → project scope → CTA.

## Production

https://mishkastrategy.github.io/BAD-HABITS/

## Stack

- semantic HTML5
- TypeScript (interaction/progressive enhancement)
- custom CSS, no UI kit
- native IntersectionObserver / accessible tab-style interactions
- local optimized AVIF assets
- GitHub Actions + GitHub Pages

A dependency-light implementation was chosen for this proposal because it reduces runtime JavaScript, keeps the editorial art direction fully custom, and helps mobile performance. Content/config is separated from interaction code in `src/data.ts`.

## Local development

```bash
npm install
npm run build
npm run serve
```

Open `http://localhost:4173`.

## Production build

```bash
npm run build
```

Output is written to `dist/`.

## Deployment

`.github/workflows/pages.yml` builds the project and deploys `dist/` to GitHub Pages on every push to `main`. The workflow uses `actions/configure-pages` with Pages enablement for a new repository.

## Project structure

```text
.
├── .github/workflows/pages.yml
├── public/
│   ├── favicon.svg
│   └── images/            # local optimized BAD HABITS photography
├── scripts/build.mjs      # production build copier
├── src/
│   ├── data.ts            # editable proposal data/config
│   ├── main.ts            # interactions / scroll state / selectors
│   └── styles.css         # full responsive art direction
├── index.html
├── 404.html
├── SOURCES.md
├── package.json
└── tsconfig.json
```

## Where to change prices

`src/data.ts` → `proposal.pricing`.

No approved project price is invented. The current production UI explicitly states that final cost is fixed after the v1 scope is agreed.

## Where to change contacts

`src/data.ts` → `proposal.contact`.

The proposal CTA is configured to the proposer email from the connected GitHub profile (`proposalEmail` / `proposalMailto`). BAD HABITS public booking contacts remain separate source data and are not used as the proposal CTA.

## Where to change branches / scenarios / roadmap

`src/data.ts` contains network branches, visit scenarios, roadmap and scope data. Visible narrative markup is in `index.html` so the editorial composition can remain intentionally art-directed.

## Images

Optimized production assets are in `public/images/` in AVIF. They are local copies — production does not hotlink source images.

Full origin mapping and content-research references are documented in [`SOURCES.md`](./SOURCES.md).

## Accessibility / motion

- semantic headings and landmarks
- keyboard-visible focus states
- buttons retain native keyboard interaction
- meaningful image alt text
- `prefers-reduced-motion` support
- interface remains readable with motion disabled

## Responsive QA targets

QA breakpoints: `1440`, `1280`, `1024`, `768`, `430`, `390`, `360` px, with extra focus on horizontal overflow, selector strips, mockups, large typography and CTA behavior.
