
// PARTICLE BACKGROUND (Canvas)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, stars;

function resizeCanvas(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; makeStars(); }
addEventListener('resize', resizeCanvas); resizeCanvas();

function makeStars(){
  const count = Math.min(180, Math.floor((W*H)/18000));
  stars = Array.from({length: count}, () => ({
    x: Math.random()*W,
    y: Math.random()*H,
    z: 0.2 + Math.random()*0.8,
    r: Math.random()*1.6 + .2
  }));
}

function renderParticles(){
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
    const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*6);
    g.addColorStop(0, `rgba(0, 255, 204, ${0.14*s.z})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, s.r*6, 0, Math.PI*2); ctx.fill();
    s.y += 0.05 + 0.2*s.z; if(s.y > H+10) s.y = -10;
  }
  requestAnimationFrame(renderParticles);
}
renderParticles();
