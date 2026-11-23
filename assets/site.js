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
})();
