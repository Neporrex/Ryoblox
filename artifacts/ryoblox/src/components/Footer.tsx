import { Link } from "wouter";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-links">
          <Link href="/" className="footer-link">Home</Link>
          <Link href="/privacy" className="footer-link">Privacy</Link>
          <Link href="/tos" className="footer-link">Terms</Link>
        </div>
        <p className="footer-credit">
          made by <span>@neporrex_</span>
        </p>
      </div>
    </footer>
  );
}
