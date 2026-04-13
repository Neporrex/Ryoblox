import { useState } from "react";
import { useLocation } from "wouter";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "all" | "week" | "month" | "today";

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

const MEDALS = ["🥇", "🥈", "🥉"];
const PERIOD_LABELS: Record<Period, string> = {
  all: "All Time",
  week: "7 Days",
  month: "30 Days",
  today: "Today",
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "12px",
  padding: "1.5rem",
};

const label: React.CSSProperties = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
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

// ─── Period Selector ─────────────────────────────────────────────────────────

function PeriodSelector({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
      {(["all", "week", "month", "today"] as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            padding: "0.3rem 0.75rem",
            borderRadius: "6px",
            border: value === p ? "1px solid #DC2626" : "1px solid rgba(255,255,255,0.08)",
            background: value === p ? "rgba(220,38,38,0.12)" : "transparent",
            color: value === p ? "#DC2626" : "#6B7280",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────

function StatPill({ label: lbl, value }: { label: string; value: string | number }) {
  return (
    <div style={{ ...card, flex: 1, minWidth: "120px" }}>
      <p style={label}>{lbl}</p>
      <p style={{ ...heading, fontSize: "1.8rem" }}>{value}</p>
    </div>
  );
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "80px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
          <div
            title={`${d.label}: ${d.value}`}
            style={{
              width: "100%",
              height: `${(d.value / max) * 100}%`,
              background: "rgba(220,38,38,0.7)",
              borderRadius: "3px 3px 0 0",
              transition: "height 0.3s ease",
              minHeight: d.value > 0 ? "3px" : "0",
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Heatmap Grid ─────────────────────────────────────────────────────────────

function HeatmapGrid({ grid }: { grid: number[][] }) {
  // grid is [dow 0=Sun..6=Sat][hour]
  const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];
  const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const reordered = DOW_ORDER.map((d) => grid[d]);
  const max = Math.max(...reordered.flat(), 1);

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: "600px" }}>
        {/* Hour labels */}
        <div style={{ display: "flex", marginLeft: "36px", marginBottom: "4px" }}>
          {Array.from({ length: 24 }, (_, h) => (
            <div
              key={h}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: "0.55rem",
                color: "#4B5563",
                fontFamily: "'Manrope', sans-serif",
              }}
            >
              {h % 3 === 0 ? fmtHour(h) : ""}
            </div>
          ))}
        </div>
        {reordered.map((row, di) => (
          <div key={di} style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
            <div style={{ width: "36px", fontSize: "0.65rem", color: "#6B7280", fontFamily: "'Manrope', sans-serif" }}>
              {DOW_LABELS[di]}
            </div>
            {row.map((val, h) => {
              const intensity = val / max;
              return (
                <div
                  key={h}
                  title={`${DOW_LABELS[di]} ${fmtHour(h)}: ${val} joins`}
                  style={{
                    flex: 1,
                    height: "18px",
                    borderRadius: "2px",
                    marginRight: "2px",
                    background: val === 0
                      ? "rgba(255,255,255,0.03)"
                      : `rgba(220,38,38,${0.1 + intensity * 0.9})`,
                    transition: "background 0.2s",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Traffic Sparkline ────────────────────────────────────────────────────────

function TrafficChart({ timestamps }: { timestamps: string[] }) {
  if (!timestamps.length) return <p style={muted}>No data.</p>;

  // Bucket by hour
  const buckets: Record<string, number> = {};
  for (const ts of timestamps) {
    const d = new Date(ts);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}-${d.getUTCHours()}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }

  const sorted = Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b));
  const data = sorted.map(([k, v]) => {
    const [y, mo, d, h] = k.split("-").map(Number);
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
      <p style={label}>Player Search</p>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setSearch(input.trim())}
          placeholder="Roblox username..."
          style={{
            flex: 1,
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.85rem",
            padding: "0.5rem 0.85rem",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            color: "#e5e5e5",
            outline: "none",
          }}
        />
        <button
          onClick={() => setSearch(input.trim())}
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "0.5rem 1rem",
            background: "#DC2626",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {isFetching && <p style={muted}>Searching…</p>}
      {error && <p style={{ ...muted, color: "#EF4444" }}>Error fetching player.</p>}
      {data && !isFetching && (
        <div>
          {data.total_joins === 0 ? (
            <p style={muted}>No data found for <strong style={{ color: "#e5e5e5" }}>{search}</strong>.</p>
          ) : (
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <StatPill label="Total Joins" value={data.total_joins} />
              <StatPill label="Playtime" value={fmtSeconds(data.playtime_seconds)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Entry Screen ─────────────────────────────────────────────────────────────

function EntryScreen({ onEnter }: { onEnter: (guildId: string) => void }) {
  const [input, setInput] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", gap: "2rem", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ ...label, textAlign: "center", display: "block" }}>Analytics</p>
        <h1 style={{ ...heading, fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "0.5rem" }}>
          Server Dashboard
        </h1>
        <p style={{ ...muted, maxWidth: "400px" }}>
          Connect with Discord to view your server's Roblox game analytics, or enter your Guild ID directly.
        </p>
      </div>

      <a
        href="https://discord.com/oauth2/authorize?client_id=1492484301600718938&permissions=6761431819611478&response_type=code&redirect_uri=https%3A%2F%2Fryoblox.vercel.app&integration_type=0&scope=guilds+bot+guilds.members.read+identify+messages.read"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.6rem",
          fontFamily: "'Manrope', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 700,
          padding: "0.75rem 1.75rem",
          background: "#5865F2",
          borderRadius: "10px",
          color: "#fff",
          textDecoration: "none",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
        </svg>
        Connect with Discord
      </a>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", maxWidth: "400px" }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
        <span style={{ ...muted, fontSize: "0.75rem" }}>or</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", width: "100%", maxWidth: "400px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && input.trim() && onEnter(input.trim())}
          placeholder="Enter Guild ID..."
          style={{
            flex: 1,
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.85rem",
            padding: "0.65rem 1rem",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            color: "#e5e5e5",
            outline: "none",
          }}
        />
        <button
          onClick={() => input.trim() && onEnter(input.trim())}
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 700,
            padding: "0.65rem 1.25rem",
            background: "#DC2626",
            border: "none",
            borderRadius: "10px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          View
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard Content ────────────────────────────────────────────────────────

function DashboardContent({ guildId }: { guildId: string }) {
  const [period, setPeriod] = useState<Period>("all");

  const stats = useQuery({ queryKey: ["stats", guildId, period], queryFn: () => getStats(guildId, period) });
  const leaderboard = useQuery({ queryKey: ["leaderboard", guildId, period], queryFn: () => getLeaderboard(guildId, period, 15) });
  const today = useQuery({ queryKey: ["today", guildId], queryFn: () => getToday(guildId) });
  const playtime = useQuery({ queryKey: ["playtime", guildId], queryFn: () => getPlaytime(guildId, 10) });
  const revenue = useQuery({ queryKey: ["revenue", guildId, period], queryFn: () => getRevenue(guildId, period) });
  const heatmap = useQuery({ queryKey: ["heatmap", guildId, period], queryFn: () => getHeatmap(guildId, period) });

  const sectionTitle = (title: string): React.CSSProperties => ({
    ...heading,
    fontSize: "1rem",
    marginBottom: "1rem",
    paddingLeft: "0.85rem",
    borderLeft: "2px solid #DC2626",
  });

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "7rem 1.5rem 5rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={label}>Dashboard</p>
          <h1 style={{ ...heading, fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "0.25rem" }}>
            Server Analytics
          </h1>
          <p style={{ ...muted, fontSize: "0.78rem" }}>
            Guild ID: <code style={{ color: "#4B5563", fontFamily: "monospace" }}>{guildId}</code>
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Today's quick stats */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <StatPill label="Today's Joins" value={today.data?.total ?? "—"} />
        <StatPill label="Unique Today" value={today.data?.unique ?? "—"} />
        <StatPill label="Total Joins" value={stats.data?.total ?? "—"} />
        <StatPill label="Unique Players" value={stats.data?.unique ?? "—"} />
        {revenue.data?.total_robux != null && (
          <StatPill label="Total Robux" value={`${revenue.data.total_robux.toLocaleString()} R$`} />
        )}
      </div>

      {/* Traffic + Leaderboard */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>

        {/* Traffic Chart */}
        <div style={card}>
          <h2 style={sectionTitle("Traffic")}>Traffic — {PERIOD_LABELS[period]}</h2>
          {stats.isFetching
            ? <p style={muted}>Loading…</p>
            : <TrafficChart timestamps={stats.data?.timestamps ?? []} />
          }
        </div>

        {/* Leaderboard */}
        <div style={card}>
          <h2 style={sectionTitle("Leaderboard")}>Top Players — {PERIOD_LABELS[period]}</h2>
          {leaderboard.isFetching
            ? <p style={muted}>Loading…</p>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {(leaderboard.data?.leaderboard ?? []).slice(0, 10).map((p: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ width: "20px", textAlign: "center", fontSize: "0.85rem" }}>
                        {i < 3 ? MEDALS[i] : <span style={{ color: "#4B5563", fontFamily: "'Manrope', sans-serif", fontSize: "0.75rem" }}>{i + 1}</span>}
                      </span>
                      <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: "#d1d5db" }}>{p.username}</span>
                    </div>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.78rem", color: "#6B7280" }}>
                      {p.joins} join{p.joins !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
                {!leaderboard.data?.leaderboard?.length && <p style={muted}>No data.</p>}
              </div>
            )
          }
        </div>
      </div>

      {/* Today's Top + Playtime */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>

        {/* Today's Top 5 */}
        <div style={card}>
          <h2 style={sectionTitle("Today")}>Today's Top Players</h2>
          {today.isFetching
            ? <p style={muted}>Loading…</p>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {(today.data?.top ?? []).map((p: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: "#d1d5db" }}>
                      {i < 3 ? MEDALS[i] : `${i + 1}.`} {p.username}
                    </span>
                    <span style={{ ...muted, fontSize: "0.78rem" }}>{p.joins} joins</span>
                  </div>
                ))}
                {!today.data?.top?.length && <p style={muted}>No joins today yet.</p>}
              </div>
            )
          }
        </div>

        {/* Playtime Leaderboard */}
        <div style={card}>
          <h2 style={sectionTitle("Playtime")}>⏱ Playtime Top 10</h2>
          {playtime.isFetching
            ? <p style={muted}>Loading…</p>
            : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {(playtime.data?.leaderboard ?? []).map((p: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.85rem", color: "#d1d5db" }}>
                      {i < 3 ? MEDALS[i] : `${i + 1}.`} {p.username}
                    </span>
                    <span style={{ ...muted, fontSize: "0.78rem" }}>{fmtSeconds(p.seconds)}</span>
                  </div>
                ))}
                {!playtime.data?.leaderboard?.length && <p style={muted}>No playtime data.</p>}
              </div>
            )
          }
        </div>
      </div>

      {/* Revenue */}
      {(revenue.data?.count ?? 0) > 0 && (
        <div style={{ ...card, marginBottom: "1rem" }}>
          <h2 style={sectionTitle("Revenue")}>💰 Revenue — {PERIOD_LABELS[period]}</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <StatPill label="Total Robux" value={`${revenue.data.total_robux.toLocaleString()} R$`} />
            <StatPill label="Transactions" value={revenue.data.count} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <p style={{ ...label, marginBottom: "0.6rem" }}>Top Buyers</p>
              {revenue.data.top_buyers.map((b: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.82rem", color: "#d1d5db" }}>
                    {i < 3 ? MEDALS[i] : `${i + 1}.`} {b.username}
                  </span>
                  <span style={muted}>{b.robux.toLocaleString()} R$</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ ...label, marginBottom: "0.6rem" }}>Top Items</p>
              {revenue.data.top_items.map((it: any, i: number) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontSize: "0.82rem", color: "#d1d5db" }}>
                    {i < 3 ? MEDALS[i] : `${i + 1}.`} {it.item}
                  </span>
                  <span style={muted}>{it.robux.toLocaleString()} R$</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Heatmap */}
      <div style={{ ...card, marginBottom: "1rem" }}>
        <h2 style={sectionTitle("Heatmap")}>Activity Heatmap — {PERIOD_LABELS[period]}</h2>
        {heatmap.isFetching
          ? <p style={muted}>Loading…</p>
          : heatmap.data?.grid
            ? <HeatmapGrid grid={heatmap.data.grid} />
            : <p style={muted}>No data.</p>
        }
      </div>

      {/* Player Search */}
      <PlayerSearch guildId={guildId} />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [guildId, setGuildId] = useState<string | null>(null);

  if (!guildId) {
    return <div className="page-content"><EntryScreen onEnter={setGuildId} /></div>;
  }

  return (
    <div className="page-content">
      <DashboardContent guildId={guildId} />
    </div>
  );
}
