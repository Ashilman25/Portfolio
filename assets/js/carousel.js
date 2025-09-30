document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".skills-track");
  if (track) {
    // Duplicate content so the scroll looks seamless
    track.innerHTML += track.innerHTML;
  }
});
