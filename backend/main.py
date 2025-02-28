from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from utils import (
    extract_text_from_pdf,
    format_text_to_markdown,
    convert_markdown_to_html,
)
import os
import shutil
import google.generativeai as genai
from dotenv import load_dotenv

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "message": "ファイルアップロード成功"}


# .envファイルから環境変数を読み込む
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# Gemini APIのAPIキーを設定
genai.configure(api_key=api_key)


@app.post("/ask")
async def ask_question(filename: str = Form(...), question: str = Form(...)):
    """PDF のテキストを取得し、質問に関連する情報を返す（Gemini APIを使用）"""
    text = extract_text_from_pdf(filename)

    if "ファイルが見つかりません" in text or "テキストを抽出できませんでした" in text:
        return {"answer": text}

    # テキストをMarkdown形式に整形
    markdown_text = format_text_to_markdown(text)

    # MarkdownをHTMLに変換
    html_text = convert_markdown_to_html(markdown_text)

    # Gemini APIを使用して質問応答
    model = genai.GenerativeModel()
    prompt = f"質問: {question}\n\n関連するテキスト:\n{text}\n\n回答:"  # Markdown整形前のテキストを使用
    response = model.generate_content(prompt)
    answer = response.text

    return {"answer": answer, "formatted_text": html_text}  # HTML形式のテキストも返す


@app.get("/list_pdfs")
async def list_pdfs():
    pdf_files = os.listdir("uploads")
    return {"pdfs": pdf_files}
