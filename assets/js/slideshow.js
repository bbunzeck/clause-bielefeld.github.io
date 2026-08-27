/* Group photo slideshow: manual navigation only, no auto-advance.
   Each slide carries its own caption, so image and text move together. */
(function () {
  'use strict';

  function setup(root) {
    var viewport = root.querySelector('.slideshow__viewport');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.slideshow__slide'));
    var dots = root.querySelector('.slideshow__dots');
    var prev = root.querySelector('[data-slide-prev]');
    var next = root.querySelector('[data-slide-next]');
    var timer = null;

    if (!viewport || !dots || !prev || !next || slides.length === 0) {
      return;
    }

    function index() {
      return Math.round(viewport.scrollLeft / viewport.clientWidth);
    }

    function goTo(i) {
      var target = Math.max(0, Math.min(i, slides.length - 1));
      viewport.scrollTo({ left: target * viewport.clientWidth, behavior: 'smooth' });
    }

    function sync() {
      var i = index();
      Array.prototype.forEach.call(dots.children, function (dot, j) {
        dot.setAttribute('aria-current', j === i ? 'true' : 'false');
      });
      prev.disabled = (i === 0);
      next.disabled = (i === slides.length - 1);
    }

    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slideshow__dot';
      dot.setAttribute('aria-label', 'Show photo ' + (i + 1) + ' of ' + slides.length);
      dot.addEventListener('click', function () { goTo(i); });
      dots.appendChild(dot);
    });

    prev.addEventListener('click', function () { goTo(index() - 1); });
    next.addEventListener('click', function () { goTo(index() + 1); });

    viewport.addEventListener('scroll', function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(sync, 80);
    });

    viewport.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); goTo(index() + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(index() - 1); }
    });

    window.addEventListener('resize', sync);
    sync();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.slideshow'), setup);
})();
