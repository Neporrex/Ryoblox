export default function Home() {
  return (
    <div className="page-content">
      {/* HERO */}
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

      {/* FEATURES */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">What Ryoblox does</h2>
            <p className="section-sub">Three commands. Real data. No setup headaches.</p>
          </div>

          <div className="cards-grid">
            <div className="card">
              <div className="card-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="4" height="18" rx="1"/>
                  <rect x="10" y="8" width="4" height="13" rx="1"/>
                  <rect x="17" y="5" width="4" height="16" rx="1"/>
                </svg>
              </div>
              <p className="card-title">Top Players</p>
              <p className="card-desc">
                Bar chart of your most frequent players. Run <span className="chip">/stats_top</span> and see who's been grinding your game.
              </p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              <p className="card-title">Player History</p>
              <p className="card-desc">
                Per-player join history over time. Use <span className="chip">/stats_player [name]</span> for a full activity line chart.
              </p>
            </div>

            <div className="card">
              <div className="card-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <p className="card-title">Game Traffic</p>
              <p className="card-desc">
                Total joins, unique players, and daily trends in one command. <span className="chip">/stats_all</span> gives you the full picture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="section-header">
            <h2 className="section-title">Up in 3 steps</h2>
            <p className="section-sub">No databases, no complicated setup — just run the bot.</p>
          </div>

          <div className="steps-list">
            {([
              {
                n: "01",
                title: "Add the bot",
                desc: "Click \"Add to Discord\" and authorize Ryoblox to your server in a few seconds.",
              },
              {
                n: "02",
                title: "Connect your game",
                desc: "Point a Roblox game webhook to your configured Discord channel. The bot picks up join events automatically.",
              },
              {
                n: "03",
                title: "Run commands",
                desc: "Use /stats_top, /stats_player, or /stats_all whenever you want. Charts are generated and posted instantly.",
              },
            ] as const).map(({ n, title, desc }) => (
              <div key={n} className="step">
                <div className="step-num">{n}</div>
                <div>
                  <p className="step-title">{title}</p>
                  <p className="step-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-center">
            <a
              href="https://discord.com/oauth2/authorize"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary large"
            >
              Get started — it's free
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
