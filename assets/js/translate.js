(function (root) {
  function translate(value, language = "es") {
    const original = String(value),
      trimmed = original.trim(),
      dict = root.FlyBySpanish || {};
    if (language !== "es") return original;
    if (dict[trimmed]) return original.replace(trimmed, dict[trimmed]);
    let s = trimmed;
    const rules = [
      [
        /^Spread (\d+) of (\d+) · Pages (\d+)–(\d+)$/,
        "Doble página $1 de $2 · Páginas $3–$4",
      ],
      [/^Homes \/ (\d+)$/, "Casas / $1"],
      [/^Land \/ (\d+)$/, "Terrenos / $1"],
      [/^Panoramic tours \/ (\d+)$/, "Recorridos panorámicos / $1"],
      [
        /^Sample quote for (.+?) sq ft · subject to review\.$/,
        "Cotización de ejemplo para $1 pies cuadrados · sujeta a revisión.",
      ],
      [
        /^Sample quote for (.+?) acres · subject to review\.$/,
        "Cotización de ejemplo para $1 acres · sujeta a revisión.",
      ],
      [/^(\$[\d,.]+) sample estimate$/, "$1 estimación de ejemplo"],
      [/^Includes (.+?) bundle savings\.$/, "Incluye $1 de ahorro por paquete."],
      [
        /^Add your square footage for a sample estimate, or continue to Pricing\.$/,
        "Añade los pies cuadrados para una estimación de ejemplo o continúa a Precios.",
      ],
      [
        /^Add your acreage for a sample estimate, or continue to Pricing\.$/,
        "Añade los acres para una estimación de ejemplo o continúa a Precios.",
      ],
      [
        /^(\d+) edited interior\/exterior images\.$/,
        "$1 imágenes editadas de interiores y exteriores.",
      ],
      [
        /^Up to (\d+) linked viewpoints; six months hosting\.$/,
        "Hasta $1 puntos de vista enlazados; seis meses de alojamiento.",
      ],
      [
        /^10 edited aerial photos, one property up to two acres\.$/,
        "10 fotos aéreas editadas; una propiedad de hasta dos acres.",
      ],
      [
        /^30–45-second horizontal edit with licensed music, up to two acres\.$/,
        "Video horizontal editado de 30 a 45 segundos con música con licencia; hasta dos acres.",
      ],
      [/^Open (.+)$/, "Abrir $1"],
      [/^\$(\d+) · (\d+) photos$/, "$$$1 · $2 fotos"],
      [/^\$(\d+) · up to (\d+) viewpoints$/, "$$$1 · hasta $2 puntos de vista"],
    ];
    for (const [pattern, replacement] of rules)
      if (pattern.test(s)) {
        s = s.replace(pattern, replacement);
        break;
      }
    const chunks = [
      "Property Photography",
      "Interactive 360° Tour",
      "Aerial Photography",
      "Aerial Video",
      "Photos + Tour + Aerial Photos",
      "Photos + Aerial Photos",
      "Complete Property Media",
      "Photos + Tour",
      "No services selected",
      "This property requires a manual quote.",
      "Land requests use aerial services.",
      "Enter a positive acreage.",
      "Enter a positive whole home square footage.",
      "Sample imagery · Unsplash",
    ];
    for (const key of chunks) s = s.split(key).join(dict[key] || key);
    s = s
      .replace(/Homes \/ (\d+)/g, "Casas / $1")
      .replace(/Land \/ (\d+)/g, "Terrenos / $1")
      .replace(/Panoramic tours \/ (\d+)/g, "Recorridos panorámicos / $1")
      .replace(/\bCover\b/g, "Portada")
      .replace(/\bClosing\b/g, "Cierre")
      .replace(/sample estimate/g, "estimación de ejemplo")
      .replace(/Custom quote requested/g, "Cotización personalizada solicitada")
      .replace(/sample estimate/g, "estimación de ejemplo")
      .replace(/Custom quote requested/g, "Cotización personalizada solicitada")
      .replace(/sample estimate/g, "estimación de ejemplo")
      .replace(/Custom quote requested/g, "Cotización personalizada solicitada")
      .replace(/sample estimate/g, "estimación de ejemplo")
      .replace(/Custom quote requested/g, "Cotización personalizada solicitada")
      .replace(/sample estimate/g, "estimación de ejemplo")
      .replace(/Custom quote requested/g, "Cotización personalizada solicitada")
      .replace(/sample estimate/g, "estimación de ejemplo")
      .replace(/Custom quote requested/g, "Cotización personalizada solicitada")
      .replace(
        /sample service estimate before extra charges/g,
        "estimación de servicios antes de cargos adicionales",
      )
      .replace(/ · Context illustration/g, " · Ilustración del contexto")
      .replace(/ · Enter size/g, " · Ingresa el tamaño")
      .replace(/ · Save /g, " · Ahorra ")
      .replace(/\bUp to ([\d,]+) sq ft\b/g, "Hasta $1 pies cuadrados")
      .replace(/([\d,]+) sq ft\b/g, "$1 pies cuadrados")
      .replace(/\bphotos\b/g, "fotos")
      .replace(/\bviewpoints\b/g, "puntos de vista");
    return original.replace(trimmed, s);
  }
  root.FlyByTranslate = translate;
  if (typeof module !== "undefined") module.exports = translate;
})(typeof window !== "undefined" ? window : globalThis);
