import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <img
            src="/ryoblox-logo.png"
            alt="Ryoblox"
            style={{ width: "28px", height: "28px", objectFit: "contain" }}
          />
          <span className="nav-logo-text">Ryoblox</span>
        </Link>

        <div className="nav-links">
          <Link href="/" className={`nav-link${location === "/" ? " active" : ""}`}>
            Home
          </Link>
          <Link href="/instructions" className={`nav-link${location === "/instructions" ? " active" : ""}`}>
            Setup
          </Link>
          <Link href="/privacy" className={`nav-link${location === "/privacy" ? " active" : ""}`}>
            Privacy
          </Link>
          <Link href="/tos" className={`nav-link${location === "/tos" ? " active" : ""}`}>
            Terms
          </Link>
          <a
            href="https://discord.com/oauth2/authorize"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Add Bot
          </a>
        </div>
      </div>
    </nav>
  );
}
