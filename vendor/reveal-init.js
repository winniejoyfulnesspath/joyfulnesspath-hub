/* Joyfulness Path ecosystem — shared reveal system (native IntersectionObserver only,
   no whileInView/animation libraries). Keep in sync with wealth10's bespoke reveal
   numbers: 8-10px travel, 40-50ms stagger step, fail-open at every stage.
   Drives any one-shot "becomes visible once scrolled into view" element:
   [data-reveal] (fade+rise), [data-curtain] (statement wipe-open panels),
   [data-signpost] (connect row line-draw) — each attribute's own CSS decides
   what .is-in actually looks like; this script only manages the timing.

   Waits for web fonts to settle before arming: this page loads Noto Serif/
   Sans TC from Google Fonts, and CJK subsets can take noticeably longer to
   swap in than the fallback stack. If the observer started against the
   fallback-font layout, elements sized/positioned differently once the real
   font swaps in could get measured as already "in view" and get marked
   revealed before the user ever actually scrolled to them — a real bug this
   caused, not a hypothetical one. Elements stay in their default fully
   visible state (no motion-ready yet) for that whole wait, so this delay is
   never visible as a flash of hidden content. */
(function () {
  var items = document.querySelectorAll('[data-reveal], [data-curtain], [data-signpost]');
  if (!items.length) return;

  function revealAll() {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  function arm() {
    document.documentElement.classList.add('motion-ready');

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

    // Fail-open safety net: nothing may stay stuck at opacity:0 forever if
    // IntersectionObserver somehow never fires for something. NOT a normal
    // reading-pace cover — 4s was long enough for anyone reading the hero
    // before scrolling to blow past it, silently force-revealing the whole
    // page before the user ever scrolled (the actual bug reported: reveal
    // "never happens" because it already happened, off-screen, seconds
    // before they got there). 20s is past any normal dwell time; this is a
    // true last-resort, not a routine trigger.
    setTimeout(revealAll, 20000);
  }

  try {
    if (document.fonts && document.fonts.ready) {
      var armed = false;
      var armOnce = function () { if (!armed) { armed = true; arm(); } };
      document.fonts.ready.then(armOnce).catch(armOnce);
      setTimeout(armOnce, 500); // don't let a slow/unsupported font load hold the whole page hostage
    } else {
      arm();
    }
  } catch (e) {
    arm();
  }
})();
