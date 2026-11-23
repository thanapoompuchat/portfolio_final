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
    el.addEventListener('mouseenter', start); el.addEventListener('mouseleave', stop);
    el.addEventListener('focus', start); el.addEventListener('blur', stop);
    el.addEventListener('click', function () { el.classList.toggle('on'); if (el.classList.contains('on')) start(); else stop(); });
  });
})();
