import { useState } from "react";

const LUA_CODE = `local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

-- Paste your webhook URL after ?url= below
local Webhook_url = "https://noisy-credit-7178.neporrex.workers.dev/?url=YOUR_WEBHOOK_URL"

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

const KEYWORDS = ["local", "function", "end", "if", "then", "elseif", "else", "return", "and", "or", "not", "nil", "true", "false", "do", "while", "for", "in", "repeat", "until", "break"];

function highlight(code: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, lineIndex) => {
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < line.length) {
      if (line[i] === "-" && line[i + 1] === "-") {
        nodes.push(<span key={i} style={{ color: "#6A9955" }}>{line.slice(i)}</span>);
        i = line.length;
        continue;
      }

      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length && line[j] !== quote) j++;
        nodes.push(<span key={i} style={{ color: "#CE9178" }}>{line.slice(i, j + 1)}</span>);
        i = j + 1;
        continue;
      }

      if (/[0-9]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[0-9.]/.test(line[j])) j++;
        nodes.push(<span key={i} style={{ color: "#B5CEA8" }}>{line.slice(i, j)}</span>);
        i = j;
        continue;
      }

      if (/[a-zA-Z_]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
        const word = line.slice(i, j);
        const rest = line.slice(j).trimStart();
        const isCall = rest.startsWith("(") || rest.startsWith(":");

        if (KEYWORDS.includes(word)) {
          nodes.push(<span key={i} style={{ color: "#569CD6" }}>{word}</span>);
        } else if (["game", "math", "string", "os", "Enum", "HttpService", "Players"].includes(word)) {
          nodes.push(<span key={i} style={{ color: "#4EC9B0" }}>{word}</span>);
        } else if (isCall) {
          nodes.push(<span key={i} style={{ color: "#DCDCAA" }}>{word}</span>);
        } else {
          nodes.push(<span key={i} style={{ color: "#9CDCFE" }}>{word}</span>);
        }
        i = j;
        continue;
      }

      if (/[+\-*/%^#&|~<>=]/.test(line[i])) {
        nodes.push(<span key={i} style={{ color: "#D4D4D4" }}>{line[i]}</span>);
        i++;
        continue;
      }

      nodes.push(<span key={i} style={{ color: "#D4D4D4" }}>{line[i]}</span>);
      i++;
    }

    return <div key={lineIndex} style={{ minHeight: "1.75em" }}>{nodes}</div>;
  });
}

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

          <Step n={3} title="Paste the script into Roblox Studio">
            Open Roblox Studio and insert a <strong style={{ color: "#e5e5e5" }}>Script</strong> inside <strong style={{ color: "#e5e5e5" }}>ServerScriptService</strong>. Paste the code below, then replace <Code>YOUR_WEBHOOK_URL</Code> with the URL you copied from Discord.
          </Step>
        </div>

        {/* Proxy Warning */}
        <div style={{
          marginBottom: "1.5rem",
          padding: "1rem 1.25rem",
          background: "rgba(220,38,38,0.08)",
          border: "2px solid rgba(220,38,38,0.5)",
          borderRadius: "10px",
          display: "flex",
          gap: "0.75rem",
          alignItems: "flex-start",
        }}>
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚠️</span>
          <div style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.88rem", lineHeight: 1.75 }}>
            <strong style={{ color: "#EF4444", fontWeight: 800, fontSize: "0.92rem" }}>
              Roblox blocks direct Discord webhook URLs.
            </strong>{" "}
            <span style={{ color: "#FCA5A5" }}>
              You must use a proxy. The script already includes our free proxy — just replace{" "}
            </span>
            <Code>YOUR_WEBHOOK_URL</Code>
            <span style={{ color: "#FCA5A5" }}> with your actual Discord webhook URL and you're good to go.</span>
            <br />
            <span style={{ color: "#6B7280" }}>
              Our proxy:{" "}
              <span style={{
                fontFamily: "monospace",
                color: "#9CA3AF",
                background: "rgba(255,255,255,0.04)",
                padding: "0.1rem 0.4rem",
                borderRadius: "4px",
                fontSize: "0.8rem",
              }}>
                https://noisy-credit-7178.neporrex.workers.dev/
              </span>
            </span>
          </div>
        </div>

        {/* Code block */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.6rem",
          }}>
            <span style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: "0.78rem",
              color: "#4B5563",
              letterSpacing: "0.05em",
            }}>ServerScriptService / Script</span>
            <button
              onClick={copyCode}
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: copied ? "#4ADE80" : "#9CA3AF",
                background: "transparent",
                border: "none",
                cursor: "pointer",
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
            lineHeight: 1.75,
            margin: 0,
          }}>
            <code>{highlight(LUA_CODE)}</code>
          </pre>
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
