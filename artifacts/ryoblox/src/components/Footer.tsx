import { Link } from "wouter";

export default function Footer() {
  return (
    <footer style={{ padding: "2.5rem 0", marginTop: "4rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <img
              src="/ryoblox-logo.png"
              alt="Ryoblox"
              style={{ width: "22px", height: "22px", objectFit: "contain", opacity: 0.7 }}
            />
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.08em",
              color: "hsl(0 0% 45%)",
            }}>
              Ryo<span style={{ color: "hsl(0 80% 40%)" }}>blox</span>
            </span>
          </div>

          <div style={{ display: "flex", gap: "2rem" }}>
            <Link href="/" className="footer-link">Home</Link>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/tos" className="footer-link">Terms of Service</Link>
          </div>

          <div style={{
            width: "40px",
            height: "1px",
            background: "hsl(0 0% 14%)",
          }} />

          <p style={{
            color: "hsl(0 0% 35%)",
            fontSize: "0.78rem",
            margin: 0,
            letterSpacing: "0.04em",
          }}>
            made by{" "}
            <span style={{
              color: "hsl(0 0% 48%)",
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
            }}>@neporrex_</span>
          </p>

          <p style={{
            color: "hsl(0 0% 28%)",
            fontSize: "0.72rem",
            margin: 0,
          }}>
            &copy; {new Date().getFullYear()} Ryoblox &mdash; All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
