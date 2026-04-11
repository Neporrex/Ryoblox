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
          }}>Privacy Policy</h1>
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
              This Privacy Policy explains how Ryoblox ("the bot", "we", "our") collects, uses, and stores data when you invite and use the bot in your Discord server. By adding Ryoblox to your server you agree to these terms.
            </Body>
          </Section>

          <Section title="1. What data we collect">
            <Body>Ryoblox collects only the minimum data required to operate its analytics features:</Body>
            <List items={[
              "Roblox usernames received through webhook messages in the configured channel",
              "Timestamps of when each join event was received",
              "Discord channel IDs used to identify the webhook target",
            ]} />
            <Body>
              We do not collect Discord user IDs, personal messages, server member lists, or any data beyond what is listed above. All data comes from your own Roblox game webhooks — nothing is harvested passively.
            </Body>
          </Section>

          <Section title="2. How data is stored">
            <Body>
              All data collected by Ryoblox is stored in local JSON files on the machine running the bot. This is self-hosted software — meaning you run it yourself. We have no access to your data, your server, or your logs at any point.
            </Body>
            <List items={[
              <>Player join records are saved in <Code>analytics.json</Code></>,
              <>Configuration (channel ID, etc.) is saved in <Code>config.json</Code></>,
              "Data is never transmitted to a third party",
            ]} />
          </Section>

          <Section title="3. How data is used">
            <Body>
              Collected data is used solely to generate statistical charts and summaries when you run slash commands. The bot processes data locally and sends the resulting charts to your Discord channel. No data is used for advertising, profiling, or any commercial purpose.
            </Body>
          </Section>

          <Section title="4. Data retention">
            <Body>
              Since you run this bot yourself, you control retention entirely. You can delete or modify the JSON files at any time. There is no automatic retention limit — data stays until you remove it.
            </Body>
          </Section>

          <Section title="5. Third-party services">
            <List items={[
              <><Strong>Discord API</Strong> — to receive webhook messages and send command responses. Discord's own privacy policy governs all interactions with their platform.</>,
              <><Strong>Matplotlib</Strong> — a local Python library used to render charts. No data leaves your machine during chart generation.</>,
            ]} />
          </Section>

          <Section title="6. Children's privacy">
            <Body>
              Ryoblox is not directed at children under 13. We do not knowingly collect any personal data from minors.
            </Body>
          </Section>

          <Section title="7. Changes to this policy">
            <Body>
              We may update this Privacy Policy from time to time. Changes will be reflected by updating the date at the top of this page. Continued use of the bot after changes constitutes acceptance.
            </Body>
          </Section>

          <Section title="8. Contact">
            <Body>
              For any questions or concerns about this policy, reach out via Discord to <Strong>@neporrex_</Strong>.
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
