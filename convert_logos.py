"""
Convierte los logos SVG de La Quinta Esencia a formatos Adobe.
Usa versiones flat (sin gradientes) para PDF limpio.
"""

from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF
import os
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

logos = [
    "quinta-esencia-imagotipo",
    "quinta-esencia-isotipo",
    "quinta-esencia-monograma",
]

output_dir = os.path.join(BASE_DIR, "quinta-esencia-logos")
os.makedirs(output_dir, exist_ok=True)

for logo in logos:
    flat_svg = os.path.join(BASE_DIR, f"{logo}-flat.svg")
    original_svg = os.path.join(BASE_DIR, f"{logo}.svg")

    print(f"\n{'='*50}")
    print(f"  Procesando: {logo}")
    print(f"{'='*50}")

    # PDF desde versión flat (sin gradientes)
    if os.path.exists(flat_svg):
        drawing = svg2rlg(flat_svg)
        if drawing:
            pdf_path = os.path.join(output_dir, f"{logo}.pdf")
            renderPDF.drawToFile(drawing, pdf_path, fmt="PDF")
            print(f"  [OK] PDF  -> {logo}.pdf (vector, compatible Adobe)")

    # Copiar SVG original (con gradientes)
    if os.path.exists(original_svg):
        dst = os.path.join(output_dir, f"{logo}.svg")
        shutil.copy2(original_svg, dst)
        print(f"  [OK] SVG  -> {logo}.svg (con gradientes)")

    # Copiar flat SVG también
    if os.path.exists(flat_svg):
        dst = os.path.join(output_dir, f"{logo}-flat.svg")
        shutil.copy2(flat_svg, dst)
        print(f"  [OK] SVG  -> {logo}-flat.svg (version plana)")

print(f"\n{'='*50}")
print("  CONVERSION COMPLETA")
print(f"{'='*50}")
print(f"""
  Carpeta: quinta-esencia-logos/

  Por cada logo tienes:
    {logos[0]}.svg         — SVG con gradientes (Figma, web, Illustrator)
    {logos[0]}-flat.svg    — SVG sin gradientes (maxima compatibilidad)
    {logos[0]}.pdf         — PDF vectorial (Illustrator, InDesign, Acrobat)

  Como abrir en Adobe:
    Illustrator:  Archivo > Abrir > .SVG o .PDF
    InDesign:     Archivo > Colocar > .PDF o .SVG
    Photoshop:    Archivo > Abrir > .SVG (rasteriza al tamanio que elijas)

  Para formato .AI nativo:
    Abre el SVG en Illustrator > Guardar como > Adobe Illustrator (.ai)
""")
