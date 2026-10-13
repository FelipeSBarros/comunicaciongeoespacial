/* global maplibregl, scrollama, QRCode */
(() => {
  const ESCENAS = window.ESCENAS;
  const NOTAS = window.NOTAS || {};
  const $ = (s) => document.querySelector(s);

  const ESTILO = "https://tiles.openfreemap.org/styles/fiord";
  const SATELITE = {
    type: "raster",
    tiles: ["https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg"],
    tileSize: 256,
    maxzoom: 15,
    attribution: 'Sentinel-2 cloudless 2020 · <a href="https://s2maps.eu">EOX IT Services</a> (datos Copernicus Sentinel modificados)',
  };
  const CICLO = ["Pregunta", "Datos", "Terreno", "Cómo contarlo", "Dónde se lee"];

  let actual = -1;
  let mapaListo = false;
  let marcadores = [];
  let visualActual = null;
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Pasos (secciones que se scrollean) ----------
  const pasos = $("#pasos");
  ESCENAS.forEach((e, i) => {
    const s = document.createElement("section");
    s.className = "paso" + (e.visual && !e.caja ? " paso--vacio" : "") + (e.visual && e.caja ? " paso--pie" : "");
    s.dataset.i = i;
    s.id = "e" + e.id;
    if (e.caja) s.innerHTML = `<div class="caja">${e.caja}</div>`;
    pasos.appendChild(s);
  });

  // ---------- Ciclo lateral ----------
  $("#ciclo").innerHTML = CICLO.map((t, k) => `<li data-k="${k + 1}"><span>${k + 1}</span>${t}</li>`).join("");

  // ---------- Mapa ----------
  const mapa = new maplibregl.Map({
    container: "mapa",
    style: ESTILO,
    center: ESCENAS[0].mapa.centro,
    zoom: ESCENAS[0].mapa.zoom,
    interactive: false,
    attributionControl: { compact: true },
  });

  window.mapa = mapa; // para inspeccionar desde la consola

  mapa.on("load", () => {
    // La imagen satelital va encima de todos los rellenos y líneas del estilo, debajo de las etiquetas.
    const capas = mapa.getStyle().layers;
    let ultimaNoEtiqueta = -1;
    capas.forEach((l, k) => { if (l.type !== "symbol") ultimaNoEtiqueta = k; });
    const etiqueta = capas[ultimaNoEtiqueta + 1];
    mapa.addSource("satelite", SATELITE);
    mapa.addLayer({ id: "satelite", type: "raster", source: "satelite", layout: { visibility: "none" } }, etiqueta && etiqueta.id);
    mapa.addSource("linea", { type: "geojson", data: lineaGeo([]) });
    mapa.addLayer({
      id: "linea", type: "line", source: "linea",
      paint: { "line-color": "#5DBBC3", "line-width": 4, "line-dasharray": [1.5, 1.5] },
    });
    mapa.addSource("ilustrativos", { type: "geojson", data: puntosIlustrativos() });
    mapa.addLayer({
      id: "ilustrativos", type: "circle", source: "ilustrativos",
      layout: { visibility: "none" },
      paint: {
        "circle-radius": 7,
        "circle-color": ["match", ["get", "c"], 1, "#5DBBC3", 2, "#F2C14E", "#E8735A"],
        "circle-stroke-color": "#fff", "circle-stroke-width": 1.5, "circle-opacity": 0.9,
      },
    });
    mapaListo = true;
    // Al cargar, ubicar el mapa en la última vista definida hasta la escena actual.
    for (let k = actual; k >= 0; k--) {
      if (ESCENAS[k].mapa) { aplicarMapa({ ...ESCENAS[actual], mapa: ESCENAS[k].mapa }, true); break; }
    }
  });

  function lineaGeo(coords) {
    return { type: "Feature", geometry: { type: "LineString", coordinates: coords } };
  }

  // Puntos ilustrativos (no son datos reales) sobre la parte urbana de Montevideo.
  function puntosIlustrativos() {
    let semilla = 7;
    const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647);
    const f = [];
    for (let k = 0; k < 70; k++) {
      // promedio de dos sorteos: más puntos hacia el centro de la ciudad
      const lng = -56.26 + ((azar() + azar()) / 2) * 0.22;
      const costa = -34.912 + Math.max(0, lng + 56.13) * 0.42;
      const lat = costa + 0.006 + ((azar() + azar()) / 2) * 0.075;
      f.push({ type: "Feature", properties: { c: 1 + (k % 3) }, geometry: { type: "Point", coordinates: [lng, lat] } });
    }
    return { type: "FeatureCollection", features: f };
  }

  function aplicarMapa(e, inmediato) {
    if (!mapaListo) return;
    if (e.mapa) {
      const m = e.mapa;
      // Con recuadro a la izquierda, el centro de la vista se corre a la derecha de la pantalla.
      const conCaja = e.caja && !e.visual && e.id !== ESCENAS[0].id && e.id !== ESCENAS[ESCENAS.length - 1].id;
      const padding = { top: 0, bottom: 0, right: 0, left: conCaja && innerWidth > 760 ? Math.round(innerWidth * 0.38) : 0 };
      const vista = { center: m.centro, zoom: m.zoom, pitch: m.pitch || 0, bearing: m.bearing || 0, padding };
      if (inmediato || reducido || !m.dur) mapa.jumpTo(vista);
      else mapa.flyTo({ ...vista, duration: m.dur, essential: true, curve: 1.5 });
      mapa.setLayoutProperty("satelite", "visibility", m.satelite ? "visible" : "none");
    }
    mapa.getSource("linea").setData(lineaGeo(e.linea || []));
    mapa.setLayoutProperty("ilustrativos", "visibility", e.puntos ? "visible" : "none");
  }

  function aplicarMarcadores(e) {
    marcadores.forEach((m) => m.remove());
    marcadores = (e.marcadores || []).map((p, k) => {
      const el = document.createElement("div");
      el.className = "marcador " + (p.clase || "");
      el.style.animationDelay = `${0.4 + k * 0.5}s`;
      el.innerHTML = `<span class="pulso"></span><span class="punto"></span>${p.texto ? `<span class="etiqueta">${p.texto}</span>` : ""}`;
      return new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(p.pos).addTo(mapa);
    });
  }

  // ---------- Capa visual (imagen, gráfico, texto) ----------
  const visual = $("#visual");

  function aplicarVisual(e) {
    const v = e.visual || null;
    const clave = v ? JSON.stringify(v) : null;
    document.body.classList.toggle("con-visual", !!v);
    if (clave === visualActual) return;
    visualActual = clave;
    visual.classList.remove("visible");
    visual.innerHTML = "";
    if (!v) return;
    const cont = document.createElement("div");
    cont.className = "visual-cont";
    if (v.img) {
      cont.classList.add("visual-img", v.ajuste === "cubrir" ? "cubrir" : "contener");
      cont.innerHTML = `<figure><img src="${v.img}" alt="">${v.pie ? `<figcaption>${v.pie}</figcaption>` : ""}</figure>`;
    } else if (v.chat) {
      cont.classList.add("visual-chat");
      cont.innerHTML = `<figure><div class="chat-marco"><img src="${v.chat}" alt="Captura de un chat de WhatsApp"><div class="chat-velo"></div></div><figcaption>${v.pie || ""}</figcaption></figure>`;
    } else if (v.grafico) {
      cont.classList.add("visual-grafico");
      cont.innerHTML = GRAFICOS[v.grafico]();
    } else if (v.html) {
      cont.classList.add("visual-html");
      cont.innerHTML = v.html;
    }
    visual.appendChild(cont);
    requestAnimationFrame(() => requestAnimationFrame(() => visual.classList.add("visible")));
  }

  // ---------- Gráficos (SVG a mano, sin dependencias) ----------
  const GRAFICOS = {
    atencion() {
      const W = 900, H = 470, m = { l: 90, r: 60, t: 90, b: 70 };
      const x = (a) => m.l + ((a - 2002) / (2018 - 2002)) * (W - m.l - m.r);
      const y = (s) => H - m.b - (s / 160) * (H - m.t - m.b);
      const pts = [[2004, 150, "≈150 s (2,5 min)", true], [2012, 75, "≈75 s", false], [2016, 47, "47 s", true]];
      const d = pts.map(([a, s], k) => `${k ? "L" : "M"}${x(a)},${y(s)}`).join(" ");
      const ejeY = [0, 30, 60, 90, 120, 150].map((s) =>
        `<line x1="${m.l}" x2="${W - m.r}" y1="${y(s)}" y2="${y(s)}" class="grilla"/><text x="${m.l - 14}" y="${y(s) + 6}" class="eje" text-anchor="end">${s}</text>`).join("");
      const ejeX = [2004, 2008, 2012, 2016].map((a) => `<text x="${x(a)}" y="${H - m.b + 34}" class="eje" text-anchor="middle">${a}</text>`).join("");
      const marcas = pts.map(([a, s, t, solido], k) =>
        `<circle cx="${x(a)}" cy="${y(s)}" r="10" class="${solido ? "p-solido" : "p-hueco"}" style="animation-delay:${0.6 + k * 0.8}s"/>
         <text x="${x(a) + 18}" y="${y(s) - 16}" class="etq" style="animation-delay:${0.6 + k * 0.8}s">${t}</text>`).join("");
      return `<h2 class="titulo-grafico">De 2,5 minutos a 47 segundos</h2>
        <svg viewBox="0 0 ${W} ${H}" class="grafico" role="img" aria-label="Segundos frente a una pantalla: 150 en 2004, 75 en 2012, 47 en 2016">
          ${ejeY}${ejeX}
          <text x="${m.l}" y="${m.t - 30}" class="eje-titulo">segundos frente a una pantalla antes de cambiar</text>
          <path d="${d}" class="linea-dibujo" pathLength="1"/>
          ${marcas}
          <line x1="${x(2016) - 16}" x2="${x(2016) + 16}" y1="${y(40)}" y2="${y(40)}" class="mediana"/>
          <text x="${x(2016) + 24}" y="${y(40) + 22}" class="etq chica" style="animation-delay:2.4s">mediana 40 s</text>
          <text x="${x(2012) - 14}" y="${y(75) + 40}" class="etq chica" text-anchor="end" style="animation-delay:1.4s">punto hueco: entrevistas</text>
        </svg>`;
    },

    medios() {
      const barra = (etq, v, max, destacada, k) => `
        <div class="fila ${destacada ? "destacada" : ""}">
          <span class="etq-fila">${etq}</span>
          <span class="pista-barra"><span class="relleno" style="--v:${v / max};animation-delay:${0.3 + k * 0.25}s"></span></span>
          <span class="valor">${v} %</span>
        </div>`;
      return `<h2 class="titulo-grafico">Nos informamos por el celular y por las redes</h2>
        <div class="paneles">
          <div class="panel"><h3>El celular como dispositivo principal para noticias</h3>
            ${barra("2014", 20, 60, false, 0)}${barra("2015", 25, 60, false, 1)}${barra("2015, menores de 35", 41, 60, true, 2)}
          </div>
          <div class="panel"><h3>Estados Unidos, 2025: ¿por dónde se informa?</h3>
            ${barra("Redes sociales y video", 54, 60, true, 3)}${barra("Televisión", 50, 60, false, 4)}${barra("Sitios y aplicaciones", 48, 60, false, 5)}
          </div>
        </div>`;
    },

    waffle() {
      const celdas = Array.from({ length: 72 }, (_, k) =>
        `<span class="${k < 21 ? "con" : ""}" style="animation-delay:${k < 21 ? 0.3 + k * 0.07 : 0}s"></span>`).join("");
      return `<div class="waffle-cont">
        <div class="waffle" aria-label="21 de 72 tierras indígenas con soja">${celdas}</div>
        <div class="waffle-txt"><p><strong class="enorme">21 de 72</strong></p><p>tierras indígenas de Mato Grosso con soja</p>
        <p class="sep"><strong class="enorme">≈73 mil ha</strong></p><p>de cultivo en tierras indígenas</p></div>
      </div>`;
    },
  };

  // ---------- Activar una escena ----------
  function activar(i) {
    if (i === actual || i < 0 || i >= ESCENAS.length) return;
    actual = i;
    const e = ESCENAS[i];
    aplicarMapa(e, false);
    aplicarMarcadores(e);
    aplicarVisual(e);
    $("#mapa").classList.toggle("desenfocado", !!e.desenfocar);
    document.body.classList.toggle("desenfocado", !!e.desenfocar);
    document.body.classList.toggle("con-ciclo", e.ciclo !== undefined);
    document.body.classList.toggle("con-pie", !!(e.visual && e.caja));

    const ciclo = $("#ciclo");
    ciclo.classList.toggle("visible", e.ciclo !== undefined);
    ciclo.querySelectorAll("li").forEach((li) =>
      li.classList.toggle("activo", e.ciclo === 0 || Number(li.dataset.k) === e.ciclo));

    $("#bloque").textContent = e.bloque;
    $("#barra").style.width = `${((i + 1) / ESCENAS.length) * 100}%`;
    actualizarNotas(e);
    history.replaceState(null, "", "#" + e.id);
  }

  // ---------- Navegación con teclado ----------
  function ir(i) {
    const s = pasos.children[Math.max(0, Math.min(ESCENAS.length - 1, i))];
    s.scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "start" });
  }

  document.addEventListener("keydown", (ev) => {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    const k = ev.key;
    if (["PageDown", "ArrowDown", "ArrowRight", " ", "Enter"].includes(k)) { ev.preventDefault(); ir(actual + 1); }
    else if (["PageUp", "ArrowUp", "ArrowLeft", "Backspace"].includes(k)) { ev.preventDefault(); ir(actual - 1); }
    else if (k === "Home") { ev.preventDefault(); ir(0); }
    else if (k === "End") { ev.preventDefault(); ir(ESCENAS.length - 1); }
    else if (k === "n" || k === "N") $("#notas").hidden = !$("#notas").hidden;
    else if (k === "f" || k === "F") {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    }
  });

  // ---------- Notas del orador (tecla N) ----------
  function actualizarNotas(e) {
    const n = NOTAS[e.nota || e.id] || {};
    const sigue = e.nota ? ` <em>(continúa ${e.nota})</em>` : "";
    $("#notas").innerHTML = `<p class="n-cab"><strong>${e.id}</strong> · ${n.titulo || ""}${n.tiempo ? ` · ${n.tiempo}` : ""}${sigue}</p>
      <p>${n.decir || "<em>Sin notas para esta escena.</em>"}</p>
      <p class="n-sig">Siguiente: ${ESCENAS[actual + 1] ? `${ESCENAS[actual + 1].id} · ${(NOTAS[ESCENAS[actual + 1].id] || {}).titulo || ""}` : "fin"}</p>`;
  }

  // ---------- Códigos QR del cierre ----------
  function dibujarQR() {
    if (typeof QRCode === "undefined") return;
    const opciones = { width: 180, height: 180, colorDark: "#1A2E4A", colorLight: "#ffffff" };
    const url = window.URL_PRESENTACION || (location.protocol.startsWith("http") ? location.href.split("#")[0] : "");
    new QRCode($("#qr-contacto"), { text: window.CONTACTO, ...opciones });
    if (url) new QRCode($("#qr-charla"), { text: url, ...opciones });
    else $("#qr-charla").innerHTML = `<p class="qr-falta">Se genera al publicar en GitHub Pages</p>`;
  }
  dibujarQR();

  // ---------- Scroll ----------
  scrollama()
    .setup({ step: ".paso", offset: 0.5 })
    .onStepEnter(({ index }) => activar(index));

  // Abrir en la escena del enlace (#3.6) o en la portada.
  const inicial = ESCENAS.findIndex((e) => "#" + e.id === decodeURIComponent(location.hash));
  if (inicial > 0) { pasos.children[inicial].scrollIntoView(); activar(inicial); }
  else activar(0);
})();
