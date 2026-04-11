import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <nav>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <img
              src="/ryoblox-logo.png"
              alt="Ryoblox"
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
            />
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "0.08em",
              color: "white",
            }}>
              Ryo<span style={{ color: "hsl(0 80% 50%)" }}>blox</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Link href="/" className={`nav-link${location === "/" ? " active" : ""}`}>
              Home
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
              style={{ padding: "0.45rem 1.1rem", fontSize: "0.78rem" }}
            >
              Add Bot
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
