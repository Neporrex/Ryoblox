import discord
from discord.ext import commands
from discord import app_commands
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import io
import json
import os
import sqlite3
from datetime import datetime, timedelta, timezone

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

DB_FILE = "analytics.db"
CONFIG_FILE = "config.json"


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE IF NOT EXISTS joins (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            username  TEXT    NOT NULL,
            ts        TEXT    NOT NULL
        )
    """)
    conn.commit()
    return conn


def load_config() -> dict:
    if not os.path.exists(CONFIG_FILE):
        return {}
    with open(CONFIG_FILE) as f:
        return json.load(f)


def log_join(username: str):
    with get_db() as conn:
        conn.execute(
            "INSERT INTO joins (username, ts) VALUES (?, ?)",
            (username, datetime.now(timezone.utc).isoformat()),
        )
        conn.commit()


# ---------------------------------------------------------------------------
# Query helpers
# ---------------------------------------------------------------------------

def query_top(limit: int = 10) -> list[tuple[str, int]]:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT username, COUNT(*) AS c FROM joins GROUP BY LOWER(username) ORDER BY c DESC LIMIT ?",
            (limit,),
        ).fetchall()
    return [(r["username"], r["c"]) for r in rows]


def query_player(username: str) -> tuple[int, list[tuple[str, int]]]:
    with get_db() as conn:
        total = conn.execute(
            "SELECT COUNT(*) FROM joins WHERE LOWER(username) = LOWER(?)",
            (username,),
        ).fetchone()[0]
        rows = conn.execute(
            """
            SELECT DATE(ts) AS d, COUNT(*) AS c
            FROM joins WHERE LOWER(username) = LOWER(?)
            GROUP BY d ORDER BY d
            """,
            (username,),
        ).fetchall()
    return total, [(r["d"], r["c"]) for r in rows]


def query_overall() -> tuple[int, int, list[tuple[str, int]]]:
    with get_db() as conn:
        total = conn.execute("SELECT COUNT(*) FROM joins").fetchone()[0]
        unique = conn.execute("SELECT COUNT(DISTINCT LOWER(username)) FROM joins").fetchone()[0]
        rows = conn.execute(
            "SELECT DATE(ts) AS d, COUNT(*) AS c FROM joins GROUP BY d ORDER BY d"
        ).fetchall()
    return total, unique, [(r["d"], r["c"]) for r in rows]


def query_today() -> tuple[int, int, list[tuple[str, int]]]:
    today = datetime.now(timezone.utc).date().isoformat()
    with get_db() as conn:
        total = conn.execute(
            "SELECT COUNT(*) FROM joins WHERE DATE(ts) = ?", (today,)
        ).fetchone()[0]
        unique = conn.execute(
            "SELECT COUNT(DISTINCT LOWER(username)) FROM joins WHERE DATE(ts) = ?", (today,)
        ).fetchone()[0]
        rows = conn.execute(
            """
            SELECT LOWER(username) AS u, COUNT(*) AS c
            FROM joins WHERE DATE(ts) = ?
            GROUP BY u ORDER BY c DESC LIMIT 5
            """,
            (today,),
        ).fetchall()
    return total, unique, [(r["u"], r["c"]) for r in rows]


def query_week() -> tuple[int, int, list[tuple[str, int]]]:
    since = (datetime.now(timezone.utc) - timedelta(days=6)).date().isoformat()
    with get_db() as conn:
        total = conn.execute(
            "SELECT COUNT(*) FROM joins WHERE DATE(ts) >= ?", (since,)
        ).fetchone()[0]
        unique = conn.execute(
            "SELECT COUNT(DISTINCT LOWER(username)) FROM joins WHERE DATE(ts) >= ?", (since,)
        ).fetchone()[0]
        rows = conn.execute(
            """
            SELECT DATE(ts) AS d, COUNT(*) AS c
            FROM joins WHERE DATE(ts) >= ?
            GROUP BY d ORDER BY d
            """,
            (since,),
        ).fetchall()
    return total, unique, [(r["d"], r["c"]) for r in rows]


# ---------------------------------------------------------------------------
# Chart helpers
# ---------------------------------------------------------------------------

def _dark(fig, ax):
    fig.patch.set_facecolor("#0b0b0f")
    ax.set_facecolor("#0b0b0f")
    ax.tick_params(colors="#666", labelsize=9)
    ax.xaxis.label.set_color("#666")
    ax.yaxis.label.set_color("#666")
    ax.title.set_color("#e0e0e0")
    for sp in ax.spines.values():
        sp.set_edgecolor("#1e1e1e")
    ax.grid(axis="y", color="#1a1a1a", linewidth=0.8, linestyle="--")


def to_file(fig, name: str) -> discord.File:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", dpi=150)
    buf.seek(0)
    plt.close(fig)
    return discord.File(buf, filename=name)


# ---------------------------------------------------------------------------
# Bot
# ---------------------------------------------------------------------------

config = load_config()
TARGET_CHANNEL_ID: int = config.get("target_channel_id", 0)

if not TARGET_CHANNEL_ID:
    print("[Ryoblox] WARNING: target_channel_id not set in config.json — webhook listening disabled.")


class Ryoblox(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        await self.tree.sync()
        print(f"[Ryoblox] Online — {len(self.guilds)} server(s) | Slash commands synced")


bot = Ryoblox()

# ---------------------------------------------------------------------------
# Webhook listener
# ---------------------------------------------------------------------------

@bot.event
async def on_message(message: discord.Message):
    if not TARGET_CHANNEL_ID or message.channel.id != TARGET_CHANNEL_ID:
        return
    if message.webhook_id is None:
        return
    for line in message.content.splitlines():
        line = line.strip()
        if line.lower().startswith("new player joined:"):
            username = line.split(":", 1)[1].strip()
            if username:
                log_join(username)
                print(f"[Ryoblox] Logged join: {username}")

# ---------------------------------------------------------------------------
# /ping  —  latency check
# ---------------------------------------------------------------------------

@bot.tree.command(name="ping", description="Check if the bot is alive and see its latency")
async def ping(interaction: discord.Interaction):
    ms = round(bot.latency * 1000)
    embed = discord.Embed(
        description=f"Pong! Latency is **{ms}ms**.",
        color=0xDC2626,
    )
    await interaction.response.send_message(embed=embed)

# ---------------------------------------------------------------------------
# /help  —  command list
# ---------------------------------------------------------------------------

@bot.tree.command(name="help", description="List all Ryoblox commands")
async def help_cmd(interaction: discord.Interaction):
    embed = discord.Embed(title="Ryoblox — Commands", color=0xDC2626)
    embed.add_field(name="/stats_top", value="Bar chart of the top 10 most frequent players.", inline=False)
    embed.add_field(name="/stats_player [username]", value="Join history chart for a specific Roblox player.", inline=False)
    embed.add_field(name="/stats_all", value="Overall game traffic chart and totals.", inline=False)
    embed.add_field(name="/stats_today", value="Today's join count, unique players, and top 5 players.", inline=False)
    embed.add_field(name="/stats_week", value="Last 7 days of game traffic as a line chart.", inline=False)
    embed.add_field(name="/leaderboard", value="Text-based ranked leaderboard (top 15 players).", inline=False)
    embed.add_field(name="/ping", value="Check bot latency.", inline=False)
    embed.set_footer(text="made by @neporrex_ • Ryoblox")
    await interaction.response.send_message(embed=embed)

# ---------------------------------------------------------------------------
# /stats_top
# ---------------------------------------------------------------------------

@bot.tree.command(name="stats_top", description="Bar chart of the top 10 most frequent players")
async def stats_top(interaction: discord.Interaction):
    await interaction.response.defer()
    players = query_top(10)
    if not players:
        await interaction.followup.send("No data yet — no joins logged.", ephemeral=True)
        return

    names, counts = zip(*players)
    fig, ax = plt.subplots(figsize=(10, 5))
    _dark(fig, ax)
    bars = ax.bar(names, counts, color="#c0392b", edgecolor="#7a1111", linewidth=0.8)
    for bar, c in zip(bars, counts):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.1, str(c),
                ha="center", va="bottom", color="#ccc", fontsize=9)
    ax.set_xlabel("Player", labelpad=8)
    ax.set_ylabel("Total Joins", labelpad=8)
    ax.set_title("Top 10 Players by Joins", pad=14, fontsize=13, fontweight="bold")
    ax.set_xticks(range(len(names)))
    ax.set_xticklabels(names, rotation=35, ha="right")
    ax.set_ylim(0, max(counts) + max(1, int(max(counts) * 0.12)))
    await interaction.followup.send("**Top 10 Players**", file=to_file(fig, "top_players.png"))

# ---------------------------------------------------------------------------
# /stats_player
# ---------------------------------------------------------------------------

@bot.tree.command(name="stats_player", description="Join history for a specific Roblox player")
@app_commands.describe(username="The Roblox username to look up")
async def stats_player(interaction: discord.Interaction, username: str):
    await interaction.response.defer()
    total, history = query_player(username)
    if total == 0:
        await interaction.followup.send(f"No data found for **{username}**.", ephemeral=True)
        return

    dates, counts = zip(*history)
    fig, ax = plt.subplots(figsize=(10, 5))
    _dark(fig, ax)
    ax.plot(range(len(dates)), counts, marker="o", linestyle="-", color="#e74c3c",
            linewidth=2, markersize=6, markerfacecolor="#c0392b", markeredgecolor="#ff6b6b")
    ax.fill_between(range(len(dates)), counts, alpha=0.07, color="#e74c3c")
    ax.set_xticks(range(len(dates)))
    ax.set_xticklabels(dates, rotation=35, ha="right")
    ax.set_xlabel("Date", labelpad=8)
    ax.set_ylabel("Joins", labelpad=8)
    ax.set_title(f"Join History — {username}", pad=14, fontsize=13, fontweight="bold")
    ax.set_ylim(0, max(counts) + max(1, int(max(counts) * 0.15)))
    await interaction.followup.send(
        f"**{username}** — **{total}** total join{'s' if total != 1 else ''}",
        file=to_file(fig, f"{username}_history.png"),
    )

# ---------------------------------------------------------------------------
# /stats_all
# ---------------------------------------------------------------------------

@bot.tree.command(name="stats_all", description="Overall game traffic: total joins, unique players, daily trend")
async def stats_all(interaction: discord.Interaction):
    await interaction.response.defer()
    total, unique, history = query_overall()
    if total == 0:
        await interaction.followup.send("No data yet.", ephemeral=True)
        return

    dates, counts = zip(*history)
    fig, ax = plt.subplots(figsize=(10, 5))
    _dark(fig, ax)
    ax.plot(range(len(dates)), counts, marker="s", linestyle="-", color="#27ae60",
            linewidth=2, markersize=6, markerfacecolor="#1e8449", markeredgecolor="#58d68d")
    ax.fill_between(range(len(dates)), counts, alpha=0.07, color="#27ae60")
    ax.set_xticks(range(len(dates)))
    ax.set_xticklabels(dates, rotation=35, ha="right")
    ax.set_xlabel("Date", labelpad=8)
    ax.set_ylabel("Total Joins", labelpad=8)
    ax.set_title("Game Traffic Over Time", pad=14, fontsize=13, fontweight="bold")
    ax.set_ylim(0, max(counts) + max(1, int(max(counts) * 0.15)))
    await interaction.followup.send(
        f"**Overall Stats** — Total joins: **{total}** | Unique players: **{unique}**",
        file=to_file(fig, "traffic.png"),
    )

# ---------------------------------------------------------------------------
# /stats_today
# ---------------------------------------------------------------------------

@bot.tree.command(name="stats_today", description="Today's join count, unique players, and top 5 players")
async def stats_today(interaction: discord.Interaction):
    await interaction.response.defer()
    total, unique, top = query_today()
    today = datetime.now(timezone.utc).date().strftime("%B %d, %Y")

    embed = discord.Embed(title=f"Today — {today}", color=0xDC2626)
    embed.add_field(name="Total Joins", value=str(total), inline=True)
    embed.add_field(name="Unique Players", value=str(unique), inline=True)

    if top:
        lb = "\n".join(f"`{i+1}.` **{u}** — {c} join{'s' if c != 1 else ''}" for i, (u, c) in enumerate(top))
        embed.add_field(name="Top 5 Today", value=lb, inline=False)
    else:
        embed.add_field(name="Top 5 Today", value="No joins recorded yet.", inline=False)

    embed.set_footer(text="Ryoblox Analytics")
    await interaction.followup.send(embed=embed)

# ---------------------------------------------------------------------------
# /stats_week
# ---------------------------------------------------------------------------

@bot.tree.command(name="stats_week", description="Last 7 days of game traffic as a line chart")
async def stats_week(interaction: discord.Interaction):
    await interaction.response.defer()
    total, unique, history = query_week()
    if total == 0:
        await interaction.followup.send("No joins in the last 7 days.", ephemeral=True)
        return

    dates, counts = zip(*history)
    fig, ax = plt.subplots(figsize=(10, 5))
    _dark(fig, ax)
    ax.plot(range(len(dates)), counts, marker="D", linestyle="-", color="#9b59b6",
            linewidth=2, markersize=6, markerfacecolor="#7d3c98", markeredgecolor="#d7bde2")
    ax.fill_between(range(len(dates)), counts, alpha=0.07, color="#9b59b6")
    ax.set_xticks(range(len(dates)))
    ax.set_xticklabels(dates, rotation=35, ha="right")
    ax.set_xlabel("Date", labelpad=8)
    ax.set_ylabel("Joins", labelpad=8)
    ax.set_title("Last 7 Days — Game Traffic", pad=14, fontsize=13, fontweight="bold")
    ax.set_ylim(0, max(counts) + max(1, int(max(counts) * 0.15)))
    await interaction.followup.send(
        f"**Last 7 Days** — **{total}** joins | **{unique}** unique players",
        file=to_file(fig, "week.png"),
    )

# ---------------------------------------------------------------------------
# /leaderboard
# ---------------------------------------------------------------------------

@bot.tree.command(name="leaderboard", description="Ranked leaderboard of top 15 players (no chart)")
async def leaderboard(interaction: discord.Interaction):
    await interaction.response.defer()
    players = query_top(15)
    if not players:
        await interaction.followup.send("No data yet.", ephemeral=True)
        return

    medals = {1: "🥇", 2: "🥈", 3: "🥉"}
    lines = []
    for i, (name, count) in enumerate(players, 1):
        prefix = medals.get(i, f"`{i:>2}.`")
        lines.append(f"{prefix} **{name}** — {count} join{'s' if count != 1 else ''}")

    embed = discord.Embed(
        title="Leaderboard",
        description="\n".join(lines),
        color=0xDC2626,
    )
    embed.set_footer(text="Ryoblox Analytics • /stats_top for a chart version")
    await interaction.followup.send(embed=embed)

# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    token = os.environ.get("DISCORD_TOKEN", "")
    if not token:
        raise RuntimeError("DISCORD_TOKEN environment variable is not set.")
    bot.run(token)
