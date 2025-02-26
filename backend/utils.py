import fitz  # PyMuPDF
import os

UPLOAD_DIR = "uploads"


def extract_text_from_pdf(filename: str) -> str:
    """指定されたPDFファイルからテキストを抽出する"""
    pdf_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(pdf_path):
        return "ファイルが見つかりません。"

    try:
        doc = fitz.open(pdf_path)
        text = "\n".join([page.get_text("text") for page in doc])
        doc.close()

        if not text.strip():
            return "テキストを抽出できませんでした。"

        return text
    except Exception as e:
        return f"エラーが発生しました: {str(e)}"
