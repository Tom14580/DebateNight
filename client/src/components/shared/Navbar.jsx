import { Link, useLocation } from "react-router-dom";
import "../../styles/Navbar.css";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container flex-between">
        <div className="navbar-logo">
          <Link to="/">DebateNight</Link>
        </div>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/lobby"
            className={`nav-link ${location.pathname === "/lobby" ? "active" : ""}`}
          >
            Lobby
          </Link>
        </div>
      </div>
    </nav>
  );
}