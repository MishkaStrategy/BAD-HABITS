const q = (selector, root = document) => root.querySelector(selector);
const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

const scenes = {
  discover: {
    image: '../images/02.avif',
    kicker: 'START WITH A MOOD',
    title: 'КАКОЙ BAD HABITS\nНУЖЕН СЕГОДНЯ?',
    text: 'Днём, с ноутбуком, вечером вдвоём, большой компанией или приватно — начать с причины визита, а не с каталога.',
    index: '01'
  },
  work: {
    image: '../images/03.avif',
    kicker: 'DAY MODE / WORK',
    title: 'СВЕТ. НОУТБУК.\nНЕСКОЛЬКО ЧАСОВ.',
    text: 'Показать дневной ритм как самостоятельный продукт: панорамный свет, спокойная посадка и понятный повод прийти раньше вечера.',
    index: '02'
  },
  night: {
    image: '../images/06.avif',
    kicker: 'AFTER DARK',
    title: 'ТО ЖЕ МЕСТО.\nДРУГОЙ РИТМ.',
    text: 'После темноты интерфейс может становиться контрастнее и эмоциональнее — не меняя бренд, а усиливая состояние пространства.',
    index: '03'
  },
  private: {
    image: '../images/04.avif',
    kicker: 'PRIVATE MODE',
    title: 'НЕ ПРЯТАТЬ\nПРИВАТНЫЙ СЦЕНАРИЙ.',
    text: 'VIP и события должны быть отдельным понятным маршрутом: атмосфера, вместимость, формат и быстрый запрос без поиска по всему сайту.',
    index: '04'
  }
};

const visits = {
  day: {
    label: 'DAY MODE / 10:40',
    title: 'СВЕТ. ВИД.\nСПОКОЙНЫЙ РИТМ.',
    text: 'Дневной BAD HABITS можно показать как отдельное состояние пространства — без попытки сделать каждый экран «ночным».',
    image: '../images/04.avif'
  },
  work: {
    label: 'WORK MODE / 14:20',
    title: 'РАБОТА НЕ\nВЫГЛЯДИТ ЧУЖОЙ.',
    text: 'Гости уже описывают сценарий с ноутбуком. Digital может сделать его осознанным поводом выбрать филиал днём.',
    image: '../images/03.avif'
  },
  date: {
    label: 'TWO PEOPLE / 19:10',
    title: 'СНАЧАЛА\nАТМОСФЕРА.',
    text: 'Фото, свет и детали пространства помогают выбрать настроение. Бронь появляется тогда, когда решение уже созрело.',
    image: '../images/05.avif'
  },
  friends: {
    label: 'GROUP MODE / 22:35',
    title: 'ОДИН ЭКРАН —\nВСЯ ПРИЧИНА ПРИЙТИ.',
    text: 'Еда, общение, настольные игры и пространство собираются в один сценарий вместо набора разрозненных ссылок.',
    image: '../images/02.avif'
  },
  vip: {
    label: 'PRIVATE / 00:15',
    title: 'ПРИВАТНЫЙ\nРЕЖИМ.',
    text: 'Отдельный маршрут для VIP и событий делает сложный запрос понятным ещё до разговора с менеджером.',
    image: '../images/04.avif'
  }
};

function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  const bar = q('.progress i');
  if (bar) bar.style.width = `${p * 100}%`;
}

function setupReveal() {
  const nodes = qa('[data-reveal]');
  if (reduced.matches || !('IntersectionObserver' in window)) {
    nodes.forEach(node => node.dataset.visible = 'true');
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.dataset.visible = 'true';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  nodes.forEach(node => observer.observe(node));
}

function setupRail() {
  const links = qa('.rail a');
  const sections = qa('[data-section]');
  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { threshold: [0.25, 0.5, 0.72] });
  sections.forEach(section => observer.observe(section));
}

function setupRoving(buttons, activate) {
  buttons.forEach((button, index) => {
    button.tabIndex = button.getAttribute('aria-selected') === 'true' ? 0 : -1;
    button.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      activate(next, true);
    });
  });
}

function setupExperience() {
  const tabs = qa('[data-scene]');
  const panel = q('#scene-panel');
  if (!tabs.length || !panel) return;
  const image = q('.scene-image', panel);
  const kicker = q('.scene-kicker', panel);
  const title = q('.scene-title', panel);
  const text = q('.scene-text', panel);
  const meter = q('.scene-meter span:first-child', panel);

  const render = key => {
    const scene = scenes[key];
    if (!scene) return;
    panel.dataset.changing = 'true';
    const commit = () => {
      if (image) image.src = scene.image;
      if (kicker) kicker.textContent = scene.kicker;
      if (title) title.innerHTML = scene.title.replace('\n', '<br>');
      if (text) text.textContent = scene.text;
      if (meter) meter.textContent = scene.index;
      requestAnimationFrame(() => panel.dataset.changing = 'false');
    };
    if (reduced.matches) commit();
    else setTimeout(commit, 150);
  };

  const activate = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    render(tabs[index]?.dataset.scene);
    if (focus) tabs[index]?.focus();
  };

  tabs.forEach((tab, index) => tab.addEventListener('click', () => activate(index)));
  setupRoving(tabs, activate);
  q('.scene-button')?.addEventListener('click', () => q('#scenarios')?.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' }));
}

function setupVisits() {
  const tabs = qa('[data-visit]');
  const image = q('#visit-image');
  const label = q('#visit-label');
  const title = q('#visit-title');
  const text = q('#visit-text');
  if (!tabs.length) return;

  const render = key => {
    const visit = visits[key];
    if (!visit) return;
    if (image) image.src = visit.image;
    if (label) label.textContent = visit.label;
    if (title) title.innerHTML = visit.title.replace('\n', '<br>');
    if (text) text.textContent = visit.text;
  };

  const activate = (index, focus = false) => {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    render(tabs[index]?.dataset.visit);
    if (focus) tabs[index]?.focus();
  };

  tabs.forEach((tab, index) => tab.addEventListener('click', () => activate(index)));
  setupRoving(tabs, activate);
}

function setupBranches() {
  const cards = qa('.branch-card');
  const image = q('#branch-image');
  const title = q('#branch-title');
  const tone = q('#branch-tone');
  if (!cards.length) return;

  const setActive = activeCard => {
    cards.forEach(item => {
      const active = item === activeCard;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    if (title) title.textContent = activeCard.dataset.branch || '';
    if (tone) tone.textContent = activeCard.dataset.tone || '';
    if (image && activeCard.dataset.image) image.src = activeCard.dataset.image;
  };

  cards.forEach(card => {
    card.setAttribute('aria-pressed', String(card.classList.contains('active')));
    card.addEventListener('click', () => setActive(card));
  });
}

function setupCursorLight() {
  const light = q('.cursor-light');
  if (!light || !matchMedia('(pointer:fine)').matches || reduced.matches) return;
  addEventListener('pointermove', event => {
    light.style.left = `${event.clientX}px`;
    light.style.top = `${event.clientY}px`;
  }, { passive: true });
  addEventListener('pointerleave', () => light.style.opacity = '0');
  addEventListener('pointerenter', () => light.style.opacity = '.14');
}

function setupImageFallbacks() {
  qa('img').forEach(img => img.addEventListener('error', () => {
    img.style.background = 'linear-gradient(145deg,#173a9e,#252a32)';
    img.style.minHeight = img.style.minHeight || '240px';
    img.removeAttribute('src');
  }, { once: true }));
}

function init() {
  setupReveal();
  setupRail();
  setupExperience();
  setupVisits();
  setupBranches();
  setupCursorLight();
  setupImageFallbacks();
  updateProgress();
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress, { passive: true });
}

init();
