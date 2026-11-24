/* BARBEARIA MORAES — orquestração (Lenis + GSAP). ?animacoes=on força as animações. */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches && !root.classList.contains('force-motion');
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var motion = hasGSAP && root.classList.contains('motion-ok') && !reduce;
  var gsap = window.gsap, ST = window.ScrollTrigger, lenis = null, pole = null;

  if (window.SiteRender) window.SiteRender.init();
  var Links = window.SiteLinks;
  if (hasGSAP) gsap.registerPlugin(ST);
  if (motion) root.classList.add('motion-ready'); else root.classList.remove('motion-ok');

  if (motion && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1 });
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Âncoras
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var t = a.getAttribute('href').length > 1 && document.getElementById(a.getAttribute('href').slice(1));
    if (!t) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t, { duration: 1.4 }); else t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
  });

  // Navbar, link ativo, poste de progresso e botão flutuante
  var nav = $('[data-nav]'), fill = $('[data-pole-fill]'), fab = $('[data-fab]'), hero = $('.hero');
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('is-scrolled', y > 24);
    if (fill) { fill.style.setProperty('--p', (max > 0 ? y / max : 0).toFixed(4)); fill.style.setProperty('--shift', (y * 0.25).toFixed(1) + 'px'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var links = $$('[data-nav-link]');
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) {
      if (!x.isIntersecting) return;
      var id = x.target.getAttribute('data-section');
      links.forEach(function (l) { if (l.getAttribute('data-nav-link') === id) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
    });
  }, { rootMargin: '-45% 0px -54% 0px' });
  $$('[data-section]').forEach(function (s) { io.observe(s); });
  var endSeen = new Set(), heroOut = false;
  var upd = function () { fab.classList.toggle('is-visible', heroOut && endSeen.size === 0); };
  new IntersectionObserver(function (e) { heroOut = e[0].intersectionRatio < 0.3; upd(); }, { threshold: [0, 0.3, 1] }).observe(hero);
  var io2 = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) endSeen.add(x.target); else endSeen.delete(x.target); }); upd(); });
  [$('#horarios'), $('.cta'), $('.footer')].forEach(function (n) { if (n) io2.observe(n); });

  // FAQ
  $$('.faq-item').forEach(function (it) {
    var b = it.querySelector('button');
    b.addEventListener('click', function () { var o = !it.classList.contains('is-open'); it.classList.toggle('is-open', o); b.setAttribute('aria-expanded', String(o)); setTimeout(function () { if (hasGSAP) ST.refresh(); }, 550); });
  });

  // Mapa sob demanda
  var map = $('[data-map]');
  if (map) {
    var mo = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return; mo.disconnect();
      var f = document.createElement('iframe'); f.src = Links.embed(); f.title = 'Mapa da Barbearia Moraes'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      f.addEventListener('load', function () { map.classList.add('is-loaded'); }); map.appendChild(f);
    }, { rootMargin: '600px 0px' });
    mo.observe(map);
  }

  // Poste 3D
  var pEl = $('[data-pole3d]');
  if (pEl && window.BarberPole) {
    window.BarberPole.mount(pEl, { reduceMotion: !motion }).then(function (api) {
      pole = api;
      if (api && hasGSAP) ST.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: function (s) { api.setScroll(s.progress); api.kick(Math.min(Math.abs(s.getVelocity()) / 8000, 0.4)); } });
    });
  }

  if (!motion) return;

  // Abertura
  var tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
  tl.to('[data-hero-name] > span', { y: 0, duration: 1.3, stagger: 0.1 }, 0.2)
    .to('[data-hero]', { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.5)
    .from('.hero__photo--a', { opacity: 0, y: 80, rotate: -12, duration: 1.6 }, 0.3)
    .from('.hero__photo--b', { opacity: 0, y: 80, rotate: 12, duration: 1.6 }, 0.45)
    .from('.pole3d', { opacity: 0, scale: 0.8, duration: 1.6 }, 0.5);
  gsap.to('.hero__photo--a', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__photo--b', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Reveals
  ST.batch('[data-anim]', { start: 'top 90%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }); } });

  // Faixa vermelha acelera com o scroll
  var mq = $('[data-marquee]');
  if (mq) {
    var tw = gsap.to(mq, { xPercent: -33.333, duration: 24, ease: 'none', repeat: -1 });
    ST.create({ onUpdate: function (s) { var v = 1 + Math.min(Math.abs(s.getVelocity()) / 400, 5); tw.timeScale(s.direction < 0 ? -v : v); gsap.to(tw, { timeScale: s.direction < 0 ? -1 : 1, duration: 1, delay: 0.2, overwrite: true }); } });
  }

  // Galeria horizontal fixada (desktop)
  gsap.matchMedia().add('(min-width: 1024px)', function () {
    var track = $('[data-cuts-track]');
    var dist = function () { return Math.max(0, track.scrollWidth - innerWidth); };
    gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '[data-cuts-pin]', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 } });
  });

  window.addEventListener('load', function () { ST.refresh(); });
})();
