// PROJECT FILTERS
const filterBar = document.querySelector(".filters");
filterBar?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-filter]");
  if (!btn) return;
  filterBar
    .querySelectorAll("[data-filter]")
    .forEach((b) => b.setAttribute("aria-pressed", "false"));
  btn.setAttribute("aria-pressed", "true");
  const key = btn.dataset.filter;
  document.querySelectorAll(".proj").forEach((card) => {
    const show = key === "all" || card.dataset.cat === key;
    card.style.display = show ? "" : "none";
  });
});
