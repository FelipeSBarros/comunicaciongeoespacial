# Presentación — Comunicación de datos geoespaciales

Charla de Felipe Sodré Mendes Barros en las Primeras Jornadas de Innovación Geoespacial (UTEC, Minas, 15 de octubre de 2026). En línea: <https://felipesbarros.github.io/comunicaciongeoespacial/>.

Scrollytelling en una sola página HTML: mapa con MapLibre GL JS, mapa base de OpenFreeMap (estilo `fiord`, sin clave de API), imagen satelital Sentinel-2 cloudless de EOX y escenas que avanzan con Scrollama. Las bibliotecas están copiadas en `vendor/`, así que solo el mapa base, la imagen satelital y las fuentes de Google necesitan internet.

## Cómo abrirla
- **Doble clic en `charla.html`.** Es la presentación entera en un solo archivo (estilos, código e imágenes adentro). Es la opción para Firefox instalado como snap (el de Ubuntu): cuando se abre un archivo con doble clic, ese Firefox solo puede leer ese archivo y no la carpeta de al lado, así que `index.html` se ve en blanco.
- `index.html` es la versión de trabajo (archivos separados). Funciona con doble clic en Chrome o Chromium, o en cualquier navegador con un servidor local, desde esta carpeta: `python3 -m http.server 8000` y abrir <http://localhost:8000>.
- Para entrar directo a una escena: `charla.html#3.6` (el id es el del guion).

Después de cambiar cualquier cosa, regenerar `charla.html`: `python3 generar_notas.py && python3 construir_unico.py`.

## Teclas
| Tecla | Acción |
|---|---|
| `Espacio`, `↓`, `→`, `PageDown`, `Enter` | escena siguiente (el control remoto de presentaciones manda `PageDown`) |
| `↑`, `←`, `PageUp` | escena anterior |
| `Inicio` / `Fin` | portada / cierre |
| `N` | muestra u oculta las notas del orador ("Qué decir" del guion, con el tiempo y la escena siguiente). Ojo: se ven en la pantalla proyectada. |
| `F` | pantalla completa |

## Archivos
- `charla.html`: la presentación en un solo archivo (≈5 MB), **generada** por `construir_unico.py`. Es la que se abre para presentar.
- `index.html`: la página de trabajo, con los archivos separados.
- `escenas.js`: una entrada por escena del guion (vista del mapa, marcadores, imagen o gráfico, texto del recuadro). Arriba están `URL_PRESENTACION` y `CONTACTO`, que usan los códigos QR del cierre.
- `notas.js`: notas del orador, **generadas** desde `../guion.md`. Después de editar el guion, correr `python3 generar_notas.py`.
- `generar_notas.py` y `construir_unico.py`: generan `notas.js` y `charla.html`. `generar_notas.py` lee `../guion.md`, que está en el repositorio del doctorado y no en este, así que solo funciona desde la copia local del autor.
- `app.js`: el motor (mapa, scroll, gráficos en SVG, teclado, notas, QR).
- `estilo.css`: la paleta y las fuentes de la charla 1 (azul marino, turquesa, Barlow Condensed y Poppins).
- `img/`: las capturas del guion (las más pesadas, convertidas a JPEG) y el logo de UTEC.
- `vendor/`: MapLibre GL JS 4.7.1, Scrollama 3.2.0 y qrcodejs 1.0.0.

## Cambiar el contenido
- **Texto que se dice:** en `../guion.md` y después `python3 generar_notas.py && python3 construir_unico.py`.
- **Texto en pantalla, vistas del mapa o imágenes:** en `escenas.js`. Cada escena tiene el mismo id que en el guion. La escena `4c.1b` es la segunda pantalla de `4c.1` (la imagen de los ríos voladores) y comparte sus notas.
- **Gráficos** (atención, medios, cuadrícula de tierras indígenas): en `app.js`, objeto `GRAFICOS`.

## Publicar en GitHub Pages
Esta carpeta es su propio repositorio git (`git@github.com:FelipeSBarros/comunicaciongeoespacial.git`, rama `main`), anidado dentro del repositorio del doctorado, que la ignora en su `.gitignore`.
1. Commit y `git push -u origin main` desde esta carpeta.
2. En GitHub: *Settings → Pages → Deploy from a branch → main / (root)*.
3. La página queda en <https://felipesbarros.github.io/comunicaciongeoespacial/>, que es la URL que ya está en `URL_PRESENTACION` (`escenas.js`) para el QR del cierre.

## Respaldo sin internet
Sin conexión, la página abre y las escenas de texto, imágenes y gráficos funcionan, pero el mapa queda vacío y las fuentes cambian. Opciones: llevar el celular como módem, o exportar un PDF con capturas de cada escena (pendiente).
