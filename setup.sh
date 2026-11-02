#!/usr/bin/env bash
# BlockHost setup script — downloads all heavy binary assets needed at runtime.
# Run this once after cloning the repo, before `bun run dev` or `bun run start`.
#
# Downloads:
#   - Temurin JDK 17 (for Minecraft 1.18–1.20.4)
#   - Temurin JDK 25 (for Minecraft 26.x)
#   - Minecraft 1.20.4 server.jar (cached for fast first boot)
#   - Minecraft 1.21.4 server.jar (cached for fast first boot)
#   - Fabric installer jar (for Fabric mod loader servers)
#   - playit.gg agent binary (for public tunneling)
#
# System Java 21 (apt install openjdk-21-jdk) is used for MC 1.20.5–1.21.x.
#
# Total download: ~250 MB. Skips any asset that already exists.

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[setup]${NC} $1"; }
warn() { echo -e "${YELLOW}[setup]${NC} $1"; }

# ---- JDKs ----
mkdir -p jdk mc-bin

if [ ! -d "jdk/jdk-17.0.13+11" ]; then
  log "Downloading Temurin JDK 17..."
  curl -sL "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.13%2B11/OpenJDK17U-jdk_x64_linux_hotspot_17.0.13_11.tar.gz" -o /tmp/jdk17.tar.gz
  tar -xzf /tmp/jdk17.tar.gz -C jdk/
  rm /tmp/jdk17.tar.gz
  log "JDK 17 installed."
else
  log "JDK 17 already present, skipping."
fi

if [ ! -d "jdk/jdk-25.0.5+8" ]; then
  log "Downloading Temurin JDK 25..."
  curl -sL "https://github.com/adoptium/temurin25-binaries/releases/download/jdk-25.0.5%2B8/OpenJDK25U-jdk_x64_linux_hotspot_25.0.5_8.tar.gz" -o /tmp/jdk25.tar.gz
  tar -xzf /tmp/jdk25.tar.gz -C jdk/
  rm /tmp/jdk25.tar.gz
  log "JDK 25 installed."
else
  log "JDK 25 already present, skipping."
fi

# System Java 21 check
if command -v java >/dev/null 2>&1; then
  JAVA_VER=$(java -version 2>&1 | head -n 1 | sed 's/.*"\([0-9]*\).*/\1/')
  if [ "$JAVA_VER" -ge 21 ] 2>/dev/null; then
    log "System Java $JAVA_VER detected (used for MC 1.20.5–1.21.x)."
  else
    warn "System Java is version $JAVA_VER. MC 1.20.5–1.21.x needs Java 21+."
    warn "Install with: sudo apt install openjdk-21-jdk-headless"
  fi
else
  warn "Java not found. Install with: sudo apt install openjdk-21-jdk-headless"
fi

# ---- Minecraft server.jars (cached for fast first boot) ----
# The app lazy-downloads any version on demand, but pre-caching popular ones speeds up first use.
fetch_server_jar() {
  local version="$1"
  local manifest_url="https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"
  if [ -f "mc-bin/server-$version.jar" ] && [ -s "mc-bin/server-$version.jar" ]; then
    log "MC $version server.jar already cached, skipping."
    return
  fi
  log "Fetching MC $version server.jar URL from Mojang..."
  local version_url=$(curl -s "$manifest_url" | python3 -c "
import json, sys
d = json.load(sys.stdin)
for v in d['versions']:
    if v['id'] == '$version':
        print(v['url'])
        break
")
  if [ -z "$version_url" ]; then
    warn "Could not find MC $version in manifest."
    return
  fi
  local jar_url=$(curl -s "$version_url" | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(d['downloads']['server']['url'])
")
  log "Downloading MC $version server.jar..."
  curl -sL "$jar_url" -o "mc-bin/server-$version.jar"
  log "MC $version server.jar cached ($(du -h mc-bin/server-$version.jar | cut -f1))."
}

fetch_server_jar "1.20.4"
fetch_server_jar "1.21.4"

# ---- Fabric installer ----
if [ ! -f "mc-bin/fabric-installer.jar" ]; then
  log "Downloading Fabric installer..."
  curl -sL "https://maven.fabricmc.net/net/fabricmc/fabric-installer/1.0.1/fabric-installer-1.0.1.jar" -o mc-bin/fabric-installer.jar
  log "Fabric installer downloaded."
else
  log "Fabric installer already present, skipping."
fi

# ---- Playit agent binary ----
if [ ! -f "mc-bin/playit" ]; then
  log "Downloading playit.gg agent binary..."
  curl -sL "https://github.com/playit-cloud/playit-agent/releases/latest/download/playit-linux-amd64" -o mc-bin/playit
  chmod +x mc-bin/playit
  log "Playit agent installed."
else
  log "Playit agent already present, skipping."
fi

# ---- Accept Minecraft EULA ----
echo "eula=true" > mc-bin/eula.txt

# ---- Install Node.js deps ----
if command -v bun >/dev/null 2>&1; then
  log "Installing Node.js dependencies with bun..."
  bun install
elif command -v npm >/dev/null 2>&1; then
  log "Installing Node.js dependencies with npm..."
  npm install
else
  warn "Neither bun nor npm found. Install Node.js 18+ to continue."
  exit 1
fi

# ---- Set up database ----
log "Setting up SQLite database..."
if command -v bun >/dev/null 2>&1; then
  bun run db:push
else
  npx prisma db push --accept-data-loss
  npx prisma generate
fi

# ---- Create servers directory ----
mkdir -p mc-servers

echo ""
log "Setup complete!"
echo ""
echo "  To start the dev server:   bun run dev"
echo "  To build for production:    bun run build"
echo "  To start production server: bun run start"
echo ""
echo "  The app runs on http://localhost:3000"
echo "  Minecraft servers are stored in mc-servers/<id>/"
echo "  World saves persist in mc-servers/<id>/world/"
echo ""
