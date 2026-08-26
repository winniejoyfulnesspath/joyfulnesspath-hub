/* Joyfulness Path main site — "a path runs through the homepage".
   Desktop-only decorative SVG line from the hero ring down to Connection,
   drawn in proportion to how far the viewport has scrolled through that
   range, with a node lighting up at each section it passes. Purely
   additive: nothing else on the page depends on this running, so any
   failure here just means the page has no path line — never a broken one. */
(function () {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 900) return;

    var main = document.getElementById('main');
    var startEl = document.querySelector('.hero .halo');
    var endEl = document.getElementById('connect');
    var sectionEls = [
      document.getElementById('statement'),
      document.getElementById('about'),
      document.getElementById('events'),
      document.getElementById('connect')
    ];
    if (!main || !startEl || !endEl || sectionEls.indexOf(null) !== -1) return;

    var container = document.createElement('div');
    container.className = 'joy-path';
    container.setAttribute('aria-hidden', 'true');
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    var defs = document.createElementNS(svgNS, 'defs');
    var gradient = document.createElementNS(svgNS, 'linearGradient');
    gradient.setAttribute('id', 'joyPathGradient');
    gradient.setAttribute('x1', '0'); gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '0'); gradient.setAttribute('y2', '1');
    ['0%', '50%', '100%'].forEach(function (offset, i) {
      var stop = document.createElementNS(svgNS, 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', i === 1 ? '#c3a46c' : '#985f6b');
      gradient.appendChild(stop);
    });
    defs.appendChild(gradient);
    svg.appendChild(defs);
    var line = document.createElementNS(svgNS, 'path');
    line.setAttribute('class', 'joy-path-line');
    svg.appendChild(line);
    var nodes = sectionEls.map(function () {
      var c = document.createElementNS(svgNS, 'circle');
      c.setAttribute('class', 'joy-path-node');
      c.setAttribute('r', '4');
      c.setAttribute('cx', '12');
      svg.appendChild(c);
      return c;
    });
    container.appendChild(svg);
    main.appendChild(container);

    var pathTop = 0, pathHeight = 0, totalLength = 0, nodeRatios = [];

    function offsetFrom(el, ancestor) {
      var y = 0;
      while (el && el !== ancestor) { y += el.offsetTop; el = el.offsetParent; }
      return y;
    }

    function layout() {
      pathTop = offsetFrom(startEl, main);
      var bottom = offsetFrom(endEl, main) + endEl.offsetHeight;
      pathHeight = Math.max(1, bottom - pathTop);
      container.style.top = pathTop + 'px';
      container.style.height = pathHeight + 'px';
      svg.setAttribute('viewBox', '0 0 24 ' + pathHeight);
      svg.style.height = pathHeight + 'px';
      var d = 'M12,0 L12,' + pathHeight;
      line.setAttribute('d', d);
      totalLength = pathHeight;
      line.style.strokeDasharray = totalLength;
      nodeRatios = sectionEls.map(function (el) {
        var y = offsetFrom(el, main) + el.offsetHeight * 0.18 - pathTop;
        return Math.min(1, Math.max(0, y / pathHeight));
      });
      nodes.forEach(function (n, i) { n.setAttribute('cy', nodeRatios[i] * pathHeight); });
      update();
    }

    function update() {
      var viewportRef = window.scrollY + window.innerHeight * 0.5;
      var progress = (viewportRef - pathTop) / pathHeight;
      progress = Math.min(1, Math.max(0, progress));
      line.style.strokeDashoffset = totalLength * (1 - progress);
      nodes.forEach(function (n, i) {
        n.classList.toggle('is-lit', progress >= nodeRatios[i] - 0.015);
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    var resizeTimer = null;
    function onResize() {
      if (window.innerWidth < 900) { container.style.display = 'none'; return; }
      container.style.display = '';
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layout, 120);
    }
    window.addEventListener('resize', onResize);

    layout();
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(layout).catch(function () {}); }
    setTimeout(layout, 800); // catches late image/font reflow
  } catch (e) {
    /* fail-open: no path line, rest of the page is unaffected */
  }
})();
