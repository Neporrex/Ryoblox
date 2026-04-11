export default function Privacy() {
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
          }}>Privacy Policy</h1>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.82rem",
            color: "#374151",
            fontWeight: 500,
          }}>Last updated — April 2026</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>

          <Section title="Introduction">
            <Body>
              This Privacy Policy describes how Ryoblox ("we", "us", or "our") collects, uses, and handles your information when you use the Ryoblox Discord bot (the "Bot"). Ryoblox is a Roblox game analytics bot that tracks player join activity and generates statistics. By using the Bot, you agree to the collection and use of information in accordance with this policy.
            </Body>
          </Section>

          <Section title="Information We Collect">
            <Body>Ryoblox collects a limited set of data necessary to provide analytics functionality:</Body>
            <List items={[
              "Roblox usernames — collected from webhook messages sent to a designated Discord channel when players join your game",
              "Join timestamps — the date and time each player join event is recorded",
              "Discord channel ID — the channel configured to receive webhook data",
            ]} />
            <Body>
              The Bot does not collect Discord messages, personal information, IP addresses, or any data outside of the configured webhook channel.
            </Body>
          </Section>

          <Section title="How Data Is Collected">
            <Body>
              Data is collected automatically when a Roblox game sends a webhook message to a designated Discord channel. The Bot parses messages matching the format <Code>New player joined: [username]</Code> and stores the username along with a timestamp in a local SQLite database.
            </Body>
          </Section>

          <Section title="How We Use Your Information">
            <Body>Collected data is used exclusively to:</Body>
            <List items={[
              "Generate player join statistics and charts via slash commands",
              "Show top players, individual player history, and overall game traffic",
              "Provide game analytics to the server owner",
            ]} />
          </Section>

          <Section title="Data Storage & Security">
            <Body>
              All data is stored locally in an SQLite database file on the machine running the Bot. Data is not transmitted to any external servers, cloud services, or third parties. The database contains only Roblox usernames and join timestamps — no sensitive or personally identifiable information is stored.
            </Body>
          </Section>

          <Section title="Data Retention & Deletion">
            <Body>
              Data is retained as long as the Bot is operational and the database file exists. Server owners can delete all collected data at any time by removing or clearing the SQLite database file. Removing the Bot from a server stops all future data collection immediately.
            </Body>
          </Section>

          <Section title="Third-Party Services">
            <Body>
              The Bot operates within the Discord platform and is subject to <A href="https://discord.com/privacy">Discord's Privacy Policy</A>. We do not share, sell, or transmit your data to any other third party.
            </Body>
          </Section>

          <Section title="Children's Privacy">
            <Body>
              The Bot is not intended for users under the age of 13 (or the minimum age required by Discord in your country). We do not knowingly collect information from children under this age.
            </Body>
          </Section>

          <Section title="Changes to This Policy">
            <Body>
              We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date. Continued use of the Bot after changes constitutes acceptance of the new policy.
            </Body>
          </Section>

          <Section title="Contact">
            <Body>
              If you have questions about this Privacy Policy, reach out to <Strong>@neporrex_</Strong> on Discord.
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
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "#DC2626", textDecoration: "underline", textDecorationColor: "rgba(220,38,38,0.35)" }}
    >{children}</a>
  );
}
