
// TYPEWRITER
const typeTarget = document.getElementById('typewriter');
const phrases = [
  'Computer Science Student | Frontend Developer | Animator',
  "I build fast, animated, accessible web experiences",
  "Let's craft something futuristic together"
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
