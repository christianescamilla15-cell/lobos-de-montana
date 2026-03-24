import comtypes.client
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
pptx_path = os.path.join(script_dir, "Lobos_de_Montana_Presentacion.pptx")
pdf_path = os.path.join(script_dir, "Lobos_de_Montana_Presentacion.pdf")

powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
powerpoint.Visible = 1

presentation = powerpoint.Presentations.Open(pptx_path)
presentation.SaveAs(pdf_path, 32)  # 32 = ppSaveAsPDF
presentation.Close()
powerpoint.Quit()

print(f"PDF creado: {pdf_path}")
