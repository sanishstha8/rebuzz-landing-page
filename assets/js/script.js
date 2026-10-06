/* =============================================================
   ReBuzz Backup & Restore — landing page behaviour
   -------------------------------------------------------------
   Vanilla JS, no dependencies. Loaded with `defer`, so the DOM is
   parsed by the time this runs. Every module guards its own nodes
   so a missing section never breaks the rest of the page.
   ============================================================= */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     Configuration
     PRICING IS A PLACEHOLDER. Replace these figures (and the
     matching defaults in index.html) with real licence prices.
     ----------------------------------------------------------- */
  var CONFIG = {
    pricing: {
      yearly:  { personal: 49, business: 99,  agency: 199, suffix: '/year'  },
      monthly: { personal: 5,  business: 10,  agency: 19,  suffix: '/month' }
    }
  };

  var REDUCED = false;
  try {
    REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* no matchMedia: treat motion as allowed */ }

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };


  /* -----------------------------------------------------------
     1. Sticky header state + active section
     ----------------------------------------------------------- */
  function initHeader() {
    var header = $('#site-header');
    if (!header) return;

    var ticking = false;
    var apply = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }, { passive: true });

    apply();
  }

  function initActiveSection() {
    if (!('IntersectionObserver' in window)) return;

    var links = $$('.site-nav__list a[href^="#"]').filter(function (a) {
      return a.getAttribute('href').length > 1;
    });
    if (!links.length) return;

    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      map[id] = link;
      sections.push(section);
    });
    if (!sections.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) {
            l.classList.remove('is-active');
            l.removeAttribute('aria-current');
          });
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { io.observe(s); });
  }


  /* -----------------------------------------------------------
     2. Mobile menu
     ----------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = $('#nav-toggle');
    var closeBtn = $('#nav-close');
    var menu = $('#mobile-menu');
    if (!toggle || !menu) return;

    var lastScrollLock = '';

    var focusable = function () {
      return $$('a[href], button:not([disabled])', menu).filter(function (el) {
        return el.offsetParent !== null;
      });
    };

    var open = function () {
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      lastScrollLock = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      var items = focusable();
      if (items.length) items[0].focus();
      document.addEventListener('keydown', onKeydown);
    };

    var close = function (returnFocus) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = lastScrollLock;
      document.removeEventListener('keydown', onKeydown);
      if (returnFocus !== false) toggle.focus();
    };

    function onKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      var items = focusable();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (menu.hidden) { open(); } else { close(); }
    });

    if (closeBtn) closeBtn.addEventListener('click', function () { close(); });

    // Following a link inside the menu should dismiss it.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a[href]')) close(false);
    });

    // Returning to a desktop width leaves no way to close the overlay.
    window.addEventListener('resize', function () {
      if (!menu.hidden && window.innerWidth > 1024) close(false);
    });
  }


  /* -----------------------------------------------------------
     3. Screenshot lightbox — full-size view; the link works without JS
     ----------------------------------------------------------- */
  function initLightbox() {
    var box = $('#lightbox');
    if (!box || typeof box.showModal !== 'function') return;

    var scroller = $('.lightbox__scroll', box);
    var img = $('.lightbox__img', box);

    // never show a screenshot larger than its own pixels: that only blurs it
    img.addEventListener('load', function () { img.style.maxWidth = img.naturalWidth + 'px'; });

    $$('.shot__zoom').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        img.style.maxWidth = '';
        img.src = link.getAttribute('href');
        img.alt = $('img', link).alt;
        box.showModal();
        scroller.scrollTo(0, 0);
      });
    });

    $('.lightbox__close', box).addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === scroller) box.close();
    });
  }


  /* -----------------------------------------------------------
     3a. A look inside — tabs named after the plugin's own tabs.
     Without JS every screen stays visible, stacked. A tab with two
     screens gets a small switch above its caption. On touch screens
     the screenshot can be swiped to step through every screen in
     order, across tabs.
     ----------------------------------------------------------- */
  function initTour() {
    var tour = $('#tour');
    if (!tour) return;

    var tablist = $('.tour__tabs', tour);
    var tabs = $$('[role="tab"]', tour);
    var views = $$('.tour__item', tour);
    if (!tablist || !tabs.length || !views.length) return;

    var panelOf = function (tab) { return document.getElementById(tab.getAttribute('aria-controls')); };
    var tabOf = function (panel) { return $('#' + panel.getAttribute('aria-labelledby')); };

    // Keep the chosen tab in view when the tab row scrolls (phones).
    var reveal = function (tab) {
      var left = tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2;
      if (typeof tablist.scrollTo === 'function') {
        tablist.scrollTo({ left: left, behavior: REDUCED ? 'auto' : 'smooth' });
      } else {
        tablist.scrollLeft = left;
      }
    };

    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = panelOf(t);
        if (panel) panel.hidden = !on;
      });
      reveal(tab);
      if (focus) tab.focus();
    };

    // Show one screen of a two-screen panel and keep both switches in step.
    var showView = function (view, focus) {
      var siblings = $$('.tour__item', view.parentNode);
      var index = siblings.indexOf(view);
      siblings.forEach(function (v) {
        v.hidden = v !== view;
        $$('.tour__switch-btn', v).forEach(function (btn, j) {
          btn.setAttribute('aria-pressed', j === index ? 'true' : 'false');
        });
      });
      if (focus) $$('.tour__switch-btn', view)[index].focus();
    };

    $$('.tour__panel', tour).forEach(function (panel) {
      var siblings = $$('.tour__item', panel);
      if (siblings.length < 2) return;

      siblings.forEach(function (view) {
        var group = document.createElement('div');
        group.className = 'tour__switch';
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', 'Screens in this tab');

        siblings.forEach(function (target) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'tour__switch-btn';
          btn.textContent = target.getAttribute('data-view');
          btn.addEventListener('click', function () { showView(target, true); });
          group.appendChild(btn);
        });

        var caption = $('.tour__text', view);
        caption.insertBefore(group, caption.firstChild);
      });

      showView(siblings[0], false);
    });

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });

      // Arrow keys move between tabs (WAI-ARIA tabs pattern, automatic activation).
      tab.addEventListener('keydown', function (e) {
        var next = null;
        switch (e.key) {
          case 'ArrowRight': next = (i + 1) % tabs.length; break;
          case 'ArrowLeft':  next = (i - 1 + tabs.length) % tabs.length; break;
          case 'Home':       next = 0; break;
          case 'End':        next = tabs.length - 1; break;
          default: return;
        }
        e.preventDefault();
        select(tabs[next], true);
      });
    });

    // Arrows and swipes: next or previous screen, stopping at the first and last.
    var current = function () {
      return views.filter(function (v) { return !v.hidden && !v.parentNode.hidden; })[0];
    };

    var step = function (dir, fromArrow) {
      var target = views[views.indexOf(current()) + dir];
      if (!target) return;
      select(tabOf(target.parentNode), false);
      showView(target, false);
      if (!REDUCED) {
        var shot = $('.tour__shot', target);
        if (shot && typeof shot.animate === 'function') {
          shot.animate([
            { transform: 'translateX(' + (dir * 48) + 'px)', opacity: 0 },
            { transform: 'none', opacity: 1 }
          ], { duration: 260, easing: 'cubic-bezier(.22, .68, .3, 1)' });
        }
      }
      // The pressed arrow was in the screen just hidden: keep focus on the
      // same arrow in the new one, or the other one at either end.
      if (fromArrow) {
        var same = $(dir > 0 ? '.tour__arrow--next' : '.tour__arrow--prev', target);
        (same.disabled ? $('.tour__arrow:not([disabled])', target) : same).focus();
      }
    };

    // Each screenshot gets its own pair of arrows, set for its place in the order.
    views.forEach(function (view, i) {
      var shot = $('.tour__shot', view);
      var stage = document.createElement('div');
      stage.className = 'tour__stage';
      shot.parentNode.insertBefore(stage, shot);
      stage.appendChild(shot);

      [[-1, 'prev', 'Previous screen', 'i-chevron-left'],
       [1,  'next', 'Next screen',     'i-chevron-right']].forEach(function (a) {
        var target = views[i + a[0]];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tour__arrow tour__arrow--' + a[1];
        btn.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#' + a[3] + '"></use></svg>';
        if (target) {
          btn.setAttribute('aria-label', a[2] + ': ' + target.getAttribute('data-view'));
          btn.addEventListener('click', function () { step(a[0], true); });
        } else {
          btn.setAttribute('aria-label', a[2]);
          btn.disabled = true;
        }
        stage.appendChild(btn);
      });
    });

    var start = null;
    var swiped = false;

    $$('.tour__shot', tour).forEach(function (shot) {
      shot.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse') return;
        start = { x: e.clientX, y: e.clientY };
      });
      shot.addEventListener('pointerup', function (e) {
        if (!start) return;
        var dx = e.clientX - start.x;
        var dy = e.clientY - start.y;
        start = null;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        swiped = true;
        window.setTimeout(function () { swiped = false; }, 400);
        step(dx < 0 ? 1 : -1);
      });
      shot.addEventListener('pointercancel', function () { start = null; });
    });

    // A swipe ends on the screenshot link; don't let it open the full-size view.
    tour.addEventListener('click', function (e) {
      if (!swiped) return;
      e.preventDefault();
      e.stopPropagation();
      swiped = false;
    }, true);

    tablist.hidden = false;
    tour.classList.add('is-tabbed');
    select(tabs[0], false);
  }


  /* -----------------------------------------------------------
     3b. Demo video pop-up — the link opens YouTube in a new tab without
     JS; with JS the video plays here. The iframe only exists while the
     pop-up is open, so YouTube loads nothing until someone asks for it
     and closing the pop-up stops the sound.
     ----------------------------------------------------------- */
  function initVideo() {
    var box = $('#video-modal');
    var links = $$('[data-video]');
    if (!box || !links.length || typeof box.showModal !== 'function') return;

    var frame = $('.video-frame', box);
    var scroller = $('.lightbox__scroll', box);

    links.forEach(function (link) {
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' +
          encodeURIComponent(link.getAttribute('data-video')) +
          '?autoplay=1&rel=0&playsinline=1';
        iframe.title = 'ReBuzz Backup & Restore demo video';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.appendChild(iframe);
        box.showModal();
      });
    });

    $('.lightbox__close', box).addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target === scroller) box.close();
    });
    box.addEventListener('close', function () { frame.textContent = ''; });
  }


  /* -----------------------------------------------------------
     4. FAQ accordion
     ----------------------------------------------------------- */
  function initAccordion() {
    var root = $('#faq-list');
    if (!root) return;

    var buttons = $$('.faq__q', root);
    if (!buttons.length) return;

    var settle = function (btn, panel) {
      // Whichever transition lands last resolves against current state.
      panel.style.height = '';
      if (btn.getAttribute('aria-expanded') !== 'true') panel.hidden = true;
    };

    var open = function (btn, panel) {
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;

      if (REDUCED) { panel.style.height = ''; return; }

      var target = panel.scrollHeight;
      panel.style.height = '0px';
      void panel.offsetHeight;           // force a reflow so the transition runs
      panel.style.height = target + 'px';
    };

    var close = function (btn, panel) {
      btn.setAttribute('aria-expanded', 'false');

      if (REDUCED) { panel.hidden = true; panel.style.height = ''; return; }

      panel.style.height = panel.scrollHeight + 'px';
      void panel.offsetHeight;
      panel.style.height = '0px';
    };

    buttons.forEach(function (btn, i) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;

      panel.addEventListener('transitionend', function (e) {
        if (e.propertyName === 'height') settle(btn, panel);
      });

      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) { close(btn, panel); } else { open(btn, panel); }
      });

      // Arrow-key navigation between headers (WAI-ARIA accordion pattern).
      btn.addEventListener('keydown', function (e) {
        var next = null;

        switch (e.key) {
          case 'ArrowDown': next = (i + 1) % buttons.length; break;
          case 'ArrowUp':   next = (i - 1 + buttons.length) % buttons.length; break;
          case 'Home':      next = 0; break;
          case 'End':       next = buttons.length - 1; break;
          default: return;
        }

        e.preventDefault();
        buttons[next].focus();
      });
    });
  }


  /* -----------------------------------------------------------
     5. Pricing — billing period toggle
     ----------------------------------------------------------- */
  function initPricing() {
    var buttons = $$('.billing__btn');
    if (!buttons.length) return;

    var prices = $$('[data-price]');
    var periods = $$('[data-period]');

    var render = function (period) {
      var table = CONFIG.pricing[period];
      if (!table) return;

      prices.forEach(function (el) {
        var plan = el.getAttribute('data-price');
        if (table[plan] !== undefined) el.textContent = String(table[plan]);
      });

      periods.forEach(function (el) { el.textContent = table.suffix; });

      buttons.forEach(function (btn) {
        var active = btn.getAttribute('data-billing') === period;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    };

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        render(btn.getAttribute('data-billing'));
      });
    });

    render('yearly');
  }


  /* -----------------------------------------------------------
     6. Placeholder links
     These point at pages that do not exist yet. They stay
     keyboard-reachable and labelled, but never navigate.
     ----------------------------------------------------------- */
  function initPlaceholderLinks() {
    var links = $$('a[data-placeholder-link]');

    links.forEach(function (link) {
      if (!link.title) {
        link.title = 'Placeholder link — connect this to the real page before launch';
      }
    });

    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a[data-placeholder-link]');
      if (link) e.preventDefault();
    });
  }


  /* -----------------------------------------------------------
     7. Hero Core — a few pixels of pointer parallax
     Desktop pointers only, and never when motion is reduced.
     ----------------------------------------------------------- */
  function initCoreParallax() {
    if (REDUCED) return;

    var core = $('#rebuzz-core');
    if (!core) return;

    var svg = $('.core__svg', core);
    if (!svg) return;

    var fine = true;
    try { fine = window.matchMedia('(pointer: fine)').matches; } catch (e) { /* assume fine */ }
    if (!fine) return;

    var hero = core.closest('.hero') || core;
    var frame = null;

    var move = function (e) {
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        var box = hero.getBoundingClientRect();
        var dx = (e.clientX - (box.left + box.width / 2)) / box.width;
        var dy = (e.clientY - (box.top + box.height / 2)) / box.height;
        svg.style.transform = 'translate3d(' + (dx * 12).toFixed(2) + 'px,' +
                              (dy * 9).toFixed(2) + 'px, 0)';
        frame = null;
      });
    };

    var reset = function () {
      svg.style.transform = '';
    };

    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', reset);
  }


  /* -----------------------------------------------------------
     Boot
     ----------------------------------------------------------- */
  initHeader();
  initActiveSection();
  initMobileMenu();
  initLightbox();
  initTour();
  initVideo();
  initAccordion();
  initPricing();
  initPlaceholderLinks();
  initCoreParallax();
})();
