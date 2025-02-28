import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2 } from "lucide-react";

export default function UploadPage() {
    const [pdfList, setPdfList] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    // PDF一覧を取得
    const fetchPdfs = useCallback(() => {
        fetch("http://localhost:8000/list_pdfs")
            .then((res) => res.json())
            .then((data) => setPdfList(data.pdfs || []))
            .catch(() => setMessage("PDFリストの取得に失敗しました"));
    }, []);

    useEffect(() => {
        fetchPdfs();
    }, [fetchPdfs]);

    // ファイルアップロード処理
    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ アップロード成功!");
                fetchPdfs(); // 成功後にリスト更新
            } else {
                setMessage(`❌ 失敗: ${data.detail || "エラーが発生しました"}`);
            }
        } catch (error) {
            setMessage("❌ アップロードエラー");
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "application/pdf": [".pdf"] } });

    return (
        <div className="flex flex-col bg-gray-900 text-white h-[calc(100vh-64px)]">
            {/* ヘッダー */}
            <div className="p-4 text-center text-2xl font-bold border-b border-gray-700">
                PDF アップロード
            </div>

            {/* ドラッグ & ドロップ */}
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center border-2 border-dashed p-10 mx-10 mt-8 rounded-lg cursor-pointer transition ${isDragActive ? "border-blue-500 bg-gray-800" : "border-gray-600 bg-gray-700"
                    }`}
            >
                <input {...getInputProps()} />
                <UploadCloud size={48} className="text-gray-400" />
                <p className="text-gray-300 mt-4">ここにPDFをドラッグ & ドロップ または クリックして選択</p>
            </div>

            {/* アップロード状況 */}
            {uploading && (
                <div className="text-center text-blue-400 mt-4 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin mr-2" />
                    アップロード中...
                </div>
            )}
            {message && <div className="text-center mt-4 text-gray-300">{message}</div>}

            {/* PDF一覧 */}
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">📂 アップロード済み PDF</h2>
                <ul className="space-y-2">
                    {pdfList.length > 0 ? (
                        pdfList.map((pdf, index) => (
                            <li key={index} className="p-2 bg-gray-800 rounded-lg text-gray-300">
                                {pdf}
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-400">まだファイルがありません</p>
                    )}
                </ul>
            </div>
        </div>
    );
}
