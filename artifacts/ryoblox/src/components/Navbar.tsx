import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { useState, useRef, useEffect } from "react";

const CLIENT_ID = "1360601405872990208";
const REDIRECT = encodeURIComponent("https://ryoblox.vercel.app/dashboard");
const OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT}&response_type=code&scope=identify+guilds`;
const BOT_INVITE = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot+applications.commands`;

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const avatar = user
    ? user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
      : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(user.id) >> 22n) % 6}.png`
    : null;

  return (
    <nav>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <img
            src="/ryoblox-logo.png"
            alt="Ryoblox"
            style={{ width: 28, height: 28, objectFit: "contain" }}
          />
          <span className="nav-logo-text">Ryoblox</span>
        </Link>

        <div className="nav-links">
          <Link href="/" className={`nav-link${location === "/" ? " active" : ""}`}>Home</Link>
          <Link href="/setup" className={`nav-link${location === "/setup" ? " active" : ""}`}>Setup</Link>
          <Link href="/privacy" className={`nav-link${location === "/privacy" ? " active" : ""}`}>Privacy</Link>
          <Link href="/tos" className={`nav-link${location === "/tos" ? " active" : ""}`}>Terms</Link>
          <Link href="/dashboard" className={`nav-link${location === "/dashboard" ? " active" : ""}`}>Dashboard</Link>
          <Link href="/global" className={`nav-link${location === "/global" ? " active" : ""}`}>Global</Link>

          {user ? (
            <div className="nav-user-wrap" ref={ref}>
              <button className="nav-user-btn" onClick={() => setOpen(!open)}>
                <img src={avatar!} alt="" className="nav-avatar" />
                <span className="nav-username">{user.global_name || user.username}</span>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="currentColor"
                  style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {open && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <img src={avatar!} alt="" className="nav-dropdown-avatar" />
                    <div>
                      <div className="nav-dropdown-name">{user.global_name || user.username}</div>
                      <div className="nav-dropdown-tag">{user.username}</div>
                    </div>
                  </div>
                  <div className="nav-dropdown-sep" />
                  <Link href="/dashboard" className="nav-dropdown-item" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/global" className="nav-dropdown-item" onClick={() => setOpen(false)}>
                    Global Stats
                  </Link>
                  <div className="nav-dropdown-sep" />
                  <button
                    className="nav-dropdown-item nav-dropdown-signout"
                    onClick={() => { logout(); setOpen(false); }}
                  >
                    ↪ Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href={OAUTH_URL} className="btn-primary nav-signin-btn">
              Sign In
            </a>
          )}

          <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Add Bot
          </a>
        </div>
      </div>
    </nav>
  );
}
