import { proposal } from './data.js';
const q = (selector) => document.querySelector(selector);
const qa = (selector) => [...document.querySelectorAll(selector)];
function motionBehavior() {
    return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}
function updateProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    document.documentElement.style.setProperty('--progress', `${p}`);
    document.documentElement.style.setProperty('--lineOffset', `${1 - p}`);
}
function setupReveal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        qa('[data-reveal]').forEach(el => el.dataset.visible = 'true');
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.dataset.visible = 'true';
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
    qa('[data-reveal]').forEach(el => io.observe(el));
}
function renderScenario(scenario) {
    const root = q('#scenario-detail');
    if (!root)
        return;
    root.innerHTML = `
    <div class="scenario-time">${scenario.time}</div>
    <div>
      <p class="eyebrow">${scenario.title}</p>
      <h3>${scenario.lead}</h3>
      <p>${scenario.copy}</p>
    </div>`;
}
function setupScenarios() {
    const buttons = qa('[data-scenario]');
    renderScenario(proposal.scenarios[0]);
    buttons.forEach(button => button.addEventListener('click', () => {
        const key = button.dataset.scenario;
        const scenario = proposal.scenarios.find(item => item.key === key);
        if (!scenario)
            return;
        buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
        renderScenario(scenario);
    }));
}
function setupRovingTabs(buttons, activate) {
    buttons.forEach((button, index) => {
        button.addEventListener('keydown', event => {
            let next = index;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
                next = (index + 1) % buttons.length;
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
                next = (index - 1 + buttons.length) % buttons.length;
            else if (event.key === 'Home')
                next = 0;
            else if (event.key === 'End')
                next = buttons.length - 1;
            else
                return;
            event.preventDefault();
            activate(next, true);
        });
    });
}
function setupBranches() {
    const buttons = qa('[data-branch]');
    const panel = q('#branch-panel');
    if (!panel || !buttons.length)
        return;
    const render = (index) => {
        const branch = proposal.branches[index];
        panel.setAttribute('aria-labelledby', buttons[index]?.id || '');
        panel.innerHTML = `
      <span class="branch-kicker">BAD HABITS / CONCEPT / ${String(index + 1).padStart(2, '0')}</span>
      <h3>${branch.address}</h3>
      <p>${branch.tone}</p>
      <div class="branch-actions"><span>меню</span><span>фото</span><span>бронь</span><span>карта</span></div>`;
    };
    const activate = (index, focus = false) => {
        buttons.forEach((button, i) => {
            const active = i === index;
            button.setAttribute('aria-selected', String(active));
            button.tabIndex = active ? 0 : -1;
        });
        render(index);
        if (focus)
            buttons[index]?.focus();
    };
    activate(0);
    buttons.forEach((button, index) => button.addEventListener('click', () => activate(index)));
    setupRovingTabs(buttons, activate);
}
function setupMockup() {
    const tabs = qa('[data-mock-tab]');
    const views = qa('[data-mock-view]');
    if (!tabs.length || !views.length)
        return;
    const activate = (index, focus = false) => {
        const target = tabs[index]?.dataset.mockTab;
        tabs.forEach((tab, i) => {
            const active = i === index;
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
        });
        views.forEach(view => { view.hidden = view.dataset.mockView !== target; });
        if (focus)
            tabs[index]?.focus();
    };
    activate(0);
    tabs.forEach((tab, index) => tab.addEventListener('click', () => activate(index)));
    setupRovingTabs(tabs, activate);
}
function setupPrototypeControls() {
    const scrollTo = (selector) => q(selector)?.scrollIntoView({ behavior: motionBehavior(), block: 'start' });
    const scenarioAction = q('.mock-overlay button');
    if (scenarioAction) {
        scenarioAction.setAttribute('aria-label', 'Перейти к сценариям посещения');
        scenarioAction.addEventListener('click', () => scrollTo('#scenarios'));
    }
    const menuButtons = qa('.menu-list button');
    menuButtons.forEach((button, index) => {
        button.setAttribute('aria-pressed', String(index === 0));
        button.addEventListener('click', () => {
            menuButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        });
    });
    const bookingAction = q('.booking-form button');
    if (bookingAction) {
        bookingAction.setAttribute('aria-label', 'Перейти к составу проекта');
        bookingAction.addEventListener('click', () => scrollTo('#offer'));
    }
    qa('.booking-form label').forEach(label => label.setAttribute('role', 'group'));
}
function setupSkipLink() {
    const main = q('main');
    if (!main)
        return;
    if (!main.id)
        main.id = 'main';
    const link = document.createElement('a');
    link.className = 'skip-link';
    link.href = `#${main.id}`;
    link.textContent = 'Перейти к содержанию';
    document.body.prepend(link);
}
function setupNav() {
    const chapters = qa('.chapter-nav a');
    const sections = chapters.map(link => q(link.getAttribute('href') || '')).filter(Boolean);
    const io = new IntersectionObserver(entries => {
        const current = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!current)
            return;
        chapters.forEach(link => {
            const active = link.getAttribute('href') === `#${current.target.id}`;
            link.dataset.active = String(active);
            if (active)
                link.setAttribute('aria-current', 'location');
            else
                link.removeAttribute('aria-current');
        });
    }, { threshold: [0.3, 0.6] });
    sections.forEach(section => io.observe(section));
}
function setupFocusPointer() {
    document.documentElement.dataset.pointer = matchMedia('(pointer: fine)').matches ? 'fine' : 'coarse';
}
function applyConfig() {
    const cta = q('#primary-cta');
    if (cta)
        cta.href = proposal.contact.proposalMailto;
    const price = q('#price-note');
    if (price)
        price.textContent = proposal.pricing.note;
    const currentSite = q('#current-site-link');
    if (currentSite)
        currentSite.href = proposal.contact.currentSite;
}
function init() {
    setupSkipLink();
    applyConfig();
    updateProgress();
    setupReveal();
    setupScenarios();
    setupBranches();
    setupMockup();
    setupPrototypeControls();
    setupNav();
    setupFocusPointer();
    addEventListener('scroll', updateProgress, { passive: true });
    addEventListener('resize', updateProgress, { passive: true });
}
init();
