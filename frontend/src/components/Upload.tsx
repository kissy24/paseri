import { useState } from "react";

export default function Upload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("ファイルを選択してください");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("http://localhost:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("アップロード成功！");
            } else {
                setMessage("アップロード失敗...");
            }
        } catch (error) {
            setMessage("エラーが発生しました");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-md">
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
                onClick={handleUpload}
                disabled={uploading}
            >
                {uploading ? "アップロード中..." : "アップロード"}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}
