export default function Home() {
  return (
    <div className="page-content">
      <section className="hero-section">
        <img
          src="/ryoblox-logo.png"
          alt="Ryoblox"
          className="hero-logo"
        />

        <h1 className="hero-title">Ryoblox</h1>

        <p className="hero-sub">
          The bot your server didn't know it needed.
        </p>

        <div className="hero-cta">
          <a
            href="https://discord.com/oauth2/authorize"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary large"
          >
            Add to Discord
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </div>
      </section>
    </div>
  );
}
