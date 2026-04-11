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
            textTransform: "uppercase",
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

          <Section>
            <Body>
              These Terms of Service ("Terms") govern your use of the Ryoblox Discord bot. By adding Ryoblox to your server or using any of its commands, you agree to be bound by these Terms.
            </Body>
          </Section>

          <Section title="1. About Ryoblox">
            <Body>
              Ryoblox is a Discord bot that helps Roblox game developers track player analytics inside Discord. The bot listens to webhook messages from your Roblox game and stores player join data in local JSON files. It provides three slash commands:
            </Body>
            <List items={[
              <><Strong>/stats_top</Strong> — bar chart of the top 10 players by join count</>,
              <><Strong>/stats_player [username]</Strong> — detailed join history for a specific Roblox player</>,
              <><Strong>/stats_all</Strong> — overall game traffic: total joins, unique players, and daily trends</>,
            ]} />
            <Body>
              All analytics data is stored locally in JSON format — <Code>analytics.json</Code> for player join records and <Code>config.json</Code> for configuration. No database is required.
            </Body>
          </Section>

          <Section title="2. Eligibility">
            <Body>
              You must be at least 13 years of age to use Ryoblox, in accordance with Discord's Terms of Service. By using Ryoblox you confirm you meet this requirement. Server administrators are responsible for ensuring compliance within their server.
            </Body>
          </Section>

          <Section title="3. Acceptable use">
            <Body>You agree not to use Ryoblox to:</Body>
            <List items={[
              "Collect or process data in violation of any applicable law or regulation",
              "Harass, threaten, or harm any individual or group",
              "Spam, abuse, or overload the bot's functionality",
              "Attempt to reverse-engineer, modify, or exploit the bot in unauthorized ways",
              "Use the bot for purposes other than Roblox game analytics",
            ]} />
          </Section>

          <Section title="4. Self-hosted software">
            <Body>Ryoblox is provided as self-hosted software. This means you run it on your own machine. Because of this:</Body>
            <List items={[
              "You are responsible for the security and maintenance of your bot instance",
              "You are responsible for safeguarding any data stored in your local JSON files",
              "The developer (@neporrex_) has no access to your bot instance, your data, or your server",
            ]} />
          </Section>

          <Section title="5. Discord compliance">
            <Body>
              Your use of Ryoblox must comply with Discord's{" "}
              <a href="https://discord.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: "#DC2626", textDecoration: "underline", textDecorationColor: "rgba(220,38,38,0.3)" }}>Terms of Service</a>
              {" "}and{" "}
              <a href="https://discord.com/guidelines" target="_blank" rel="noopener noreferrer" style={{ color: "#DC2626", textDecoration: "underline", textDecorationColor: "rgba(220,38,38,0.3)" }}>Community Guidelines</a>
              {" "}at all times. Ryoblox is an independent project and is not affiliated with or endorsed by Discord Inc.
            </Body>
          </Section>

          <Section title="6. Roblox compliance">
            <Body>
              Your use of Ryoblox must also comply with the{" "}
              <a href="https://en.help.roblox.com/hc/en-us/articles/115004647846" target="_blank" rel="noopener noreferrer" style={{ color: "#DC2626", textDecoration: "underline", textDecorationColor: "rgba(220,38,38,0.3)" }}>Roblox Terms of Use</a>.
              {" "}Ryoblox is not affiliated with or endorsed by Roblox Corporation.
            </Body>
          </Section>

          <Section title="7. Disclaimer of warranties">
            <Body>
              Ryoblox is provided "as is" without warranty of any kind, express or implied. We make no guarantees about uptime, accuracy of analytics data, or fitness for any particular purpose. Your use of the bot is entirely at your own risk.
            </Body>
          </Section>

          <Section title="8. Limitation of liability">
            <Body>
              To the fullest extent permitted by applicable law, the developer of Ryoblox shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the bot.
            </Body>
          </Section>

          <Section title="9. Changes to these Terms">
            <Body>
              We reserve the right to update these Terms at any time. Updates will be reflected by the date at the top of this page. Continued use of Ryoblox after changes constitutes your acceptance of the new Terms.
            </Body>
          </Section>

          <Section title="10. Contact">
            <Body>
              For questions about these Terms, reach out via Discord to <Strong>@neporrex_</Strong>.
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
