
// SKILL RINGS
function updateRings(){
  document.querySelectorAll('.ring').forEach(r =>{
    const pct = Number(r.dataset.percent || 0);
    const deg = Math.round(360 * (pct/100));
    const meter = r.querySelector('.meter');
    meter.style.background = `conic-gradient(var(--teal) ${deg}deg, #1a222c ${deg}deg 360deg)`;
    r.querySelector('.pct').textContent = pct + '%';
  });
}
updateRings();
