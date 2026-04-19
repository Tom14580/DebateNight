import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room"
import Navbar from "./components/shared/Navbar";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/rooms/:roomId" element={<Room />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}