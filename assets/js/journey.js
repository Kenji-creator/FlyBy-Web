(() => {
  const section = document.querySelector(".process-scroll"),
    reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let scheduled = false,
    path = section?.querySelector(".process-draw"),
    length = path?.getTotalLength?.() || 1400;
  function update() {
    scheduled = false;
    if (!section) return;
    const header = document.querySelector("header").getBoundingClientRect().height,
      scene = section.querySelector(".process-scene");
    section.style.setProperty("--pin-header", header + "px");
    section.classList.toggle("process-enhanced", !reduced.matches);
    const rect = section.getBoundingClientRect(),
      distance = Math.max(1, rect.height - scene.getBoundingClientRect().height),
      progress = reduced.matches
        ? 1
        : Math.max(0, Math.min(1, (header - rect.top) / distance));
    section.style.setProperty("--route-progress", String(progress));
    if (path) {
      path.style.strokeDasharray = String(length);
      path.style.strokeDashoffset = String(length * (1 - progress));
    }
    section
      .querySelectorAll(".grid article")
      .forEach((step, i) =>
        step.classList.toggle(
          "step-active",
          reduced.matches || progress >= [0.08, 0.33, 0.58, 0.83][i],
        ),
      );
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }
  if (section) {
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    update();
  }
  const pins = [...document.querySelectorAll("[data-city]")];
  pins.forEach(
    (pin) =>
      (pin.onclick = () => {
        pins.forEach((p) => p.setAttribute("aria-pressed", String(p === pin)));
        const city = pin.dataset.city,
          extra = ["Scottsdale", "Phoenix"].includes(city);
        document.querySelector("#map-city").textContent = city;
        document.querySelector("#map-category").textContent = extra
          ? "Travel confirmed during quoting"
          : "Core service community";
        document.querySelector("#map-description").textContent = extra
          ? "Service in " + city + " is available with travel confirmed during quoting."
          : "Homes and land in " +
            city +
            " are within our service area. Included travel is reviewed using the property’s actual location.";
      }),
  );
})();
