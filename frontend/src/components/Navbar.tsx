import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between">
                <h1 className="text-lg font-bold text-white">PDF AI Service</h1>
                <div className="flex gap-4">
                    <Link to="/" className="text-gray-300 hover:text-white transition">PDFアップロード</Link>
                    <Link to="/ask" className="text-gray-300 hover:text-white transition">質問</Link>
                </div>
            </div>
        </nav>
    );
}
