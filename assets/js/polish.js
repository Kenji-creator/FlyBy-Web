(() => {
  const header = document.querySelector("header");
  let scheduled = false;
  function updateHeader() {
    scheduled = false;
    header.classList.toggle("scrolled", scrollY > 14);
  }
  addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateHeader);
      }
    },
    { passive: true },
  );
  updateHeader();
  if (matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
    document.addEventListener(
      "pointermove",
      (event) => {
        const card = event.target.closest(".choice,.match-form");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--pointer-x", event.clientX - rect.left + "px");
        card.style.setProperty("--pointer-y", event.clientY - rect.top + "px");
      },
      { passive: true },
    );
  }
})();
