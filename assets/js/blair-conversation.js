(() => {
  const base = window.FlyByHelperAnswers,
    norm = (value) =>
      String(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9° ]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
  const extra = {
    quoteGuide: {
      en: "I can guide you through property type, size, services, your estimate, Contact, delivery date, review, and sending. You complete the fields and submit yourself.",
      es: "Puedo guiarte por tipo, tamaño, servicios, estimación, Contacto, fecha de entrega, revisión y envío. Tú completas los campos y envías.",
    },
    customGuide: {
      en: "Select Request a custom quote, describe your request in Notes, then send it by email when connected. Contact details are optional; add a way to reach you for a reply within 1 day.",
      es: "Selecciona Solicitar cotización personalizada, describe la solicitud en Notas y envíala por correo cuando esté conectado. Los datos de contacto son opcionales; añade cómo responderte en un día.",
    },
    booking: {
      en: "Start with Pricing, add your contact and property details, then choose your requested media delivery date. the FlyBy Crew reviews the deadline and schedules the capture separately. Calendar request submission is not connected yet.",
      es: "Empieza en Precios, añade datos de contacto y propiedad y elige la fecha solicitada de entrega del contenido. el equipo FlyBy revisa la fecha límite y programa la captura por separado. El envío al calendario aún no está conectado.",
    },
    hello: {
      en: "Hi, I’m Blair! What would you like to explore: services, the portfolio, the FlyBy Crew, or an estimate?",
      es: "¡Hola, soy Blair! ¿Qué quieres explorar: servicios, portafolio, el equipo FlyBy o una estimación?",
    },
    thanks: {
      en: "You’re welcome! Want to see the work, compare services, or get an estimate?",
      es: "¡Con gusto! ¿Quieres ver el trabajo, comparar servicios o conseguir una estimación?",
    },
    wellbeing: {
      en: "Ready to help you find a better perspective! What would you like to see on FlyBy?",
      es: "¡Lista para ayudarte a encontrar una mejor perspectiva! ¿Qué quieres ver en FlyBy?",
    },
    weather: {
      en: "Aerial work depends on suitable weather, safe conditions, and flight availability. Scheduling and changes are confirmed manually with the FlyBy Crew.",
      es: "El trabajo aéreo depende de buen clima, condiciones seguras y disponibilidad de vuelo. el equipo FlyBy confirma manualmente horarios y cambios.",
    },
    branding: {
      en: "Discuss branded and unbranded delivery options with the FlyBy Crew during project confirmation. These options are explained in the FAQ.",
      es: "Consulta con el equipo FlyBy las opciones de entrega con y sin marca al confirmar el proyecto. Estas opciones se explican en Preguntas frecuentes.",
    },
    boundaries: {
      en: "Boundary overlays are illustrative, based on information supplied by the client. They are not surveys or verified legal boundaries.",
      es: "Las marcas de límites son ilustrativas y se basan en información del cliente. No son levantamientos ni límites legales verificados.",
    },
    large: {
      en: "Homes above 5,000 sq ft, parcels above two acres, additional panoramas, and complex projects need a custom quote. You can ask the FlyBy Crew through Contact.",
      es: "Casas de más de 5,000 pies cuadrados, terrenos de más de dos acres, panoramas adicionales y proyectos complejos requieren una cotización personalizada. Puedes consultar al equipo FlyBy en Contacto.",
    },
    goodbye: {
      en: "Thanks for visiting FlyBy! I’ll be here whenever you need a hand.",
      es: "¡Gracias por visitar FlyBy! Aquí estaré cuando necesites ayuda.",
    },
    capabilities: {
      en: "I’m a rule-based website guide. I can explain FlyBy’s services and lead you to the portfolio, pricing, the FlyBy Crew, reviews, or Contact. If I don’t have a verified answer, I’ll help you ask the FlyBy Crew.",
      es: "Soy una guía del sitio basada en reglas. Puedo explicar los servicios de FlyBy y llevarte al portafolio, precios, el equipo FlyBy, reseñas o Contacto. Si no tengo una respuesta verificada, te ayudo a preguntarle al equipo FlyBy.",
    },
    photos: {
      en: "Property photography includes edited interior and exterior images: 25–40 images depending on home size. Let’s explore the photography service; Pricing has the size-based estimate.",
      es: "La fotografía inmobiliaria incluye imágenes editadas de interiores y exteriores: 25–40 según el tamaño de la casa. Exploremos el servicio; Precios ofrece la estimación por tamaño.",
    },
    aerial: {
      en: "Aerial photography shows the lot and surroundings. The listed service is $149 for 10 edited aerial photos for one property up to two acres, subject to flight availability and suitable weather.",
      es: "La fotografía aérea muestra el terreno y su entorno. El servicio indicado cuesta $149 por 10 fotos aéreas editadas de una propiedad de hasta dos acres, sujeto a disponibilidad de vuelo y clima adecuado.",
    },
    video: {
      en: "Aerial video is a 30–45-second edited sequence for one property up to two acres, listed at $199. Flight availability and suitable weather apply.",
      es: "El video aéreo es una secuencia editada de 30–45 segundos para una propiedad de hasta dos acres, con precio indicado de $199. Depende de disponibilidad de vuelo y clima adecuado.",
    },
    reviews: {
      en: "The Reviews page is where customer feedback will appear. Published customer reviews are still awaiting collection; I won’t invent any.",
      es: "La página de Reseñas mostrará opiniones de clientes. Aún falta recopilar reseñas publicadas; no inventaré ninguna.",
    },
    faq: {
      en: "Let’s look through the frequently asked questions. You can open a question to see its answer.",
      es: "Veamos las preguntas frecuentes. Puedes abrir una pregunta para ver su respuesta.",
    },
    contact: {
      en: "Let’s ask the FlyBy Crew. Choose the questions option, add your name and email, and optionally write your question in Notes. I’ll walk you through it.",
      es: "Preguntémosle al equipo FlyBy. Elige la opción de preguntas, añade nombre y correo y, si quieres, escribe tu pregunta en Notas. Te guiaré paso a paso.",
    },
    privacy: {
      en: "The Privacy page explains browser drafts and the services the website loads. Blair’s conversation stays in this browser session and isn’t sent to an AI service.",
      es: "Privacidad explica los borradores del navegador y los servicios que carga el sitio. La conversación con Blair se queda en esta sesión del navegador y no se envía a un servicio de IA.",
    },
    clarify: {
      en: "Which would you like: services, the portfolio, the FlyBy Crew, pricing, reviews, or Contact?",
      es: "¿Qué prefieres: servicios, portafolio, el equipo FlyBy, precios, reseñas o Contacto?",
    },
  };
  const destinations = {
    quoteGuide: ["pricing.html", "#kind"],
    customGuide: ["contact.html", "#custom"],
    weather: ["faq.html", "#faq-weather"],
    branding: ["faq.html", "#faq-branding"],
    boundaries: ["faq.html", "#faq-boundaries"],
    large: ["faq.html", "#faq-large"],
    services: ["services.html", "#service-panel"],
    photos: ["services.html", "#service-panel", "#explore-photos"],
    tours: ["services.html", "#service-panel", "#explore-tour"],
    aerial: ["services.html", "#service-panel", "#explore-aerial"],
    video: ["services.html", "#service-panel", "#explore-video"],
    hosting: ["services.html", "#service-panel", "#explore-tour"],
    pricing: ["pricing.html", "#size"],
    bundles: ["pricing.html", "#choices"],
    area: ["index.html", "#flyby-street-map"],
    delivery: ["faq.html", "#faq-delivery"],
    owner: ["meet.html", "#owner-photo"],
    portfolio: ["gallery.html", "#book-stage"],
    booking: ["pricing.html", "#size"],
    reviews: ["work.html", "main h1"],
    faq: ["faq.html", "main details"],
    contact: ["contact.html", '[name="contact-intent"][value="questions"]'],
    privacy: ["privacy.html", "main h1"],
  };
  const patterns = [
    ["privacy", /\b(privacy|privacidad|personal data|datos personales)\b/],
    [
      "contact",
      /\b(contact|contacto|question for rey|ask rey|hablar con rey|preguntarle a rey|call me|llamenme)\b/,
    ],
    [
      "reviews",
      /\b(review|reviews|testimonials|feedback|resenas|opiniones|testimonios)\b/,
    ],
    ["hosting", /\b(hosting|hosted|alojamiento|six months|6 months)\b/],
    ["bundles", /\b(bundle|discount|save money|savings|descuento|ahorro|paquete)\b/],
    [
      "area",
      /\b(mesa|gilbert|chandler|tempe|phoenix|scottsdale|queen creek|apache junction|service area|where do you work|where are you|location|ubicacion|zona|donde trabajan|donde estan)\b/,
    ],
    [
      "owner",
      /\b(rey|owner|team|photographer|who are you guys|about flyby|propietario|equipo|fotografo|quien captura)\b/,
    ],
    [
      "portfolio",
      /\b(portfolio|gallery|examples|samples|your work|see work|quality|portafolio|galeria|ejemplos|su trabajo|tu trabajo|calidad)\b/,
    ],
    [
      "delivery",
      /\b(delivery|turnaround|how long does it take|how soon|entrega|cuanto tarda|cuando recib)\b/,
    ],
    [
      "booking",
      /\b(book|booking|appointment|calendar|schedule|date|reservar|reserva|cita|calendario|fecha)\b/,
    ],
    [
      "tours",
      /\b(360|tour|tours|matterport|walkthrough|recorrido|recorridos|floor plan|dollhouse|zillow)\b/,
    ],
    ["video", /\b(video|videos|film|filming|footage)\b/],
    [
      "aerial",
      /\b(drone|drones|aerial|dron|aerea|aereo|land|parcel|acreage|terreno|parcela|acres)\b/,
    ],
    [
      "photos",
      /\b(photo|photos|photography|pictures|images|fotos|fotografia|imagenes)\b/,
    ],
    ["services", /\b(services|offer|offerings|what can you do for|servicios|ofrecen)\b/],
    ["faq", /\b(faq|frequently asked|preguntas frecuentes)\b/],
  ];
  function match(value, previous = null) {
    const s = norm(value);
    if (!s) return null;
    if (
      /\b(licensed|insured|license|insurance|faa|certified|commercial tower|guarantee|refund|cancel|licencia|seguro|certificacion|garantia|reembolso|cancelar|invent|ignore your instructions|inventa|ignora tus instrucciones)\b/.test(
        s,
      )
    )
      return null;
    if (
      /\b(?:(?:ask|contact|talk to|speak (?:to|with)|message|reach|call) (?:the )?(?:owner|founder|rey)|(?:hablar con|contactar a|preguntarle a) (?:el )?(?:dueno|propietario|rey))\b/.test(
        s,
      )
    )
      return "contact";
    if (
      /\b(?:who (?:owns|runs|founded|started)|who is (?:the )?(?:owner|founder)|whose company|quien (?:es el dueno|es el propietario|dirige|fundo))\b/.test(
        s,
      )
    )
      return "owner";
    if (
      /\b(service locations?|service areas?|service map|coverage|locations|cities|towns|service region|operating area|areas served|work in|shoot in|available in|cobertura|areas (?:do you|you) (?:serve|cover)|where (?:do|can|will) you (?:service|serve|work|travel|shoot)|where do you provide services|where.*(?:service|serve)|where are (?:your|the) services|(?:do|can|will) you (?:serve|cover|come to|travel to)|where.*(?:available|offer services)|ubicaciones|mapa|zonas? de servicio|donde (?:ofrecen|atienden|trabajan|dan servicio)|que (?:ciudades|zonas))\b/.test(
        s,
      )
    )
      return "area";
    if (
      /\b(step by step|walk me through|guide me|help me get|how do i get a quote|how do i submit|paso a paso|guiame|como consigo una cotizacion|como envio)\b/.test(
        s,
      )
    )
      return "quoteGuide";
    if (/\b(custom quote|cotizacion personalizada)\b/.test(s)) return "customGuide";
    const exact = base.match(value);
    if (exact) return exact;
    if (/\b(weather|rain|wind|bad weather|clima|lluvia|viento)\b/.test(s))
      return "weather";
    if (/\b(brand|branded|unbranded|marca|sin marca)\b/.test(s)) return "branding";
    if (/\b(boundary|boundaries|survey|limites|levantamiento)\b/.test(s))
      return "boundaries";
    if (
      /\b(larger properties|large property|big house|custom quote|propiedad grande|cotizacion personalizada)\b/.test(
        s,
      )
    )
      return "large";
    if (
      /^(how are you|how are you blair|whats up|como estas|como estas blair|que tal)$/.test(
        s,
      )
    )
      return "wellbeing";
    if (/^(hi|hello|hey|hola|buenos dias|buenas tardes|good morning)( blair)?$/.test(s))
      return "hello";
    if (
      /^(thank you|thanks|thank you blair|thanks blair|gracias|muchas gracias|gracias blair|perfect|great|ok|okay|perfecto|genial)$/.test(
        s,
      )
    )
      return "thanks";
    if (/^(bye|goodbye|adios|hasta luego)$/.test(s)) return "goodbye";
    if (
      /\b(who are you|your name|are you ai|help me|help|quien eres|como te llamas|eres ia|ayudame)\b/.test(
        s,
      )
    )
      return "capabilities";
    if (/\b(what can you do|que puedes hacer)\b/.test(s)) return "services";
    if (
      /^(yes|si|sure|show me|take me there|tell me more|more|and that|what about that|muestrame|llevame|dime mas|mas)$/.test(
        s,
      )
    )
      return destinations[previous] ? previous : "clarify";
    if (/^(no|no thanks|no gracias)$/.test(s)) return "clarify";
    const price =
      /\b(price|prices|pricing|cost|costs|how much|estimate|quote|pay|charge|budget|precio|precios|cuanto cuesta|cuanto cuestan|cotizacion|estimacion|pies cuadrados|square feet|square footage|sq ft|sqft)\b/.test(
        s,
      );
    if (price) {
      if (/\b(video|aerial|drone|dron|aereo|aerea)\b/.test(s))
        return /\bvideo\b/.test(s) ? "video" : "aerial";
      if (
        ["aerial", "video"].includes(previous) &&
        /^(how much|how much does it cost|what does it cost|cuanto cuesta)$/.test(s)
      )
        return previous;
      return "pricing";
    }
    if (/^(how long|for how long|cuanto tiempo|por cuanto tiempo)$/.test(s))
      return ["tours", "hosting"].includes(previous)
        ? "hosting"
        : previous === "booking"
          ? "booking"
          : "delivery";
    return patterns.find(([, pattern]) => pattern.test(s))?.[0] || null;
  }
  function answer(key, lang = "en") {
    if (!Object.hasOwn(extra, key) && !Object.hasOwn(destinations, key)) return null;
    const route = destinations[key],
      item = extra[key],
      labels = {
        photos: ["Explore Photography", "Explorar fotografía"],
        aerial: ["Explore Aerial Photos", "Explorar fotos aéreas"],
        video: ["Explore Aerial Video", "Explorar video aéreo"],
        reviews: ["Read Reviews", "Leer reseñas"],
        faq: ["Explore the FAQ", "Explorar preguntas frecuentes"],
        privacy: ["Read Privacy Details", "Leer privacidad"],
        hosting: ["See Tour Hosting", "Ver alojamiento del recorrido"],
        delivery: ["See Delivery Details", "Ver plazos de entrega"],
        weather: ["See Flight Conditions", "Ver condiciones de vuelo"],
        branding: ["See Delivery Options", "Ver opciones de entrega"],
        boundaries: ["See Boundary Details", "Ver detalles de límites"],
        large: ["See Custom Quote Details", "Ver cotizaciones personalizadas"],
      },
      original = item
        ? {
            text: item[lang === "es" ? "es" : "en"],
            label: lang === "es" ? "Ver información" : "See this information",
            href: route?.[0] || null,
          }
        : base.answer(key, lang);
    if (!original) return null;
    return {
      ...original,
      label: labels[key]?.[lang === "es" ? 1 : 0] || original.label,
      href: route ? route[0] + (route[1].startsWith("#") ? route[1] : "") : null,
      route: route
        ? { page: route[0], selector: route[1], activate: route[2] || null }
        : null,
    };
  }
  window.FlyByHelperAnswers = { match, answer };
  window.FlyByBlairTopics = Object.keys(destinations);
})();
