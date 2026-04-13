import { useState, useEffect } from "react";

const API = "https://ryo-api.vercel.app";

interface LeaderboardEntry {
  username: string;
  guild_name?: string;
  value: number;
}

type Tab = "joins" | "playtime" | "revenue";

export default function Global() {
  const [tab, setTab] = useState<Tab>("joins");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/global/leaderboard?type=${tab}`)
      .then((r) => r.json())
      .then((d) => {
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, [tab]);

  const formatValue = (v: number) => {
    if (tab === "playtime") {
      const h = Math.floor(v / 3600);
      const m = Math.floor((v % 3600) / 60);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    }
    if (tab === "revenue") return `${v.toLocaleString()} R$`;
    return v.toLocaleString();
  };

  const rankClass = (i: number) => {
    if (i === 0) return "gold";
    if (i === 1) return "silver";
    if (i === 2) return "bronze";
    return "";
  };

  const rankLabel = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `#${i + 1}`;
  };

  return (
    <div className="global-page">
      <p className="section-label" style={{ color: "#dc2626", fontWeight: 700, fontSize: "0.8rem", letterSpacing: 2, textTransform: "uppercase" }}>
        WORLDWIDE
      </p>
      <h1>Global Leaderboard</h1>
      <p className="global-sub">
        Top players across all servers using Ryoblox. Compete to reach #1!
      </p>

      <div className="global-tabs">
        <button className={`global-tab${tab === "joins" ? " active" : ""}`} onClick={() => setTab("joins")}>
          🎮 Most Joins
        </button>
        <button className={`global-tab${tab === "playtime" ? " active" : ""}`} onClick={() => setTab("playtime")}>
          ⏱️ Most Playtime
        </button>
        <button className={`global-tab${tab === "revenue" ? " active" : ""}`} onClick={() => setTab("revenue")}>
          💰 Most Revenue
        </button>
      </div>

      <div className="global-board">
        {loading ? (
          <div className="global-empty">Loading...</div>
        ) : data.length === 0 ? (
          <div className="global-empty">No data yet. Start playing to appear here!</div>
        ) : (
          data.map((entry, i) => (
            <div className="global-row" key={`${entry.username}-${i}`}>
              <div className={`global-rank ${rankClass(i)}`}>{rankLabel(i)}</div>
              <div>
                <div className="global-name">{entry.username}</div>
                {entry.guild_name && <div className="global-game">{entry.guild_name}</div>}
              </div>
              <div className="global-value">{formatValue(entry.value)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
