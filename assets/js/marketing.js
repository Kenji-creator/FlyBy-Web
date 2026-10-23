(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
    lens = document.querySelector("#lens-panel"),
    process = document.querySelector("#shoot-process");
  const views = [
    {
      image: "photo-1600210492486-724fe5c67fb0",
      alt: "Sample imagery: light-filled living room",
      service: "Property Photography",
      title: "Make the details easy to see.",
      copy: "Interior and exterior photos give buyers a clear look at rooms, light, and finishes.",
      action: "Choose Photography →",
      url: "pricing.html?services=0&type=Home",
    },
    {
      image: "photo-1600596542815-ffad4c1539a9",
      alt: "Sample imagery: modern home with a pool",
      service: "Photos + Panoramic Tour",
      title: "Help visitors connect the spaces.",
      copy: "Pair still photos with a linked panoramic walkthrough to show how rooms relate. This reference image is not a live tour.",
      action: "Choose Photos + Tour →",
      url: "pricing.html?services=0,1&type=Home",
    },
    {
      image: "photo-1500534623283-312aade485b7",
      alt: "Sample imagery: open landscape with distant views",
      service: "Aerial Photography",
      title: "Give the setting its own story.",
      copy: "Aerial media helps show land, views, and surrounding context. This landscape image illustrates the direction, not FlyBy aerial work.",
      action: "Choose Aerial Media →",
      url: "pricing.html?services=2,3&type=Land",
    },
  ];
  function smallAnimation(el) {
    if (!reduced.matches && typeof el.animate === "function")
      try {
        el.animate(
          [
            { opacity: 0.45, transform: "translateY(6px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 380, easing: "cubic-bezier(.16,1,.3,1)" },
        );
      } catch {}
  }
  if (lens) {
    const tabs = [...document.querySelectorAll("[data-lens]")];
    function select(index, focus = false) {
      const data = views[index];
      tabs.forEach((tab, i) => {
        tab.setAttribute("aria-selected", String(index === i));
        tab.tabIndex = index === i ? 0 : -1;
      });
      lens.setAttribute("aria-labelledby", tabs[index].id);
      const image = document.querySelector("#lens-image");
      image.src =
        "https://images.unsplash.com/" + data.image + "?auto=format&fit=crop&w=1400&q=85";
      image.alt = data.alt;
      for (const key of ["service", "title", "copy"])
        document.querySelector("#lens-" + key).textContent = data[key];
      const action = document.querySelector("#lens-action");
      action.textContent = data.action;
      action.href = data.url;
      smallAnimation(document.querySelector(".lens-caption"));
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, i) => {
      tab.onclick = () => select(i);
      tab.onkeydown = (event) => {
        const target =
          event.key === "ArrowRight"
            ? (i + 1) % tabs.length
            : event.key === "ArrowLeft"
              ? (i + tabs.length - 1) % tabs.length
              : event.key === "Home"
                ? 0
                : event.key === "End"
                  ? tabs.length - 1
                  : null;
        if (target !== null) {
          event.preventDefault();
          select(target, true);
        }
      };
    });
  }
  let visible = true,
    scheduled = false,
    path = process?.querySelector(".process-draw"),
    length;
  if (path?.getTotalLength) {
    length = path.getTotalLength();
    process.style.setProperty("--route-length", String(length));
  }
  function draw() {
    scheduled = false;
    if (!visible) return;
    const height = innerHeight;
    if (lens && !reduced.matches && innerWidth > 800) {
      const rect = lens.getBoundingClientRect(),
        progress = Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height)));
      lens.style.setProperty("--lens-drift", ((progress - 0.5) * 24).toFixed(2) + "px");
    }
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(draw);
    }
  }
  if ((lens || process) && "IntersectionObserver" in window) {
    const watched = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) =>
        e.isIntersecting ? watched.add(e.target) : watched.delete(e.target),
      );
      visible = watched.size > 0;
      schedule();
    });
    if (lens) observer.observe(lens);
    if (process) observer.observe(process);
  }
  if (lens || process) {
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    draw();
  }

  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(
        "[data-bundle],[data-example],[data-example-size],#service-add",
      )
    )
      return;
    const target = document.querySelector(".summary,aside,#match-estimate");
    if (target) smallAnimation(target);
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches("[data-service],[data-match-service]")) {
      const target = document.querySelector("aside,#match-estimate");
      if (target) smallAnimation(target);
    }
  });
})();
