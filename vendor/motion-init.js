/* Joyfulness Path ecosystem — shared Motion System init (Lenis smooth scroll).
   Keep this file byte-identical across joyfulnesspath-hub / winnie-angel-wealth10 /
   chamuel-heart-return so scroll feel stays consistent site to site.
   Fail-open by design: reduced motion, touch, or a failed Lenis load all fall
   back to native scrolling — never blocks or hides content. */
(function () {
  try {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (reduceMotion || isCoarsePointer || typeof window.Lenis !== 'function') return;

    var lenis = new window.Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.addEventListener('click', function (event) {
      var link = event.target.closest && event.target.closest('a[href^="#"]');
      if (!link) return;
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      var target;
      try { target = document.querySelector(hash); } catch (e) { target = null; }
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: -12 });
    }, false);
  } catch (e) {
    /* fail-open: leave native scrolling in place */
  }
})();
