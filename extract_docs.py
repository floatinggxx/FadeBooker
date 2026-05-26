import os
from pypdf import PdfReader
from docx import Document

def extract_pdf_text(path):
    try:
        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def extract_docx_text(path):
    try:
        doc = Document(path)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        return f"Error reading DOCX: {str(e)}"

pdf_path = "/home/mauricio/Descargas/Evaluación Parcial 2_ TPY1101 Estudiante (1).pdf"
docx_path = "/home/mauricio/Documentos/GitHub/FadeBooker/Gestión/EP_TPY1101 _Grupo 5_002D_Entrega 2.docx"

print("--- PDF CONTENT (RUBRICA) ---")
print(extract_pdf_text(pdf_path))
print("\n--- DOCX CONTENT (INFORME) ---")
print(extract_docx_text(docx_path))
