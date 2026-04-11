export default function Privacy() {
  return (
    <div className="page-content">
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "5rem 1.5rem 3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="section-label">Legal</span>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "2.2rem",
            fontWeight: 900,
            color: "white",
            margin: "0 0 0.5rem",
            letterSpacing: "0.08em",
          }}>
            Privacy Policy
          </h1>
          <div className="divider-red" />
          <p style={{ color: "hsl(0 0% 40%)", fontSize: "0.82rem", marginTop: "0.75rem", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}>
            Last updated: April 2026
          </p>
        </div>

        <div className="card-dark" style={{ padding: "2.5rem 3rem" }}>
          <div className="prose-dark">
            <p>
              This Privacy Policy explains how Ryoblox ("the bot", "we", "our") collects, uses, and stores data when you invite and use the bot in your Discord server. By adding Ryoblox to your server you agree to these terms.
            </p>

            <h2>1. What data we collect</h2>
            <p>
              Ryoblox collects only the minimum data required to operate its analytics features. Specifically:
            </p>
            <ul>
              <li>Roblox usernames received through webhook messages in the configured channel</li>
              <li>Timestamps of when each join event was received</li>
              <li>Discord channel IDs used to identify the webhook target</li>
            </ul>
            <p>
              We do not collect Discord user IDs, user messages, personal information, server member lists, or any data beyond what is listed above. All data comes from your own Roblox game webhooks — nothing is harvested passively.
            </p>

            <h2>2. How data is stored</h2>
            <p>
              All data collected by Ryoblox is stored in local JSON files on the machine running the bot. This is self-hosted software — meaning you run it yourself. We (the developers) have no access to your data, your server, or your logs at any point.
            </p>
            <ul>
              <li>Player join records are saved in <code style={{ background: "hsl(220 15% 13%)", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.82rem", color: "hsl(0 80% 60%)" }}>analytics.json</code></li>
              <li>Configuration (channel ID, etc.) is saved in <code style={{ background: "hsl(220 15% 13%)", padding: "0.1rem 0.4rem", borderRadius: "4px", fontSize: "0.82rem", color: "hsl(0 80% 60%)" }}>config.json</code></li>
              <li>Data is never transmitted to a third party</li>
            </ul>

            <h2>3. How data is used</h2>
            <p>
              Collected data is used solely to generate statistical charts and summaries when you run slash commands. The bot processes the stored data locally and sends the resulting charts to your Discord channel. No data is used for advertising, profiling, or any commercial purpose.
            </p>

            <h2>4. Data retention</h2>
            <p>
              Since you run this bot yourself, you control retention entirely. You can delete or modify the JSON files at any time. There is no automatic retention limit — data stays until you remove it.
            </p>

            <h2>5. Third-party services</h2>
            <p>
              Ryoblox uses:
            </p>
            <ul>
              <li><strong style={{ color: "hsl(0 0% 80%)" }}>Discord API</strong> — to receive webhook messages and send command responses. Discord's own privacy policy governs all interactions with the Discord platform.</li>
              <li><strong style={{ color: "hsl(0 0% 80%)" }}>Matplotlib</strong> — a local Python library used to render charts. No data leaves your machine during chart generation.</li>
            </ul>

            <h2>6. Children's privacy</h2>
            <p>
              Ryoblox is not directed at children under 13. We do not knowingly collect any personal data from minors.
            </p>

            <h2>7. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be reflected by updating the date at the top of this page. Continued use of the bot after changes constitutes acceptance.
            </p>

            <h2>8. Contact</h2>
            <p>
              For any questions or concerns about this policy, reach out via Discord to <strong style={{ color: "hsl(0 0% 80%)" }}>@neporrex_</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
