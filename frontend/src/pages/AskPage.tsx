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

    useEffect(() => {
        fetch("http://localhost:8000/list_pdfs")
            .then((res) => res.json())
            .then((data) => {
                setPdfList(data.pdfs || []);
                if (data.pdfs.length > 0) {
                    setSelectedPdf(data.pdfs[0]);
                }
            })
            .catch((err) => console.error("Error fetching PDFs:", err));
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || !selectedPdf) return;

        setMessages([...messages, { sender: "user", text: input }]);
        setInput("");

        try {
            const formData = new FormData();
            formData.append("filename", selectedPdf);
            formData.append("question", input);

            const response = await fetch("http://localhost:8000/ask", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setMessages((prev) => [...prev, { sender: "ai", text: data.answer || "エラーが発生しました。" }]);
        } catch (error) {
            console.error("Error sending question:", error);
            setMessages((prev) => [...prev, { sender: "ai", text: "サーバーエラー。" }]);
        }
    };

    return (
        <div className="flex flex-col bg-gray-900 text-white h-[calc(100vh-64px)]">
            {/* ヘッダー */}
            <div className="p-4 text-center text-2xl font-bold border-b border-gray-700">
                AI に質問
            </div>

            {/* PDF選択 */}
            <div className="flex justify-center items-center p-4">
                <label className="text-gray-400 mr-2">PDF を選択:</label>
                <select
                    className="p-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
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
            <div className="flex flex-col flex-grow overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-4 max-w-[80%] rounded-xl shadow-md ${msg.sender === "user"
                            ? "bg-blue-600 text-white ml-auto"
                            : "bg-gray-700 text-white"
                            }`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            {/* 入力エリア */}
            <div className="p-4 border-t border-gray-700 bg-gray-800 flex items-center">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="質問を入力..."
                    className="flex-grow min-h-16 max-h-32 bg-gray-700 p-3 rounded-lg text-white outline-none resize-none"
                />
                <button
                    onClick={sendMessage}
                    className="ml-4 bg-blue-600 p-3 rounded-lg hover:bg-blue-500 transition flex items-center"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
