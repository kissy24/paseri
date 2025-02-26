import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadPage from "./pages/UploadPage";
import AskPage from "./pages/AskPage";

export default function App() {
  return (
    <div className="h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/ask" element={<AskPage />} />
      </Routes>
    </div>
  );
}
