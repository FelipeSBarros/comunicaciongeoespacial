"""Arma charla.html: la presentación entera en un solo archivo (CSS, JS e imágenes adentro).

Sirve para abrirla con doble clic en navegadores que solo dejan leer el archivo abierto y no
la carpeta de al lado (por ejemplo, Firefox instalado como snap en Ubuntu).
Correr después de cambiar el guion, escenas.js, app.js o estilo.css:

    python3 generar_notas.py && python3 construir_unico.py
"""
import base64
import mimetypes
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SALIDA = AQUI / "charla.html"


def leer(ruta):
    return (AQUI / ruta).read_text(encoding="utf-8")


def como_data_uri(ruta):
    tipo = mimetypes.guess_type(ruta)[0] or "application/octet-stream"
    datos = base64.b64encode((AQUI / ruta).read_bytes()).decode()
    return f"data:{tipo};base64,{datos}"


def imagenes_adentro(texto):
    return re.sub(r"img/[\w.\-]+\.(?:png|jpe?g)", lambda m: como_data_uri(m.group(0)), texto)


def script(texto):
    # Un "</script" dentro del código cerraría la etiqueta antes de tiempo.
    return "<script>\n" + texto.replace("</script", "<\\/script") + "\n</script>"


html = leer("index.html")
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
              lambda m: f"<style>\n{leer(m.group(1))}\n</style>", html)
html = re.sub(r'<script src="([^"]+)"></script>',
              lambda m: script(imagenes_adentro(leer(m.group(1)))), html)
SALIDA.write_text(html, encoding="utf-8")
print(f"{SALIDA.name}: {SALIDA.stat().st_size / 1e6:.1f} MB")
