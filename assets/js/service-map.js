(() => {
  const locations = [
      {
        name: "Mesa",
        category: "core",
        coordinates: [-111.8314302884615, 33.4151759154873],
      },
      { name: "Gilbert", category: "core", coordinates: [-111.789027, 33.3528264] },
      {
        name: "Apache Junction",
        category: "core",
        coordinates: [-111.5500532, 33.414911],
      },
      { name: "Chandler", category: "core", coordinates: [-111.8412502, 33.3061605] },
      { name: "Queen Creek", category: "core", coordinates: [-111.6377055, 33.2485715] },
      { name: "Tempe", category: "core", coordinates: [-111.9400054, 33.4255104] },
      {
        name: "Scottsdale",
        category: "travel-confirmed",
        coordinates: [-111.9216734, 33.4948764],
      },
      {
        name: "Phoenix",
        category: "travel-confirmed",
        coordinates: [-112.0725488, 33.4482948],
      },
    ],
    copy = {
      en: [
        "FlyBy service locations",
        "Eight location pins positioned from the supplied map coordinates. Select a city below for travel details.",
        "Select a pin or city to highlight its boundary. Outlines are simplified 2025 Census boundaries for reference; included travel is confirmed by property address.",
        "Choose a service location",
        "MESA & THE EAST VALLEY",
      ],
      es: [
        "Ubicaciones de servicio de FlyBy",
        "Ocho puntos situados según las coordenadas del mapa proporcionado. Selecciona una ciudad para consultar el transporte.",
        "Selecciona un punto o ciudad para resaltar su límite. Son límites simplificados del Censo de 2025 como referencia; el transporte incluido se confirma según la dirección.",
        "Elige una ubicación de servicio",
        "MESA Y EAST VALLEY",
      ],
      "zh-CN": [
        "FlyBy 服务地点",
        "八个地点按所提供地图中的坐标标注。选择城市查看交通安排。",
        "选择标记或城市可突出显示边界。轮廓为简化的2025年人口普查边界，仅供参考；免费交通范围将根据房产地址确认。",
        "选择服务地点",
        "MESA 与 EAST VALLEY",
      ],
    },
    root = document.querySelector(".kml-service-map"),
    container = document.querySelector("#flyby-street-map");
  if (!root || !container) return;
  let map = null,
    selected = "Mesa",
    loaded = 0,
    failed = false;
  const markers = new Map(),
    cityLayers = new Map();
  let allBounds = null;
  const status = document.querySelector("#street-map-status"),
    messages = {
      en: [
        "Loading street map…",
        "Street map is unavailable right now. Use Open full map or choose a city below.",
        "Open full map ↗",
        "Interactive street map of FlyBy service locations",
        "Zoom in",
        "Zoom out",
      ],
      es: [
        "Cargando mapa de calles…",
        "El mapa no está disponible ahora. Abre el mapa completo o elige una ciudad abajo.",
        "Abrir mapa completo ↗",
        "Mapa de calles interactivo de los servicios de FlyBy",
        "Acercar",
        "Alejar",
      ],
      "zh-CN": [
        "正在加载街道地图…",
        "街道地图暂时无法加载。请打开完整地图或选择下方城市。",
        "打开完整地图 ↗",
        "FlyBy 服务地点互动街道地图",
        "放大",
        "缩小",
      ],
    };
  const language = () => messages[document.documentElement.lang] || messages.en;
  function select(name, fit = true) {
    selected = name;
    markers.forEach((marker, key) =>
      marker.getElement()?.classList.toggle("map-location-selected", key === name),
    );
    cityLayers.forEach((layer, key) => {
      const chosen = key === name;
      layer.setStyle({
        color: chosen ? "#087d8d" : "#385957",
        weight: chosen ? 3 : 1,
        opacity: chosen ? 1 : 0.25,
        fillColor: "#00a7b8",
        fillOpacity: chosen ? 0.2 : 0,
      });
      layer.getElement()?.classList.toggle("city-boundary-selected", chosen);
      if (chosen) layer.bringToFront();
    });
    const point = locations.find((p) => p.name === name);
    if (point)
      document.querySelector("#map-coordinate").textContent =
        point.coordinates[1].toFixed(5) +
        "° N · " +
        Math.abs(point.coordinates[0]).toFixed(5) +
        "° W";
    if (map) map.fire("flyby-service-selection");
    if (fit && map && allBounds) {
      const bounds = L.latLngBounds(allBounds.getSouthWest(), allBounds.getNorthEast());
      const outline = cityLayers.get(name);
      if (outline) bounds.extend(outline.getBounds());
      map.fitBounds(bounds, {
        padding: [28, 34],
        maxZoom: 11,
        animate: !matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    }
  }
  root
    .querySelectorAll("[data-city]")
    .forEach((button) =>
      button.addEventListener("click", () => select(button.dataset.city)),
    );
  function translate() {
    const t = copy[document.documentElement.lang] || copy.en,
      m = language();
    document.querySelector("#service-map-note").textContent = t[2];
    root.setAttribute("aria-label", t[0]);
    root.querySelector(".service-city-list").setAttribute("aria-label", t[3]);
    container.setAttribute("aria-label", m[3]);
    root.querySelector(".street-map-link").textContent = m[2];
    status.textContent = m[failed ? 1 : 0];
    const zoomIn = root.querySelector(".leaflet-control-zoom-in"),
      zoomOut = root.querySelector(".leaflet-control-zoom-out");
    if (zoomIn) {
      zoomIn.setAttribute("title", m[4]);
      zoomIn.setAttribute("aria-label", m[4]);
      zoomOut.setAttribute("title", m[5]);
      zoomOut.setAttribute("aria-label", m[5]);
    }
  }
  function unavailable() {
    if (loaded) return;
    failed = true;
    status.hidden = false;
    translate();
  }
  function initialize() {
    if (map) return;
    if (!window.L) {
      unavailable();
      return;
    }
    const L = window.L,
      reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    map = L.map(container, {
      scrollWheelZoom: false,
      minZoom: 8,
      maxZoom: 16,
      zoomAnimation: !reduced,
      fadeAnimation: !reduced,
    });
    const bounds = L.latLngBounds(
      locations.map((p) => [p.coordinates[1], p.coordinates[0]]),
    );
    allBounds = bounds;
    map.fitBounds(bounds, { padding: [30, 36], maxZoom: 11, animate: false });
    const tileOptions = {
        maxZoom: 16,
        attribution:
          '<a href="https://www.usgs.gov/programs/national-geospatial-program/national-map">USGS The National Map</a> · Boundaries: <a href="https://www.census.gov/geographies/mapping-files/2025/geo/carto-boundary-file.html">U.S. Census Bureau (2025)</a>',
        keepBuffer: 1,
        updateWhenIdle: true,
        referrerPolicy: "strict-origin-when-cross-origin",
      },
      overview = L.tileLayer(
        "https://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/tile/{z}/{y}/{x}",
        { ...tileOptions, minNativeZoom: 10, maxNativeZoom: 10 },
      ),
      detail = L.tileLayer(
        window.FlyByMapConfig?.tileUrl ||
          "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
        { ...tileOptions, minZoom: 12 },
      );
    for (const layer of [overview, detail]) {
      layer.on("tileload", () => {
        loaded++;
        failed = false;
        status.hidden = true;
      });
      layer.on("tileerror", unavailable);
    }
    overview.addTo(map);
    function setMapDetail() {
      const streets = map.getZoom() >= 12;
      container.dataset.mapDetail = streets ? "street" : "overview";
      if (streets && !map.hasLayer(detail)) detail.addTo(map);
      else if (!streets && map.hasLayer(detail)) map.removeLayer(detail);
      markers.forEach((marker, name) => {
        if (!streets && (innerWidth > 600 || name === selected)) marker.openTooltip();
        else marker.closeTooltip();
      });
    }
    map.on("zoomend flyby-service-selection", setMapDetail);
    setMapDetail();
    L.geoJSON(window.FlyByCityBoundaries, {
      style: {
        className: "city-boundary",
        color: "#385957",
        weight: 1,
        opacity: 0.25,
        fillOpacity: 0,
      },
      onEachFeature(feature, layer) {
        const name = feature.properties.name;
        cityLayers.set(name, layer);
        layer.on("add", () =>
          layer.getElement()?.setAttribute("data-boundary-city", name),
        );
        layer.on("click", () => root.querySelector('[data-city="' + name + '"]').click());
      },
    }).addTo(map);
    locations.forEach((p, i) => {
      const icon = L.divIcon({
          className:
            "map-location-icon " +
            (p.category === "travel-confirmed" ? "map-location-extra" : ""),
          html: "<span>" + (i + 1) + "</span>",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
        marker = L.marker([p.coordinates[1], p.coordinates[0]], {
          icon,
          title: p.name,
          alt: p.name,
          keyboard: true,
        })
          .addTo(map)
          .bindTooltip(p.name, {
            direction: ["Tempe", "Phoenix"].includes(p.name)
              ? "left"
              : ["Gilbert", "Apache Junction"].includes(p.name)
                ? "right"
                : ["Chandler", "Queen Creek"].includes(p.name)
                  ? "bottom"
                  : "top",
            offset: ["Tempe", "Phoenix"].includes(p.name)
              ? [-14, 0]
              : ["Gilbert", "Apache Junction"].includes(p.name)
                ? [14, 0]
                : ["Chandler", "Queen Creek"].includes(p.name)
                  ? [0, 14]
                  : [0, -14],
          });
      marker.on("click", () =>
        root.querySelector('[data-city="' + p.name + '"]').click(),
      );
      markers.set(p.name, marker);
    });
    select(selected, false);
    setMapDetail();
    translate();
    setTimeout(unavailable, 12000);
    if (window.ResizeObserver)
      new ResizeObserver(() => {
        map.invalidateSize({ pan: false });
        map.fitBounds(bounds, { padding: [30, 36], maxZoom: 11, animate: false });
      }).observe(container);
  }
  document.addEventListener("flyby-language-change", translate);
  translate();
  select("Mesa");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          initialize();
        }
      },
      { rootMargin: "250px" },
    );
    observer.observe(container);
  } else initialize();
})();
