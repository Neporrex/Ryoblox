import { useState } from "react";

const LUA_CODE = `local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local MarketplaceService = game:GetService("MarketplaceService")

local Webhook_url = "https://noisy-credit-7178.neporrex.workers.dev/?url=YOUR_WEBHOOK_URL"

-- ─────────────────────────────────────────────────────────────────────────
-- Game pass registry — fill in your real Robux prices
-- ─────────────────────────────────────────────────────────────────────────
local GAME_PASSES = {
    [111111] = { name = "Example Pass", robux = 0 },
}

-- ─────────────────────────────────────────────────────────────────────────
-- Developer product registry — fill in your real Robux prices
-- ─────────────────────────────────────────────────────────────────────────
local DEV_PRODUCTS = {
  [22222222] = { name = "Example Dev Product", robux = 0   },
}

local joinTimes = {}

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

local function sendWebhook(message)
    local success, err = pcall(function()
        HttpService:PostAsync(
            Webhook_url,
            HttpService:JSONEncode({ content = message }),
            Enum.HttpContentType.ApplicationJson
        )
    end)
    if not success then
        warn("[Ryoblox] Webhook failed: " .. tostring(err))
    end
end

-- ── Player join / leave ──────────────────────────────────────────────────
Players.PlayerAdded:Connect(function(player)
    joinTimes[player.UserId] = os.time()
    sendWebhook("New player joined: " .. player.Name)
end)

Players.PlayerRemoving:Connect(function(player)
    local joinTime = joinTimes[player.UserId]
    local playtime = "unknown"
    if joinTime then
        playtime = formatTime(os.time() - joinTime)
        joinTimes[player.UserId] = nil
    end
    sendWebhook("Player left: " .. player.Name .. " | Playtime: " .. playtime)
end)

-- ── Game pass purchases ──────────────────────────────────────────────────
MarketplaceService.PromptGamePassPurchaseFinished:Connect(
    function(player, passId, wasPurchased)
        if not wasPurchased then return end
        local info  = GAME_PASSES[passId]
        local name  = info and info.name  or ("GamePass:" .. tostring(passId))
        local robux = info and info.robux or 0
        sendWebhook(string.format(
            "Robux earned: %d | Player: %s | Item: %s",
            robux, player.Name, name
        ))
    end
)

-- ── Developer product purchases ──────────────────────────────────────────
-- Add your own productFunctions entries below if you have more products.
local productFunctions = {}

MarketplaceService.ProcessReceipt = function(receiptInfo)
    local player = Players:GetPlayerByUserId(receiptInfo.PlayerId)
    if not player then
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end

    local handler = productFunctions[receiptInfo.ProductId]
    local granted = false
    if handler then
        local ok, result = pcall(handler, receiptInfo, player)
        granted = ok and result
    else
        granted = true -- no handler needed, just log the purchase
    end

    if granted then
        local info  = DEV_PRODUCTS[receiptInfo.ProductId]
        local name  = info and info.name  or ("Product:" .. tostring(receiptInfo.ProductId))
        local robux = info and info.robux or 0
        sendWebhook(string.format(
            "Robux earned: %d | Player: %s | Item: %s",
            robux, player.Name, name
        ))
        return Enum.ProductPurchaseDecision.PurchaseGranted
    end

    return Enum.ProductPurchaseDecision.NotProcessedYet
end`;

const KEYWORDS = [
  "local","function","end","if","then","elseif","else","return",
  "and","or","not","nil","true","false","do","while","for","in",
  "repeat","until","break","tostring","pcall","pairs","ipairs","math",
];

const BUILTINS = [
  "game","string","os","Enum","HttpService","Players","MarketplaceService",
  "workspace","print","warn","wait",
];

function highlight(code: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, lineIndex) => {
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < line.length) {
      // Comments
      if (line[i] === "-" && line[i + 1] === "-") {
        nodes.push(<span key={i} style={{ color: "#6A9955", fontStyle: "italic" }}>{line.slice(i)}</span>);
        i = line.length;
        continue;
      }

      // Strings
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length && line[j] !== quote) j++;
        nodes.push(<span key={i} style={{ color: "#CE9178" }}>{line.slice(i, j + 1)}</span>);
        i = j + 1;
        continue;
      }

      // Numbers
      if (/[0-9]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[0-9.]/.test(line[j])) j++;
        nodes.push(<span key={i} style={{ color: "#B5CEA8" }}>{line.slice(i, j)}</span>);
        i = j;
        continue;
      }

      // Words
      if (/[a-zA-Z_]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
        const word = line.slice(i, j);
        const rest = line.slice(j).trimStart();
        const isCall = rest.startsWith("(") || rest.startsWith(":");

        let color = "#9CDCFE";
        if (KEYWORDS.includes(word)) color = "#569CD6";
        else if (BUILTINS.includes(word)) color = "#4EC9B0";
        else if (isCall) color = "#DCDCAA";

        nodes.push(<span key={i} style={{ color }}>{word}</span>);
        i = j;
        continue;
      }

      // Section dividers (─)
      if (line[i] === "─") {
        nodes.push(<span key={i} style={{ color: "#333" }}>{line[i]}</span>);
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
            In your Discord server, go to the channel where you want to receive join events. Open{" "}
            <strong style={{ color: "#e5e5e5" }}>Channel Settings → Integrations → Webhooks → New Webhook</strong>.
            Copy the webhook URL — you'll paste it into the Lua script shortly.
          </Step>

          <Step n={3} title="Paste the script into Roblox Studio">
            Open Roblox Studio and insert a <strong style={{ color: "#e5e5e5" }}>Script</strong> inside{" "}
            <strong style={{ color: "#e5e5e5" }}>ServerScriptService</strong>. Paste the code below, then replace{" "}
            <Code>YOUR_WEBHOOK_URL</Code> with the URL you copied from Discord.
          </Step>

          <Step n={4} title="Configure your game passes and products">
            At the top of the script, fill in the <Code>robux</Code> prices for each game pass and developer product.
            These are the Robux amounts players pay — they'll show up in <Code>/stats_revenue</Code> and the daily digest.
          </Step>

          <Step n={5} title="Run /set-channel and /set-digest-channel in Discord">
            In your Discord server, use <Code>/set-channel</Code> to tell Ryoblox which channel receives the webhook messages,
            then optionally use <Code>/set-digest-channel</Code> to pick a channel for the automatic daily summary posted every midnight UTC.
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

        {/* Webhook format reference */}
        <div style={{
          marginBottom: "1.5rem",
          padding: "1rem 1.25rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid #1a1a1a",
          borderRadius: "10px",
        }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "#4B5563",
            marginBottom: "0.75rem",
          }}>Webhook message formats</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {[
              ["Join",        "New player joined: Username"],
              ["Leave",       "Player left: Username | Playtime: 1h 2m 3s"],
              ["Game pass",   "Robux earned: 99 | Player: Username | Item: VIP Pass"],
              ["Dev product", "Robux earned: 50 | Player: Username | Item: Make it Rain 10k"],
            ].map(([label, example]) => (
              <div key={label} style={{ display: "flex", gap: "0.75rem", alignItems: "baseline" }}>
                <span style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#DC2626",
                  minWidth: "80px",
                  flexShrink: 0,
                }}>{label}</span>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  color: "#6B7280",
                  background: "rgba(255,255,255,0.03)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #111",
                }}>{example}</span>
              </div>
            ))}
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
                transition: "color 0.15s",
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
            fontFamily: "'Fira Code', 'Courier New', monospace",
            fontSize: "0.78rem",
            lineHeight: 1.75,
            margin: 0,
          }}>
            <code>{highlight(LUA_CODE)}</code>
          </pre>
        </div>

        {/* Commands reference */}
        <div style={{ marginBottom: "4rem" }}>
          <p style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            color: "#DC2626",
            marginBottom: "1.25rem",
          }}>Available commands</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              ["/set-channel",         "Point Ryoblox at the channel receiving webhook messages. Requires Manage Server."],
              ["/set-digest-channel",  "Choose a channel for the automatic midnight UTC daily summary."],
              ["/stats_top",           "Bar chart of the top 10 most frequent players for a chosen period."],
              ["/stats_player",        "Cumulative join history and total playtime for a specific player."],
              ["/stats_all",           "Full game traffic as a cumulative chart."],
              ["/stats_today",         "Today's join count, unique players, and top 5."],
              ["/stats_week",          "Last 7 days of traffic as a cumulative chart."],
              ["/stats_heatmap",       "Activity heatmap by hour of day and day of week."],
              ["/stats_revenue",       "Robux earnings overview — totals, top buyers, and top items."],
              ["/leaderboard",         "Text leaderboard of the top 15 players."],
              ["/playtime_top",        "Top 10 players ranked by total in-game playtime."],
              ["/purge",               "Delete messages from a specific user or the entire channel."],
              ["/ping",                "Check bot latency."],
            ].map(([cmd, desc]) => (
              <div key={cmd as string} style={{
                display: "flex",
                gap: "1rem",
                alignItems: "baseline",
                padding: "0.65rem 1rem",
                background: "rgba(255,255,255,0.015)",
                border: "1px solid #111",
                borderRadius: "8px",
              }}>
                <span style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "0.8rem",
                  color: "#DC2626",
                  minWidth: "190px",
                  flexShrink: 0,
                }}>{cmd}</span>
                <span style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.85rem",
                  color: "#6B7280",
                  lineHeight: 1.6,
                }}>{desc}</span>
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
      padding: "1.25rem",
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
      fontFamily: "'Fira Code', monospace",
      fontSize: "0.82rem",
      color: "#EF4444",
      background: "rgba(220,38,38,0.08)",
      border: "1px solid rgba(220,38,38,0.18)",
      padding: "0.1rem 0.4rem",
      borderRadius: "4px",
    }}>{children}</span>
  );
}
