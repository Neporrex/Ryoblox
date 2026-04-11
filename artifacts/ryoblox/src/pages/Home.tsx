export default function Home() {
  return (
    <div className="page-content">
      {/* HERO */}
      <section style={{ padding: "7rem 1.5rem 5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <span className="discord-badge animate-fade-in" style={{ marginBottom: "2rem", display: "inline-flex", opacity: 0, animationDelay: "0.05s", animationFillMode: "forwards" }}>
            <svg width="14" height="14" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Discord Analytics Bot
          </span>

          <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "center", opacity: 0, animation: "fadeInUp 0.7s ease 0.1s forwards" }}>
            <img
              src="/ryoblox-logo.png"
              alt="Ryoblox"
              style={{ width: "110px", height: "110px", objectFit: "contain", filter: "drop-shadow(0 0 20px rgba(220,38,38,0.35))" }}
            />
          </div>

          <h1 className="hero-title animate-fade-in-up delay-200 text-glow-red" style={{
            fontSize: "clamp(2.8rem, 7vw, 4.5rem)",
            color: "white",
            margin: "0 0 1rem",
            opacity: 0,
            animationFillMode: "forwards",
          }}>
            Ryoblox
          </h1>

          <p className="tag-line animate-fade-in-up delay-300" style={{
            fontSize: "1.1rem",
            margin: "0 0 0.5rem",
            opacity: 0,
            animationFillMode: "forwards",
          }}>
            Track your Roblox game analytics directly inside Discord.
          </p>
          <p style={{
            color: "hsl(0 0% 38%)",
            fontSize: "0.88rem",
            marginBottom: "2.5rem",
            fontFamily: "'Cinzel', serif",
            letterSpacing: "0.12em",
            opacity: 0,
            animation: "fadeInUp 0.7s ease 0.35s forwards",
          }}>
            PLAYER JOINS &bull; CHARTS &bull; GAME TRAFFIC
          </p>

          <div className="animate-fade-in-up delay-400" style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            opacity: 0,
            animationFillMode: "forwards",
          }}>
            <a
              href="https://discord.com/oauth2/authorize"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: "0.95rem", padding: "0.85rem 2.2rem" }}
            >
              <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
              Add to Discord
            </a>
            <a href="/tos" className="btn-secondary" style={{ fontSize: "0.95rem", padding: "0.85rem 2.2rem" }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div className="card-dark" style={{
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2.5rem",
            flexWrap: "wrap",
          }}>
            <div style={{ textAlign: "center" }}>
              <div className="stat-number">3</div>
              <div className="stat-label">Commands</div>
            </div>
            <div className="separator" />
            <div style={{ textAlign: "center" }}>
              <div className="stat-number">100%</div>
              <div className="stat-label">Free</div>
            </div>
            <div className="separator" />
            <div style={{ textAlign: "center" }}>
              <div className="stat-number">JSON</div>
              <div className="stat-label">Storage</div>
            </div>
            <div className="separator" />
            <div style={{ textAlign: "center" }}>
              <div className="stat-number">24/7</div>
              <div className="stat-label">Tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span className="section-label">Features</span>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.9rem",
              fontWeight: 700,
              color: "white",
              margin: 0,
              letterSpacing: "0.06em",
            }}>
              What Ryoblox does
            </h2>
            <div className="divider-red" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <div className="card-dark" style={{ padding: "2rem" }}>
              <div className="feature-icon">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem", color: "white", margin: "0 0 0.5rem", letterSpacing: "0.06em" }}>
                Top Players Chart
              </h3>
              <p style={{ color: "hsl(0 0% 52%)", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
                Generate a bar chart of your top 10 most active players with <span className="command-chip">/stats_top</span>
              </p>
            </div>

            <div className="card-dark" style={{ padding: "2rem" }}>
              <div className="feature-icon">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem", color: "white", margin: "0 0 0.5rem", letterSpacing: "0.06em" }}>
                Player Stats
              </h3>
              <p style={{ color: "hsl(0 0% 52%)", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
                Dive into a specific Roblox username's history with <span className="command-chip">/stats_player</span>
              </p>
            </div>

            <div className="card-dark" style={{ padding: "2rem" }}>
              <div className="feature-icon">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem", color: "white", margin: "0 0 0.5rem", letterSpacing: "0.06em" }}>
                Global Analytics
              </h3>
              <p style={{ color: "hsl(0 0% 52%)", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
                See your game's total traffic, unique players, and trends with <span className="command-chip">/stats_all</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "3rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "750px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="section-label">Setup</span>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.9rem",
              fontWeight: 700,
              color: "white",
              margin: 0,
              letterSpacing: "0.06em",
            }}>
              Up in 3 steps
            </h2>
            <div className="divider-red" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { n: "01", title: "Add the bot", desc: "Click \"Add to Discord\" and authorize Ryoblox to your server." },
              { n: "02", title: "Connect your game", desc: "Set up a Roblox webhook pointing to your bot's target channel. The bot listens for join events in real time." },
              { n: "03", title: "Run commands", desc: "Use /stats_top, /stats_player, or /stats_all to pull analytics at any time." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="card-dark" style={{ padding: "1.5rem 2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "hsl(0 80% 45% / 0.35)",
                  lineHeight: 1,
                  minWidth: "42px",
                  userSelect: "none",
                }}>
                  {n}
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Cinzel', serif", color: "white", fontSize: "0.95rem", margin: "0 0 0.35rem", letterSpacing: "0.06em" }}>{title}</h4>
                  <p style={{ color: "hsl(0 0% 50%)", fontSize: "0.875rem", margin: 0, lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <a
              href="https://discord.com/oauth2/authorize"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: "1rem", padding: "0.9rem 2.5rem" }}
            >
              <svg width="18" height="18" viewBox="0 0 127.14 96.36" fill="currentColor">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
              Get Started — It's Free
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
