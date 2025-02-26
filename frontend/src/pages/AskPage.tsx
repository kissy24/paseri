import { useState, useEffect } from "react";
import { Send } from "lucide-react";

interface Message {
    sender: "user" | "ai";
    text: string;
}

export default function AskPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [pdfList, setPdfList] = useState<string[]>([]);
    const [selectedPdf, setSelectedPdf] = useState<string>("");

    // PDFリストを取得
    useEffect(() => {
        fetch("http://localhost:8000/list_pdfs")
            .then((res) => res.json())
            .then((data) => {
                setPdfList(data.pdfs || []);
                if (data.pdfs.length > 0) {
                    setSelectedPdf(data.pdfs[0]); // デフォルトで最初のPDFを選択
                }
            })
            .catch((err) => console.error("Error fetching PDFs:", err));
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || !selectedPdf) return;

        // ユーザーの質問を表示
        setMessages([...messages, { sender: "user", text: input }]);
        setInput("");

        try {
            // FormData を使用して送信
            const formData = new FormData();
            formData.append("filename", selectedPdf);
            formData.append("question", input);

            const response = await fetch("http://localhost:8000/ask", {
                method: "POST",
                body: formData, // FormData で送信
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { sender: "ai", text: data.answer || "エラーが発生しました。" }]);
        } catch (error) {
            console.error("Error sending question:", error);
            setMessages((prev) => [...prev, { sender: "ai", text: "サーバーエラー。" }]);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <h2 className="text-3xl font-bold text-center mt-6">AI に質問</h2>

            {/* PDF選択 */}
            <div className="text-center mt-4">
                <label className="text-gray-400">質問するPDFを選択:</label>
                <select
                    className="ml-2 p-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
                    value={selectedPdf}
                    onChange={(e) => setSelectedPdf(e.target.value)}
                >
                    {pdfList.map((pdf) => (
                        <option key={pdf} value={pdf}>
                            {pdf}
                        </option>
                    ))}
                </select>
            </div>

            {/* チャットエリア */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 max-w-md rounded-lg ${msg.sender === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* 入力エリア */}
            <div className="p-4 border-t border-gray-700 flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="質問を入力..."
                    className="flex-1 bg-gray-800 p-3 rounded-lg text-white outline-none"
                />
                <button
                    onClick={sendMessage}
                    className="ml-4 bg-blue-600 p-3 rounded-lg hover:bg-blue-500 transition"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
