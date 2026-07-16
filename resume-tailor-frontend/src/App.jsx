import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import Tailor from "./pages/Tailor";
import Tracker from "./pages/Tracker";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 px-4 py-10 md:py-16 md:px-12">
            <Routes>
              <Route path="/" element={<Upload />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/tailor" element={<Tailor />} />
              <Route path="/tracker" element={<Tracker />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
