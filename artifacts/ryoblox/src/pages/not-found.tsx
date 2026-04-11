import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="page-content" style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
    }}>
      <div>
        <p style={{
          fontFamily: "'Clash Display', sans-serif",
          fontWeight: 700,
          fontSize: "6rem",
          color: "rgba(220,38,38,0.15)",
          lineHeight: 1,
          marginBottom: "1rem",
        }}>404</p>
        <h2 style={{
          fontFamily: "'Clash Display', sans-serif",
          fontWeight: 600,
          fontSize: "1.4rem",
          color: "#e5e5e5",
          marginBottom: "0.5rem",
          letterSpacing: "-0.02em",
        }}>Page not found</h2>
        <p style={{ color: "#4B5563", fontSize: "0.9rem", marginBottom: "2rem" }}>
          This page doesn't exist or was moved.
        </p>
        <Link href="/" className="btn-primary">Go home</Link>
      </div>
    </div>
  );
}
