import { useAuth } from "../hooks/useAuth";
import { Link } from "wouter";

const CLIENT_ID = "1360601405872990208";
const REDIRECT = encodeURIComponent("https://ryoblox.vercel.app/dashboard");
const OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT}&response_type=code&scope=identify+guilds`;
const BOT_INVITE = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot+applications.commands`;

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page-content">
      <section className="hero-section">
        <img src="/ryoblox-logo.png" alt="Ryoblox" className="hero-logo" />
        <h1 className="hero-title">Ryoblox</h1>
        <p className="hero-sub">The bot your server didn't know it needed.</p>

        <div className="hero-cta">
          <a href={BOT_INVITE} target="_blank" rel="noopener noreferrer" className="btn-primary large">
            Add to Discord
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {user ? (
            <Link href="/dashboard" className="btn-secondary large">
              Open Dashboard →
            </Link>
          ) : (
            <a href={OAUTH_URL} className="btn-secondary large">
              Sign In with Discord
            </a>
          )}
        </div>
        <div className="scroll-indicator">
          <div className="scroll-mouse"><div className="scroll-dot" /></div>
        </div>
      </section>
    </div>
  );
}
