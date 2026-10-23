(() => {
  window.FlyByEstimateGate = {
    evaluate({
      ids = [],
      size = "",
      kind = "Home",
      custom = false,
      intent = "shoot",
      notes = "",
    } = {}) {
      const clean = Array.isArray(ids)
          ? [...new Set(ids)].filter((i) => Number.isInteger(i) && i >= 0 && i < 4)
          : [],
        quote = FlyByPricing.quote(clean, size, kind),
        complete = clean.length > 0 && quote.status === "estimate",
        isCustom = intent !== "questions" && custom;
      return {
        complete,
        ready: intent === "questions" || complete || isCustom,
        mode: intent === "questions" ? "questions" : isCustom ? "custom" : "shoot",
        notesRequired: isCustom,
        descriptionReady: !isCustom || Boolean(String(notes).trim()),
        quote,
      };
    },
  };
})();
