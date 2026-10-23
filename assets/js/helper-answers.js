(function (root) {
  const definitions = {
    services: {
      aliases: [
        "services",
        "what services do you offer",
        "what do you offer",
        "servicios",
        "que servicios ofrecen",
      ],
      en: "FlyBy offers property photography, linked 360° panoramic walkthroughs, aerial photography, and aerial video.",
      es: "FlyBy ofrece fotografía inmobiliaria, recorridos panorámicos de 360° enlazados, fotografía aérea y video aéreo.",
      href: "services.html",
      label: ["Explore Services", "Explorar servicios"],
    },
    pricing: {
      aliases: [
        "pricing",
        "prices",
        "how much do photos cost",
        "how much does photography cost",
        "can i get an estimate",
        "precios",
        "cuanto cuestan las fotos",
        "puedo obtener una cotizacion",
        "cotizacion",
      ],
      en: "Photography and tour rates depend on home size. Enter square footage or parcel acreage in Pricing to see a sample estimate. Larger homes above 5,000 sq ft and parcels above two acres need a custom quote.",
      es: "Las tarifas de fotografía y recorridos dependen del tamaño de la casa. Ingresa los pies cuadrados o acres en Precios para ver una estimación de ejemplo. Las casas de más de 5,000 pies cuadrados y terrenos de más de dos acres requieren una cotización personalizada.",
      href: "pricing.html",
      label: ["Get an Estimate", "Obtener una estimación"],
    },
    bundles: {
      aliases: [
        "discount",
        "bundle discount",
        "how do bundle savings work",
        "is there a bundle discount",
        "descuento",
        "como funcionan los descuentos",
        "hay descuento por paquete",
      ],
      en: "Two or more different services for the same property and appointment receive 15% off the service subtotal. Travel, tax, hosting extensions, and custom charges are excluded. Promotions do not stack.",
      es: "Dos o más servicios diferentes para la misma propiedad y cita reciben un 15% de descuento sobre el subtotal de servicios. Se excluyen traslados, impuestos, extensiones de alojamiento y cargos personalizados. Las promociones no se acumulan.",
      href: "pricing.html",
      label: ["Build a Package", "Crear un paquete"],
    },
    tours: {
      aliases: [
        "360 tour",
        "360 tours",
        "what is a panoramic tour",
        "how does the tour work",
        "do you offer matterport",
        "recorrido 360",
        "como funciona el recorrido",
        "ofrecen matterport",
      ],
      en: "The tour is an Insta360-captured panoramic walkthrough with linked viewpoints. It is not a measured 3D model and includes no dollhouse, floor plans, or automatic Zillow integration.",
      es: "El recorrido panorámico se captura con Insta360 y conecta puntos de vista. No es un modelo 3D con medidas ni incluye casa de muñecas, planos o integración automática con Zillow.",
      href: "services.html",
      label: ["Explore 360° Tours", "Explorar recorridos de 360°"],
    },
    hosting: {
      aliases: [
        "hosting",
        "how long is tour hosting included",
        "how long is the tour hosted",
        "alojamiento",
        "cuanto dura el alojamiento",
      ],
      en: "Tours include six months of hosting. Extensions require a quote before the included period ends.",
      es: "Los recorridos incluyen seis meses de alojamiento. Las extensiones requieren cotización antes de que termine el período incluido.",
      href: "contact.html?intent=questions",
      label: ["Ask about Hosting", "Consultar sobre alojamiento"],
    },
    area: {
      aliases: [
        "service area",
        "where do you work",
        "where do you serve",
        "do you serve mesa",
        "do you serve phoenix",
        "zona de servicio",
        "donde trabajan",
        "atienden mesa",
        "atienden phoenix",
      ],
      en: "Core communities are Mesa, Gilbert, Chandler, Tempe, Apache Junction, and Queen Creek. Scottsdale and Phoenix are available with travel confirmed during quoting. Included travel is within 25 driving miles of downtown Mesa.",
      es: "Las comunidades principales son Mesa, Gilbert, Chandler, Tempe, Apache Junction y Queen Creek. Scottsdale y Phoenix están disponibles con traslado confirmado durante la cotización. El traslado incluido cubre hasta 25 millas por carretera desde el centro de Mesa.",
      href: "index.html#service-area",
      label: ["See the Service Map", "Ver el mapa de servicio"],
    },
    delivery: {
      aliases: [
        "delivery",
        "when will i receive my media",
        "how long does delivery take",
        "entrega",
        "cuando recibire el contenido",
        "cuanto tarda la entrega",
      ],
      en: "Delivery targets are photos within two business days and tours/video within three business days, pending operational confirmation. Final timing is confirmed for your project.",
      es: "Los plazos previstos son fotos en dos días hábiles y recorridos/video en tres días hábiles, sujetos a confirmación operativa. El plazo final se confirma para tu proyecto.",
      href: "contact.html?intent=questions",
      label: ["Discuss Your Timing", "Consultar los plazos"],
    },
    owner: {
      aliases: [
        "team",
        "owner",
        "who is rey",
        "who captures the media",
        "who owns flyby",
        "equipo",
        "propietario",
        "quien es rey",
        "quien captura el contenido",
      ],
      en: "Meet the FlyBy Crew and learn about the creator behind your property media on the Meet the Crew page.",
      es: "El equipo FlyBy es el propietario y actual creador de contenido inmobiliario de FlyBy. Conócelo en la página Conoce al equipo.",
      href: "meet.html",
      label: ["Meet the FlyBy Crew", "Conoce al equipo"],
    },
    portfolio: {
      aliases: [
        "portfolio",
        "can i see your work",
        "is this your work",
        "portafolio",
        "puedo ver su trabajo",
        "es este su trabajo",
      ],
      en: "The portfolio is a digital book. It currently contains clearly labeled reference images; genuine FlyBy work and a real tour are still awaiting upload.",
      es: "El portafolio es un libro digital. Por ahora contiene imágenes de referencia identificadas; aún faltan trabajos auténticos de FlyBy y un recorrido real.",
      href: "gallery.html",
      label: ["Open the Portfolio", "Abrir el portafolio"],
    },
    booking: {
      aliases: [
        "booking",
        "can i book a shoot",
        "how do i book",
        "is the calendar live",
        "reservar",
        "como reservo",
        "puedo reservar una sesion",
        "el calendario esta conectado",
      ],
      en: "Start with Pricing, continue to Contact, choose a date, and review your request. Live calendar availability and submissions are not connected yet, so no real request or appointment is confirmed.",
      es: "Empieza en Precios, continúa a Contacto, elige una fecha y revisa la solicitud. La disponibilidad en vivo y los envíos aún no están conectados, así que no se confirma una solicitud real ni una cita.",
      href: "pricing.html",
      label: ["Start with an Estimate", "Empezar con una estimación"],
    },
  };
  function normalize(value) {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9° ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function match(value) {
    const input = normalize(value);
    return (
      Object.keys(definitions).find((key) =>
        definitions[key].aliases.some((alias) => normalize(alias) === input),
      ) || null
    );
  }
  function answer(key, lang = "en") {
    const item = definitions[key];
    if (!item) return null;
    let text = lang === "es" ? item.es : item.en;
    if (key === "pricing" && root.FlyByPricing?.tiers?.length) {
      const base = root.FlyByPricing.tiers[0];
      text =
        (lang === "es"
          ? "Fotografía desde $" + base.photo + " y recorridos desde $" + base.tour + ". "
          : "Photography from $" + base.photo + " and tours from $" + base.tour + ". ") +
        text;
    }
    if (
      key === "booking" &&
      root.FlyByBooking?.availabilityEndpoint &&
      root.FlyByBooking?.requestEndpoint
    )
      text =
        lang === "es"
          ? "Empieza en Precios, continúa a Contacto y selecciona un horario disponible. Revisa la solicitud antes de enviarla. FlyBy confirma manualmente el alcance y la cita."
          : "Start in Pricing, continue to Contact and choose an available time. Review the request before submitting. FlyBy confirms scope and appointments manually.";
    return { text, href: item.href, label: item.label[lang === "es" ? 1 : 0] };
  }
  root.FlyByHelperAnswers = { match, answer };
  if (typeof module !== "undefined") module.exports = root.FlyByHelperAnswers;
})(globalThis);
