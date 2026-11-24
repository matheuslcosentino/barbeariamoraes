/* BARBEARIA MORAES — renderização a partir de config.js */
(function () {
  'use strict';
  var C = window.SITE_CONFIG;
  if (!C) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var use = function (id) { return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-' + id + '"></use></svg>'; };
  var ext = ' target="_blank" rel="noopener"';
  var A = C.address, K = C.contact;

  var Links = {
    route: function () { return 'https://www.google.com/maps/dir/?api=1&destination=' + A.geo.lat + ',' + A.geo.lng; },
    place: function () { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(A.mapsQuery); },
    embed: function () { return 'https://maps.google.com/maps?q=' + encodeURIComponent(A.mapsQuery) + '&z=17&hl=pt-BR&output=embed'; },
    wa: function () { return K.whatsapp ? 'https://wa.me/' + K.whatsapp.number + '?text=' + encodeURIComponent(C.messages.general) : null; },
    tel: function () { return K.phone ? 'tel:' + K.phone.number : null; },
  };
  window.SiteLinks = Links;

  var street = function () { return [A.street, A.complement].filter(Boolean).join(' – '); };
  var city = function () { return [A.district, A.city + ' – ' + A.state].filter(Boolean).join(', '); };

  /* Horários / status */
  var DAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  var toMin = function (t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; };
  var fmt = function (m) { var h = Math.floor(m / 60), mm = m % 60; return h + 'h' + (mm ? pad(mm) : ''); };
  function now() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    var v = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var h = +v('hour'); if (h === 24) h = 0;
    return { day: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[v('weekday')], min: h * 60 + +v('minute') };
  }
  function range(d) { var r = C.hours.find(function (h) { return h.days.indexOf(d) >= 0; }); return r && !r.closed ? { o: toMin(r.open), c: toMin(r.close) } : null; }
  function status() {
    var n = now(), t = range(n.day);
    if (t && n.min >= t.o && n.min < t.c) {
      var left = t.c - n.min;
      return { open: true, text: left <= 60 ? 'Aberto · fecha às ' + fmt(t.c) + ', corre!' : 'Aberto agora · até as ' + fmt(t.c) };
    }
    if (t && n.min < t.o) return { open: false, text: 'Fechado · abre hoje às ' + fmt(t.o) };
    for (var k = 1; k <= 7; k++) { var d = (n.day + k) % 7, r = range(d); if (r) return { open: false, text: 'Fechado · abre ' + (k === 1 ? 'amanhã' : DAYS[d]) + ' às ' + fmt(r.o) }; }
    return null;
  }
  function updateStatus() {
    var s = status();
    $$('[data-status]').forEach(function (el) {
      if (!s) { el.hidden = true; return; }
      el.classList.toggle('is-open', s.open); el.classList.toggle('is-closed', !s.open);
      var t = $('[data-status-text]', el); if (t) t.textContent = s.text;
    });
  }
  function hoursHtml(compact) {
    var today = now().day;
    var rows = C.hours.map(function (h) {
      var time = h.closed ? 'Fechado' : fmt(toMin(h.open)) + ' às ' + fmt(toMin(h.close));
      return compact ? esc(h.label) + ': ' + time : '<div class="hours__row' + (h.days.indexOf(today) >= 0 ? ' is-today' : '') + '"><span>' + esc(h.label) + '</span><span>' + time + '</span></div>';
    });
    return compact ? rows.join('<br>') : '<div class="hours">' + rows.join('') + (C.hoursNote ? '<p class="hours__note">' + esc(C.hoursNote) + '</p>' : '') + '</div>';
  }

  var ICONS = {
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
    razor: '<path d="M2 9h13.5a2.5 2.5 0 0 1 0 5H6z"/><path d="M15.5 9 21 4.5"/><path d="M5 11.5h8"/>',
    brow: '<path d="M3 12c3-4 7-5 11-4 3 .7 5 2 7 4"/><path d="M5 16c2.5-2 6-2.6 9-2"/>',
  };

  function channels() {
    var out = [];
    if (K.phone) out.push('<li><a href="' + Links.tel() + '">' + use('phone') + 'Telefone ' + esc(K.phone.display) + '</a></li>');
    if (K.whatsapp) out.push('<li><a href="' + Links.wa() + '"' + ext + '>' + use('whatsapp') + 'WhatsApp ' + esc(K.whatsapp.display) + '</a></li>');
    if (K.instagram) out.push('<li><a href="' + esc(K.instagram.url) + '"' + ext + '>' + use('instagram') + 'Instagram ' + esc(K.instagram.handle) + '</a></li>');
    return out.join('');
  }
  function faqAnswer(t) {
    return esc(t)
      .replace('{horarios}', hoursHtml(true).replace(/<br>/g, '; ') + '. ' + esc(C.hoursNote || ''))
      .replace('{endereco}', esc(street() + ', ' + city()))
      .replace('{telefone}', K.phone ? '<a href="' + Links.tel() + '">' + esc(K.phone.display) + '</a>' : '')
      .replace('{instagram}', K.instagram ? '<a href="' + esc(K.instagram.url) + '"' + ext + '>' + esc(K.instagram.handle) + '</a>' : '');
  }

  window.SiteRender = {
    init: function () {
      var m = $('[data-marquee]');
      if (m) { var chunk = '<span>' + ['Cabelo', 'Barba', 'Sobrancelha', 'Ordem de chegada', 'Centro de BC'].map(function (w) { return esc(w) + ' <b>✂</b>'; }).join(' ') + '</span>'; m.innerHTML = chunk + chunk + chunk; }

      var sv = $('[data-render="services"]');
      if (sv) sv.innerHTML = C.services.map(function (s, i) {
        return '<li class="svc" data-anim><span class="svc__num">' + pad(i + 1) + '</span><span class="svc__icon" aria-hidden="true"><svg viewBox="0 0 24 24">' + (ICONS[s.icon] || '') + '</svg></span><h3>' + esc(s.name) + '</h3><p>' + esc(s.text) + '</p></li>';
      }).join('');

      var st = $('[data-render="steps"]');
      if (st) st.innerHTML = C.steps.map(function (s, i) {
        return '<li class="step" data-anim><span class="step__n" aria-hidden="true">' + pad(i + 1) + '</span><div><h3>' + esc(s.title) + '</h3><p>' + esc(s.text) + '</p></div></li>';
      }).join('');

      var g = $('[data-render="gallery"]');
      if (g) g.innerHTML = C.gallery.map(function (p, i) {
        return '<li class="cut" data-n="#' + pad(i + 1) + '"><picture><source srcset="' + esc(p.src) + '.webp" type="image/webp"><img src="' + esc(p.src) + '.jpg" alt="' + esc(p.alt) + '" loading="lazy" decoding="async"></picture></li>';
      }).join('');

      var R = C.reviews, rv = $('[data-render="reviews"]');
      if (!R || !R.enabled) { var sec = $('#avaliacoes'); if (sec) sec.remove(); }
      else {
        if (rv) rv.innerHTML = R.items.map(function (r) { return '<li class="review" data-anim><blockquote><p>“' + esc(r.text) + '”</p><footer>★★★★★ · ' + esc(r.author) + '</footer></blockquote></li>'; }).join('');
        var tg = $('[data-render="review-tags"]');
        if (tg) tg.innerHTML = (R.tags || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
      }

      var fq = $('[data-render="faq"]');
      if (fq) {
        fq.innerHTML = C.faq.map(function (f, i) {
          return '<div class="faq-item" data-anim><h3><button class="faq-item__btn" type="button" id="fq-' + i + '" aria-expanded="false" aria-controls="fp-' + i + '"><span>' + esc(f.q) + '</span><span class="faq-item__icon" aria-hidden="true"></span></button></h3>' +
            '<div class="faq-item__panel" id="fp-' + i + '" role="region" aria-labelledby="fq-' + i + '"><div><p>' + faqAnswer(f.a) + '</p></div></div></div>';
        }).join('');
        var tmp = document.createElement('div'), s = document.createElement('script');
        s.type = 'application/ld+json';
        s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: C.faq.map(function (f) { tmp.innerHTML = faqAnswer(f.a); return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: tmp.textContent } }; }) });
        document.head.appendChild(s);
      }

      $$('[data-render="address"]').forEach(function (el) { el.innerHTML = esc(street()) + '<br>' + esc(city()) + '<br>CEP ' + esc(A.zip); });
      $$('[data-render="footer-address"]').forEach(function (el) { el.innerHTML = esc(street()) + '<br>' + esc(city()); });
      $$('[data-render="hours"]').forEach(function (el) { el.innerHTML = hoursHtml(false); });
      $$('[data-render="footer-hours"]').forEach(function (el) { el.innerHTML = hoursHtml(true) + '<br>Ordem de chegada'; });
      $$('[data-render="channels"], [data-render="footer-channels"]').forEach(function (el) { el.innerHTML = channels(); });

      $$('[data-route]').forEach(function (a) { a.href = Links.route(); });
      $$('[data-place]').forEach(function (a) { a.href = Links.place(); });
      $$('[data-wa]').forEach(function (a) { var u = Links.wa(); if (u) a.href = u; else a.remove(); });
      $$('[data-tel]').forEach(function (a) { var u = Links.tel(); if (u) a.href = u; else a.remove(); });
      $$('[data-instagram]').forEach(function (a) { a.href = K.instagram.url; });
      if (C.rating) {
        $$('[data-rating-value]').forEach(function (el) { el.textContent = C.rating.value; });
        $$('[data-rating-count]').forEach(function (el) { el.textContent = C.rating.count; });
        $$('[data-rating-checked]').forEach(function (el) { el.textContent = 'consultado em ' + C.rating.checkedAt; });
      }
      $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
      updateStatus();
      setInterval(updateStatus, 60000);
    },
  };
})();
