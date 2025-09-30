// Lightweight tilt effect for Skills cards in the carousel (no frameworks)
(function () {
  const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!supportsFinePointer) return; // skip on touch devices

  const ROTATE_DEFAULT = 100; // degrees
  const SCALE_DEFAULT = 15; // scale factor
  const SMOOTH = 0.15; // lerp factor for smoothing

  // For each skill card, attach listeners and animate via rAF
  function initSkillTilt(card) {
    let rect = null;
    let tx = 0,
      ty = 0,
      ts = 1; // targets
    let cx = 0,
      cy = 0,
      cs = 1; // currents
    let hovering = false;

    const rotateAmp = Number(card.dataset.rotate || ROTATE_DEFAULT);
    const scaleOnHover = Number(card.dataset.scale || SCALE_DEFAULT);

    function onEnter() {
      hovering = true;
      ts = scaleOnHover;
      card.classList.add("is-tilting");
    }

    function onLeave() {
      hovering = false;
      tx = 0;
      ty = 0;
      ts = 1;
      card.classList.remove("is-tilting");
    }

    function onMove(e) {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ox = x - rect.width / 2;
      const oy = y - rect.height / 2;

      // Map cursor to rotations
      tx = (oy / (rect.height / 2)) * -rotateAmp;
      ty = (ox / (rect.width / 2)) * rotateAmp;
    }

    function onResize() {
      rect = null;
    }
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onResize, { passive: true });

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("mousemove", onMove);

    // Smooth animation loop
    (function loop() {
      // simple linear interpolation toward targets
      cx += (tx - cx) * SMOOTH;
      cy += (ty - cy) * SMOOTH;
      cs += (ts - cs) * (hovering ? 0.25 : SMOOTH);

      card.style.transform =
  `translateZ(${(hovering ? 40 : 0)}px) rotateX(${cx.toFixed(2)}deg) rotateY(${cy.toFixed(2)}deg) scale(${cs.toFixed(3)})`;


      requestAnimationFrame(loop);
    })();
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".skills-track .skill").forEach(initSkillTilt);
  });
})();
