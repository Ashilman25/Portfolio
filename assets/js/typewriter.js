
// TYPEWRITER
const typeTarget = document.getElementById('typewriter');
const phrases = [
  'Full Stack Developer',
  'Artificial Intelligence Enthusiast',
  'Computer Science Student',
  "I don't know yet",
  "To be completed"
];
let pi = 0, ci = 0, typing = true;

function typeLoop(){
  const current = phrases[pi];
  if(typing){
    typeTarget.textContent = current.slice(0, ci++);
    if(ci > current.length + 6){ typing = false; }
  } else {
    typeTarget.textContent = current.slice(0, ci--);
    if(ci === 0){ typing = true; pi = (pi + 1) % phrases.length; }
  }
  requestAnimationFrame(() => setTimeout(typeLoop, typing ? 48 : 26));
}
typeLoop();
