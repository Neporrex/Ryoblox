import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getStats,
  getLeaderboard,
  getToday,
  getPlaytime,
  getRevenue,
  getHeatmap,
  getPlayer,
} from "@/lib/api";

// ─── Constants ────────────────────────────────────────────────────────────────

const API = "https://ryo-api.vercel.app";
const DISCORD_CLIENT_ID = "1492484301600718938";
const REDIRECT_URI = "https://ryoblox.vercel.app/dashboard";
const OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=1492484301600718938&response_type=code&redirect_uri=https%3A%2F%2Fryoblox.vercel.app%2Fdashboard&scope=guilds+guilds.members.read+identify+messages.read`;

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "all" | "week" | "month" | "today";
type Stage = "connect" | "loading" | "pick" | "dashboard";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtSeconds(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return `${h}h ${m}m ${sec}s`;
  if (m) return `${m}m ${sec}s`;
  return `${sec}s`;
}

function fmtHour(h: number): string {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

function getUserAvatarUrl(user: DiscordUser): string {
  if (user.avatar) {
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=128`;
  }
  const defaultIndex = user.discriminator === "0"
    ? (BigInt(user.id) >> 22n) % 6n
    : Number(user.discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
}

const MEDALS = ["🥇", "🥈", "🥉"];
const PERIOD_LABELS: Record<Period, string> = {
  all: "All Time",
  week: "7 Days",
  month: "30 Days",
  today: "Today",
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

function saveSession(token: string, user: DiscordUser, guilds: Guild[]) {
  localStorage.setItem("ryo_token", token);
  localStorage.setItem("ryo_user", JSON.stringify(user));
  localStorage.setItem("ryo_guilds", JSON.stringify(guilds));
}

function loadSession(): { token: string; user: DiscordUser; guilds: Guild[] } | null {
  try {
    const token = localStorage.getItem("ryo_token");
    const user = localStorage.getItem("ryo_user");
    const guilds = localStorage.getItem("ryo_guilds");
    if (token && user && guilds) {
      return { token, user: JSON.parse(user), guilds: JSON.parse(guilds) };
    }
  } catch {}
  return null;
}

function clearSession() {
  localStorage.removeItem("ryo_token");
  localStorage.removeItem("ryo_user");
  localStorage.removeItem("ryo_guilds");
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "12px",
  padding: "1.5rem",
};

const lbl: React.CSSProperties = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "#DC2626",
  marginBottom: "0.4rem",
};

const heading: React.CSSProperties = {
  fontFamily: "'Clash Display', 'Manrope', sans-serif",
  fontWeight: 700,
  color: "#fff",
  letterSpacing: "-0.02em",
};

const muted: React.CSSProperties = {
  fontFamily: "'Manrope', sans-serif",
  color: "#6B7280",
  fontSize: "0.85rem",
  lineHeight: 1.7,
};

const discordBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6rem",
  fontFamily: "'Manrope', sans-serif",
  fontSize: "0.9rem",
  fontWeight: 700,
  padding: "0.85rem 2rem",
  background: "#5865F2",
  borderRadius: "12px",
  color: "#fff",
  textDecoration: "none",
  transition: "all 0.2s",
  cursor: "pointer",
  border: "none",
};

// ─── Discord Icon ─────────────────────────────────────────────────────────────

function DiscordIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <>
      <div style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#5865F2", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

// ─── User Profile Widget ──────────────────────────────────────────────────────

function UserProfileWidget({ user, onLogout }: { user: DiscordUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName = user.global_name || user.username;
  const avatarUrl = getUserAvatarUrl(user);

  return (
    <div ref={ref} style={{ position: "fixed", top: "1.25rem", right: "1.5rem", zIndex: 1000 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.4rem 0.75rem 0.4rem 0.4rem",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "50px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
          }
        }}
      >
        <img
          src={avatarUrl}
          alt={displayName}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <span
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#e5e5e5",
          }}
        >
          {displayName}
        </span>
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="#6B7280"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: "280px",
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            animation: "fadeInDropdown 0.15s ease-out",
          }}
        >
          <style>{`
            @keyframes fadeInDropdown {
              from { opacity: 0; transform: translateY(-6px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Banner area */}
          <div
            style={{
              height: "60px",
              background: "linear-gradient(135deg, #5865F2 0%, #DC2626 100%)",
              position: "relative",
            }}
          />

          {/* Avatar overlapping banner */}
          <div style={{ padding: "0 1rem 1rem", marginTop: "-28px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <img
                src={avatarUrl}
                alt={displayName}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  border: "4px solid #1a1a1a",
                  objectFit: "cover",
                }}
              />
              <div style={{ paddingBottom: "4px" }}>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: "0.95rem",
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {displayName}
                </p>
                <p
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    color: "#6B7280",
                    fontSize: "0.72rem",
                    margin: 0,
                  }}
                >
                  {user.username}
                  {user.discriminator !== "0" ? `#${user.discriminator}` : ""}
                </p>
              </div>
            </div>

            <div
              style={{
                height: "1px",
                background: "rgba(255,255,255,0.06)",
                margin: "0 -0.25rem 0.75rem",
              }}
            />

            {/* Info section */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px",
                padding: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9CA3AF",
                  marginBottom: "0.3rem",
                }}
              >
                Discord ID
              </p>
              <p
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "0.8rem",
                  color: "#d1d5db",
                  margin: 0,
                }}
              >
                {user.id}
              </p>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.6rem",
                background: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.15)",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.15s",
                fontFamily: "'Manrope', sans-serif",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#EF4444",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.15)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.08)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.15)";
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Period Selector ──────────────────────────────────────────────────────────

function PeriodSelector({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
      {(["all", "week", "month", "today"] as Period[]).map((p) => (
        <button key={p} onClick={() => onChange(p)} style={{
          fontFamily: "'Manrope', sans-serif", fontSize: "0.72rem", fontWeight: 600,
          letterSpacing: "0.06em", padding: "0.3rem 0.75rem", borderRadius: "6px",
          border: value === p ? "1px solid #DC2626" : "1px solid rgba(255,255,255,0.08)",
          background: value === p ? "rgba(220,38,38,0.12)" : "transparent",
          color: value === p ? "#DC2626" : "#6B7280", cursor: "pointer", transition: "all 0.15s",
        }}>
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ ...card, flex: 1, minWidth: "120px" }}>
      <p style={lbl}>{label}</p>
      <p style={{ ...heading, fontSize: "1.8rem" }}>{value}</p>
    </div>
  );
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "80px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
          <div title={`${d.label}: ${d.value}`} style={{
            width: "100%", height: `${(d.value / max) * 100}%`,
            background: "rgba(220,38,38,0.7)", borderRadius: "3px 3px 0 0",
            minHeight: d.value > 0 ? "3px" : "0",
          }} />
        </div>
      ))}
    </div>
  );
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────

function HeatmapGrid({ grid }: { grid: number[][] }) {
  const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];
  const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const reordered = DOW_ORDER.map((d) => grid[d]);
  const max = Math.max(...reordered.flat(), 1);
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: "600px" }}>
        <div style={{ display: "flex", marginLeft: "36px", marginBottom: "4px" }}>
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} style={{ flex: 1, textAlign: "center", fontSize: "0.55rem", color: "#4B5563", fontFamily: "'Manrope', sans-serif" }}>
              {h % 3 === 0 ? fmtHour(h) : ""}
            </div>
          ))}
        </div>
        {reordered.map((row, di) => (
          <div key={di} style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
            <div style={{ width: "36px", fontSize: "0.65rem", color: "#6B7280", fontFamily: "'Manrope', sans-serif" }}>{DOW_LABELS[di]}</div>
            {row.map((val, h) => (
              <div key={h} title={`${DOW_LABELS[di]} ${fmtHour(h)}: ${val} joins`} style={{
                flex: 1, height: "18px", borderRadius: "2px", marginRight: "2px",
                background: val === 0 ? "rgba(255,255,255,0.03)" : `rgba(220,38,38,${0.1 + (val / max) * 0.9})`,
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Traffic Chart ────────────────────────────────────────────────────────────

function TrafficChart({ timestamps }: { timestamps: string[] }) {
  if (!timestamps.length) return <p style={muted}>No data.</p>;
  const buckets: Record<string, number> = {};
  for (const ts of timestamps) {
    const d = new Date(ts);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth()).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}-${d.getUTCHours()}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }
  const data = Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => {
    const [, mo, d, h] = k.split("-").map(Number);
    return { label: `${d}/${mo + 1} ${fmtHour(h)}`, value: v };
  });
  return <MiniBarChart data={data.slice(-48)} />;
}

// ─── Player Search ────────────────────────────────────────────────────────────

function PlayerSearch({ guildId }: { guildId: string }) {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const { data, isFetching, error } = useQuery({
    queryKey: ["player", guildId, search],
    queryFn: () => getPlayer(guildId, search),
    enabled: !!search,
  });
  return (
    <div style={card}>
      <p style={lbl}>Player Search</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearch(input.trim())}
          placeholder="Roblox username..."
          style={{ flex: 1, fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", padding: "0.5rem 0.85rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#e5e5e5", outline: "none" }}
        />
        <button onClick={() => setSearch(input.trim())} style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem", fontWeight: 700, padding: "0.5rem 1rem", background: "#DC2626", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
          Search
        </button>
      </div>
      {isFetching && <p style={muted}>Searching…</p>}
      {error && <p style={{ ...muted, color: "#EF4444" }}>Error fetching player.</p>}
      {data && !isFetching && (
        data.total_joins === 0
          ? <p style={muted}>No data found for <strong style={{ color: "#e5e5e5" }}>{search}</strong>.</p>
          : <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <StatPill label="Total Joins" value={data.total_joins} />
              <StatPill label="Playtime" value={fmtSeconds(data.playtime_seconds)} />
            </div>
      )}
    </div>
  );
}

// ─── Connect Screen ───────────────────────────────────────────────────────────

function ConnectScreen({ loading, error }: { loading?: boolean; error?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "75vh", gap: "2rem", padding: "2rem", textAlign: "center" }}>
      <div>
        <p style={{ ...lbl, display: "block", textAlign: "center" }}>Analytics</p>
        <h1 style={{ ...heading, fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "0.75rem" }}>
          Server Dashboard
        </h1>
        <p style={{ ...muted, maxWidth: "380px", margin: "0 auto" }}>
          Sign in with Discord to view analytics for your Roblox game. Only servers with Ryoblox installed will appear.
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", padding: "0.75rem 1.25rem" }}>
          <p style={{ ...muted, color: "#EF4444", margin: 0 }}>{error}</p>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Spinner />
          <span style={muted}>Signing you in…</span>
        </div>
      ) : (
        <a href={OAUTH_URL} style={discordBtn}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
        >
          <DiscordIcon />
          Connect with Discord
        </a>
      )}

      <p style={{ ...muted, fontSize: "0.75rem", maxWidth: "320px" }}>
        We only read your server list. No messages are accessed through OAuth.
      </p>
    </div>
  );
}

// ─── Guild Picker ─────────────────────────────────────────────────────────────

function GuildPicker({ guilds, onSelect }: { guilds: Guild[]; onSelect: (g: Guild) => void }) {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "7rem 1.5rem 5rem" }}>
      <p style={lbl}>Your Servers</p>
      <h1 style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.2rem)", marginBottom: "0.5rem" }}>
        Select a Server
      </h1>
      <p style={{ ...muted, marginBottom: "2rem" }}>
        Servers where Ryoblox is installed and has data.
      </p>

      {guilds.length === 0 ? (
        <div style={{ ...card, textAlign: "center", padding: "3rem" }}>
          <p style={{ ...muted, marginBottom: "1.25rem" }}>
            No servers found with Ryoblox installed.
          </p>
          <a href="https://discord.com/oauth2/authorize?client_id=1492484301600718938&scope=bot&permissions=6761431819611478"
            target="_blank" rel="noopener noreferrer" style={{ ...discordBtn, fontSize: "0.82rem", padding: "0.65rem 1.25rem" }}>
            <DiscordIcon size={16} />
            Add Ryoblox to a Server
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {guilds.map((g) => (
            <button key={g.id} onClick={() => onSelect(g)} style={{
              display: "flex", alignItems: "center", gap: "1rem",
              padding: "1rem 1.25rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px", cursor: "pointer",
              transition: "all 0.15s", width: "100%", textAlign: "left",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.35)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; }}
            >
              {g.icon ? (
                <img src={g.icon} alt={g.name} style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "rgba(220,38,38,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700, color: "#DC2626", fontSize: "1rem" }}>{g.name.charAt(0)}</span>
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: "#e5e5e5", fontSize: "0.9rem", margin: 0 }}>{g.name}</p>
                <p style={{ ...muted, fontSize: "0.72rem", margin: 0 }}>{g.owner ? "Owner" : "Member"}</p>
              </div>
              <svg width="16" height="16" fill="none" stroke="#4B5563" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Content ────────────────────────────────────────────────────────

function DashboardContent({ guildId, guildName, onBack }: { guildId: string; guildName: string; onBack: () => void }) {
  const [period, setPeriod] = useState<Period>("all");

  const stats       = useQuery({ queryKey: ["stats",       guildId, period], queryFn: () => getStats(guildId, period) });
  const leaderboard = useQuery({ queryKey: ["leaderboard", guildId, period], queryFn: () => getLeaderboard(guildId, period, 15) });
  const today       = useQuery({ queryKey: ["today",       guildId],         queryFn: () => getToday(guildId) });
  const playtime    = useQuery({ queryKey: ["playtime",    guildId],         queryFn: () => getPlaytime(guildId, 10) });
  const revenue     = useQuery({ queryKey: ["revenue",     guildId, period], queryFn: () => getRevenue(guildId, period) });
  const heatmap     = useQuery({ queryKey: ["heatmap",     guildId, period], queryFn: () => getHeatmap(guildId, period) });

  const sTitle: React.CSSProperties = { ...heading, fontSize: "1rem", marginBottom: "1rem", paddingLeft: "0.85rem", borderLeft: "2px solid #DC2626" };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "7rem 1.5rem 5rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem", padding: 0 }}>
            <svg width="14" height="14" fill="none" stroke="#6B7280" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
            <span style={{ ...muted, fontSize: "0.78rem" }}>All servers</span>
          </button>
          <p style={lbl}>Dashboard</p>
          <h1 style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "0.25rem" }}>{guildName}</h1>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Stat pills */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <StatPill label="Today's Joins"  value={today.data?.total  ?? "—"} />
        <StatPill label="Unique Today"   value={today.data?.unique ?? "—"} />
        <StatPill label="Total Joins"    value={stats.data?.total  ?? "—"} />
        <StatPill label="Unique Players" value={stats.data?.unique ?? "—"} />
        {(revenue.data?.total_robux ?? 0) > 0 && (
          <StatPill label="Total Robux" value={`${revenue.data.total_robux.toLocaleString()} R$`} />
        )}
      </div>

      {/* Traffic + Leaderboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div style={card}>
          <h2 style={sTitle}>Traffic — {PERIOD_LABELS[period]}</h2>
          {stats.isFetching ? <p style={muted}>Loading…</p> : <TrafficChart timestamps={stats.data?.timestamps ?? []} />}
        </div>
        <div style={card}>
          <h2 style={sTitle}>Top Players — {PERIOD_LABELS[period]}</h2>
          {leaderboard.isFetching ? <p style={muted}>Loading…</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {(leaderboard.data?.leaderboard ?? []).slice(0, 10).map((p: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ width: "20px", textAlign: "center", fontSize: "0.85rem" }}>
                      {i < 3 ? MEDALS[i] : <span style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }}>{i + 1}</span>}
                    </span>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: "#d1d5db" }}>{p.username}</span>
                  </div>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.78rem", color: "#6B7280" }}>{p.joins} join{p.joins !== 1 ? "s" : ""}</span>
                </div>
              ))}
              {!leaderboard.data?.leaderboard?.length && <p style={muted}>No data.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Today + Playtime */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div style={card}>
          <h2 style={sTitle}>Today's Top Players</h2>
          {today.isFetching ? <p style={muted}>Loading…</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {(today.data?.top ?? []).map((p: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: "#d1d5db" }}>{i < 3 ? MEDALS[i] : `${i + 1}.`} {p.username}</span>
                  <span style={{ ...muted, fontSize: "0.78rem" }}>{p.joins} joins</span>
                </div>
              ))}
              {!today.data?.top?.length && <p style={muted}>No joins today yet.</p>}
            </div>
          )}
        </div>
        <div style={card}>
          <h2 style={sTitle}>⏱ Playtime Top 10</h2>
          {playtime.isFetching ? <p style={muted}>Loading…</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {(playtime.data?.leaderboard ?? []).map((p: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: "#d1d5db" }}>{i < 3 ? MEDALS[i] : `${i + 1}.`} {p.username}</span>
                  <span style={{ ...muted, fontSize: "0.78rem" }}>{fmtSeconds(p.seconds)}</span>
                </div>
              ))}
              {!playtime.data?.leaderboard?.length && <p style={muted}>No playtime data.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Revenue */}
      {(revenue.data?.count ?? 0) > 0 && (
        <div style={{ ...card, marginBottom: "1rem" }}>
          <h2 style={sTitle}>💰 Revenue — {PERIOD_LABELS[period]}</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <StatPill label="Total Robux" value={`${revenue.data.total_robux.toLocaleString()} R$`} />
            <StatPill label="Transactions" value={revenue.data.count} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <p style={{ ...lbl, marginBottom: "0.6rem" }}>Top Buyers</p>
              {revenue.data.top_buyers.map((b: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.82rem", color: "#d1d5db" }}>{i < 3 ? MEDALS[i] : `${i + 1}.`} {b.username}</span>
                  <span style={muted}>{b.robux.toLocaleString()} R$</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ ...lbl, marginBottom: "0.6rem" }}>Top Items</p>
              {revenue.data.top_items.map((it: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.82rem", color: "#d1d5db" }}>{i < 3 ? MEDALS[i] : `${i + 1}.`} {it.item}</span>
                  <span style={muted}>{it.robux.toLocaleString()} R$</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div style={{ ...card, marginBottom: "1rem" }}>
        <h2 style={sTitle}>Activity Heatmap — {PERIOD_LABELS[period]}</h2>
        {heatmap.isFetching ? <p style={muted}>Loading…</p>
          : heatmap.data?.grid ? <HeatmapGrid grid={heatmap.data.grid} />
          : <p style={muted}>No data.</p>}
      </div>

      {/* Player Search */}
      <PlayerSearch guildId={guildId} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [stage, setStage]                 = useState<Stage>("connect");
  const [token, setToken]                 = useState<string | null>(null);
  const [user, setUser]                   = useState<DiscordUser | null>(null);
  const [guilds, setGuilds]               = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [error, setError]                 = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setToken(session.token);
      setUser(session.user);
      setGuilds(session.guilds);
      setStage("pick");
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;

    window.history.replaceState({}, "", window.location.pathname);
    setStage("loading");
    setError(null);

    fetch(`${API}/api/auth/callback?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then(async (data) => {
        if (data.error) throw new Error(data.error);
        const accessToken: string = data.access_token;
        setToken(accessToken);

        // Fetch user info
        const userRes = await fetch("https://discord.com/api/v10/users/@me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userRes.ok) throw new Error("Failed to fetch user info");
        const userData: DiscordUser = await userRes.json();
        setUser(userData);

        // Fetch guilds
        const guildsRes = await fetch(`${API}/api/guilds`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const guildsData = await guildsRes.json();
        if (guildsData.error) throw new Error(guildsData.error);

        setGuilds(guildsData.guilds);
        saveSession(accessToken, userData, guildsData.guilds);
        setStage("pick");
      })
      .catch((err) => {
        setError(err.message || "Authentication failed. Please try again.");
        setStage("connect");
      });
  }, []);

  const handleLogout = () => {
    clearSession();
    setToken(null);
    setUser(null);
    setGuilds([]);
    setSelectedGuild(null);
    setStage("connect");
  };

  const isLoggedIn = stage !== "connect" && stage !== "loading" && user;

  return (
    <div className="page-content">
      {isLoggedIn && <UserProfileWidget user={user} onLogout={handleLogout} />}

      {stage === "connect"   && <ConnectScreen error={error ?? undefined} />}
      {stage === "loading"   && <ConnectScreen loading />}
      {stage === "pick"      && <GuildPicker guilds={guilds} onSelect={(g) => { setSelectedGuild(g); setStage("dashboard"); }} />}
      {stage === "dashboard" && selectedGuild && (
        <DashboardContent
          guildId={selectedGuild.id}
          guildName={selectedGuild.name}
          onBack={() => setStage("pick")}
        />
      )}
    </div>
  );
}
