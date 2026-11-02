# BlockHost — Free Minecraft Server Hosting

A fully working Minecraft server hosting platform that runs **real `java -jar server.jar`** processes. Supports vanilla, Fabric, Forge (via Fabric fallback), Paper, and Spigot server types. Includes user accounts, mod search via Modrinth, a file explorer, playit.gg tunneling for public access, and a live console that streams real Minecraft server output.

## Features

- **Real Java servers** — spawns actual `java -jar server.jar` processes (Mojang's official server.jar)
- **Multi-version support** — any Minecraft release from 1.7.10 to 26.x (lazy-downloads server.jar on demand)
- **Fabric mod loader** — runs the official Fabric installer to generate mod-compatible servers
- **Mod search & install** — search Modrinth's catalog, one-click install to the `mods/` folder
- **File explorer** — browse, upload, edit, and delete files in each server's working directory
- **User accounts** — signup/login with bcrypt-hashed passwords, HMAC-signed HTTP-only cookies
- **Live console** — real-time streaming of Minecraft server stdout/stderr with command input
- **playit.gg tunneling** — optional public tunneling so players from the internet can join (servers are private/LAN-only by default)
- **System dashboard** — host CPU/RAM usage, active user count, server counts (running/offline)
- **Full server settings** — world type, seed, difficulty, gamemode, view distance, hardcore, PvP, whitelist, nether, flight, command blocks, online mode, resource packs

## Quick start

```bash
# 1. Clone the repo
git clone https://github.com/yourname/blockhost.git
cd blockhost

# 2. Run the setup script (downloads JDKs, server.jars, playit binary, installs deps)
./setup.sh

# 3. Start the dev server
bun run dev
```

The app runs on `http://localhost:3000`.

## Requirements

- **Node.js 18+** (or Bun)
- **Java 21+** (system-wide, for MC 1.20.5–1.21.x) — `apt install openjdk-21-jdk`
- **Python 3** (used by setup.sh to parse Mojang's version manifest)
- **curl** (for downloading assets)
- **~500 MB disk** for JDKs + cached server.jars + playit binary
- **~2 GB RAM** minimum (Next.js + one running Minecraft server)

The setup script also downloads Temurin JDK 17 (for MC 1.18–1.20.4) and Temurin JDK 25 (for MC 26.x) into `jdk/`. These are used automatically based on each Minecraft version's required Java version.

## Production deployment

```bash
# On a VPS (e.g. $5 DigitalOcean / Hetzner droplet, Ubuntu 22.04+):
git clone https://github.com/yourname/blockhost.git
cd blockhost
./setup.sh
bun run build
bun run start

# Or with systemd:
sudo cp blockhost.service /etc/systemd/system/
sudo systemctl enable --now blockhost
```

For public access without playit.gg, open port 25565 directly:
```bash
sudo ufw allow 25565/tcp
```

Players then connect to `<your-vps-ip>` from their Minecraft client.

## Architecture

```
src/
├── app/
│   ├── api/                    # Next.js API routes
│   │   ├── auth/               # signup, login, logout, me
│   │   ├── account/            # user profile (playit secret)
│   │   ├── mods/search/        # Modrinth mod search proxy
│   │   ├── playit/             # claim, cancel, reset
│   │   ├── servers/            # CRUD + start/stop/restart/command/console/stats/mods/files/tunnel
│   │   ├── stats/system/       # host CPU/RAM, active sessions, server counts
│   │   └── versions/           # Mojang version manifest proxy
│   ├── page.tsx                # single-page app (home, dashboard, detail, account views)
│   ├── layout.tsx              # root layout with fonts + toaster
│   └── globals.css             # dark Minecraft theme
├── components/
│   ├── mc/                     # all Minecraft-specific UI components
│   │   ├── server-card.tsx     # dashboard server card
│   │   ├── server-detail.tsx   # console + tabs (players, mods, files, settings, tunnel)
│   │   ├── mods-tab.tsx        # Modrinth search + installed mods
│   │   ├── files-tab.tsx       # file explorer
│   │   ├── account-page.tsx    # system dashboard
│   │   ├── create-server-dialog.tsx
│   │   ├── auth-dialog.tsx
│   │   └── account-dialog.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── mc/
│   │   ├── engine.ts           # Java process manager (spawns real java -jar)
│   │   ├── versions.ts         # Mojang version manifest + lazy server.jar download
│   │   ├── fabric.ts           # Fabric installer integration
│   │   └── playit.ts           # playit.gg agent + claim flow
│   ├── auth/session.ts         # HMAC-signed cookie sessions + active session tracker
│   ├── store/app-store.ts      # Zustand store (auth, servers, realtime mirrors)
│   └── db-v2.ts                # Prisma client
└── prisma/
    └── schema.prisma           # User + Server models
```

## Key technical details

- **Real Java processes**: The `McEngine` class (`src/lib/mc/engine.ts`) spawns `java -Xmx768M -jar server.jar nogui` via `child_process.spawn`. It reads stdout/stderr line-by-line, parses Minecraft's log format, detects player joins/leaves, and exposes the console via a polling API. CPU/RAM are sampled from `/proc/<pid>/stat` and `/proc/<pid>/status`.
- **Multi-JDK**: The engine picks the right JDK per Minecraft version — Temurin 17 for MC 1.18–1.20.4, system Java 21 for MC 1.20.5–1.21.x, Temurin 25 for MC 26.x.
- **Fabric installer**: For Fabric servers, the engine runs the official Fabric installer jar to generate `fabric-server-launch.jar` + libraries, then launches that instead of vanilla.
- **playit.gg integration**: The `PlayitAgent` class manages the playit binary as a child process. It implements the claim flow (generate code → poll `/claim/setup` → exchange for secret via `/claim/exchange`) using playit's public API at `api.playit.gg`. Servers are private by default — the user must explicitly start a tunnel from the Tunnel tab.
- **Modrinth integration**: The `/api/mods/search` endpoint proxies Modrinth's public search API with auto-filtering by MC version + loader. The `/api/servers/[id]/mods` endpoint downloads mod .jar files directly to the server's `mods/` folder.
- **File explorer**: The `/api/servers/[id]/files` endpoints provide CRUD operations with path traversal protection (all paths are sandboxed within the server's directory).

## License

The BlockHost source code is MIT-licensed. However:
- **Minecraft server.jar**: Mojang EULA — you must accept; you cannot redistribute
- **Temurin JDK**: GPL-2.0 with Classpath Exception
- **Playit binary**: GPL-3.0
- **Fabric installer**: Apache-2.0

The `setup.sh` script downloads all these at install time so you're not redistributing them.
