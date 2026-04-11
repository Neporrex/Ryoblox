import { useState } from "react";

const LUA_CODE = `local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

local Webhook_url = "" -- Your webhook URL here

local joinTimes = {}

-- Convert seconds to a readable time format
local function formatTime(seconds)
	local h = math.floor(seconds / 3600)
	local m = math.floor((seconds % 3600) / 60)
	local s = math.floor(seconds % 60)
	if h > 0 then
		return string.format("%dh %dm %ds", h, m, s)
	elseif m > 0 then
		return string.format("%dm %ds", m, s)
	else
		return string.format("%ds", s)
	end
end

-- Send a message when a player joins
local function sendJoin(player)
	local data = {
		["content"] = "New player joined: " .. player.Name
	}
	local jsonData = HttpService:JSONEncode(data)
	pcall(function()
		HttpService:PostAsync(Webhook_url, jsonData, Enum.HttpContentType.ApplicationJson)
	end)
end

-- Send a message when a player leaves, including playtime
local function sendLeave(player)
	local joinTime = joinTimes[player.UserId]
	local playtime = "unknown"
	if joinTime then
		playtime = formatTime(os.time() - joinTime)
		joinTimes[player.UserId] = nil
	end
	local data = {
		["content"] = "Player left: " .. player.Name .. " | Playtime: " .. playtime
	}
	local jsonData = HttpService:JSONEncode(data)
	pcall(function()
		HttpService:PostAsync(Webhook_url, jsonData, Enum.HttpContentType.ApplicationJson)
	end)
end

Players.PlayerAdded:Connect(function(player)
	joinTimes[player.UserId] = os.time()
	sendJoin(player)
end)

Players.PlayerRemoving:Connect(function(player)
	sendLeave(player)
end)`;

const COMMANDS = [
  { name: "/set-channel", desc: "Set the channel Ryoblox listens to for join events. Requires Manage Channels permission." },
  { name: "/stats_top", desc: "Bar chart of your top 10 most frequent players by join count." },
  { name: "/stats_player [username]", desc: "Individual join history and chart for a specific Roblox player." },
  { name: "/stats_all", desc: "Overall game traffic — total joins, unique players, and daily trend." },
  { name: "/stats_today", desc: "Today's join count, unique players, and top 5 players." },
  { name: "/stats_week", desc: "Last 7 days of game traffic as a line chart." },
  { name: "/leaderboard", desc: "Ranked top 15 players as a Discord embed with medals." },
  { name: "/ping", desc: "Check if the bot is online and view latency." },
  { name: "/help", desc: "List all available Ryoblox commands." },
];

export default function Instructions() {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(LUA_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="page-content">
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "8rem 2rem 6rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: "#DC2626",
            marginBottom: "0.85rem",
          }}>Guide</p>
          <h1 style={{
            fontFamily: "'Clash Display', 'Manrope', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2.2rem, 6vw, 3.2rem)",
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: "0.6rem",
          }}>How to set up Ryoblox</h1>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.9rem",
            color: "#6B7280",
            lineHeight: 1.7,
          }}>
            Follow these steps to connect your Roblox game to your Discord server. The whole setup takes under 5 minutes.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "4rem" }}>
          <Step n={1} title="Add Ryoblox to your server">
            Click <strong style={{ color: "#e5e5e5" }}>Add to Discord</strong> at the top of this page and authorize the bot. Make sure to keep all the default permissions — the bot needs them to post charts in your channels.
          </Step>

          <Step n={2} title="Create a Discord webhook">
            In your Discord server, go to the channel where you want to receive join events. Open <strong style={{ color: "#e5e5e5" }}>Channel Settings → Integrations → Webhooks → New Webhook</strong>. Copy the webhook URL — you'll paste it into the Lua script shortly.
          </Step>

          <Step n={3} title="Set your stats channel">
            In your Discord server, run the command <Code>/set-channel</Code> and select the same channel you created the webhook in. This tells Ryoblox which channel to watch for player joins.
          </Step>

          <Step n={4} title="Add the Lua script to your Roblox game">
            In <strong style={{ color: "#e5e5e5" }}>Roblox Studio</strong>, open your game and go to <strong style={{ color: "#e5e5e5" }}>ServerScriptService</strong>. Create a new <strong style={{ color: "#e5e5e5" }}>Script</strong> (not LocalScript), paste the code below, and fill in your webhook URL from Step 2.
          </Step>

          <Step n={5} title="Enable HTTP requests in Studio">
            In Roblox Studio go to <strong style={{ color: "#e5e5e5" }}>Home → Game Settings → Security</strong> and toggle on <strong style={{ color: "#e5e5e5" }}>Allow HTTP Requests</strong>. Without this the webhook calls will be silently blocked.
          </Step>

          <Step n={6} title="Publish and test">
            Publish your game, then join it from the Roblox client. Within a few seconds you should see a message appear in your webhook channel. Then run <Code>/stats_top</Code> in Discord — your name should appear on the chart.
          </Step>
        </div>

        {/* Lua code block */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.75rem",
          }}>
            <h2 style={{
              fontFamily: "'Clash Display', 'Manrope', sans-serif",
              fontWeight: 600,
              fontSize: "1.05rem",
              color: "#e5e5e5",
              letterSpacing: "-0.01em",
              paddingLeft: "0.85rem",
              borderLeft: "2px solid #DC2626",
            }}>ServerScript — paste into ServerScriptService</h2>
            <button
              onClick={copyCode}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: copied ? "#4ade80" : "#DC2626",
                background: copied ? "rgba(74,222,128,0.08)" : "rgba(220,38,38,0.08)",
                border: `1px solid ${copied ? "rgba(74,222,128,0.25)" : "rgba(220,38,38,0.25)"}`,
                borderRadius: "6px",
                padding: "0.35rem 0.85rem",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "0.03em",
                flexShrink: 0,
              }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre style={{
            background: "#0d0d0d",
            border: "1px solid #1a1a1a",
            borderRadius: "10px",
            padding: "1.5rem",
            overflowX: "auto",
            fontFamily: "'Manrope', 'Courier New', monospace",
            fontSize: "0.78rem",
            color: "#9ca3af",
            lineHeight: 1.75,
            margin: 0,
          }}>
            <code>{LUA_CODE}</code>
          </pre>
        </div>

        {/* Commands reference */}
        <div>
          <h2 style={{
            fontFamily: "'Clash Display', 'Manrope', sans-serif",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "#e5e5e5",
            letterSpacing: "-0.01em",
            marginBottom: "1rem",
            paddingLeft: "0.85rem",
            borderLeft: "2px solid #DC2626",
          }}>All commands</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {COMMANDS.map((cmd) => (
              <div
                key={cmd.name}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid #111",
                  borderRadius: "8px",
                }}
              >
                <span style={{
                  fontFamily: "'Manrope', monospace",
                  fontSize: "0.8rem",
                  color: "#EF4444",
                  background: "rgba(220,38,38,0.08)",
                  border: "1px solid rgba(220,38,38,0.18)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "5px",
                  whiteSpace: "nowrap" as const,
                  flexShrink: 0,
                }}>{cmd.name}</span>
                <span style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.88rem",
                  color: "#6B7280",
                  lineHeight: 1.6,
                }}>{cmd.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      gap: "1.25rem",
      alignItems: "flex-start",
      padding: "1.25rem 1.25rem",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid #111",
      borderRadius: "10px",
    }}>
      <div style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "rgba(220,38,38,0.12)",
        border: "1px solid rgba(220,38,38,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: "'Clash Display', sans-serif",
        fontWeight: 700,
        fontSize: "0.82rem",
        color: "#DC2626",
      }}>{n}</div>
      <div>
        <p style={{
          fontFamily: "'Clash Display', 'Manrope', sans-serif",
          fontWeight: 600,
          fontSize: "0.95rem",
          color: "#e5e5e5",
          marginBottom: "0.35rem",
        }}>{title}</p>
        <p style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: "0.88rem",
          color: "#6B7280",
          lineHeight: 1.75,
        }}>{children}</p>
      </div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: "'Manrope', monospace",
      fontSize: "0.82rem",
      color: "#EF4444",
      background: "rgba(220,38,38,0.08)",
      border: "1px solid rgba(220,38,38,0.18)",
      padding: "0.1rem 0.4rem",
      borderRadius: "4px",
    }}>{children}</span>
  );
}
