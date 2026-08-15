import { proposal } from './data.js';

type Scenario = (typeof proposal.scenarios)[number];

const q = <T extends Element>(selector: string) => document.querySelector<T>(selector);
const qa = <T extends Element>(selector: string) => [...document.querySelectorAll<T>(selector)];

function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? scrollY / max : 0;
  document.documentElement.style.setProperty('--progress', `${p}`);
  document.documentElement.style.setProperty('--lineOffset', `${1 - p}`);
}

function setupReveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    qa<HTMLElement>('[data-reveal]').forEach(el => el.dataset.visible = 'true');
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.visible = 'true';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
  qa<HTMLElement>('[data-reveal]').forEach(el => io.observe(el));
}

function renderScenario(scenario: Scenario) {
  const root = q<HTMLElement>('#scenario-detail');
  if (!root) return;
  root.innerHTML = `
    <div class="scenario-time">${scenario.time}</div>
    <div>
      <p class="eyebrow">${scenario.title}</p>
      <h3>${scenario.lead}</h3>
      <p>${scenario.copy}</p>
    </div>`;
}

function setupScenarios() {
  const buttons = qa<HTMLButtonElement>('[data-scenario]');
  renderScenario(proposal.scenarios[0]);
  buttons.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.scenario;
    const scenario = proposal.scenarios.find(item => item.key === key);
    if (!scenario) return;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    renderScenario(scenario);
  }));
}

function setupBranches() {
  const buttons = qa<HTMLButtonElement>('[data-branch]');
  const panel = q<HTMLElement>('#branch-panel');
  if (!panel) return;
  const render = (index: number) => {
    const branch = proposal.branches[index];
    panel.innerHTML = `
      <span class="branch-kicker">BAD HABITS / ${String(index + 1).padStart(2, '0')}</span>
      <h3>${branch.address}</h3>
      <p>${branch.tone}</p>
      <div class="branch-actions"><span>меню</span><span>фото</span><span>бронь</span><span>карта</span></div>`;
  };
  render(0);
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    buttons.forEach(b => b.setAttribute('aria-selected', String(b === button)));
    render(index);
  }));
}

function setupMockup() {
  const tabs = qa<HTMLButtonElement>('[data-mock-tab]');
  const views = qa<HTMLElement>('[data-mock-view]');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    const target = tab.dataset.mockTab;
    tabs.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    views.forEach(v => v.hidden = v.dataset.mockView !== target);
  }));
}

function setupNav() {
  const chapters = qa<HTMLAnchorElement>('.chapter-nav a');
  const sections = chapters.map(link => q<HTMLElement>(link.getAttribute('href') || '')).filter(Boolean) as HTMLElement[];
  const io = new IntersectionObserver(entries => {
    const current = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    chapters.forEach(link => link.dataset.active = String(link.getAttribute('href') === `#${current.target.id}`));
  }, { threshold: [0.3, 0.6] });
  sections.forEach(s => io.observe(s));
}

function setupFocusPointer() {
  document.documentElement.dataset.pointer = matchMedia('(pointer: fine)').matches ? 'fine' : 'coarse';
}

function applyConfig() {
  const cta = q<HTMLAnchorElement>('#primary-cta');
  if (cta) cta.href = proposal.contact.proposalMailto;
  const price = q<HTMLElement>('#price-note');
  if (price) price.textContent = proposal.pricing.note;
  const currentSite = q<HTMLAnchorElement>('#current-site-link');
  if (currentSite) currentSite.href = proposal.contact.currentSite;
}

function init() {
  applyConfig();
  updateProgress();
  setupReveal();
  setupScenarios();
  setupBranches();
  setupMockup();
  setupNav();
  setupFocusPointer();
  addEventListener('scroll', updateProgress, { passive: true });
}

init();
