const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)],
  names = [
    "Property Photography",
    "Interactive 360° Tour",
    "Aerial Photography",
    "Aerial Video",
  ],
  money = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
let ids = [],
  size = "",
  kind = "Home";
try {
  const p = new URLSearchParams(location.search),
    saved = JSON.parse(sessionStorage.getItem("flyby-quote") || "{}");
  ids = (p.get("services") ?? (saved.ids || []).join(","))
    .split(",")
    .filter((x) => /^[0-3]$/.test(x))
    .map(Number);
  size = p.get("size") ?? saved.size ?? "";
  kind = p.get("type") ?? saved.kind ?? "Home";
  if (p.has("type") && p.get("type") !== saved.kind && !p.has("size")) size = "";
  if (p.has("type") && p.get("type") !== saved.kind && !p.has("size")) size = "";
  if (p.has("type") && p.get("type") !== saved.kind && !p.has("size")) size = "";
  if (p.has("type") && p.get("type") !== saved.kind && !p.has("size")) size = "";
  if (p.has("type") && p.get("type") !== saved.kind && !p.has("size")) size = "";
  if (p.has("type") && p.get("type") !== saved.kind && !p.has("size")) size = "";
} catch {}
if (!["Home", "Land"].includes(kind)) kind = "Home";
function save() {
  try {
    sessionStorage.setItem("flyby-quote", JSON.stringify({ ids, size, kind }));
  } catch {}
}
function estimate() {
  return FlyByPricing.quote(ids, size, kind);
}
function labelText(q) {
  return (
    (ids.map((i) => names[i]).join(" + ") || "No services selected") +
    " · " +
    (q.status === "estimate"
      ? size +
        (kind === "Land" ? " acres" : " sq ft") +
        " · " +
        money(q.total) +
        " sample service estimate before extra charges"
      : q.reason)
  );
}
if ($("#choices")) {
  const input = $("#size"),
    type = $("#kind");
  input.value = size;
  type.value = kind;
  $("#choices").innerHTML = names
    .map(
      (n, i) =>
        `<label class="choice"><input type="checkbox" data-service="${i}"> ${n}<strong id="price-${i}"></strong><small id="detail-${i}"></small></label>`,
    )
    .join("");
  function update() {
    save();
    const q = estimate(),
      t = q.tier || FlyByPricing.tiers[0];
    $("#size-label").firstChild.textContent =
      kind === "Land" ? "Parcel acreage" : "Home square footage";
    input.min = kind === "Land" ? "0.01" : "1";
    input.step = kind === "Land" ? "any" : "1";
    $("#status").textContent =
      q.status === "estimate"
        ? "Sample quote for " +
          size +
          (kind === "Land" ? " acres" : " sq ft") +
          " · subject to review."
        : q.reason;
    $("#selection").textContent =
      ids.map((i) => names[i]).join(" + ") || "Select services.";
    ["subtotal", "savings", "total"].forEach(
      (k) => ($("#" + k).textContent = q.status === "estimate" ? money(q[k]) : "—"),
    );
    $$("[data-service]").forEach((el) => {
      const i = +el.dataset.service;
      el.checked = ids.includes(i);
      el.disabled = kind === "Land" && i < 2;
      $("#price-" + i).textContent =
        i >= 2
          ? money(i === 2 ? 149 : 199)
          : kind === "Land"
            ? "Not applicable"
            : q.status === "estimate"
              ? money(q.prices[i])
              : "Enter home size";
      $("#detail-" + i).textContent =
        i === 0
          ? t.photos + " edited interior/exterior images."
          : i === 1
            ? "Up to " + t.views + " linked viewpoints; six months hosting."
            : i === 2
              ? "10 edited aerial photos, one property up to two acres."
              : "30–45-second horizontal edit with licensed music, up to two acres.";
    });
    $$("[data-bundle]").forEach((b) => {
      const v = b.dataset.bundle.split(",").map(Number),
        e = FlyByPricing.quote(v, size, kind);
      b.disabled = kind === "Land";
      b.textContent =
        b.dataset.title +
        (e.status === "estimate"
          ? " · " + money(e.total) + " · Save " + money(e.savings)
          : " · Enter size");
    });
    $("#quote-link").href =
      "contact.html?" +
      new URLSearchParams({ services: ids.join(","), size, type: kind, intent: "shoot" });
    if ($("#question-link"))
      $("#question-link").href =
        "contact.html?" +
        new URLSearchParams({
          services: ids.join(","),
          size,
          type: kind,
          intent: "questions",
        });
  }
  input.addEventListener("input", () => {
    size = input.value;
    update();
  });
  type.addEventListener("change", () => {
    kind = type.value;
    size = "";
    input.value = "";
    if (kind === "Land") ids = ids.filter((i) => i >= 2);
    update();
  });
  $$("[data-service]").forEach((el) =>
    el.addEventListener("change", () => {
      const i = +el.dataset.service;
      ids = el.checked ? [...new Set([...ids, i])] : ids.filter((x) => x !== i);
      update();
    }),
  );
  $$("[data-bundle]").forEach((b) =>
    b.addEventListener("click", () => {
      ids = b.dataset.bundle.split(",").map(Number);
      update();
    }),
  );
  $$("[data-example]").forEach((b) =>
    b.addEventListener("click", () => {
      kind = "Home";
      size = b.dataset.example;
      ids = [0, 1];
      type.value = kind;
      input.value = size;
      update();
    }),
  );
  update();
}
if ($("#request")) {
  const input = $("#contact-size"),
    type = $("#contact-kind");
  input.value = size;
  type.value = kind;
  function sync() {
    kind = type.value;
    size = input.value;
    $("#contact-size-label").firstChild.textContent =
      kind === "Land" ? "Parcel acreage" : "Home square footage";
    input.min = kind === "Land" ? "0.01" : "1";
    input.step = kind === "Land" ? "any" : "1";
    const q = estimate();
    $("#contact-estimate").textContent = labelText(q);
    save();
  }
  input.addEventListener("input", sync);
  type.addEventListener("change", () => {
    input.value = "";
    if (type.value === "Land") ids = ids.filter((i) => i >= 2);
    sync();
  });
  const now = new Date();
  $("#date").min = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  sync();
}
if ($("#portfolio")) {
  const tabs = $$("[data-category]");
  function activate(tab) {
    tabs.forEach((t) => {
      t.setAttribute("aria-selected", String(t === tab));
      t.tabIndex = t === tab ? 0 : -1;
    });
    $("#portfolio").setAttribute("aria-labelledby", tab.id);
    const c = tab.dataset.category;
    if (c === "360° Tours")
      $("#portfolio").innerHTML =
        '<div class="placeholder"><span class="eyebrow">Tour preview placeholder</span><h2>A sense of space.</h2><p>A real panoramic walkthrough will be embedded when supplied. This placeholder is not interactive.</p></div>';
    else
      $("#portfolio").innerHTML =
        '<figure><img src="https://images.unsplash.com/' +
        (c === "Homes"
          ? "photo-1600210492486-724fe5c67fb0"
          : "photo-1500534623283-312aade485b7") +
        '?auto=format&fit=crop&w=1400&q=85" alt="Sample imagery: ' +
        (c === "Homes" ? "light-filled interior" : "open landscape with distant views") +
        '"><figcaption>Sample imagery · Unsplash</figcaption></figure>';
  }
  tabs.forEach((t, i) => {
    t.onclick = () => activate(t);
    t.onkeydown = (e) => {
      const next =
        e.key === "ArrowRight"
          ? (i + 1) % 3
          : e.key === "ArrowLeft"
            ? (i + 2) % 3
            : e.key === "Home"
              ? 0
              : e.key === "End"
                ? 2
                : null;
      if (next !== null) {
        e.preventDefault();
        activate(tabs[next]);
        tabs[next].focus();
      }
    };
  });
  activate(tabs[0]);
}
$("#menu").onclick = () => {
  const open = $("#menu").getAttribute("aria-expanded") !== "true";
  $("#menu").setAttribute("aria-expanded", String(open));
  $("#links").classList.toggle("open", open);
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("#menu").setAttribute("aria-expanded", "false");
    $("#links").classList.remove("open");
  }
});
$$("#links a").forEach((a) => {
  if (a.getAttribute("href") === location.pathname.split("/").pop())
    a.setAttribute("aria-current", "page");
});
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (n) => Math.max(0, Math.min(1, n));
let ticking = false;
function render() {
  ticking = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  $(".progress").style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
  if (motion.matches) return;
  const image = $(".cinema");
  if (image) {
    const r = image.getBoundingClientRect(),
      p = clamp((innerHeight - r.top) / (innerHeight + r.height));
    image.style.setProperty("--zoom", 1.1 - p * 0.1);
    image.style.setProperty("--inset", (1 - p) * 6 + "%");
  }
  const story = $(".story");
  if (story && innerWidth > 800) {
    const r = story.getBoundingClientRect(),
      p = clamp(-r.top / (r.height - innerHeight)),
      stage = Math.min(2, Math.floor(p * 3));
    $("#story-word").textContent = ["detail.", "connection.", "perspective."][stage];
    $("#story-copy").textContent = [
      "Start with the spaces that make a home feel like home.",
      "Show how rooms connect with linked panoramic viewpoints.",
      "Step back to see land, views, and surrounding context.",
    ][stage];
    story.style.setProperty("--story-scale", 1 + p * 0.08);
  }
}
function schedule() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(render);
  }
}
addEventListener("scroll", schedule, { passive: true });
addEventListener("resize", schedule);
motion.addEventListener("change", schedule);
render();
