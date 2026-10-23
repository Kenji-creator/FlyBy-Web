(function (root) {
  function clip(points, nx, ny, mx, my, keep) {
    const output = [];
    for (let i = 0; i < points.length; i++) {
      const a = points[i],
        b = points[(i + 1) % points.length],
        da = (a[0] - mx) * nx + (a[1] - my) * ny,
        db = (b[0] - mx) * nx + (b[1] - my) * ny,
        inside = keep ? da >= 0 : da <= 0,
        next = keep ? db >= 0 : db <= 0;
      if (inside) output.push(a);
      if (inside !== next) {
        const t = da / (da - db);
        output.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
      }
    }
    return output;
  }
  function geometry(w, h, t) {
    const x = w - 2 * w * t,
      y = h - h * 0.26 * Math.sin(Math.PI * t),
      dx = w - x,
      dy = h - y,
      length = Math.hypot(dx, dy) || 1,
      nx = dx / length,
      ny = dy / length,
      mx = (w + x) / 2,
      my = (h + y) / 2,
      d = nx * mx + ny * my,
      rect = [
        [0, 0],
        [w, 0],
        [w, h],
        [0, h],
      ];
    return {
      front: clip(rect, nx, ny, mx, my, false),
      fold: clip(rect, nx, ny, mx, my, true),
      matrix: [
        1 - 2 * nx * nx,
        -2 * nx * ny,
        -2 * nx * ny,
        1 - 2 * ny * ny,
        2 * d * nx,
        2 * d * ny,
      ],
      mx,
      my,
      nx,
      ny,
    };
  }
  function polygon(points) {
    return points.length
      ? "polygon(" +
          points.map((p) => p[0].toFixed(2) + "px " + p[1].toFixed(2) + "px").join(",") +
          ")"
      : "polygon(0 0,0 0,0 0)";
  }
  function animate(stage, oldPage, backPage, stationary, forward, done) {
    const bounds = stage.getBoundingClientRect(),
      w = bounds.width / 2,
      h = bounds.height,
      layer = document.createElement("div");
    layer.className = "curl-layer" + (forward ? "" : " curl-reverse");
    layer.setAttribute("aria-hidden", "true");
    layer.inert = true;
    const front = document.createElement("div"),
      back = document.createElement("div"),
      shade = document.createElement("div"),
      still = document.createElement("div");
    front.className = "curl-front";
    back.className = "curl-back";
    shade.className = "curl-shade";
    still.className = "curl-still";
    oldPage.classList.add("curl-content");
    backPage.classList.add("curl-content");
    stationary.classList.add("curl-content");
    if (!forward) {
      oldPage.classList.add("curl-mirror");
      stationary.classList.add("curl-mirror");
    } else backPage.classList.add("curl-mirror");
    front.append(oldPage);
    back.append(backPage);
    still.append(stationary);
    layer.append(still, front, back, shade);
    stage.append(layer);
    let start,
      finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      layer.remove();
      done();
    }
    function draw(now) {
      if (start === undefined) start = now;
      const time = Math.min(1, (now - start) / 1150),
        t = 0.0001 + (1 - 0.0001) * (time * time * (3 - 2 * time));
      const g = geometry(w, h, t);
      front.style.clipPath = polygon(g.front);
      back.style.clipPath = polygon(g.fold);
      back.style.transform = "matrix(" + g.matrix.join(",") + ")";
      shade.style.left = w + g.mx + "px";
      shade.style.top = g.my + "px";
      shade.style.width = Math.hypot(w, h) * 2 + "px";
      shade.style.transform =
        "translate(-50%,-50%) rotate(" + Math.atan2(g.nx, -g.ny) + "rad)";
      shade.style.opacity = String(Math.sin(Math.PI * time) * 0.68);
      layer.style.setProperty("--curl-lift", Math.sin(Math.PI * time) * 13 + "px");
      if (time < 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches)
        requestAnimationFrame(draw);
      else finish();
    }
    requestAnimationFrame(draw);
    return finish;
  }
  root.FlyByCurl = { geometry, animate };
  if (typeof module !== "undefined") module.exports = { geometry };
})(globalThis);
