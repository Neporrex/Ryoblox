const API = 'https://ryo-api.vercel.app'

export async function getStats(guildId, period = 'all') {
  const res = await fetch(`${API}/api/stats?guild_id=${guildId}&period=${period}`)
  return res.json()
}

export async function getLeaderboard(guildId, period = 'all', limit = 15) {
  const res = await fetch(`${API}/api/leaderboard?guild_id=${guildId}&period=${period}&limit=${limit}`)
  return res.json()
}

export async function getPlayer(guildId, username) {
  const res = await fetch(`${API}/api/player?guild_id=${guildId}&username=${username}`)
  return res.json()
}

export async function getPlaytime(guildId, limit = 10) {
  const res = await fetch(`${API}/api/playtime?guild_id=${guildId}&limit=${limit}`)
  return res.json()
}

export async function getRevenue(guildId, period = 'all') {
  const res = await fetch(`${API}/api/revenue?guild_id=${guildId}&period=${period}`)
  return res.json()
}

export async function getToday(guildId) {
  const res = await fetch(`${API}/api/today?guild_id=${guildId}`)
  return res.json()
}

export async function getHeatmap(guildId, period = 'all') {
  const res = await fetch(`${API}/api/heatmap?guild_id=${guildId}&period=${period}`)
  return res.json()
}
