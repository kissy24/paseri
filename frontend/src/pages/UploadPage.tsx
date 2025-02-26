import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload } from "lucide-react";

export default function UploadPage() {
    const [files, setFiles] = useState<File[]>([]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        onDrop: (acceptedFiles) => setFiles(acceptedFiles),
    });

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h2 className="text-3xl font-bold mb-6">PDF アップロード</h2>

            <div
                {...getRootProps()}
                className={`w-96 h-48 border-2 border-dashed p-6 flex flex-col items-center justify-center rounded-lg transition ${isDragActive ? "border-blue-400 bg-gray-800" : "border-gray-600"
                    }`}
            >
                <input {...getInputProps()} />
                <CloudUpload size={48} className="text-gray-400" />
                <p className="mt-2 text-gray-400">
                    {isDragActive ? "ここにドロップしてください" : "PDFファイルをドラッグ＆ドロップ"}
                </p>
            </div>

            {files.length > 0 && (
                <div className="mt-6 w-96 bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">アップロードされたファイル:</h3>
                    <ul className="mt-2 text-gray-400">
                        {files.map((file) => (
                            <li key={file.name} className="truncate">{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
