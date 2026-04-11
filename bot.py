import discord
from discord.ext import commands
from discord import app_commands
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import io
import json
import os
from datetime import datetime

# --- JSON Storage ---
DATA_FILE = "analytics.json"
CONFIG_FILE = "config.json"


def load_data() -> dict:
    if not os.path.exists(DATA_FILE):
        return {"joins": []}
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_data(data: dict):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


def load_config() -> dict:
    if not os.path.exists(CONFIG_FILE):
        return {}
    with open(CONFIG_FILE, "r") as f:
        return json.load(f)


def log_join(username: str):
    data = load_data()
    data["joins"].append({
        "username": username,
        "timestamp": datetime.utcnow().isoformat()
    })
    save_data(data)


def get_top_players(limit: int = 10) -> list[tuple[str, int]]:
    data = load_data()
    counts: dict[str, int] = {}
    for entry in data["joins"]:
        name = entry["username"]
        counts[name] = counts.get(name, 0) + 1
    sorted_players = sorted(counts.items(), key=lambda x: x[1], reverse=True)
    return sorted_players[:limit]


def get_player_history(username: str) -> tuple[int, list[tuple[str, int]]]:
    data = load_data()
    daily: dict[str, int] = {}
    total = 0
    for entry in data["joins"]:
        if entry["username"].lower() == username.lower():
            total += 1
            date = entry["timestamp"][:10]
            daily[date] = daily.get(date, 0) + 1
    sorted_days = sorted(daily.items())
    return total, sorted_days


def get_overall_stats() -> tuple[int, int, list[tuple[str, int]]]:
    data = load_data()
    total = len(data["joins"])
    unique = len({e["username"].lower() for e in data["joins"]})
    daily: dict[str, int] = {}
    for entry in data["joins"]:
        date = entry["timestamp"][:10]
        daily[date] = daily.get(date, 0) + 1
    sorted_days = sorted(daily.items())
    return total, unique, sorted_days


# --- Chart helpers ---

def _apply_dark_style(fig, ax):
    fig.patch.set_facecolor("#0d0f14")
    ax.set_facecolor("#0d0f14")
    ax.tick_params(colors="#888888", labelsize=9)
    ax.xaxis.label.set_color("#888888")
    ax.yaxis.label.set_color("#888888")
    ax.title.set_color("#e0e0e0")
    for spine in ax.spines.values():
        spine.set_edgecolor("#222222")
    ax.grid(axis='y', color="#1e1e1e", linewidth=0.8, linestyle='--')


def chart_to_file(fig, filename: str) -> discord.File:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", dpi=140)
    buf.seek(0)
    plt.close(fig)
    return discord.File(buf, filename=filename)


# --- Bot setup ---

config = load_config()
TARGET_CHANNEL_ID: int = config.get("target_channel_id", 0)

if not TARGET_CHANNEL_ID:
    print(
        "WARNING: target_channel_id not set in config.json. "
        "Webhook listening is disabled until you set it."
    )


class RyobloxBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.message_content = True
        super().__init__(command_prefix="!", intents=intents)

    async def setup_hook(self):
        await self.tree.sync()
        print(f"[Ryoblox] Ready — {len(self.guilds)} server(s) | Slash commands synced")


bot = RyobloxBot()


# --- Webhook listener ---

@bot.event
async def on_message(message: discord.Message):
    if not TARGET_CHANNEL_ID:
        return
    if message.channel.id != TARGET_CHANNEL_ID:
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


# --- /stats_top ---

@bot.tree.command(name="stats_top", description="Bar chart of the top 10 most frequent players")
async def stats_top(interaction: discord.Interaction):
    await interaction.response.defer()

    players = get_top_players(10)
    if not players:
        await interaction.followup.send("No data yet — no joins have been logged.", ephemeral=True)
        return

    names = [p[0] for p in players]
    counts = [p[1] for p in players]

    fig, ax = plt.subplots(figsize=(10, 5))
    _apply_dark_style(fig, ax)

    bars = ax.bar(names, counts, color="#c0392b", edgecolor="#8b1a1a", linewidth=0.8)

    for bar, count in zip(bars, counts):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + 0.15,
            str(count),
            ha="center", va="bottom",
            color="#cccccc", fontsize=9
        )

    ax.set_xlabel("Player", labelpad=8)
    ax.set_ylabel("Total Joins", labelpad=8)
    ax.set_title("Top 10 Players by Joins", pad=14, fontsize=13, fontweight="bold")
    ax.set_xticks(range(len(names)))
    ax.set_xticklabels(names, rotation=35, ha="right")
    ax.set_ylim(0, max(counts) + max(1, max(counts) * 0.12))

    file = chart_to_file(fig, "top_players.png")
    await interaction.followup.send(content="**Top 10 Players**", file=file)


# --- /stats_player ---

@bot.tree.command(name="stats_player", description="Join history and stats for a specific Roblox player")
@app_commands.describe(username="The Roblox username to look up")
async def stats_player(interaction: discord.Interaction, username: str):
    await interaction.response.defer()

    total, history = get_player_history(username)
    if total == 0:
        await interaction.followup.send(
            f"No data found for **{username}**. Make sure the name matches exactly.",
            ephemeral=True
        )
        return

    dates = [h[0] for h in history]
    counts = [h[1] for h in history]

    fig, ax = plt.subplots(figsize=(10, 5))
    _apply_dark_style(fig, ax)

    ax.plot(dates, counts, marker="o", linestyle="-", color="#e74c3c",
            linewidth=2, markersize=6, markerfacecolor="#c0392b", markeredgecolor="#ff6b6b")
    ax.fill_between(range(len(dates)), counts, alpha=0.08, color="#e74c3c")
    ax.set_xticks(range(len(dates)))
    ax.set_xticklabels(dates, rotation=35, ha="right")
    ax.set_xlabel("Date", labelpad=8)
    ax.set_ylabel("Joins", labelpad=8)
    ax.set_title(f"Join History — {username}", pad=14, fontsize=13, fontweight="bold")
    ax.set_ylim(0, max(counts) + max(1, max(counts) * 0.15))

    file = chart_to_file(fig, f"{username}_history.png")
    await interaction.followup.send(
        content=f"**{username}** — **{total}** total join{'s' if total != 1 else ''}",
        file=file
    )


# --- /stats_all ---

@bot.tree.command(name="stats_all", description="Overall game traffic: total joins, unique players, and daily trend")
async def stats_all(interaction: discord.Interaction):
    await interaction.response.defer()

    total, unique, history = get_overall_stats()
    if total == 0:
        await interaction.followup.send("No data yet — no joins have been logged.", ephemeral=True)
        return

    dates = [h[0] for h in history]
    counts = [h[1] for h in history]

    fig, ax = plt.subplots(figsize=(10, 5))
    _apply_dark_style(fig, ax)

    ax.plot(dates, counts, marker="s", linestyle="-", color="#27ae60",
            linewidth=2, markersize=6, markerfacecolor="#1e8449", markeredgecolor="#58d68d")
    ax.fill_between(range(len(dates)), counts, alpha=0.08, color="#27ae60")
    ax.set_xticks(range(len(dates)))
    ax.set_xticklabels(dates, rotation=35, ha="right")
    ax.set_xlabel("Date", labelpad=8)
    ax.set_ylabel("Total Joins", labelpad=8)
    ax.set_title("Game Traffic Over Time", pad=14, fontsize=13, fontweight="bold")
    ax.set_ylim(0, max(counts) + max(1, max(counts) * 0.15))

    file = chart_to_file(fig, "game_traffic.png")
    await interaction.followup.send(
        content=(
            f"**Overall Game Stats**\n"
            f"Total joins: **{total}** | Unique players: **{unique}**"
        ),
        file=file
    )


# --- Run ---

if __name__ == "__main__":
    token = os.environ.get("DISCORD_TOKEN", "")
    if not token:
        raise RuntimeError(
            "DISCORD_TOKEN environment variable is not set. "
            "Set it before running the bot."
        )
    bot.run(token)
