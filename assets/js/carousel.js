document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".skills-track");
  const wrap = document.querySelector(".skills-carousel");
  if (!track || !wrap) return;

  // 1) Snapshot the original children (one full set)
  const originals = Array.from(track.children).map(el => el.cloneNode(true));

  // 2) Ensure we have at least two full sets laid out
  // Clear and re-append the originals once
  track.innerHTML = "";
  originals.forEach(el => track.appendChild(el.cloneNode(true)));

  // Measure width of one full set
  const measureSetWidth = () => {
    // Temporarily ensure no transform affects measurement
    const prev = track.style.transform;
    track.style.transform = "none";
    const width = Array.from(track.children)
      .slice(0, originals.length)
      .reduce((w, el) => w + el.getBoundingClientRect().width, 0)
      + (getComputedStyle(track).columnGap === "normal"
          ? 0
          : (originals.length - 1) * parseFloat(getComputedStyle(track).gap || "0"));
    track.style.transform = prev;
    return width;
  };

  // 3) Duplicate items until total width >= loopWidth * 2 (seamless)
  const ensureCoverage = (loopWidth) => {
    // We want at least two sets back-to-back
    let totalWidth = 0;
    // Count current width
    totalWidth = track.getBoundingClientRect().width;

    // While not enough coverage, append another set
    // (Upper bound to avoid runaway duplication)
    let safety = 10;
    while (totalWidth < loopWidth * 2 && safety-- > 0) {
      originals.forEach(el => track.appendChild(el.cloneNode(true)));
      totalWidth = track.getBoundingClientRect().width;
    }
  };

  // 4) Compute speed and apply custom properties
  const applyAnimation = () => {
    const loopWidth = measureSetWidth();            // px distance for one full set
    ensureCoverage(loopWidth);

    // Pixels per second — tweak to taste
    const PX_PER_SEC = 80;                          // constant speed
    const duration = loopWidth / PX_PER_SEC;        // seconds to move one set width

    track.style.setProperty("--loop", `${loopWidth}px`);
    track.style.setProperty("--duration", `${duration}s`);
  };

  applyAnimation();

  // 5) Recompute on resize (responsive, prevents drift/jumps)
  let rAF;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(applyAnimation);
  });
  ro.observe(wrap);
});
