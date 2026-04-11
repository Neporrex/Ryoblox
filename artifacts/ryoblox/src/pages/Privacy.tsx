export default function Privacy() {
  return (
    <div className="page-content">
      <div className="legal-header">
        <span className="legal-tag">Legal</span>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-date">Last updated — April 2026</p>
      </div>

      <div className="legal-body">
        <div className="legal-card">
          <p>
            This Privacy Policy explains how Ryoblox ("the bot", "we", "our") collects, uses, and stores data when you invite and use the bot in your Discord server. By adding Ryoblox to your server you agree to these terms.
          </p>

          <h2>1. What data we collect</h2>
          <p>Ryoblox collects only the minimum data required to operate its analytics features:</p>
          <ul>
            <li>Roblox usernames received through webhook messages in the configured channel</li>
            <li>Timestamps of when each join event was received</li>
            <li>Discord channel IDs used to identify the webhook target</li>
          </ul>
          <p>
            We do not collect Discord user IDs, personal messages, server member lists, or any data beyond what is listed above. All data comes from your own Roblox game webhooks — nothing is harvested passively.
          </p>

          <h2>2. How data is stored</h2>
          <p>
            All data collected by Ryoblox is stored in local JSON files on the machine running the bot. This is self-hosted software — meaning you run it yourself. We have no access to your data, your server, or your logs at any point.
          </p>
          <ul>
            <li>Player join records are saved in <span className="inline-code">analytics.json</span></li>
            <li>Configuration (channel ID, etc.) is saved in <span className="inline-code">config.json</span></li>
            <li>Data is never transmitted to a third party</li>
          </ul>

          <h2>3. How data is used</h2>
          <p>
            Collected data is used solely to generate statistical charts and summaries when you run slash commands. The bot processes data locally and sends the resulting charts to your Discord channel. No data is used for advertising, profiling, or any commercial purpose.
          </p>

          <h2>4. Data retention</h2>
          <p>
            Since you run this bot yourself, you control retention entirely. You can delete or modify the JSON files at any time. There is no automatic retention limit — data stays until you remove it.
          </p>

          <h2>5. Third-party services</h2>
          <ul>
            <li><strong style={{ color: "#e5e5e5" }}>Discord API</strong> — to receive webhook messages and send command responses. Discord's own privacy policy governs all interactions with their platform.</li>
            <li><strong style={{ color: "#e5e5e5" }}>Matplotlib</strong> — a local Python library used to render charts. No data leaves your machine during chart generation.</li>
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
            For any questions or concerns about this policy, reach out via Discord to <strong style={{ color: "#e5e5e5" }}>@neporrex_</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
