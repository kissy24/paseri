import fitz  # PyMuPDF
import os
import markdown

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


def format_text_to_markdown(text: str) -> str:
    """テキストをMarkdown形式に整形する（汎用版）"""

    # 改行をMarkdownの改行コードに変換
    text = text.replace("\n", "\n\n")

    # 必要に応じて、他のMarkdown記法（見出し、リストなど）を追加
    # 例：
    # text = text.replace("##", "###")  # 小見出しを調整

    return text


def convert_markdown_to_html(markdown_text: str) -> str:
    """MarkdownテキストをHTMLに変換する"""
    html = markdown.markdown(markdown_text)
    return html
