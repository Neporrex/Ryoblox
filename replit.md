# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- **ryoblox** (`artifacts/ryoblox/`) — React + Vite website for the Ryoblox Discord bot
  - Dark & red theme with Cinzel display font and Inter body font
  - Constellation background (canvas, reacts to mouse movement)
  - Pages: Home (add bot CTA), Privacy Policy, Terms of Service
  - Preview path: `/`

- **api-server** (`artifacts/api-server/`) — Express API server (backend, unused by ryoblox frontend)
  - Preview path: `/api`

## Bot

- **`bot.py`** — All-in-one Python Discord bot (self-hosted)
  - Data stored in JSON files: `analytics.json` (join records), `config.json` (bot config)
  - Commands: `/stats_top`, `/stats_player`, `/stats_all`
  - Requires `DISCORD_TOKEN` env var and `target_channel_id` in `config.json`
  - Dependencies: `discord.py`, `matplotlib`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
