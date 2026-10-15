Object.assign(window.FlyBySpanish,{
  "Choose a Delivery Date →": "Elegir fecha de entrega →",
  "Step 2 of 3 · Delivery deadline": "Paso 2 de 3 · Fecha límite de entrega",
  "Your media.": "Tu contenido.",
  "Your deadline.": "Tu fecha límite.",
  "Choose when you would like the finished media delivered. Rey will confirm the deadline and schedule the capture separately.": "Elige cuándo deseas recibir el contenido terminado. Rey confirmará la fecha límite y programará la captura por separado.",
  "Requested media delivery date": "Fecha solicitada de entrega del contenido",
  "Select your requested media delivery date. Rey confirms the deadline and schedules the capture separately.": "Selecciona la fecha solicitada de entrega. Rey confirma la fecha límite y programa la captura por separado.",
  "This is a requested delivery deadline, not a capture appointment or a guaranteed delivery date.": "Es una fecha límite solicitada de entrega, no una cita de captura ni una fecha garantizada.",
  "Rey reviews the scope, access, and delivery deadline, then schedules the capture with you.": "Rey revisa el alcance, acceso y fecha límite de entrega y después programa la captura contigo.",
  "Check your property, selected services, estimate, and requested delivery date.": "Revisa la propiedad, servicios, estimación y fecha solicitada de entrega.",
  "Calendar requests are not connected yet. Your request has not been sent.": "Las solicitudes al calendario aún no están conectadas. Tu solicitud no se ha enviado.",
  "Change Delivery Date →": "Cambiar fecha de entrega →",
  "Send Media Request ↗": "Enviar solicitud de contenido ↗",
  "Request a delivery date": "Solicita una fecha de entrega",
  "Share the location, access details, and when you need the finished media.": "Comparte ubicación, acceso y cuándo necesitas el contenido terminado.",
  "Capture scheduling": "Programación de la captura",
  "Rey schedules the capture separately after reviewing your request.": "Rey programa la captura por separado después de revisar tu solicitud.",
  "Request a Reply →": "Solicitar respuesta →",
  "Add your name and email. Your question in Notes is optional. This request goes to FlyBy’s business email.": "Añade nombre y correo. La pregunta en Notas es opcional. Esta solicitud va al correo empresarial de FlyBy.",
  "Property type, size, services, and estimate come from Pricing. Next, choose when you would like the finished media delivered.": "El tipo, tamaño, servicios y estimación vienen de Precios. Después elige cuándo deseas recibir el contenido terminado.",
  "Business email is not connected yet. This form cannot send your question.": "El correo empresarial aún no está conectado. Este formulario no puede enviar tu pregunta.",
  "Choose a requested media delivery date.": "Elige una fecha solicitada de entrega del contenido.",
  "Review your request before sending. The delivery deadline is confirmed manually.": "Revisa la solicitud antes de enviarla. La fecha límite de entrega se confirma manualmente.",
  "Your question has been sent to FlyBy’s business email. Rey will reply to you.": "Tu pregunta se ha enviado al correo empresarial de FlyBy. Rey te responderá.",
  "Your media request has been added to FlyBy’s calendar for review. The requested delivery date still needs confirmation; Rey will schedule the capture separately.": "Tu solicitud de contenido se ha añadido al calendario de FlyBy para revisión. La fecha solicitada de entrega aún necesita confirmación; Rey programará la captura por separado.",
  "Your request could not be confirmed. Your details remain here; please try again later.": "No se pudo confirmar tu solicitud. Los datos siguen aquí; inténtalo más tarde.",
  "When will the media be delivered?": "¿Cuándo se entregará el contenido?",
  "You choose your requested media delivery date. Rey reviews the deadline and confirms it with you, then schedules the capture separately. The date is not a capture appointment or a delivery guarantee.": "Tú eliges la fecha solicitada de entrega del contenido. Rey revisa y confirma la fecha límite contigo y programa la captura por separado. Esa fecha no es una cita de captura ni una garantía de entrega.",
  "Step 1 of 3 · Property details. Share your estimate, choose a delivery deadline, and review your media request.": "Paso 1 de 3 · Datos de la propiedad. Comparte la estimación, elige una fecha límite de entrega y revisa la solicitud."
});

Object.assign(window.FlyBySpanish,{"When connected, contact requests are sent to FlyBy’s business mailbox and media requests are added to a private Google Calendar for review. The media delivery date is a requested deadline; Rey confirms it and schedules the capture separately. No request is sent while that connection is unavailable.":"Cuando estén conectadas, las solicitudes de contacto se envían al correo empresarial de FlyBy y las de contenido se añaden a un calendario privado de Google para revisión. La fecha de entrega es una fecha límite solicitada; Rey la confirma y programa la captura por separado. No se envía ninguna solicitud mientras la conexión no esté disponible."});

Object.assign(window.FlyBySpanish,{"Contact details":"Datos de contacto","Complete an estimate in Pricing, or select Request a custom quote to unlock these fields.":"Completa una estimación en Precios o selecciona Solicitar cotización personalizada para desbloquear estos campos.","Your estimate is ready. Add your contact details below.":"Tu estimación está lista. Añade los datos de contacto abajo.","Describe your custom request in Notes. All other fields are optional.":"Describe tu solicitud personalizada en Notas. Los demás campos son opcionales.","Describe your custom request (required).":"Describe tu solicitud personalizada (obligatorio).","Request a Custom Quote →":"Solicitar cotización personalizada →","Describe your custom request in Notes before continuing.":"Describe tu solicitud personalizada en Notas antes de continuar."});

Object.assign(window.FlyBySpanish,{"Optional: add an email or phone so Rey can send your response within 1 day.":"Opcional: añade correo o teléfono para que Rey pueda responderte en un día.","Business email is not connected yet. This form cannot send your request.":"El correo empresarial aún no está conectado. Este formulario no puede enviar tu solicitud.","Your custom quote request has been sent. You should receive a response within 1 day.":"Tu solicitud de cotización personalizada se ha enviado. Deberías recibir una respuesta en un día.","Your question has been sent. You should receive an answer within 1 day.":"Tu pregunta se ha enviado. Deberías recibir una respuesta en un día."});

// Crew wording translations
for(const [key,value] of Object.entries(window.FlyBySpanish)){if(/\bRey\b/.test(key)&&!key.includes('Rey M.'))window.FlyBySpanish[key.replace(/\bRey\b/g,'the FlyBy Crew')]=value.replace(/\bRey\b/g,'el equipo FlyBy').replaceAll('a el equipo','al equipo').replaceAll('de el equipo','del equipo');}
