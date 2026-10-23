(() => {
  const launcher = document.querySelector(".pip-launcher");
  if (!launcher) return;
  const nest = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  nest.classList.add("pip-nest");
  nest.setAttribute("viewBox", "0 0 100 86");
  nest.setAttribute("aria-hidden", "true");
  nest.innerHTML =
    '<ellipse cx="50" cy="74" rx="35" ry="6" fill="#09294e" opacity=".09"/><path d="M15 47 Q50 32 86 47 L76 66 Q50 80 25 66Z" fill="#b38458"/><ellipse cx="50" cy="49" rx="36" ry="14" fill="#8b6045"/><ellipse cx="50" cy="48" rx="29" ry="9" fill="#614d3d"/><ellipse cx="36" cy="43" rx="11" ry="14" fill="#d4eeea" transform="rotate(-16 36 43)"/><ellipse cx="62" cy="43" rx="11" ry="15" fill="#faf0db" transform="rotate(18 62 43)"/><ellipse cx="49" cy="47" rx="11" ry="14" fill="#8ed6d5"/><g fill="#09294e" opacity=".22"><circle cx="33" cy="40" r="1.2"/><circle cx="40" cy="46" r="1"/><circle cx="59" cy="39" r="1.2"/><circle cx="66" cy="46" r="1"/><circle cx="47" cy="44" r="1.3"/><circle cx="53" cy="50" r="1"/></g><path d="M12 48 Q50 67 88 48 M18 55 Q50 70 83 54 M23 62 Q49 73 78 62 M21 44l-9-5 M84 46l8-9 M28 68l-8 5 M71 68l8 6" fill="none" stroke="#d8ae79" stroke-width="3.6" stroke-linecap="round"/><path d="M20 53l9 10m3-8 10 13m8-11 9 12m8-15 9 8" stroke="#966847" stroke-width="2" stroke-linecap="round"/><path d="M73 30 Q80 17 88 23 Q89 34 76 37Z" fill="#ff8b43"/><path d="M75 38l9-12" stroke="#bf642c" stroke-width="1.7" stroke-linecap="round"/>';
  launcher.insertBefore(nest, launcher.querySelector("span"));
  function visit() {
    requestAnimationFrame(() => {
      window.FlyByHelperUI?.companion();
    });
  }
  visit();
  let frame = 0;
  addEventListener(
    "scroll",
    () => {
      if (frame || document.body.classList.contains("helper-guiding")) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        window.FlyByBlairPresentation?.reflow();
      });
    },
    { passive: true },
  );
  addEventListener("resize", () => {
    if (!document.body.classList.contains("helper-guiding"))
      window.FlyByBlairPresentation?.reflow();
  });
  addEventListener("pageshow", (event) => {
    if (event.persisted) visit();
  });
})();
