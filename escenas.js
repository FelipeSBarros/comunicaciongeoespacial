// Escenas de la presentación. Cada escena sale de una sección de ../guion.md (mismo id).
// El texto "Qué decir" no va acá: lo genera generar_notas.py en notas.js.
//
// Campos:
//   id, bloque          identificador del guion y nombre del bloque (para la barra de progreso)
//   mapa                vista del mapa: centro [lng, lat], zoom, pitch, bearing, satelite, dur (ms)
//   marcadores          [{pos: [lng, lat], texto, clase}] puntos HTML sobre el mapa
//   linea               [[lng, lat], ...] línea punteada
//   puntos              "ilustrativos" (escena 1.5)
//   visual              lo que tapa el mapa: {img, pie} | {html} | {grafico} | {chat}
//   caja                texto del recuadro (HTML)
//   ciclo               0 = ciclo completo, 1–5 = paso iluminado (bloque 3)
//   desenfocar          desenfoca el mapa de fondo

// URL pública de la presentación (GitHub Pages). Si queda vacía, el QR usa la dirección actual
// cuando la página se sirve por http(s).
window.URL_PRESENTACION = "https://felipesbarros.github.io/comunicaciongeoespacial/";
window.CONTACTO = "https://felipesbarros.github.io/";

const PLANETA = { centro: [-30, -10], zoom: 1.5, pitch: 0, bearing: 0 };
const MVD = { centro: [-56.17, -34.86], zoom: 11.5, pitch: 0, bearing: 0 };

const ficha = (filas) =>
  `<dl class="ficha">${filas.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>`;

const venn = (n, chico = false) => `
<svg class="venn${chico ? " venn--chico" : ""}" viewBox="0 0 600 520" role="img" aria-label="Diagrama de Venn">
  <circle cx="300" cy="190" r="150" class="v1 ${n >= 1 ? "on" : ""}"/>
  <circle cx="215" cy="335" r="150" class="v2 ${n >= 2 ? "on" : ""}"/>
  <circle cx="385" cy="335" r="150" class="v3 ${n >= 2 ? "on" : ""}"/>
  <text x="300" y="115" class="${n >= 1 ? "on" : ""}">Periodismo de datos</text>
  <text x="150" y="410" class="${n >= 2 ? "on" : ""}">Ecoperiodismo</text>
  <text x="450" y="410" class="${n >= 2 ? "on" : ""}">Geoperiodismo</text>
  <circle cx="300" cy="290" r="10" class="centro ${n >= 2 ? "on" : ""}"/>
  <text x="300" y="262" class="centro-txt ${n >= 2 ? "on" : ""}">los casos de hoy</text>
</svg>`;

window.ESCENAS = [
  // 0 · Portada
  {
    id: "0.1", bloque: "Portada",
    mapa: { ...PLANETA, dur: 0 },
    caja: `<div class="portada">
      <p class="sobre">Primeras Jornadas de Innovación Geoespacial · UTEC</p>
      <h1>Comunicación de datos geoespaciales</h1>
      <p class="autor">Felipe Sodré Mendes Barros</p>
      <p class="afil">Doctorando en Teledetección, Universidad de Valencia<br>Universidad Nacional de Misiones (Argentina)</p>
      <p class="fecha">Jueves 15 de octubre de 2026 · Minas</p>
      <img src="img/logo_utec.png" alt="UTEC" class="logo">
      <p class="pista">Avanzar: <kbd>Espacio</kbd> o <kbd>↓</kbd></p>
    </div>`,
  },

  // 1 · Gancho
  {
    id: "1.1", bloque: "El dónde está en todas partes",
    mapa: { centro: [-56.030, -34.838], zoom: 14, pitch: 45, bearing: -20, dur: 7000 },
    marcadores: [{ pos: [-56.030, -34.838], texto: "Yo, 12/10/2026" }],
    caja: `<p class="lugar">Aeropuerto de Carrasco</p><p>12 de octubre de 2026</p>`,
  },
  {
    id: "1.2", bloque: "El dónde está en todas partes",
    marcadores: [{ pos: [-56.030, -34.838], texto: "Yo, 12/10/2026" }],
    desenfocar: true,
    visual: { html: `<p class="pregunta">¿Quién ya publicó<br>su ubicación hoy?</p>` },
  },
  {
    id: "1.3", bloque: "El dónde está en todas partes",
    mapa: { centro: [-55.6, -34.6], zoom: 9.2, pitch: 30, bearing: 0, dur: 4000 },
    marcadores: [
      { pos: [-56.030, -34.838], texto: "Aeropuerto, 12/10" },
      { pos: [-55.237, -34.376], texto: "Minas, hoy" },
    ],
    linea: [[-56.030, -34.838], [-55.75, -34.62], [-55.237, -34.376]],
    caja: `<p class="lugar">Minas</p><p>hoy</p>`,
  },
  {
    id: "1.4", bloque: "El dónde está en todas partes",
    visual: { img: "img/instagram-map.jpg", pie: "Instagram Map · imagen de prensa de Meta, con usuarios de ejemplo" },
  },
  {
    id: "1.5", bloque: "El dónde está en todas partes",
    mapa: { ...MVD, dur: 3500 },
    puntos: "ilustrativos",
    caja: `<p class="cita">"Todo pasa en algún lugar."</p>
      <p class="fuente">UN-GGIM (2013), <em>Future trends in geospatial information management</em></p>
      <ul class="leyenda"><li class="c1">celulares</li><li class="c2">fotos</li><li class="c3">publicaciones</li></ul>
      <p class="fuente">Puntos ilustrativos, no son datos reales.</p>`,
  },

  // 2 · Definiciones
  {
    id: "2.1", bloque: "Definiciones",
    visual: { html: `<div class="dos-col">${venn(1)}<div class="def"><h2>Periodismo de datos</h2><p>Una rama del periodismo de investigación que usa los datos como <strong>fuente</strong> y como <strong>evidencia</strong>.</p></div></div>` },
  },
  {
    id: "2.2", bloque: "Definiciones",
    visual: { html: `<div class="dos-col">${venn(2)}<div class="def"><h2>Ecoperiodismo</h2><p>Se define por el <strong>tema</strong>: el ambiente.</p><h2>Geoperiodismo</h2><p>Se define por el <strong>tipo de dato</strong>: el geoespacial.</p><p class="nota">Los casos de hoy están en el centro.</p></div></div>` },
  },
  {
    id: "2.3", bloque: "Definiciones",
    visual: { html: `<div class="dos-col">${venn(2, true)}<div class="def"><h2 class="grande">La pauta</h2><p>El tema o la agenda de la nota: lo que se va a investigar y publicar.</p></div></div>` },
  },
  {
    id: "2.4", bloque: "Definiciones",
    visual: { html: `<div class="columnas">
      <div><h2>Fuentes oficiales</h2><ul><li>Satélites (Sentinel, Landsat)</li><li>Censos</li><li>Catálogos de datos del Estado (IDE Uruguay)</li></ul></div>
      <div><h2>Fuentes informales</h2><ul><li>Redes sociales</li><li>Reportes ciudadanos</li><li>Fotos</li></ul></div>
    </div><p class="nota centro">Siempre: ¿de dónde viene el dato y cuánto se puede confiar en él?</p>` },
  },

  // 3 · El ciclo
  { id: "3.1", bloque: "El ciclo", ciclo: 0, visual: { html: `<h2 class="titulo-escena">¿Qué hay detrás de un proyecto?</h2><p class="sub centro">Un ciclo de cinco pasos. No es una receta: los pasos se mezclan y se vuelve atrás.</p>` } },
  { id: "3.2", bloque: "El ciclo", ciclo: 1, visual: { html: `<div class="preguntas"><p>¿Hay soja plantada en tierras indígenas?</p><p>¿Dónde y cuándo está más afectada por el humo la población de la Amazonía?</p></div><p class="nota">El dato puede confirmar la hipótesis… o descartarla.</p>` } },
  { id: "3.3", bloque: "El ciclo", ciclo: 2, visual: { html: `<h2 class="titulo-escena">Buscar · descargar · limpiar · cruzar</h2>
      <div class="barra-tiempo"><span class="b-datos">conseguir y preparar los datos</span><span class="b-resto">todo lo demás</span></div>
      <p class="herr">QGIS · Python · R</p><p class="nota centro">La parte que no se ve, y la más larga.</p>` } },
  { id: "3.4", bloque: "El ciclo", ciclo: 3, visual: { html: `<h2 class="titulo-escena">El resultado le dice al periodista a dónde ir</h2>
      <svg class="flecha-terreno" viewBox="0 0 600 160" aria-hidden="true"><rect x="20" y="50" width="150" height="60" rx="10"/><text x="95" y="88">dato</text><path d="M180 80 C 300 10, 380 10, 470 70" /><circle cx="520" cy="80" r="16"/><circle cx="520" cy="80" r="34" class="halo"/><text x="520" y="140">terreno</text></svg>
      <p class="nota centro">El dato dice cuánto. La persona dice cómo se vive.</p>` } },
  { id: "3.5", bloque: "El ciclo", ciclo: 4, visual: { html: `<h2 class="titulo-escena">El mapa como personaje</h2><p class="sub centro">El dato geoespacial no es solo evidencia: también es parte de la historia.</p>` } },
  {
    id: "3.6", bloque: "El ciclo", ciclo: 5,
    visual: { grafico: "atencion" },
    caja: `<p class="fuente">Tiempo promedio frente a una pantalla antes de cambiar de tarea, en trabajadores de oficina. Fuentes: González y Mark (2004); Mark et al. (2016); Mark (2023), <em>Attention Span</em>. El punto hueco (2012) viene de entrevistas.</p>`,
  },
  {
    id: "3.7", bloque: "El ciclo", ciclo: 5,
    visual: { grafico: "medios" },
    caja: `<p class="fuente">Fuente: Reuters Institute, <em>Digital News Report</em> 2015 y 2025.</p>`,
  },
  { id: "3.8", bloque: "El ciclo", ciclo: 5, visual: { html: `<div class="tarjetas">
      <div><h3>Scrollytelling</h3><p>La historia avanza con el scroll.</p></div>
      <div class="activa"><h3>Relatos centrados en el mapa</h3><p>(como esta charla)</p></div>
      <div><h3>Paneles de datos</h3><p>El lector explora por su cuenta.</p></div>
    </div>` } },

  // 4a · Soja
  {
    id: "4a.1", bloque: "Caso 1 · Soja en tierras indígenas",
    visual: { img: "img/Soja_TI.jpg", pie: "<em>O Joio e o Trigo</em> · por Marcos Hermanson · análisis de datos: Felipe Sodré y Natalie Aubet" },
  },
  {
    id: "4a.2", bloque: "Caso 1 · Soja en tierras indígenas",
    mapa: { centro: [-55.5, -12.8], zoom: 5.5, pitch: 0, bearing: 0, dur: 6000 },
    caja: `<p class="lugar">Mato Grosso, Brasil</p>${ficha([
      ["Pregunta", "¿Se planta soja en tierras indígenas?"],
      ["Datos", "Imágenes Sentinel-2 (2021–2023), libres y gratuitas"],
      ["Método", "Segmentación y validación con software libre"],
    ])}`,
  },
  {
    id: "4a.3", bloque: "Caso 1 · Soja en tierras indígenas",
    mapa: { centro: [-51.3, -13.9], zoom: 10, pitch: 40, bearing: 15, satelite: true, dur: 5000 },
    caja: `<p class="lugar">Tierra indígena Wedezé</p><p>La más afectada: unas <strong>13 mil hectáreas</strong> de soja.</p><p class="fuente">Ubicación aproximada.</p>`,
  },
  {
    id: "4a.4", bloque: "Caso 1 · Soja en tierras indígenas",
    visual: { grafico: "waffle" },
  },

  // 4b · Engolindo fumaça
  {
    id: "4b.1", bloque: "Caso 2 · \"Engolindo fumaça\"",
    mapa: { centro: [-60.0, -8.0], zoom: 4.3, pitch: 0, bearing: 0, dur: 5000 },
    marcadores: [
      { pos: [-64.5, -4.0], texto: "Amazonas" },
      { pos: [-70.3, -9.2], texto: "Acre" },
      { pos: [-62.8, -10.9], texto: "Rondônia" },
      { pos: [-55.9, -12.6], texto: "Mato Grosso" },
      { pos: [-52.5, -4.5], texto: "Pará" },
    ],
    caja: `<p class="lugar">Amazonía, 2020</p>${ficha([
      ["Pregunta", "¿Dónde y cuándo respira más humo la población? ¿Tiene que ver con la COVID-19?"],
      ["Datos", "Modelos CAMS (Copernicus, UE), cada 3 horas: 2.920 imágenes · DataSUS"],
    ])}`,
  },
  {
    id: "4b.2", bloque: "Caso 2 · \"Engolindo fumaça\"",
    visual: { img: "img/InfoAmazonia.png", pie: "Aumento de internaciones por COVID y SRAG, y días por mes con más de 25 µg/m³ · InfoAmazonia" },
    caja: `<ul class="cifras"><li><strong>+2 %</strong> riesgo de internación por cada día de humo</li><li><strong>+18 %</strong> casos graves de COVID</li><li><strong>+24 %</strong> internaciones respiratorias</li></ul>`,
  },
  {
    id: "4b.3", bloque: "Caso 2 · \"Engolindo fumaça\"",
    visual: { img: "img/InfoAmz_Testimonio.jpg", ajuste: "cubrir" },
  },
  {
    id: "4b.4", bloque: "Caso 2 · \"Engolindo fumaça\"",
    visual: { img: "img/FolhaDeSPaulo.png", pie: "Cinco reportajes, tres con <em>Folha de S.Paulo</em> (23/08/2021) · Apoyo: John S. Knight Fellowship y Big Local News (Stanford)" },
  },

  // 4c · Cerrado
  {
    id: "4c.1", bloque: "Caso 3 · Cerrado",
    mapa: { centro: [-47.5, -14.5], zoom: 4.8, pitch: 0, bearing: 0, dur: 4000 },
    caja: `<p class="lugar">Cerrado, Brasil</p>${ficha([
      ["Pregunta", "¿Qué le pasa al agua del Cerrado, donde nacen 8 de las 12 regiones hidrográficas de Brasil?"],
      ["Medio", "Ambiental Media, 2025"],
    ])}`,
  },
  {
    id: "4c.1b", nota: "4c.1", bloque: "Caso 3 · Cerrado",
    visual: { img: "img/AmbientalMedia_Cerrado_identificador_bacia.jpg", pie: "Los \"ríos voladores\" · Ambiental Media, \"Cerrado: o elo sagrado das águas do Brasil\"" },
  },
  {
    id: "4c.2", bloque: "Caso 3 · Cerrado",
    visual: { img: "img/AmbientalMedia_CErrado_q90.png", pie: "Dashboard del reportaje: caudal, evapotranspiración y lluvia por cuenca · Datos: ANA y MapBiomas" },
  },

  // 4d · Uruguay 2100
  {
    id: "4d.1", bloque: "Caso 4 · Uruguay 2100",
    mapa: { centro: [-56.16, -34.91], zoom: 12.5, pitch: 50, bearing: 160, dur: 8000 },
    caja: `<p class="lugar">Montevideo</p>${ficha([
      ["Pregunta", "¿Qué parte de Montevideo se inundaría en 2100, y a quién afectaría?"],
      ["Datos", "Líneas de inundación del Ministerio de Ambiente + censo 2011 (INE) + escuelas, centros de salud y CAIF"],
      ["Medio", "Amenaza Roboto, 2022"],
    ])}`,
  },
  {
    id: "4d.2", bloque: "Caso 4 · Uruguay 2100",
    visual: { img: "img/roboto_inundacion.jpg", pie: "Línea azul: costa actual · polígono blanco: superficie inundada · Amenaza Roboto, \"La ciudad sumergida\"" },
    caja: `<p>Cerca del <strong>10 %</strong> de Montevideo y unas <strong>18 mil personas</strong> expuestas, sobre todo en barrios de bajos ingresos.</p>
      <p class="fuente">Texto y análisis: Gabriel Farías, Natalie Aubet, Miguel Ángel Dobrich, Nahuel Lamas · Fotos: Matilde Campodónico · Diseño: Antar Kuri · Ganador del concurso de datos climáticos abiertos (Ministerio de Ambiente, Agesic, Open Data Charter, BID).</p>`,
  },

  // 5 · Claves
  { id: "5.1", bloque: "Claves para animarse", visual: { html: `<h2 class="titulo-escena">Nadie hace todo</h2><ul class="perfiles"><li>Periodista</li><li>Datos y SIG</li><li>Diseño</li><li>Desarrollo</li><li>Especialista en el tema</li></ul>` } },
  { id: "5.2", bloque: "Claves para animarse", visual: { html: `<h2 class="titulo-escena">Conozcan el medio</h2><div class="medio"><div class="celular"><span>47 s</span></div><p class="sub">¿Dónde y cómo<br>se va a leer?</p></div>` } },
  { id: "5.3", bloque: "Claves para animarse", visual: { html: `<h2 class="titulo-escena">Prototipen</h2>
      <div class="herramientas"><figure><img src="img/DataWrapper.png" alt="Datawrapper"><figcaption>Datawrapper</figcaption></figure><figure><img src="img/Flourish.png" alt="Flourish"><figcaption>Flourish</figcaption></figure></div>
      <p class="etapas"><span>Preparar:</span> QGIS · Python · R &nbsp;&nbsp; <span>Contar:</span> Datawrapper · Flourish · Mapbox / MapLibre</p>
      <p class="nota centro">Esta charla: MapLibre + OpenFreeMap + Scrollama. Todo libre.</p>` } },
  {
    id: "5.4", bloque: "Claves para animarse",
    mapa: { ...MVD, dur: 3500 },
    marcadores: [
      { pos: [-56.165, -34.905], texto: "08:10", clase: "etica" },
      { pos: [-56.185, -34.885], texto: "12:40", clase: "etica" },
      { pos: [-56.140, -34.875], texto: "18:05", clase: "etica" },
      { pos: [-56.200, -34.860], texto: "23:30", clase: "etica" },
    ],
    caja: `<p><strong class="enorme">4 puntos</strong> en el espacio y el tiempo alcanzan para identificar al <strong class="enorme">95 %</strong> de las personas,</p><p>en una base "anónima" de 1,5 millones de celulares.</p><p class="fuente">de Montjoye et al. (2013), <em>Scientific Reports</em>. Puntos ilustrativos.</p>`,
  },

  // 6 · Cierre
  {
    id: "6.1", bloque: "Cierre",
    visual: { chat: "img/Referenciaa_editada.jpeg", pie: "WhatsApp, equipo del reportaje del Cerrado · reproducido con permiso" },
  },
  {
    id: "6.2", bloque: "Cierre",
    mapa: { ...PLANETA, dur: 7000 },
    caja: `<div class="final">
      <p class="lema">Armen un equipo.<br>Hagan una pregunta.<br>Prototipen el primer mapa.</p>
      <div class="qrs"><figure><div id="qr-contacto"></div><figcaption>Contacto</figcaption></figure><figure><div id="qr-charla"></div><figcaption>Esta presentación</figcaption></figure></div>
      <p class="fuente">Todo pasa en algún lugar. Gracias.</p>
    </div>`,
  },
];
