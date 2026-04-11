export default function Tos() {
  return (
    <div className="page-content">
      <div className="legal-header">
        <span className="legal-tag">Legal</span>
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-date">Last updated — April 2026</p>
      </div>

      <div className="legal-body">
        <div className="legal-card">
          <p>
            These Terms of Service ("Terms") govern your use of the Ryoblox Discord bot. By adding Ryoblox to your server or using any of its commands, you agree to be bound by these Terms.
          </p>

          <h2>1. About Ryoblox</h2>
          <p>
            Ryoblox is a Discord bot that helps Roblox game developers track player analytics inside Discord. The bot listens to webhook messages from your Roblox game and stores player join data in local JSON files. It provides three slash commands:
          </p>
          <ul>
            <li><strong style={{ color: "#DC2626" }}>/stats_top</strong> — bar chart of the top 10 players by join count</li>
            <li><strong style={{ color: "#DC2626" }}>/stats_player [username]</strong> — detailed join history for a specific Roblox player</li>
            <li><strong style={{ color: "#DC2626" }}>/stats_all</strong> — overall game traffic: total joins, unique players, and daily trends</li>
          </ul>
          <p>
            All analytics data is stored locally in JSON format — <span className="inline-code">analytics.json</span> for player join records and <span className="inline-code">config.json</span> for configuration. No database is required.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 13 years of age to use Ryoblox, in accordance with Discord's Terms of Service. By using Ryoblox you confirm you meet this requirement. Server administrators are responsible for ensuring compliance within their server.
          </p>

          <h2>3. Acceptable use</h2>
          <p>You agree not to use Ryoblox to:</p>
          <ul>
            <li>Collect or process data in violation of any applicable law or regulation</li>
            <li>Harass, threaten, or harm any individual or group</li>
            <li>Spam, abuse, or overload the bot's functionality</li>
            <li>Attempt to reverse-engineer, modify, or exploit the bot in unauthorized ways</li>
            <li>Use the bot for purposes other than Roblox game analytics</li>
          </ul>

          <h2>4. Self-hosted software</h2>
          <p>Ryoblox is provided as self-hosted software. This means you run it on your own machine. Because of this:</p>
          <ul>
            <li>You are responsible for the security and maintenance of your bot instance</li>
            <li>You are responsible for safeguarding any data stored in your local JSON files</li>
            <li>The developer (@neporrex_) has no access to your bot instance, your data, or your server</li>
          </ul>

          <h2>5. Discord compliance</h2>
          <p>
            Your use of Ryoblox must comply with Discord's <a href="https://discord.com/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="https://discord.com/guidelines" target="_blank" rel="noopener noreferrer">Community Guidelines</a> at all times. Ryoblox is an independent project and is not affiliated with or endorsed by Discord Inc.
          </p>

          <h2>6. Roblox compliance</h2>
          <p>
            Your use of Ryoblox must also comply with the <a href="https://en.help.roblox.com/hc/en-us/articles/115004647846" target="_blank" rel="noopener noreferrer">Roblox Terms of Use</a>. Ryoblox is not affiliated with or endorsed by Roblox Corporation.
          </p>

          <h2>7. Disclaimer of warranties</h2>
          <p>
            Ryoblox is provided "as is" without warranty of any kind, express or implied. We make no guarantees about uptime, accuracy of analytics data, or fitness for any particular purpose. Your use of the bot is entirely at your own risk.
          </p>

          <h2>8. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by applicable law, the developer of Ryoblox shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the bot.
          </p>

          <h2>9. Changes to these Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Updates will be reflected by the date at the top of this page. Continued use of Ryoblox after changes constitutes your acceptance of the new Terms.
          </p>

          <h2>10. Contact</h2>
          <p>
            For questions about these Terms, reach out via Discord to <strong style={{ color: "#e5e5e5" }}>@neporrex_</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
