import { useState, useEffect, useCallback } from "react";

const API = "https://ryo-api.vercel.app";

interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  avatar?: string;
  discriminator?: string;
}

interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
}

export function useAuth() {
  const [user, setUser] = useState<DiscordUser | null>(() => {
    try {
      const stored = localStorage.getItem("discord_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("discord_token")
  );
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [loading, setLoading] = useState(false);

  const saveUser = (u: DiscordUser | null, t: string | null) => {
    setUser(u);
    setToken(t);
    if (u && t) {
      localStorage.setItem("discord_user", JSON.stringify(u));
      localStorage.setItem("discord_token", t);
    } else {
      localStorage.removeItem("discord_user");
      localStorage.removeItem("discord_token");
    }
  };

  const login = useCallback(async (code: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/callback?code=${code}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const userData: DiscordUser = await userRes.json();

      const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      const guildsData = await guildsRes.json();

      saveUser(userData, data.access_token);
      setGuilds(Array.isArray(guildsData) ? guildsData : []);
      return true;
    } catch (err) {
      console.error("Auth error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGuilds = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGuilds(Array.isArray(data) ? data : []);
    } catch {
      /* token expired */
    }
  }, [token]);

  const logout = useCallback(() => {
    saveUser(null, null);
    setGuilds([]);
  }, []);

  useEffect(() => {
    if (token && guilds.length === 0) fetchGuilds();
  }, [token]);

  return { user, token, guilds, loading, login, logout, fetchGuilds };
}
