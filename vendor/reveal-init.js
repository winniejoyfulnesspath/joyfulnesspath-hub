/* Joyfulness Path ecosystem — shared reveal system (native IntersectionObserver only,
   no whileInView/animation libraries). Keep in sync with wealth10's bespoke reveal
   numbers: 8-10px travel, 40-50ms stagger step, fail-open at every stage.
   Drives any one-shot "becomes visible once scrolled into view" element:
   [data-reveal] (fade+rise), [data-curtain] (statement wipe-open panels),
   [data-signpost] (connect row line-draw) — each attribute's own CSS decides
   what .is-in actually looks like; this script only manages the timing. */
(function () {
  var items = document.querySelectorAll('[data-reveal], [data-curtain], [data-signpost]');
  if (!items.length) return;

  document.documentElement.classList.add('motion-ready');

  function revealAll() {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  if (!('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  try {
    var io = new IntersectionObserver(function (entries, observer) {
      var order = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var step = Math.min(order, 3) * 45; // 40-50ms band per item, capped so long lists don't crawl
        entry.target.style.transitionDelay = step + 'ms';
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
        order++;
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { io.observe(el); });
  } catch (e) {
    revealAll();
    return;
  }

  // Fail-open safety net: nothing may stay stuck at opacity:0.
  setTimeout(revealAll, 4000);
})();
