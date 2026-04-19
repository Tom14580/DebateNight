import { Link, useLocation } from "react-router-dom";
import "../../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">⚔</div>
          <span>
            Debate<span className="logo-accent">Night</span>
          </span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>

          <Link
            to="/lobby"
            className={`nav-link ${isActive("/lobby") ? "active" : ""}`}
          >
            Lobby
          </Link>

          <Link
            to="/history"
            className={`nav-link ${isActive("/history") ? "active" : ""}`}
          >
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}