(() => {
  let active = null,
    navigationTimer = 0,
    navigating = false,
    ownerTimer = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
    tail = document.createElement("i");
  tail.className = "blair-speech-tail";
  tail.hidden = true;
  tail.setAttribute("aria-hidden", "true");
  document.body.append(tail);
  const viewport = () => ({
    height: window.visualViewport?.height || innerHeight,
    top: window.visualViewport?.offsetTop || 0,
  });
  function fitWidth(bubble, slot) {
    const available =
      innerWidth <= 800
        ? innerWidth - 24
        : Math.max(220, slot.getBoundingClientRect().width - 24);
    bubble.style.width = Math.min(330, innerWidth - 24, available) + "px";
  }
  function hide() {
    if (active) active.bubble.hidden = true;
    tail.hidden = true;
  }
  function release() {
    clearHugLayers();
    clearTimeout(ownerTimer);
    ownerTimer = 0;
    hide();
    active?.walker?.classList.remove("owner-companion", "owner-hugging");
    active?.walker?.querySelector(".blair-heart-cloud")?.remove();
    active?.bubble?.classList.remove("blair-owner-speech");
    active?.anchor?.classList.remove("blair-field-target");
    active?.walker?.classList.remove("header-peeking");
    if (active?.wrapper?.parentNode) active.wrapper.replaceWith(active.anchor);
    else active?.slot?.remove();
    active = null;
  }
  function prepare(walker, bubble, target) {
    if (!target) return null;
    if (active?.target === target && active.walker === walker) {
      active.bubble = bubble;
      return active;
    }
    release();
    bubble.hidden = true;
    if (target.id === "owner-photo") {
      const anchor = target.closest(".owner-portrait");
      active = { walker, bubble, target, anchor, owner: true, phase: "idle" };
      walker.classList.add("owner-companion");
      const hearts = document.createElement("span");
      hearts.className = "blair-heart-cloud";
      hearts.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 5; i++) {
        const heart = document.createElement("i");
        heart.textContent = "♥";
        heart.style.setProperty("--heart-index", i);
        hearts.append(heart);
      }
      walker.append(hearts);
      return active;
    }
    const slot = document.createElement("div");
    slot.className = "blair-guidance-space";
    slot.setAttribute("aria-hidden", "true");
    const fieldTarget = target.matches("#kind,#size"),
      mapTarget = target.id === "flyby-street-map";
    let anchor = fieldTarget
      ? target.closest("label")
      : target.closest(
          ".service-map-grid,main details,.service-panel,.owner-portrait,.owner-story,#estimate-summary,.inputs,.choices,.builder aside,#date-calendar,.request-mode,.form-grid>label",
        ) ||
        target.closest("label") ||
        target;
    if (fieldTarget) anchor.classList.add("blair-field-target");
    if (document.body.classList.contains("portfolio-screen"))
      anchor = document.querySelector(".gallery-intro") || anchor;
    if (!anchor.closest("main")) return null;
    const layout = getComputedStyle(anchor),
      wrapper = document.createElement("div");
    wrapper.className = "blair-guidance-unit";
    wrapper.style.gridColumn = layout.gridColumn;
    wrapper.style.order = layout.order;
    anchor.parentNode.insertBefore(wrapper, anchor);
    wrapper.append(slot, anchor);
    fitWidth(bubble, slot);
    const wasHidden = bubble.hidden;
    bubble.style.visibility = "hidden";
    bubble.hidden = false;
    const height = Math.min(
      bubble.getBoundingClientRect().height || 180,
      Math.max(120, viewport().height * 0.43),
    );
    bubble.hidden = wasHidden;
    bubble.style.visibility = "";
    slot.style.height = height + 96 + "px";
    slot.style.setProperty("--blair-bubble-height", height + "px");
    active = {
      walker,
      bubble,
      target,
      slot,
      height,
      anchor,
      wrapper,
      fieldTarget,
      mapTarget,
    };
    slot.scrollIntoView({
      behavior: reduced.matches ? "auto" : "smooth",
      block: "start",
    });
    return active;
  }
  function coordinates(walker, bubble, target) {
    const item = prepare(walker, bubble, target),
      view = viewport(),
      headerBottom =
        document.querySelector("header")?.getBoundingClientRect().bottom || 80;
    if (!item) {
      const r = target.getBoundingClientRect();
      return {
        x: Math.max(8, Math.min(innerWidth - 76, r.left - 68)),
        y: Math.max(view.top + 8, Math.min(view.top + view.height - 76, r.top)),
      };
    }
    if (item.owner) {
      const r = target.getBoundingClientRect(),
        hug = ["approach", "hug"].includes(item.phase),
        x = r.left + r.width * (hug ? 0.625 : 0.13) - 34,
        y = r.top + r.height * (hug ? 0.79 : 0.77) - 34,
        peeking = y < headerBottom - 33;
      walker.classList.toggle("header-peeking", peeking);
      return {
        x: Math.max(12, Math.min(innerWidth - 80, x)),
        y: peeking
          ? headerBottom - 33
          : Math.max(view.top + 8, Math.min(view.top + view.height - 76, y)),
      };
    }
    const r = item.slot.getBoundingClientRect(),
      field = target.getBoundingClientRect(),
      rawY = item.fieldTarget
        ? field.top + field.height / 2 - 34
        : item.mapTarget
          ? field.top - 76
          : r.top + item.height + 20,
      peeking = rawY < headerBottom - 33;
    walker.classList.toggle("header-peeking", peeking);
    if (peeking) hide();
    return {
      x: Math.max(
        12,
        Math.min(
          innerWidth - 80,
          item.fieldTarget ? item.anchor.getBoundingClientRect().left : r.left + 12,
        ),
      ),
      y: peeking
        ? headerBottom - 33
        : Math.max(view.top + 8, Math.min(view.top + view.height - 76, rawY)),
    };
  }
  let hugLayers = null;
  function clearHugLayers() {
    if (!hugLayers) return;
    hugLayers.cover.remove();
    hugLayers.arms.remove();
    hugLayers = null;
  }
  function updateHugLayers() {
    if (!active?.owner || active.phase !== "hug") {
      clearHugLayers();
      return;
    }
    const photo = active.target,
      bird = active.walker.getBoundingClientRect(),
      header = document.querySelector("header").getBoundingClientRect().bottom;
    if (
      active.walker.classList.contains("header-peeking") ||
      bird.top < header ||
      bird.bottom > viewport().height
    ) {
      if (hugLayers) {
        hugLayers.cover.hidden = true;
        hugLayers.arms.hidden = true;
      }
      return;
    }
    if (!hugLayers) {
      const cover = document.createElement("div"),
        arms = document.createElement("div");
      cover.className = "blair-behind-leg owner-hugging";
      cover.setAttribute("aria-hidden", "true");
      cover.innerHTML = window.FlyByBlairSVG || "";
      const face = cover.querySelector(".blair-bird-body");
      face
        .querySelectorAll('ellipse[cy="62"],path[d^="M42 72"],path[d^="M36 68"]')
        .forEach((el) => el.remove());
      face
        .querySelector('path[d^="M24 51"]')
        ?.setAttribute(
          "d",
          "M24 49 C20 29 29 15 50 15 C71 15 80 29 76 49 Q72 61 50 61 Q28 61 24 49",
        );
      face.querySelectorAll('ellipse[cy="36"],circle').forEach((el) => el.remove());
      const eyes = document.createElementNS("http://www.w3.org/2000/svg", "path");
      eyes.setAttribute("d", "M32 36 Q38 41 44 36 M56 36 Q62 41 68 36");
      eyes.setAttribute("fill", "none");
      eyes.setAttribute("stroke", "#09294e");
      eyes.setAttribute("stroke-width", "2.8");
      eyes.setAttribute("stroke-linecap", "round");
      face.append(eyes);
      arms.className = "blair-hug-arms";
      arms.setAttribute("aria-hidden", "true");
      arms.innerHTML =
        '<svg viewBox="0 0 100 70" aria-hidden="true"><path d="M13 27 C26 31 40 34 55 29 C64 26 67 32 60 36 C44 44 25 39 13 32 Z" fill="#09294e"/><path d="M88 22 C83 19 77 23 74 28 Q80 33 89 28 Q92 25 88 22" fill="#09294e"/><path d="M20 30 Q37 37 54 32" fill="none" stroke="#24829b" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></svg>';
      active.anchor.append(cover, arms);
      hugLayers = { cover, arms };
    }
    const { cover, arms } = hugLayers,
      w = photo.offsetWidth,
      h = photo.offsetHeight,
      left = photo.offsetLeft,
      top = photo.offsetTop;
    cover.hidden = false;
    arms.hidden = false;
    Object.assign(cover.style, {
      left: left + w * 0.625 - 34 + "px",
      top: top + h * 0.79 - 34 + "px",
    });
    const width = Math.max(48, Math.min(92, w * 0.13 + 18));
    Object.assign(arms.style, {
      left: left + w * 0.655 - width / 2 + "px",
      top: top + h * 0.79 - 14 + "px",
      width: width + "px",
      height: width * 0.7 + "px",
    });
  }
  function scheduleHug() {
    if (
      ownerTimer ||
      !active?.owner ||
      reduced.matches ||
      document.body.classList.contains("blair-paused")
    )
      return;
    ownerTimer = setTimeout(
      () => {
        ownerTimer = 0;
        const item = active;
        if (!item?.owner || item.phase !== "idle") return;
        const r = item.target.getBoundingClientRect(),
          leg = r.top + r.height * 0.79,
          header = document.querySelector("header").getBoundingClientRect().bottom;
        if (
          document.hidden ||
          document.body.classList.contains("blair-paused") ||
          leg < header + 80 ||
          leg > viewport().height - 50
        ) {
          scheduleHug();
          return;
        }
        item.phase = "approach";
        travel(item.walker, item.bubble, item.target, item.passive);
      },
      12000 + Math.random() * 14000,
    );
  }
  function settleOwner(walker) {
    const item = active;
    if (item.phase === "approach") {
      item.phase = "hug";
      walker.classList.add("owner-hugging");
      updateHugLayers();
      hide();
      clearTimeout(ownerTimer);
      ownerTimer = setTimeout(() => {
        ownerTimer = 0;
        if (active !== item) return;
        walker.classList.remove("owner-hugging");
        clearHugLayers();
        item.phase = "return";
        travel(walker, item.bubble, item.target, item.passive);
      }, 2400);
      return;
    }
    if (item.phase === "hug") {
      updateHugLayers();
      hide();
      return;
    }
    if (item.phase === "return") item.phase = "idle";
    scheduleHug();
    if (item.passive) {
      hide();
      return;
    }
    const r = item.target.getBoundingClientRect(),
      bird = walker.getBoundingClientRect(),
      bubble = item.bubble;
    const width = Math.max(155, Math.min(210, r.width * 0.43));
    bubble.style.width = width + "px";
    bubble.classList.add("blair-speech", "blair-owner-speech");
    bubble.querySelector("h3").textContent = "Rey M. ♡";
    const language = document.documentElement.lang;
    bubble.querySelector("p").textContent =
      language === "zh-CN"
        ? "FlyBy 创始人和房产影像创作者。"
        : language === "es"
          ? "Propietario y creador de contenido de FlyBy."
          : "FlyBy’s owner & media creator.";
    bubble.style.left = Math.max(12, Math.min(innerWidth - width - 12, r.left)) + "px";
    bubble.style.right = "auto";
    bubble.style.bottom = "auto";
    bubble.style.visibility = "hidden";
    bubble.hidden = false;
    const height = bubble.getBoundingClientRect().height,
      top = bird.top - height - 20,
      header = document.querySelector("header").getBoundingClientRect().bottom;
    if (top < header + 8 || bird.top > viewport().height - 30) {
      hide();
      bubble.style.visibility = "";
      return;
    }
    bubble.style.top = top + "px";
    bubble.style.visibility = "";
    tail.hidden = true;
  }
  function settle(walker) {
    if (!active || active.walker !== walker) return;
    if (walker.classList.contains("header-peeking")) {
      if (active.owner) updateHugLayers();
      hide();
      return;
    }
    if (active.owner) {
      settleOwner(walker);
      return;
    }
    const { bubble, slot } = active,
      r = slot.getBoundingClientRect(),
      bird = walker.getBoundingClientRect();
    if (r.bottom < 80 || r.top > innerHeight - 80) {
      bubble.hidden = true;
      tail.hidden = true;
      return;
    }
    bubble.classList.add("blair-speech");
    bubble.style.left =
      Math.max(
        12,
        Math.min(innerWidth - (parseFloat(bubble.style.width) || 330) - 12, r.left + 12),
      ) + "px";
    bubble.style.right = "auto";
    bubble.style.bottom = "auto";
    bubble.style.visibility = "hidden";
    bubble.hidden = false;
    const top =
      Math.min(
        bird.top,
        active.fieldTarget ? active.anchor.getBoundingClientRect().top : bird.top,
      ) -
      bubble.getBoundingClientRect().height -
      12;
    if (top < 8) {
      bubble.hidden = true;
      bubble.style.visibility = "";
      tail.hidden = true;
      return;
    }
    bubble.style.top = top + "px";
    bubble.style.visibility = "";
    tail.style.left = bird.left + 27 + "px";
    tail.style.top = bubble.getBoundingClientRect().bottom - 7 + "px";
    tail.hidden = false;
  }

  function travel(walker, bubble, target, passive = false) {
    if (navigating) return null;
    const p = coordinates(walker, bubble, target);
    if (active?.owner) active.passive = passive;
    bubble.hidden = true;
    window.FlyByBlair?.move(walker, p.x, p.y, () => settle(walker));
    return p;
  }
  function cancelNavigation() {
    active?.walker?.classList.remove("header-peeking");
    navigating = false;
    clearTimeout(navigationTimer);
    navigationTimer = 0;
    document
      .querySelectorAll(".blair-nav-target,.blair-nav-click")
      .forEach((el) => el.classList.remove("blair-nav-target", "blair-nav-click"));
  }
  function continueTo(walker, href) {
    cancelNavigation();
    navigating = true;
    walker.classList.remove("header-peeking");
    window.FlyByBlair?.stop();
    window.FlyByBlairHandoff?.save(walker, href, null);
    release();
    location.assign(href);
    return true;
  }
  function navigate(walker, href, topic = null) {
    cancelNavigation();
    navigating = true;
    release();
    document.body.classList.add("helper-guiding");
    document
      .querySelectorAll(".pip-guide-box,.blair-welcome")
      .forEach((el) => (el.hidden = true));
    const page = new URL(href, location.href).pathname.split("/").pop(),
      anchor = [...document.querySelectorAll("header a")].find(
        (el) =>
          new URL(el.getAttribute("href"), location.href).pathname.split("/").pop() ===
          page,
      ),
      menu = document.querySelector("#menu");
    if (
      anchor &&
      !anchor.getClientRects().length &&
      menu?.getAttribute("aria-expanded") !== "true"
    )
      menu.click();
    const r = (anchor || document.querySelector("header")).getBoundingClientRect(),
      x = Math.max(8, Math.min(innerWidth - 76, r.left - 66)),
      y = Math.max(8, Math.min(innerHeight - 76, r.top + (r.height - 68) / 2));
    anchor?.classList.add("blair-nav-target");
    window.FlyByBlair?.move(walker, x, y, () => {
      anchor?.classList.add("blair-nav-click");
      navigationTimer = setTimeout(
        () => {
          navigationTimer = 0;
          window.FlyByBlairHandoff?.save(walker, href, topic);
          if (topic)
            try {
              sessionStorage.setItem("flyby-blair-arrival", topic);
            } catch {}
          if (anchor) {
            const original = anchor.getAttribute("href");
            anchor.href = href;
            anchor.click();
            anchor.setAttribute("href", original);
          } else location.assign(href);
        },
        reduced.matches ? 0 : 550,
      );
    });
    return true;
  }
  document.addEventListener("flyby-blair-moving", hide);
  document.addEventListener("flyby-blair-landed", (event) =>
    settle(event.detail.element),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      cancelNavigation();
      window.FlyByBlairHandoff?.clear();
    }
  });
  document.addEventListener(
    "click",
    (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (
        !anchor ||
        !active ||
        !window.FlyByQuoteGuide?.active() ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.button > 0
      )
        return;
      const href = new URL(anchor.href, location.href);
      if (
        href.origin === location.origin &&
        ["pricing.html", "contact.html", "schedule.html", "review.html"].includes(
          href.pathname.split("/").pop(),
        )
      )
        window.FlyByBlairHandoff?.save(active.walker, href.href, null);
    },
    true,
  );
  function reflow() {
    if (!active) return;
    if (active.owner) {
      travel(active.walker, active.bubble, active.target, active.passive);
      return;
    }
    const bubble = active.bubble,
      hidden = bubble.hidden;
    fitWidth(bubble, active.slot);
    bubble.style.visibility = "hidden";
    bubble.hidden = false;
    active.height = Math.min(
      bubble.getBoundingClientRect().height || active.height,
      Math.max(100, viewport().height * 0.43),
    );
    bubble.hidden = hidden;
    bubble.style.visibility = "";
    active.slot.style.height = active.height + 96 + "px";
    travel(active.walker, active.bubble, active.target);
  }
  window.FlyByBlairPresentation = {
    travel,
    settle,
    hide,
    release,
    navigate,
    continueTo,
    cancelNavigation,
    reflow,
  };
})();
