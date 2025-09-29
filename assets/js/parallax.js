
// PARALLAX on sections with data-parallax
const parallaxEls = document.querySelectorAll('[data-parallax]');
addEventListener('scroll', () => {
  const y = scrollY;
  parallaxEls.forEach(el => {
    const f = Number(el.getAttribute('data-parallax')) || 0.08;
    el.style.backgroundPosition = `center ${y * f}px`;
  });
}, {passive:true});
