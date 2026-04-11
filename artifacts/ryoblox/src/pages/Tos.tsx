export default function Tos() {
  return (
    <div className="page-content">
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "8rem 2rem 6rem" }}>

        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: "#DC2626",
            marginBottom: "0.85rem",
          }}>Legal</p>
          <h1 style={{
            fontFamily: "'Clash Display', 'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2.2rem, 6vw, 3.2rem)",
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: "0.6rem",
          }}>Terms of Service</h1>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.82rem",
            color: "#374151",
            fontWeight: 500,
          }}>Last updated — April 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>

          <Section title="Acceptance of Terms">
            <Body>
              By adding Ryoblox (the "Bot") to your Discord server or using any of its features, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please remove the Bot from your server and discontinue use.
            </Body>
          </Section>

          <Section title="Description of Service">
            <Body>
              Ryoblox is a Roblox game analytics Discord bot. It monitors a designated channel for webhook messages from your Roblox game, logs player join events, and provides analytics through the following slash commands:
            </Body>
            <List items={[
              <><Strong>/stats_top</Strong> — Bar chart of the top 10 most frequent players</>,
              <><Strong>/stats_player [username]</Strong> — Individual player stats and join history chart</>,
              <><Strong>/stats_all</Strong> — Overall game traffic stats and chart</>,
              <><Strong>/stats_today</Strong> — Today's joins and active players</>,
              <><Strong>/stats_week</Strong> — Last 7 days of game traffic</>,
              <><Strong>/leaderboard</Strong> — Ranked leaderboard embed (no chart)</>,
            ]} />
            <Body>The Bot is provided "as is" and "as available" without any warranties of any kind.</Body>
          </Section>

          <Section title="How It Works">
            <Body>
              The Bot listens to a specific Discord channel for webhook messages from your Roblox game. When a message matching the format <Code>New player joined: [username]</Code> is detected, the Bot records the player's Roblox username and a timestamp into a local SQLite database. This data is used to generate charts and statistics on demand.
            </Body>
          </Section>

          <Section title="User Responsibilities">
            <Body>By using the Bot, you agree to:</Body>
            <List items={[
              "Comply with Discord's Terms of Service and Community Guidelines",
              "Comply with Roblox's Terms of Use",
              "Not use the Bot for any illegal or unauthorized purpose",
              "Not attempt to exploit, reverse engineer, or disrupt the Bot's functionality",
              "Not abuse the Bot's commands (e.g., spamming slash commands)",
              "Ensure the webhook channel is properly configured for your Roblox game",
              "Take responsibility for all activity on your server related to the Bot",
            ]} />
          </Section>

          <Section title="Data & Storage">
            <Body>
              The Bot stores data locally in an SQLite database. Only Roblox usernames and join timestamps are stored. No Discord messages, personal information, or sensitive data is collected. For full details, please review our <A href="/privacy">Privacy Policy</A>.
            </Body>
          </Section>

          <Section title="Availability">
            <Body>
              We strive to keep the Bot running smoothly, but we do not guarantee 100% uptime. The Bot may be temporarily unavailable due to maintenance, updates, or unforeseen issues. We are not liable for any damages resulting from downtime or data loss.
            </Body>
          </Section>

          <Section title="Limitation of Liability">
            <Body>
              To the maximum extent permitted by law, Ryoblox and its developer(s) shall not be held liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Bot, including but not limited to loss of data, inaccurate analytics, or service interruptions.
            </Body>
          </Section>

          <Section title="Modifications">
            <Body>
              We reserve the right to modify the Bot's features, commands, functionality, or these Terms at any time without prior notice. Continued use of the Bot after modifications constitutes your acceptance of the updated Terms.
            </Body>
          </Section>

          <Section title="Termination">
            <Body>
              We reserve the right to restrict or terminate your access to the Bot at any time, for any reason, including but not limited to violations of these Terms. You may stop using the Bot at any time by removing it from your server.
            </Body>
          </Section>

          <Section title="Contact">
            <Body>
              For any questions regarding these Terms, reach out to <Strong>@neporrex_</Strong> on Discord.
            </Body>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div>
      {title && (
        <h2 style={{
          fontFamily: "'Clash Display', 'Manrope', sans-serif",
          fontWeight: 600,
          fontSize: "1.05rem",
          color: "#e5e5e5",
          letterSpacing: "-0.01em",
          marginBottom: "0.65rem",
          paddingLeft: "0.85rem",
          borderLeft: "2px solid #DC2626",
        }}>{title}</h2>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {children}
      </div>
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Manrope', sans-serif",
      fontSize: "0.9rem",
      color: "#6B7280",
      lineHeight: 1.85,
      fontWeight: 400,
    }}>{children}</p>
  );
}

function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      {items.map((item, i) => (
        <li key={i} style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: "0.9rem",
          color: "#6B7280",
          lineHeight: 1.85,
          paddingLeft: "1.1rem",
          position: "relative",
        }}>
          <span style={{ position: "absolute", left: 0, color: "rgba(220,38,38,0.5)" }}>—</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "'Manrope', monospace",
      fontSize: "0.8rem",
      color: "#EF4444",
      background: "rgba(220,38,38,0.08)",
      border: "1px solid rgba(220,38,38,0.18)",
      padding: "0.1rem 0.4rem",
      borderRadius: "4px",
    }}>{children}</span>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#d1d5db", fontWeight: 600 }}>{children}</span>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{ color: "#DC2626", textDecoration: "underline", textDecorationColor: "rgba(220,38,38,0.35)" }}
    >{children}</a>
  );
}
