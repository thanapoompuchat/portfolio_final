// Reveal-on-scroll, and a labelled placeholder for any image that fails to load.
(function () {
  document.querySelectorAll('.shot .frame img, .thumbs .frame img').forEach(function (img) {
    var mark = function () {
      var box = img.closest('.frame');
      box.classList.add('missing');
      if (!box.querySelector('.ph')) {
        var ph = document.createElement('span');
        ph.className = 'ph';
        ph.textContent = img.alt || 'Image coming soon';
        box.appendChild(ph);
      }
    };
    if (img.complete && img.naturalWidth === 0 && img.loading !== 'lazy') mark();
    img.addEventListener('error', mark);
  });

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // keep brand hover previews inside the viewport
  document.querySelectorAll('.brand').forEach(function (b) {
    var pop = b.querySelector('.pop'); if (!pop) return;
    function fit() {
      var op = pop.offsetParent; if (!op) return;
      var left = op.getBoundingClientRect().left + pop.offsetLeft - pop.offsetWidth / 2;
      var right = left + pop.offsetWidth, w = document.documentElement.clientWidth, m = 16, dx = 0;
      if (right > w - m) dx = (w - m) - right;
      if (left + dx < m) dx = m - left;
      pop.style.setProperty('--dx', dx + 'px');
    }
    b.addEventListener('mouseenter', fit); b.addEventListener('focus', fit);
  });

  // CultureAI audit demo: count the score down, tap to toggle on touch screens
  document.querySelectorAll('.audit').forEach(function (a) {
    var num = a.querySelector('.a-num'), t = null;
    function run() {
      clearInterval(t); var v = 100, end = 58; num.textContent = v;
      t = setInterval(function () { v -= 2; if (v <= end) { v = end; clearInterval(t); } num.textContent = v; }, 28);
    }
    function reset() { clearInterval(t); num.textContent = '--'; }
    a.addEventListener('mouseenter', run);
    a.addEventListener('mouseleave', function () { if (!a.classList.contains('on')) reset(); });
    a.addEventListener('focus', run);
    a.addEventListener('click', function () { a.classList.toggle('on'); if (a.classList.contains('on')) run(); else reset(); });
  });

  // CultureAI title: on hover, scramble the name into other languages
  document.querySelectorAll('.loc').forEach(function (el) {
    var w = el.querySelector('.loc-w'), tag = el.querySelector('.loc-tag');
    var list = el.dataset.words.split(';').map(function (x) { return x.split('|'); });
    var i = 0, loop = null, anim = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(n) {
      var target = list[n][0], f = 0, frames = reduce ? 1 : 9;
      tag.textContent = list[n][1];
      w.classList.toggle('rtl', list[n][1] === 'AR');
      clearInterval(anim);
      anim = setInterval(function () {
        f++;
        if (f >= frames) { w.textContent = target; clearInterval(anim); return; }
        var keep = Math.floor(target.length * f / frames), out = '';
        for (var c = 0; c < target.length; c++) {
          out += c < keep || target[c] === ' ' ? target[c] : target[Math.floor(Math.random() * target.length)];
        }
        w.textContent = out;
      }, 32);
    }
    function start() { if (loop) return; i = 0; loop = setInterval(function () { i = (i + 1) % list.length; show(i); }, 900); i = 1; show(1); }
    function stop() { clearInterval(loop); loop = null; i = 0; show(0); }
    // listen on the whole title row: the word changes width, so the cursor must not fall off it
    var zone = el.closest('h1') || el;
    zone.addEventListener('mouseenter', function () { el.classList.add('hv'); start(); });
    zone.addEventListener('mouseleave', function () { el.classList.remove('hv'); if (!el.classList.contains('on')) stop(); });
    el.addEventListener('focus', start); el.addEventListener('blur', function () { if (!el.classList.contains('on')) stop(); });
    zone.addEventListener('click', function () { el.classList.toggle('on'); if (el.classList.contains('on')) start(); else stop(); });
  });

  // BeTask title: hover "signs in" - letters turn to password dots, then reveal with a live clock
  document.querySelectorAll('.login').forEach(function (el) {
    var w = el.querySelector('.lg-w'), st = el.querySelector('.lg-st'), ck = el.querySelector('.lg-clock');
    var text = w.dataset.text, timers = [], tick = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function clock() { var d = new Date(); ck.textContent = d.toTimeString().slice(0, 8); }
    function clear() { timers.forEach(clearTimeout); timers = []; clearInterval(tick); }
    function start() {
      clear(); el.classList.remove('ok'); el.classList.add('hv');
      st.textContent = 'Signing in'; ck.textContent = '';
      var step = reduce ? 0 : 55;
      w.classList.add('masked');
      for (var n = 1; n <= text.length; n++) (function (n) {
        later(function () { w.textContent = '\u2022'.repeat(n) + text.slice(n); }, n * step);
      })(n);
      later(function () {
        w.classList.remove('masked'); w.textContent = text;
        el.classList.add('ok'); st.textContent = 'Signed in'; clock(); tick = setInterval(clock, 1000);
      }, reduce ? 0 : text.length * step + 450);
    }
    function stop() { clear(); el.classList.remove('hv', 'ok'); w.classList.remove('masked'); w.textContent = text; }
    var zone = el.closest('h1') || el;
    zone.addEventListener('mouseenter', start);
    zone.addEventListener('mouseleave', function () { if (!el.classList.contains('on')) stop(); });
    el.addEventListener('focus', start); el.addEventListener('blur', function () { if (!el.classList.contains('on')) stop(); });
    zone.addEventListener('click', function () { el.classList.toggle('on'); if (el.classList.contains('on')) start(); else stop(); });
  });

  // generic title hover zone: toggles .hv on .hz elements when the whole title row is hovered or tapped
  document.querySelectorAll('.hz').forEach(function (el) {
    var zone = el.closest('h1') || el;
    zone.addEventListener('mouseenter', function () { el.classList.add('hv'); });
    zone.addEventListener('mouseleave', function () { if (!el.classList.contains('on')) el.classList.remove('hv'); });
    el.addEventListener('focus', function () { el.classList.add('hv'); });
    el.addEventListener('blur', function () { if (!el.classList.contains('on')) el.classList.remove('hv'); });
    zone.addEventListener('click', function () { el.classList.toggle('on'); el.classList.toggle('hv', el.classList.contains('on')); });
  });
})();
