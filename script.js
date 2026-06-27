/* =========================================================
   Hugo Pazotto — Portfolio interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---- Mobile nav ---- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      var open = nav.classList.contains('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('is-open'); });
    });
  }

  /* ---- Sticky header state ---- */
  var header = document.querySelector('.header');
  function onScroll() {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 12);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Animated counters ---- */
  function animateCount(el) {
    var raw = el.getAttribute('data-count');         // e.g. "250", "90", "380"
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var target = parseFloat(raw);
    if (isNaN(target)) { return; }
    var dur = 1400, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val.toLocaleString('pt-BR') + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---- Active nav link on scroll-spy ---- */
  var sections = [].slice.call(document.querySelectorAll('section[id]'));
  var navLinks = [].slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.getAttribute('id');
          navLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Current year ---- */
  var yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Testimonials filter ---- */
  var filters = document.querySelectorAll('.tst-filter');
  var cards = document.querySelectorAll('.tst-card');
  if (filters.length && cards.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        filters.forEach(function (b) { b.classList.toggle('active', b === btn); });
        cards.forEach(function (c) {
          var show = cat === 'all' || c.getAttribute('data-cat') === cat;
          c.classList.toggle('is-hidden', !show);
        });
      });
    });
  }
})();
