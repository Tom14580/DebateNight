import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!displayName.trim()) return;

    localStorage.setItem("displayName", displayName.trim());
    navigate("/lobby");
  }

  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="home-title">DebateNight</h1>

        <p className="home-subtitle">
          Pick a side. Debate in real time.
        </p>

        <form onSubmit={handleSubmit} className="home-form mt-lg">
          <input
            className="input"
            type="text"
            placeholder="Enter your name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!displayName.trim()}
          >
            Enter Lobby
          </button>
        </form>
      </div>
    </div>
  );
}