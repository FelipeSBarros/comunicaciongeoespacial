"""Extrae las notas del orador de ../guion.md y las escribe en notas.js.

El guion es la fuente única del texto "Qué decir" y del tiempo de cada escena.
Después de editar el guion, correr:  python3 generar_notas.py
"""
import json
import re
from pathlib import Path

AQUI = Path(__file__).resolve().parent
GUION = AQUI.parent / "guion.md"
SALIDA = AQUI / "notas.js"

TITULO = re.compile(r"^#{4,5} (\d+[a-d]?\.\d+) · (.+?)(?: \((\d+:\d+)\))?$")

notas, actual = {}, None
for linea in GUION.read_text(encoding="utf-8").splitlines():
    m = TITULO.match(linea)
    if m:
        actual = m.group(1)
        notas[actual] = {"titulo": m.group(2), "tiempo": m.group(3) or "", "decir": ""}
    elif actual and linea.startswith("**Qué decir:**"):
        notas[actual]["decir"] = linea.removeprefix("**Qué decir:**").strip()
    elif linea.startswith("## Anexo"):
        break

SALIDA.write_text(
    "// Generado por generar_notas.py a partir de ../guion.md. No editar a mano.\n"
    f"window.NOTAS = {json.dumps(notas, ensure_ascii=False, indent=1)};\n",
    encoding="utf-8",
)
print(f"{len(notas)} escenas → {SALIDA.name}")
