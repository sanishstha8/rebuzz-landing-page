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

    $$('.shot__zoom').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
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
  initAccordion();
  initPricing();
  initPlaceholderLinks();
  initCoreParallax();
})();
