from reportlab.lib.pagesizes import landscape
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
pdf_path = os.path.join(script_dir, "Lobos_de_Montana_Presentacion.pdf")
logo_path = os.path.join(script_dir, "logo-wolf.png")

W, H = landscape((13.333*inch, 7.5*inch))

BLACK6 = HexColor("#161F28")
BLUE655 = HexColor("#1E3765")
BLUE2717 = HexColor("#A9C0DE")
GRAY642 = HexColor("#D3DFE8")
WHITE = HexColor("#FFFFFF")
GOLD = HexColor("#D4A84B")

c = canvas.Canvas(pdf_path, pagesize=(W, H))

def y(top_inches):
    return H - top_inches * inch

def draw_bg(c):
    c.setFillColor(BLACK6)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def draw_footer(c):
    c.setFillColor(BLUE655)
    c.rect(0, 0, W, 0.5*inch, fill=1, stroke=0)
    c.setFont("Helvetica", 9)
    c.setFillColor(BLUE2717)
    c.drawCentredString(W/2, 0.15*inch, "Lobos de Montana  |  lobosdemontana.mx  |  Conquista cada sendero")

def draw_sidebar(c):
    c.setFillColor(BLUE2717)
    c.rect(0, 0, 0.15*inch, H, fill=1, stroke=0)

def draw_line(c, x, top, width, color=BLUE2717):
    c.setFillColor(color)
    c.rect(x*inch, y(top), width*inch, 3, fill=1, stroke=0)

def draw_watermark(c):
    if os.path.exists(logo_path):
        c.saveState()
        c.setFillAlpha(0.06)
        c.drawImage(logo_path, 4.2*inch, y(6.5), 5*inch, 5*inch, mask='auto', preserveAspectRatio=True)
        c.restoreState()

def draw_card(c, x, top, w, h, color=BLUE655):
    c.saveState()
    c.setFillAlpha(0.7)
    c.setFillColor(color)
    c.roundRect(x*inch, y(top+h), w*inch, h*inch, 8, fill=1, stroke=0)
    c.restoreState()

# ===================== SLIDE 1: INTRO =====================
draw_bg(c)
draw_watermark(c)

if os.path.exists(logo_path):
    c.drawImage(logo_path, 5.4*inch, y(2.8), 2.5*inch, 2.5*inch, mask='auto', preserveAspectRatio=True)

draw_line(c, 3.5, 3.0, 6.3)
c.setFillColor(GOLD)
c.rect(5.5*inch, y(3.08), 2.3*inch, 3, fill=1, stroke=0)

c.setFont("Helvetica-Bold", 80)
c.setFillColor(WHITE)
c.drawCentredString(W/2, y(4.5), "LOBOS DE MONTANA")

draw_line(c, 3.5, 4.9, 6.3)
c.setFillColor(GOLD)
c.rect(5.5*inch, y(4.98), 2.3*inch, 3, fill=1, stroke=0)

c.setFont("Helvetica-Oblique", 28)
c.setFillColor(BLUE2717)
c.drawCentredString(W/2, y(5.6), "Conquista cada sendero — equipo que resiste como tu")

c.setFont("Helvetica", 18)
c.setFillColor(GRAY642)
c.drawCentredString(W/2, y(6.2), "Equipo Premium de Senderismo y Montanismo")

draw_footer(c)
c.showPage()

# ===================== SLIDE 2: SLOGAN =====================
draw_bg(c)
draw_watermark(c)
draw_sidebar(c)

c.setFont("Helvetica-Bold", 18)
c.setFillColor(BLUE2717)
c.drawString(0.8*inch, y(0.7), "NUESTRO SLOGAN")

c.setFont("Helvetica-BoldOblique", 44)
c.setFillColor(WHITE)
c.drawString(0.8*inch, y(1.8), '"Conquista cada sendero —')
c.drawString(0.8*inch, y(2.5), 'equipo que resiste como tu"')

draw_line(c, 0.8, 3.0, 4)

items = [
    ("CONQUISTA", "No somos espectadores. Cada producto esta disenado para quienes se atreven a ir mas alla."),
    ("CADA SENDERO", "No importa si es tu primera caminata o tu expedicion mas ambiciosa. Nuestro equipo se adapta."),
    ("EQUIPO QUE RESISTE COMO TU", "La montana no perdona. Seleccionamos productos con la misma resistencia que nuestros clientes.")
]
yp = 3.5
for title, desc in items:
    draw_card(c, 0.6, yp-0.1, 11.8, 1.0)
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(BLUE2717)
    c.drawString(1.6*inch, y(yp+0.3), title)
    c.setFont("Helvetica", 13)
    c.setFillColor(GRAY642)
    c.drawString(1.6*inch, y(yp+0.65), desc)
    yp += 1.15

draw_footer(c)
c.showPage()

# ===================== SLIDE 3: QUIENES SOMOS =====================
draw_bg(c)
draw_watermark(c)
draw_sidebar(c)

c.setFont("Helvetica-Bold", 18)
c.setFillColor(BLUE2717)
c.drawString(0.8*inch, y(0.7), "QUIENES SOMOS")

c.setFont("Helvetica", 17)
c.setFillColor(GRAY642)
c.drawString(0.8*inch, y(1.5), "Somos Lobos de Montana, una tienda especializada en equipo de senderismo y montanismo.")
c.drawString(0.8*inch, y(1.9), "Nacimos de la pasion por explorar los senderos mas desafiantes.")

draw_line(c, 0.8, 2.2, 6)

# Mision
draw_card(c, 0.6, 2.5, 5.8, 2.0)
c.setFillColor(BLUE2717)
c.rect(0.6*inch, y(2.56), 5.8*inch, 4, fill=1, stroke=0)
c.setFont("Helvetica-Bold", 18)
c.setFillColor(BLUE2717)
c.drawString(1.0*inch, y(3.0), "MISION")
c.setFont("Helvetica", 14)
c.setFillColor(GRAY642)
c.drawString(1.0*inch, y(3.5), "Equipar a cada aventurero con productos de alta")
c.drawString(1.0*inch, y(3.8), "calidad que garanticen seguridad y rendimiento.")

# Vision
draw_card(c, 7.0, 2.5, 5.8, 2.0)
c.setFillColor(BLUE2717)
c.rect(7.0*inch, y(2.56), 5.8*inch, 4, fill=1, stroke=0)
c.setFont("Helvetica-Bold", 18)
c.setFillColor(BLUE2717)
c.drawString(7.4*inch, y(3.0), "VISION")
c.setFont("Helvetica", 14)
c.setFillColor(GRAY642)
c.drawString(7.4*inch, y(3.5), "Ser la tienda lider en Mexico de equipo outdoor,")
c.drawString(7.4*inch, y(3.8), "reconocida por calidad e innovacion.")

# Valores
c.setFont("Helvetica-Bold", 16)
c.setFillColor(BLUE2717)
c.drawString(0.8*inch, y(5.0), "NUESTROS VALORES")

valores = ["Calidad sin compromiso", "Pasion por la aventura", "Resistencia y durabilidad", "Comunidad y confianza"]
xv = 0.6
for v in valores:
    draw_card(c, xv, 5.3, 2.9, 0.8)
    c.setFont("Helvetica", 12)
    c.setFillColor(GRAY642)
    c.drawString((xv+0.3)*inch, y(5.8), v)
    xv += 3.1

draw_footer(c)
c.showPage()

# ===================== SLIDE 4: PRODUCTOS =====================
draw_bg(c)
draw_watermark(c)
draw_sidebar(c)

c.setFont("Helvetica-Bold", 18)
c.setFillColor(BLUE2717)
c.drawString(0.8*inch, y(0.7), "NUESTROS PRODUCTOS")

c.setFont("Helvetica", 16)
c.setFillColor(GRAY642)
c.drawString(0.8*inch, y(1.2), "Equipo seleccionado por expertos para cada tipo de aventura")

c.setFont("Helvetica-Bold", 14)
c.setFillColor(BLUE2717)
c.drawString(0.8*inch, y(1.7), "PRODUCTOS DESTACADOS")
draw_line(c, 0.8, 1.85, 11.5)

dest = [
    ("Botas de Cana Media", "$1,299 MXN", "Soporte y traccion para terrenos irregulares"),
    ("Sudadera Impermeable", "$899 MXN", "Proteccion contra lluvia y viento"),
    ("Bastones de Senderismo", "$649 MXN", "Ultraligeros y ajustables")
]
xd = 0.6
for n, p, d in dest:
    draw_card(c, xd, 2.1, 3.9, 1.8)
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(WHITE)
    c.drawString((xd+0.3)*inch, y(2.6), n)
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(BLUE2717)
    c.drawString((xd+0.3)*inch, y(3.0), p)
    c.setFont("Helvetica", 13)
    c.setFillColor(GRAY642)
    c.drawString((xd+0.3)*inch, y(3.4), d)
    xd += 4.15

c.setFont("Helvetica-Bold", 14)
c.setFillColor(BLUE2717)
c.drawString(0.8*inch, y(4.3), "CATALOGO GENERAL")
draw_line(c, 0.8, 4.45, 11.5)

cat = [
    ("Mochila Hidratacion 15L", "$1,499"),
    ("Gorra Proteccion UV", "$349"),
    ("Pantalon Convertible", "$749"),
    ("Guantes Termicos", "$499"),
    ("Cantimplora Termica", "$399"),
    ("Gafas Polarizadas", "$599")
]
xc = 0.6
for n, p in cat:
    draw_card(c, xc, 4.7, 1.95, 1.3)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(WHITE)
    c.drawString((xc+0.15)*inch, y(5.1), n)
    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(BLUE2717)
    c.drawString((xc+0.15)*inch, y(5.5), p)
    xc += 2.1

draw_footer(c)
c.showPage()

# ===================== SLIDE 5: ALCANCE =====================
draw_bg(c)
draw_watermark(c)
draw_sidebar(c)

c.setFont("Helvetica-Bold", 18)
c.setFillColor(BLUE2717)
c.drawString(0.8*inch, y(0.7), "NUESTRO ALCANCE")

c.setFont("Helvetica", 16)
c.setFillColor(GRAY642)
c.drawString(0.8*inch, y(1.3), "Conectamos con aventureros en todo Mexico a traves de nuestra plataforma digital.")

stats = [("500+", "Productos en catalogo"), ("10K+", "Clientes satisfechos"), ("32", "Estados alcanzados")]
xs = 0.6
for num, label in stats:
    draw_card(c, xs, 2.0, 3.9, 3.5)
    c.setFont("Helvetica-Bold", 72)
    c.setFillColor(BLUE2717)
    c.drawCentredString((xs+1.95)*inch, y(3.5), num)
    draw_line(c, xs+0.5, 4.0, 2.9)
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(WHITE)
    c.drawCentredString((xs+1.95)*inch, y(4.6), label)
    xs += 4.15

c.setFont("Helvetica", 14)
c.setFillColor(GRAY642)
c.drawCentredString(W/2, y(6.2), "lobosdemontana.mx  |  Tiendas en CDMX, Monterrey y Guadalajara")

draw_footer(c)
c.showPage()

# ===================== SLIDE 6: CIERRE =====================
draw_bg(c)
draw_watermark(c)

if os.path.exists(logo_path):
    c.drawImage(logo_path, 5.4*inch, y(2.8), 2.5*inch, 2.5*inch, mask='auto', preserveAspectRatio=True)

draw_line(c, 3.0, 3.0, 7.3)
c.setFont("Helvetica-Bold", 68)
c.setFillColor(WHITE)
c.drawCentredString(W/2, y(4.2), "LOBOS DE MONTANA")
draw_line(c, 3.0, 4.5, 7.3)

c.setFont("Helvetica-Oblique", 22)
c.setFillColor(BLUE2717)
c.drawCentredString(W/2, y(5.0), "Conquista cada sendero — equipo que resiste como tu")

draw_card(c, 3.2, 5.3, 6.9, 1.4)
c.setFont("Helvetica-Bold", 14)
c.setFillColor(BLUE2717)
c.drawCentredString(W/2, y(5.6), "CONTACTO")
c.setFont("Helvetica", 14)
c.setFillColor(GRAY642)
c.drawCentredString(W/2, y(5.95), "wolves@tienda.com  |  +52 55 1234 5678")
c.setFont("Helvetica-Bold", 16)
c.setFillColor(WHITE)
c.drawCentredString(W/2, y(6.3), "lobosdemontana.mx")

c.setFont("Helvetica-Oblique", 15)
c.setFillColor(GRAY642)
c.drawCentredString(W/2, y(6.8), "Gracias por acompanarnos en esta aventura!")

draw_footer(c)
c.showPage()

# ===================== SLIDE 7: EQUIPO =====================
draw_bg(c)
draw_watermark(c)
draw_sidebar(c)

c.setFont("Helvetica-Bold", 18)
c.setFillColor(BLUE2717)
c.drawString(0.8*inch, y(0.7), "EQUIPO DE DESARROLLO")

c.setFont("Helvetica-Oblique", 16)
c.setFillColor(GRAY642)
c.drawString(0.8*inch, y(1.2), "Las personas detras de Lobos de Montana")
draw_line(c, 0.8, 1.4, 5)

team = [
    "Alejandro Gonzalez", "Erick Garcia", "Daniel Aguilar",
    "Alejandro Ruiz", "Angel Arturo", "Francisco Ortiz",
    "Chris Hernandez", "Edwin Sanchez", "Diego"
]

col_pos = [0.6, 4.75, 8.9]
row_start = 1.8
row_h = 1.55
card_w = 3.8
card_h = 1.3

for idx, name in enumerate(team):
    col = idx % 3
    row = idx // 3
    x = col_pos[col]
    yt = row_start + row * row_h

    draw_card(c, x, yt, card_w, card_h)

    # Initials circle
    c.saveState()
    c.setFillColor(BLUE655)
    cx = (x + 0.55) * inch
    cy = y(yt + 0.7)
    c.circle(cx, cy, 0.3*inch, fill=1, stroke=0)
    initials = "".join([p[0] for p in name.split() if p])[:2].upper()
    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(BLUE2717)
    c.drawCentredString(cx, cy - 7, initials)
    c.restoreState()

    c.setFont("Helvetica-Bold", 18)
    c.setFillColor(WHITE)
    c.drawString((x+1.2)*inch, y(yt+0.55), name)

    c.setFont("Helvetica-Oblique", 11)
    c.setFillColor(GRAY642)
    c.drawString((x+1.2)*inch, y(yt+0.85), "Desarrollador")

c.setFont("Helvetica-BoldOblique", 13)
c.setFillColor(BLUE2717)
c.drawCentredString(W/2, y(6.7), "Un equipo comprometido con la aventura y la tecnologia")

draw_footer(c)
c.showPage()

c.save()
print(f"PDF creado: {pdf_path}")
