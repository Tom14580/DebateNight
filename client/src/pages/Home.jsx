import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnlineCount } from "../hooks/useOnlineCount";
import "../styles/Home.css";

export default function Home() {
  const [displayName, setDisplayName] = useState("");
  const [savedName, setSavedName] = useState("");
  const navigate = useNavigate();
  const onlineCount = useOnlineCount();

  useEffect(() => {
    const name = localStorage.getItem("displayName");
    if (name) {
      setSavedName(name);
      setDisplayName(name);
    }
  }, []);

  function handleEnter(e) {
    e?.preventDefault();

    if (!displayName.trim()) return;

    const trimmed = displayName.trim();
    localStorage.setItem("displayName", trimmed);
    setSavedName(trimmed);
  }

  return (
    <div className="home-page">
      <div className="home-bg">
        <div className="bg-blob blob-left"></div>
        <div className="bg-blob blob-right"></div>
      </div>

      <div className="home-hero container">
        <div className="home-badge">Online: {onlineCount}</div>

        <h1 className="home-title">
          Defend your <br />
          <span>position.</span>
        </h1>

        <p className="home-subtitle">
          Real-time 1-on-1 debates. Pick a topic, choose your side, and argue
          your case before the timer runs out.
        </p>

        <div className="home-cta mt-lg">
          {savedName ? (
            <>
              <p className="welcome-text">
                Welcome back, <span>{savedName}</span>
              </p>

              <div className="home-edit-row">
                <input
                  className="input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />

                <button
                  className="btn btn-primary"
                  onClick={handleEnter}
                  disabled={!displayName.trim()}
                >
                  Update
                </button>
              </div>

              <button
                className="btn btn-primary mt-sm home-full-btn"
                onClick={() => navigate("/lobby")}
              >
                Enter Lobby →
              </button>
            </>
          ) : (
            <form onSubmit={handleEnter} className="home-form">
              <input
                className="input"
                placeholder="Enter your display name..."
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!displayName.trim()}
              >
                Join Now →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}