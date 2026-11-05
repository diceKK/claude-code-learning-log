/*
 * 描画と動作
 * data.js（window.PORTFOLIO_DATA）を読んで、各セクションを組み立てます。
 * 絞り込み、拡大表示、URL ハッシュとの連動もここで扱います。
 */
(function () {
  'use strict';

  var MOTION_MS = 250;
  var reducedQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function prefersReducedMotion() {
    return Boolean(reducedQuery && reducedQuery.matches);
  }

  /* ---------- 小さな道具 ---------- */

  function $(id) {
    return document.getElementById(id);
  }

  // 要素を作る。props: className / text / attrs
  function h(tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};
    if (props.className) node.className = props.className;
    if (props.text !== undefined && props.text !== null) node.textContent = String(props.text);
    if (props.attrs) {
      Object.keys(props.attrs).forEach(function (key) {
        node.setAttribute(key, props.attrs[key]);
      });
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  // 2026-11-05 → 11/05
  function formatDate(iso) {
    var parts = String(iso).split('-');
    return parts.length === 3 ? parts[1] + '/' + parts[2] : String(iso);
  }

  function timeEl(iso) {
    return h('time', { text: formatDate(iso), attrs: { datetime: iso } });
  }

  function replaceHash(hash) {
    try {
      history.replaceState(null, '', hash);
    } catch (e) {
      /* file:// などで使えない場合は何もしない */
    }
  }

  function scrollToEl(node) {
    if (!node) return;
    node.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  function isVisible(node) {
    return Boolean(node && node.isConnected && node.getClientRects().length > 0);
  }

  /* ---------- データの確認 ---------- */

  function isValidData(d) {
    return Boolean(
      d && typeof d === 'object' &&
      d.site && d.hero &&
      Array.isArray(d.stats) &&
      Array.isArray(d.steps) &&
      Array.isArray(d.works) &&
      d.made && Array.isArray(d.made.skills) && Array.isArray(d.made.agents) &&
      d.reflection && Array.isArray(d.reflection.body) &&
      d.footer && Array.isArray(d.footer.notes)
    );
  }

  function showLoadError() {
    var main = $('main');
    if (!main) return;
    clear(main);
    main.appendChild(h('p', { className: 'notice', text: 'データを読み込めませんでした' }));
  }

  var data = window.PORTFOLIO_DATA;
  if (!isValidData(data)) {
    showLoadError();
    return;
  }

  var works = data.works;
  var steps = data.steps;
  var stepMap = {};
  var workMap = {};
  steps.forEach(function (s) { stepMap[s.id] = s; });
  works.forEach(function (w) { workMap[w.id] = w; });

  function stepName(stepId) {
    return stepMap[stepId] ? stepMap[stepId].name : '';
  }

  function imagePath(file) {
    return 'images/' + file;
  }

  // 拡大表示を開くボタン（画像を包む）
  function zoomButton(work, extraClass) {
    var img = h('img', {
      attrs: {
        src: imagePath(work.file),
        alt: work.alt,
        loading: 'lazy',
        decoding: 'async'
      }
    });
    var btn = h('button', {
      className: 'media-button' + (extraClass ? ' ' + extraClass : ''),
      attrs: { type: 'button', 'aria-label': work.title + ' を拡大表示', 'data-work-id': work.id }
    }, [img]);
    btn.addEventListener('click', function () {
      openLightbox(work.id, btn);
    });
    return btn;
  }

  function metaLine(iso, label) {
    return h('p', { className: 'meta' }, [timeEl(iso), ' · ' + label]);
  }

  function storyList(work) {
    return h('dl', { className: 'story' }, [
      h('div', null, [h('dt', { text: 'やりたかったこと' }), h('dd', { text: work.goal })]),
      h('div', null, [h('dt', { text: 'やったこと' }), h('dd', { text: work.action })]),
      h('div', null, [h('dt', { text: '結果' }), h('dd', { text: work.result })])
    ]);
  }

  /* ---------- 描画 ---------- */

  function renderHeaderAndHero() {
    $('site-title').textContent = data.site.title;

    var heroMedia = $('hero-media');
    clear(heroMedia);
    heroMedia.appendChild(h('img', {
      className: 'hero__img',
      attrs: { src: imagePath(data.hero.image), alt: data.hero.alt, decoding: 'async' }
    }));
    $('hero-heading').textContent = data.hero.heading;
    $('hero-lead').textContent = data.hero.lead;
    $('hero-period').textContent = data.hero.period;
  }

  function renderStats() {
    var list = $('stats-list');
    clear(list);
    data.stats.forEach(function (s) {
      list.appendChild(h('li', { className: 'stats__item' }, [
        h('span', { className: 'stats__value', text: s.value }),
        h('span', { className: 'stats__label', text: s.label })
      ]));
    });
  }

  function renderFeatured() {
    var list = $('featured-list');
    clear(list);
    works.filter(function (w) { return w.featured === true; }).forEach(function (w) {
      var children = [
        zoomButton(w, 'feature-card__media'),
        metaLine(w.date, stepName(w.step)),
        h('h3', { className: 'feature-card__title', text: w.title })
      ];
      if (w.metric) children.push(h('p', { className: 'metric', text: w.metric }));
      children.push(storyList(w));
      list.appendChild(h('article', { className: 'feature-card' }, children));
    });
  }

  function renderIndex() {
    var list = $('index-list');
    clear(list);
    steps.forEach(function (s) {
      list.appendChild(h('li', null, [
        h('a', { className: 'step-index__link', attrs: { href: '#' + s.id } }, [
          h('span', { className: 'step-index__no', text: s.no }),
          h('span', { className: 'step-index__name', text: s.name }),
          h('span', { className: 'step-index__date' }, [timeEl(s.date)])
        ])
      ]));
    });
  }

  function renderProcess() {
    var list = $('process-list');
    clear(list);
    steps.forEach(function (s) {
      var carousel = h('div', {
        className: 'carousel',
        attrs: { role: 'region', 'aria-label': s.name + 'の画像', tabindex: '0' }
      });
      works.filter(function (w) { return w.step === s.id; }).forEach(function (w) {
        carousel.appendChild(h('figure', { className: 'carousel__item' }, [
          zoomButton(w),
          h('figcaption', { text: w.title })
        ]));
      });
      list.appendChild(h('li', { className: 'timeline__item' }, [
        h('article', { className: 'step', attrs: { id: s.id } }, [
          metaLine(s.date, 'Step ' + parseInt(s.no, 10)),
          h('h3', { className: 'step__title', text: s.name }),
          h('p', { className: 'step__summary', text: s.summary }),
          carousel
        ])
      ]));
    });
  }

  var currentFilter = 'all';
  var filterButtons = [];
  var galleryItems = [];
  var galleryButtonMap = {};

  function renderGallery() {
    var filters = $('gallery-filters');
    var grid = $('gallery-grid');
    clear(filters);
    clear(grid);
    filterButtons = [];
    galleryItems = [];

    var options = [{ id: 'all', label: 'すべて（' + works.length + '）' }];
    steps.forEach(function (s) {
      var count = works.filter(function (w) { return w.step === s.id; }).length;
      options.push({ id: s.id, label: s.name + '（' + count + '）' });
    });
    options.forEach(function (opt) {
      var btn = h('button', {
        className: 'filter',
        text: opt.label,
        attrs: { type: 'button', 'aria-pressed': 'false', 'data-filter': opt.id }
      });
      btn.addEventListener('click', function () {
        applyFilter(opt.id, true);
      });
      filters.appendChild(btn);
      filterButtons.push(btn);
    });

    works.forEach(function (w) {
      var btn = zoomButton(w, 'gallery-card__media');
      galleryButtonMap[w.id] = btn;
      var item = h('li', { className: 'gallery-card', attrs: { 'data-step': w.step } }, [
        btn,
        h('h3', { className: 'gallery-card__title', text: w.title }),
        h('p', { className: 'gallery-card__step', text: stepName(w.step) })
      ]);
      grid.appendChild(item);
      galleryItems.push(item);
    });
  }

  function renderMade() {
    var skills = data.made.skills;
    var agents = data.made.agents;
    $('made-skills-title').textContent = 'スキル（' + skills.length + '）';
    $('made-agents-title').textContent = 'サブエージェント（' + agents.length + '）';
    [[skills, $('made-skills')], [agents, $('made-agents')]].forEach(function (pair) {
      var list = pair[1];
      clear(list);
      pair[0].forEach(function (item) {
        list.appendChild(h('li', { className: 'made__item' }, [
          h('span', { className: 'made__name', text: item.name }),
          h('span', { className: 'made__desc', text: item.desc })
        ]));
      });
    });
  }

  function renderReflectionAndFooter() {
    $('reflection-title').textContent = data.reflection.heading;
    var body = $('reflection-body');
    clear(body);
    data.reflection.body.forEach(function (text) {
      body.appendChild(h('p', { text: text }));
    });

    var notes = $('footer-notes');
    clear(notes);
    data.footer.notes.forEach(function (text) {
      notes.appendChild(h('li', { text: text }));
    });
  }

  /* ---------- 絞り込み ---------- */

  function applyFilter(stepId, updateHash) {
    if (stepId !== 'all' && !stepMap[stepId]) return false;
    currentFilter = stepId;
    filterButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-filter') === stepId ? 'true' : 'false');
    });
    var shown = 0;
    galleryItems.forEach(function (item) {
      var show = stepId === 'all' || item.getAttribute('data-step') === stepId;
      item.hidden = !show;
      if (show) shown += 1;
    });
    $('gallery-count').textContent = shown + '件を表示中';
    if (updateHash) replaceHash(stepId === 'all' ? '#gallery' : '#gallery/' + stepId);
    return true;
  }

  /* ---------- 拡大表示 ---------- */

  var lb = {
    root: $('lightbox'),
    media: $('lightbox-media'),
    meta: $('lightbox-meta'),
    title: $('lightbox-title'),
    metric: $('lightbox-metric'),
    goal: $('lightbox-goal'),
    action: $('lightbox-action'),
    result: $('lightbox-result'),
    tags: $('lightbox-tags'),
    pos: $('lightbox-pos'),
    prev: $('lightbox-prev'),
    next: $('lightbox-next'),
    close: $('lightbox-close')
  };
  var lbState = { open: false, list: [], index: 0, opener: null, prevHash: '#gallery', timer: null };
  var backgroundEls = [
    document.querySelector('.skip-link'),
    document.querySelector('.site-header'),
    $('main'),
    document.querySelector('.site-footer')
  ].filter(Boolean);

  function setBackgroundInert(on) {
    backgroundEls.forEach(function (node) {
      if (on) node.setAttribute('inert', '');
      else node.removeAttribute('inert');
    });
  }

  function renderLightbox() {
    var w = lbState.list[lbState.index];
    if (!w) return;
    clear(lb.media);
    lb.media.appendChild(h('img', {
      className: 'lightbox__img',
      attrs: { src: imagePath(w.file), alt: w.alt, decoding: 'async', loading: 'lazy' }
    }));
    clear(lb.meta);
    lb.meta.appendChild(timeEl(w.date));
    lb.meta.appendChild(document.createTextNode(' · ' + stepName(w.step)));
    lb.title.textContent = w.title;
    if (w.metric) {
      lb.metric.textContent = w.metric;
      lb.metric.hidden = false;
    } else {
      lb.metric.textContent = '';
      lb.metric.hidden = true;
    }
    lb.goal.textContent = w.goal;
    lb.action.textContent = w.action;
    lb.result.textContent = w.result;
    clear(lb.tags);
    (w.tags || []).forEach(function (t) {
      lb.tags.appendChild(h('li', { className: 'tag', text: t }));
    });
    lb.pos.textContent = (lbState.index + 1) + ' / ' + lbState.list.length;
    replaceHash('#work/' + w.id);
  }

  function openLightbox(workId, opener) {
    var work = workMap[workId];
    if (!work) return false;

    var inFilter = currentFilter === 'all' || work.step === currentFilter;
    var list = inFilter
      ? works.filter(function (w) { return currentFilter === 'all' || w.step === currentFilter; })
      : works.slice();
    lbState.list = list;
    lbState.index = list.indexOf(work);

    var wasOpen = lbState.open;
    if (!wasOpen) {
      var hash = location.hash;
      lbState.prevHash = hash && hash.indexOf('#work/') !== 0 ? hash : '#gallery';
      lbState.opener = opener || null;
      if (lbState.timer) {
        clearTimeout(lbState.timer);
        lbState.timer = null;
      }
      lb.root.hidden = false;
      void lb.root.offsetWidth; // フェードを効かせるため一度描画させる
      lb.root.classList.add('is-open');
      setBackgroundInert(true);
      document.body.classList.add('is-locked');
      lbState.open = true;
    }
    renderLightbox();
    if (!wasOpen) lb.close.focus();
    return true;
  }

  function moveLightbox(step) {
    if (!lbState.open || lbState.list.length === 0) return;
    var len = lbState.list.length;
    lbState.index = (lbState.index + step + len) % len;
    renderLightbox();
  }

  function closeLightbox(restoreHash) {
    if (!lbState.open) return;
    lbState.open = false;
    lb.root.classList.remove('is-open');
    setBackgroundInert(false);
    document.body.classList.remove('is-locked');
    if (restoreHash !== false) replaceHash(lbState.prevHash || '#gallery');

    if (prefersReducedMotion()) {
      lb.root.hidden = true;
    } else {
      lbState.timer = setTimeout(function () {
        lb.root.hidden = true;
        lbState.timer = null;
      }, MOTION_MS);
    }

    var target = lbState.opener;
    lbState.opener = null;
    if (isVisible(target)) {
      target.focus();
    } else {
      var fallback = $('gallery-title');
      if (fallback) fallback.focus();
    }
  }

  function focusables() {
    return Array.prototype.slice.call(lb.root.querySelectorAll('button:not([disabled])'))
      .filter(isVisible);
  }

  function onKeydown(e) {
    if (!lbState.open) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      moveLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      moveLightbox(1);
    } else if (e.key === 'Tab') {
      var items = focusables();
      if (items.length === 0) return;
      var first = items[0];
      var last = items[items.length - 1];
      var active = document.activeElement;
      var inside = lb.root.contains(active);
      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!inside || active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function bindLightbox() {
    lb.prev.addEventListener('click', function () { moveLightbox(-1); });
    lb.next.addEventListener('click', function () { moveLightbox(1); });
    lb.close.addEventListener('click', function () { closeLightbox(); });
    lb.root.addEventListener('click', function (e) {
      var target = e.target;
      if (target.closest && target.closest('.lightbox__img, .lightbox__panel')) return;
      closeLightbox();
    });
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('focusin', function (e) {
      if (lbState.open && !lb.root.contains(e.target)) lb.close.focus();
    });
  }

  /* ---------- URL ハッシュ ---------- */

  function readHash() {
    try {
      return decodeURIComponent(location.hash || '');
    } catch (e) {
      return '';
    }
  }

  function handleHash(isInitial) {
    var hash = readHash();
    var m = /^#work\/(.+)$/.exec(hash);
    if (m) {
      if (workMap[m[1]]) openLightbox(m[1], galleryButtonMap[m[1]]);
      return;
    }
    if (lbState.open) closeLightbox(false);

    m = /^#gallery\/(step-\d+)$/.exec(hash);
    if (m) {
      if (stepMap[m[1]] && applyFilter(m[1], false)) scrollToEl($('gallery'));
      return;
    }
    if (hash === '#gallery' && !isInitial) applyFilter('all', false);
  }

  /* ---------- 起動 ---------- */

  try {
    renderHeaderAndHero();
    renderStats();
    renderFeatured();
    renderIndex();
    renderProcess();
    renderGallery();
    renderMade();
    renderReflectionAndFooter();
    applyFilter('all', false);
    bindLightbox();
  } catch (e) {
    showLoadError();
    return;
  }

  window.addEventListener('hashchange', function () { handleHash(false); });
  handleHash(true);
})();
