import { useState } from "react";

export default function Question() {
    const [question, setQuestion] = useState("");
    const [filename, setFilename] = useState(""); // アップロードしたPDFのファイル名
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if (!filename) {
            setAnswer("先にPDFをアップロードしてください");
            return;
        }
        if (!question.trim()) {
            setAnswer("質問を入力してください");
            return;
        }

        setLoading(true);
        setAnswer("");

        const formData = new FormData();
        formData.append("filename", filename);
        formData.append("question", question);

        try {
            const response = await fetch("http://localhost:8000/ask", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            setAnswer(result.answer);
        } catch (error) {
            setAnswer("エラーが発生しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-md">
            <input
                type="text"
                placeholder="アップロードしたPDFのファイル名"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <input
                type="text"
                placeholder="質問を入力..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                onClick={handleAsk}
                disabled={loading}
            >
                {loading ? "質問中..." : "質問する"}
            </button>
            {answer && <p className="border p-2 rounded bg-gray-100">{answer}</p>}
        </div>
    );
}
