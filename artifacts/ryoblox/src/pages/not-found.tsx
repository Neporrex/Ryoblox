import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="page-content" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
      <div>
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "5rem",
          fontWeight: 900,
          color: "hsl(0 80% 45% / 0.2)",
          lineHeight: 1,
          marginBottom: "1rem",
        }}>404</div>
        <h2 style={{ fontFamily: "'Cinzel', serif", color: "white", margin: "0 0 0.5rem", letterSpacing: "0.08em" }}>Page not found</h2>
        <p style={{ color: "hsl(0 0% 45%)", marginBottom: "2rem" }}>This page doesn't exist or was moved.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );
}
