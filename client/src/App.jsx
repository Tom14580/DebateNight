import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import Room from "./pages/Room"
import Navbar from "./components/shared/Navbar";

export default function App() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/rooms/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}