(() => {
  function guidedPage(href) {
    const bird = document.querySelector(".quote-walker:not([hidden])");
    if (bird && window.FlyByQuoteGuide?.active() && window.FlyByBlairPresentation)
      window.FlyByBlairPresentation.continueTo(bird, href);
    else location.href = href;
  }
  const key = "flyby-request-draft",
    config = window.FlyByBooking || {},
    find = (s) => document.querySelector(s),
    names = [
      "Property Photography",
      "Interactive 360° Tour",
      "Aerial Photography",
      "Aerial Video",
    ],
    money = (n) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  function read() {
    try {
      return JSON.parse(sessionStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  }
  function write(draft) {
    try {
      sessionStorage.setItem(key, JSON.stringify(draft));
      return true;
    } catch {
      return false;
    }
  }
  function packageData() {
    try {
      return JSON.parse(sessionStorage.getItem("flyby-quote") || "{}");
    } catch {
      return {};
    }
  }
  function dateLabel(date) {
    return new Intl.DateTimeFormat(
      document.documentElement.lang === "zh-CN"
        ? "zh-CN"
        : document.documentElement.lang === "zh-CN"
          ? "zh-CN"
          : document.documentElement.lang === "zh-CN"
            ? "zh-CN"
            : document.documentElement.lang === "zh-CN"
              ? "zh-CN"
              : document.documentElement.lang === "es"
                ? "es-US"
                : "en-US",
      { dateStyle: "long", timeZone: config.timeZone || "America/Phoenix" },
    ).format(new Date(date + "T12:00:00-07:00"));
  }
  function summary(draft) {
    if (!draft.size || !draft.ids?.length)
      return draft.intent === "questions"
        ? "Contact request · estimate optional."
        : "Custom quote requested";
    const quote = FlyByPricing.quote(draft.ids, draft.size, draft.kind);
    return (
      draft.ids.map((i) => names[i]).join(" + ") +
      " · " +
      draft.size +
      (draft.kind === "Land" ? " acres" : " sq ft") +
      " · " +
      (quote.status === "estimate"
        ? money(quote.total) + " sample estimate"
        : quote.reason)
    );
  }
  function requireDraft() {
    const draft = read();
    if (!draft) {
      const box = find("#calendar-status") || find("#submission-status");
      if (box)
        box.textContent = "Start with your property details before choosing a date.";
      const button = find("#continue-review") || find("#submit-request");
      if (button) button.disabled = true;
      return null;
    }
    return draft;
  }
  const endpoint = (intent) =>
    intent === "shoot" ? config.mediaRequestEndpoint : config.emailRequestEndpoint;
  async function send(draft, button, status, error) {
    if (!endpoint(draft.intent)) return;
    button.disabled = true;
    error.textContent = "";
    status.textContent = "Sending your request…";
    draft.requestId =
      draft.requestId ||
      globalThis.crypto?.randomUUID?.() ||
      "flyby-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
    write(draft);
    try {
      const response = await fetch(endpoint(draft.intent), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!response.ok) throw Error("submission");
      const result = await response.json(),
        destination = draft.intent === "shoot" ? "google-calendar" : "business-email";
      if (
        result.accepted !== true ||
        !result.requestId ||
        result.destination !== destination
      )
        throw Error("confirmation");
      sessionStorage.removeItem(key);
      status.textContent =
        draft.intent === "custom"
          ? "Your custom quote request has been sent. You should receive a response within 1 day."
          : draft.intent === "questions"
            ? "Your question has been sent. You should receive an answer within 1 day."
            : "Your media request has been added to FlyBy’s calendar for review. The requested delivery date still needs confirmation; the FlyBy Crew will schedule the capture separately.";
      status.setAttribute?.("data-sent", "true");
      if (typeof CustomEvent === "function")
        document.dispatchEvent?.(
          new CustomEvent("flyby-request-sent", {
            detail: { destination, requestId: result.requestId },
          }),
        );
    } catch {
      error.textContent =
        "Your request could not be confirmed. Your details remain here; please try again later.";
      status.textContent = "No request confirmation has been received.";
      button.disabled = false;
    }
  }
  if (find("#request")) {
    const form = find("#request"),
      previous = read(),
      params = new URLSearchParams(location.search || "");
    let intent =
      params.get("intent") === "questions"
        ? "questions"
        : params.get("intent") === "shoot"
          ? "shoot"
          : previous?.intent === "questions"
            ? "questions"
            : "shoot";
    if (previous)
      for (const name of ["name", "email", "phone", "location", "notes"]) {
        const field = form.elements.namedItem(name);
        if (field) field.value = previous[name] || "";
      }
    if (previous?.intent === "custom") {
      const p = packageData();
      if (
        String(previous.size || "") === find("#contact-size").value &&
        previous.kind === find("#contact-kind").value &&
        JSON.stringify(previous.ids || []) === JSON.stringify(p.ids || [])
      )
        find("#custom").checked = true;
    }
    function gateState() {
      const p = packageData();
      return window.FlyByEstimateGate.evaluate({
        ids: p.ids,
        size: find("#contact-size").value,
        kind: find("#contact-kind").value,
        custom: find("#custom").checked,
        intent,
        notes: form.elements.namedItem("notes")?.value || "",
      });
    }
    function configureIntent() {
      const state = gateState(),
        questions = state.mode === "questions",
        custom = state.mode === "custom",
        address = form.elements.namedItem("location"),
        notes = form.elements.namedItem("notes");
      for (const name of ["name", "email"]) {
        const field = form.elements.namedItem(name);
        if (field) field.required = !custom;
      }
      if (address) address.required = state.mode === "shoot";
      if (notes) {
        notes.required = custom;
        notes.placeholder = custom
          ? "Describe your custom request (required)."
          : "Your question (optional), access details, or anything you would like us to know.";
      }
      find("#contact-size").required = state.mode === "shoot" && state.ready;
      find("#contact-kind").disabled = true;
      find("#contact-size").readOnly = true;
      const fields = find("#contact-details");
      if (fields) fields.disabled = !state.ready;
      const help = find("#intent-help"),
        button = find("#contact-continue"),
        status = find("#contact-response"),
        estimateBox = find("#estimate-summary"),
        pricingLink = find("#contact-pricing-link"),
        message = find("#estimate-gate-message");
      if (estimateBox) estimateBox.hidden = questions;
      if (pricingLink) pricingLink.hidden = questions;
      if (message)
        message.textContent = custom
          ? "Describe your custom request in Notes. All other fields are optional."
          : state.complete
            ? "Your estimate is ready. Add your contact details below."
            : "Complete an estimate in Pricing, or select Request a custom quote to unlock these fields.";
      if (help)
        help.textContent = questions
          ? "Add your name and email. Your question in Notes is optional. This request goes to FlyBy’s business email."
          : custom
            ? "Optional: add an email or phone so the FlyBy Crew can send your response within 1 day."
            : "";
      if (help) help.hidden = state.mode === "shoot";
      if (button) {
        button.textContent = questions
          ? "Request a Reply →"
          : custom
            ? "Request a Custom Quote →"
            : "Choose a Delivery Date →";
        button.disabled =
          !state.ready || (state.mode !== "shoot" && !endpoint(state.mode));
      }
      if (status)
        status.textContent =
          state.mode !== "shoot" && !endpoint(state.mode)
            ? "Business email is not connected yet. This form cannot send your request."
            : "";
      form
        .querySelectorAll('[name="contact-intent"]')
        .forEach((r) => (r.checked = r.value === intent));
      if (questions)
        find("#contact-estimate").textContent = "Contact request · estimate optional.";
    }
    form.querySelectorAll('[name="contact-intent"]').forEach((r) =>
      r.addEventListener("change", () => {
        intent = r.value;
        configureIntent();
      }),
    );
    find("#custom").addEventListener("change", configureIntent);
    find("#contact-size").addEventListener("input", configureIntent);
    window.FlyByContactState = { state: gateState, refresh: configureIntent };
    configureIntent();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const state = gateState();
      if (!state.ready) {
        find("#form-error").textContent =
          "Complete an estimate in Pricing, or select Request a custom quote to unlock these fields.";
        return;
      }
      if (state.notesRequired && !state.descriptionReady) {
        find("#form-error").textContent =
          "Describe your custom request in Notes before continuing.";
        return;
      }
      if (!form.reportValidity()) return;
      const quote = packageData(),
        size = find("#contact-size").value,
        kind = find("#contact-kind").value,
        ids = (quote.ids || []).filter((i) => Number.isInteger(i) && i >= 0 && i < 4),
        custom = find("#custom").checked,
        result = FlyByPricing.quote(ids, size, kind);
      if (state.mode === "shoot" && (!ids.length || result.status !== "estimate")) {
        find("#form-error").textContent =
          result.status === "invalid"
            ? "Start in Pricing to enter your property type and size, or choose Contact Me with Answers."
            : "Choose services or request a custom quote before continuing.";
        return;
      }
      const data = {};
      for (const name of ["name", "email", "phone", "location", "notes"])
        data[name] = form.elements.namedItem(name)?.value.trim() || "";
      Object.assign(data, {
        size,
        kind,
        ids,
        custom,
        intent: state.mode,
        updated: new Date().toISOString(),
      });
      const retry = read();
      if (
        retry?.requestId &&
        [
          "name",
          "email",
          "phone",
          "location",
          "notes",
          "size",
          "kind",
          "ids",
          "custom",
          "intent",
        ].every((k) => JSON.stringify(retry[k]) === JSON.stringify(data[k]))
      )
        data.requestId = retry.requestId;
      if (!write(data)) {
        find("#form-error").textContent =
          "Browser session storage is unavailable. Your draft cannot be carried to the next page.";
        return;
      }
      if (state.mode !== "shoot") {
        if (endpoint(state.mode))
          send(
            data,
            find("#contact-continue"),
            find("#contact-response"),
            find("#form-error"),
          );
        return;
      }
      guidedPage("schedule.html");
    });
  }
  if (find("#calendar-status")) {
    const draft = requireDraft();
    if (draft) {
      if (draft.intent === "questions") {
        location.href = "contact.html?intent=questions";
        return;
      }
      find("#schedule-summary").textContent = summary(draft);
      const date = find("#preview-date"),
        parts = new Intl.DateTimeFormat("en-US", {
          timeZone: config.timeZone || "America/Phoenix",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).formatToParts(new Date()),
        part = (k) => parts.find((p) => p.type === k).value;
      date.min = part("year") + "-" + part("month") + "-" + part("day");
      date.value = draft.dueDate || "";
      find("#calendar-status").textContent =
        "Select your requested media delivery date. the FlyBy Crew confirms the deadline and schedules the capture separately.";
      find("#continue-review").onclick = () => {
        find("#schedule-error").textContent = "";
        if (!date.value || !date.checkValidity()) {
          date.reportValidity();
          find("#schedule-error").textContent = "Choose a requested media delivery date.";
          return;
        }
        draft.dueDate = date.value;
        delete draft.requestedDate;
        delete draft.requestedEnd;
        delete draft.slotId;
        delete draft.dateVerified;
        if (write(draft)) guidedPage("review.html");
        else
          find("#schedule-error").textContent =
            "Your draft could not be saved in this browser session.";
      };
    }
  }
  if (find("#request-review")) {
    const draft = requireDraft(),
      button = find("#submit-request");
    if (draft) {
      const questions = draft.intent === "questions";
      function render() {
        const container = find("#request-review");
        container.replaceChildren();
        let rows = [
          ["Name", draft.name],
          ["Email", draft.email],
          ["Phone (optional)", draft.phone || "Not provided"],
          ["Property address or parcel location", draft.location || "Not provided"],
          ["Property type", draft.kind === "Land" ? "Land" : "Home"],
          ["Home size", draft.size + (draft.kind === "Land" ? " acres" : " sq ft")],
          ["Selected services & sample estimate", summary(draft)],
          [
            "Requested media delivery date",
            draft.dueDate ? dateLabel(draft.dueDate) : "Not selected",
          ],
          [
            "Capture scheduling",
            "the FlyBy Crew schedules the capture separately after reviewing your request.",
          ],
          ["Notes", draft.notes || "Not provided"],
        ];
        if (questions)
          rows = rows.filter(
            ([label]) =>
              !["Requested media delivery date", "Capture scheduling"].includes(label) &&
              !(!draft.size && ["Property type", "Home size"].includes(label)),
          );
        const list = document.createElement("dl");
        rows.forEach(([label, value]) => {
          const row = document.createElement("div"),
            term = document.createElement("dt"),
            description = document.createElement("dd");
          row.className = "review-row";
          term.textContent = label;
          description.textContent = value;
          if (
            [
              "Name",
              "Email",
              "Phone (optional)",
              "Property address or parcel location",
              "Notes",
            ].includes(label)
          )
            description.dataset.noTranslate = "true";
          row.append(term, description);
          list.append(row);
        });
        container.append(list);
      }
      render();
      document.addEventListener("flyby-language-change", render);
      button.textContent = questions ? "Request a Reply →" : "Send Media Request ↗";
      button.disabled = !endpoint(draft.intent) || (!questions && !draft.dueDate);
      find("#submission-status").textContent = !endpoint(draft.intent)
        ? questions
          ? "Business email is not connected yet. This form cannot send your question."
          : "Calendar requests are not connected yet. Your request has not been sent."
        : "Review your request before sending. The delivery deadline is confirmed manually.";
      button.onclick = () => {
        if (!questions && !draft.dueDate) return;
        return send(draft, button, find("#submission-status"), find("#review-error"));
      };
    }
  }
})();
