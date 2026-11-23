// Nav border on scroll, reveal-on-scroll, and placeholders for images not exported yet.
(function () {
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // A figure whose image fails to load shows its alt text as a labelled placeholder,
  // so the layout holds until the real PNG is dropped into /images.
  document.querySelectorAll('.shot .frame img, .feature .visual img, .card .thumb img').forEach(function (img) {
    var mark = function () {
      var box = img.closest('.frame') || img.parentElement;
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
})();
