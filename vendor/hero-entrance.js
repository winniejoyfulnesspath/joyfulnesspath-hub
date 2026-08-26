/* Joyfulness Path main site — hero "breathing gate" entrance.
   Fail-open: the hero's CSS default is fully visible with no transform;
   this script only ADDS classes that switch on the hidden->reveal states
   defined in index.html's <style>. If this script never runs (blocked,
   404s, throws), the hero just renders normally, statically visible. */
(function () {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var hero = document.querySelector('.hero');
    if (!hero) return;
    hero.classList.add('hero-armed');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add('hero-in');
      });
    });
  } catch (e) {
    /* fail-open: hero stays in its default fully-visible state */
  }
})();
