module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/src/lib/db-v2.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
// Force a new client on schema changes (bump this number to invalidate)
const SCHEMA_VERSION = 4;
const db = globalForPrisma?.prisma_v === SCHEMA_VERSION ? globalForPrisma.prisma : new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        'query'
    ]
});
if ("TURBOPACK compile-time truthy", 1) {
    ;
    globalForPrisma.prisma_v = SCHEMA_VERSION;
    globalForPrisma.prisma = db;
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/auth/session.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSessionCookie",
    ()=>clearSessionCookie,
    "getActiveSessionCount",
    ()=>getActiveSessionCount,
    "getCurrentUser",
    ()=>getCurrentUser,
    "login",
    ()=>login,
    "setSessionCookie",
    ()=>setSessionCookie
]);
// Simple session helpers using HTTP-only cookies with HMAC-signed user IDs.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db-v2.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
;
const SESSION_COOKIE = 'blockhost_session';
const SECRET = process.env.SESSION_SECRET || 'blockhost-dev-secret-change-in-production-please';
// In-memory active-session tracker. Records the last-seen timestamp for each
// distinct user (or anonymous visitor). Entries older than SESSION_TTL_MS are
// pruned on read. Used by the /api/stats/system endpoint to show "users online".
const SESSION_TTL_MS = 5 * 60 * 1000 // 5 minutes
;
const activeSessions = new Map() // key: userId or 'anon:<ip>', value: lastSeenMs
;
function touchSession(userId, ip) {
    const key = userId || (ip ? `anon:${ip}` : 'anon:unknown');
    activeSessions.set(key, Date.now());
}
function getActiveSessionCount() {
    const now = Date.now();
    let count = 0;
    for (const [key, lastSeen] of activeSessions.entries()){
        if (now - lastSeen > SESSION_TTL_MS) {
            activeSessions.delete(key);
        } else {
            count++;
        }
    }
    return count;
}
function sign(value) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHmac"])('sha256', SECRET).update(value).digest('hex').slice(0, 32);
}
function makeToken(userId) {
    return `${userId}.${sign(userId)}`;
}
function verifyToken(token) {
    if (!token || typeof token !== 'string') return null;
    const idx = token.lastIndexOf('.');
    if (idx < 1) return null;
    const userId = token.slice(0, idx);
    const sig = token.slice(idx + 1);
    if (sign(userId) !== sig) return null;
    return userId;
}
function getClientIp(req) {
    // Try common headers (Caddy sets X-Forwarded-For)
    const headers = req?.headers;
    if (headers) {
        const xff = headers.get?.('x-forwarded-for') || headers['x-forwarded-for'];
        if (xff) return String(xff).split(',')[0].trim();
        const xri = headers.get?.('x-real-ip') || headers['x-real-ip'];
        if (xri) return String(xri);
    }
    return null;
}
async function getCurrentUser(req) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    let userId = null;
    if (token) {
        userId = verifyToken(token);
    }
    // Touch the session tracker for every authenticated request
    touchSession(userId, getClientIp(req));
    if (!userId) return null;
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            email: true,
            name: true,
            playitSecret: true
        }
    });
    if (!user) return null;
    return user;
}
async function setSessionCookie(userId) {
    touchSession(userId, null);
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(SESSION_COOKIE, makeToken(userId), {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30
    });
}
async function clearSessionCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(SESSION_COOKIE);
}
async function login(email, password) {
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
        where: {
            email: email.toLowerCase()
        }
    });
    if (!user) return {
        ok: false,
        error: 'Invalid email or password'
    };
    const valid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(password, user.passwordHash);
    if (!valid) return {
        ok: false,
        error: 'Invalid email or password'
    };
    await setSessionCookie(user.id);
    return {
        ok: true,
        user: {
            id: user.id,
            email: user.email,
            name: user.name
        }
    };
}
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/mc/versions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureServerJar",
    ()=>ensureServerJar,
    "getLatestVersion",
    ()=>getLatestVersion,
    "listRecommendedVersions",
    ()=>listRecommendedVersions,
    "listVersions",
    ()=>listVersions,
    "warmManifest",
    ()=>warmManifest
]);
// Minecraft version catalog.
// Fetches the official version manifest from Mojang on first request,
// caches it in memory, and lazy-downloads each version's server.jar on demand.
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const BIN_DIR = '/home/z/my-project/mc-bin';
const VERSIONS_CACHE_PATH = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(BIN_DIR, 'version-manifest.json');
const VERSIONS_CACHE_TTL_MS = 1000 * 60 * 60 * 6 // 6 hours
;
const g = globalThis;
async function fetchManifest() {
    if (g.__mcCatalog && Date.now() - g.__mcCatalog.fetchedAt < VERSIONS_CACHE_TTL_MS) {
        return g.__mcCatalog.manifest;
    }
    // Try disk cache first
    if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(VERSIONS_CACHE_PATH)) {
        try {
            const stat = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["statSync"])(VERSIONS_CACHE_PATH);
            if (Date.now() - stat.mtimeMs < VERSIONS_CACHE_TTL_MS) {
                const cached = JSON.parse((0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])(VERSIONS_CACHE_PATH, 'utf8'));
                g.__mcCatalog = {
                    manifest: cached,
                    fetchedAt: stat.mtimeMs
                };
                return cached;
            }
        } catch  {}
    }
    // Fetch fresh
    const res = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json');
    if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`);
    const manifest = await res.json();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"])(BIN_DIR, {
        recursive: true
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"])(VERSIONS_CACHE_PATH, JSON.stringify(manifest, null, 2));
    g.__mcCatalog = {
        manifest,
        fetchedAt: Date.now()
    };
    return manifest;
}
async function listVersions(filter = 'release') {
    const manifest = await fetchManifest();
    const latest = manifest.latest.release;
    let vs = manifest.versions;
    if (filter !== 'all') vs = vs.filter((v)=>v.type === filter);
    return vs.map((v)=>({
            id: v.id,
            type: v.type,
            latest: v.id === latest
        }));
}
// Curated list of recommended versions (the ones most users actually want).
// Anything outside this list is still installable via the "all versions" dropdown.
const RECOMMENDED_VERSIONS = [
    '1.21.11',
    '1.21.8',
    '1.21.4',
    '1.21.1',
    '1.20.6',
    '1.20.4',
    '1.20.1',
    '1.19.4',
    '1.19.2',
    '1.18.2',
    '1.17.1',
    '1.16.5',
    '1.12.2',
    '1.8.9'
];
async function listRecommendedVersions() {
    const manifest = await fetchManifest();
    const latest = manifest.latest.release;
    const byId = new Map(manifest.versions.map((v)=>[
            v.id,
            v
        ]));
    return RECOMMENDED_VERSIONS.map((id)=>({
            id,
            available: byId.has(id),
            latest: id === latest
        })).filter((v)=>v.available);
}
async function getLatestVersion() {
    const manifest = await fetchManifest();
    return manifest.latest.release;
}
async function ensureServerJar(versionId) {
    const safeName = `server-${versionId}.jar`;
    const jarPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(BIN_DIR, safeName);
    if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(jarPath) && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["statSync"])(jarPath).size > 1000000) {
        // Already have it — read its metadata for Java version
        const metaPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(BIN_DIR, `meta-${versionId}.json`);
        if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(metaPath)) {
            try {
                const meta = JSON.parse((0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])(metaPath, 'utf8'));
                return {
                    path: jarPath,
                    javaVersion: meta.javaVersion || 17
                };
            } catch  {}
        }
        return {
            path: jarPath,
            javaVersion: 17
        };
    }
    // Need to fetch the version's metadata to get the download URL
    const manifest = await fetchManifest();
    const version = manifest.versions.find((v)=>v.id === versionId);
    if (!version) {
        return {
            path: '',
            javaVersion: 17,
            error: `Unknown version: ${versionId}`
        };
    }
    // Fetch version metadata
    const metaRes = await fetch(version.url);
    if (!metaRes.ok) {
        return {
            path: '',
            javaVersion: 17,
            error: `Failed to fetch version metadata: ${metaRes.status}`
        };
    }
    const meta = await metaRes.json();
    if (!meta.downloads?.server?.url) {
        return {
            path: '',
            javaVersion: 17,
            error: `Version ${versionId} has no server.jar`
        };
    }
    // Download the server.jar
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"])(BIN_DIR, {
        recursive: true
    });
    const jarRes = await fetch(meta.downloads.server.url);
    if (!jarRes.ok) {
        return {
            path: '',
            javaVersion: 17,
            error: `Failed to download server.jar: ${jarRes.status}`
        };
    }
    const jarBuf = Buffer.from(await jarRes.arrayBuffer());
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"])(jarPath, jarBuf);
    // Save metadata
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(BIN_DIR, `meta-${versionId}.json`), JSON.stringify({
        id: meta.id,
        javaVersion: meta.javaVersion?.majorVersion || 17,
        sha1: meta.downloads.server.sha1,
        size: meta.downloads.server.size
    }, null, 2));
    // Pre-extract libraries (the server.jar's libs are unpacked on first run, but
    // we can let the actual server start do that lazily).
    return {
        path: jarPath,
        javaVersion: meta.javaVersion?.majorVersion || 17
    };
}
function warmManifest() {
    fetchManifest().catch((e)=>console.error('Failed to warm MC version manifest:', e));
}
}),
"[project]/src/lib/mc/playit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPlayitAgent",
    ()=>getPlayitAgent,
    "isPlayitInstalled",
    ()=>isPlayitInstalled
]);
// Playit.gg tunnel agent manager with inline claim flow.
//
// When the user starts a Minecraft server and doesn't have a playit secret yet,
// we generate a claim code, surface the URL in the Minecraft server's console
// (and in the website UI), then poll playit's API until the user accepts.
// Once accepted, we exchange the code for a permanent secret, store it on the
// user's account, and start the agent.
//
// API endpoints (from playit-cli source):
//   POST https://api.playit.gg/claim/setup    { code, agent_type, version } → ClaimSetupResponse
//   POST https://api.playit.gg/claim/exchange { code }                       → { secret_key }
//
// Claim flow:
//   1. Generate 5-byte hex code (10 chars)
//   2. URL = https://playit.gg/claim/<code>
//   3. Poll /claim/setup every 2s:
//        WaitingForUserVisit → user hasn't opened the URL yet
//        WaitingForUser      → user opened it, hasn't clicked "Approve"
//        UserAccepted        → ready to exchange
//        UserRejected        → user declined; abort
//   4. POST /claim/exchange → secret_key
//   5. Save secret to user account (so we don't re-claim next time)
//   6. Spawn `playit --secret <key>` as a long-running child process
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
;
const PLAYIT_BIN = '/home/z/my-project/mc-bin/playit';
const PLAYIT_DIR = '/home/z/my-project/mc-bin/playit-data';
const SOCKET_PATH = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(PLAYIT_DIR, 'ipc.sock');
const SECRET_PATH = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(PLAYIT_DIR, 'secret.toml');
const LOG_PATH = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(PLAYIT_DIR, 'agent.log');
const API_BASE = 'https://api.playit.gg';
class PlayitAgent {
    proc = null;
    pid = null;
    secret = null;
    status = 'stopped';
    lastError = '';
    stdoutBuf = '';
    tunnels = new Map();
    listeners = new Set();
    pendingClaim = null;
    isAvailable() {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(PLAYIT_BIN);
    }
    getStatus() {
        return {
            status: this.status,
            secret: this.secret ? `${this.secret.slice(0, 4)}…${this.secret.slice(-4)}` : null,
            pid: this.pid,
            lastError: this.lastError,
            tunnels: Array.from(this.tunnels.values()),
            pendingClaim: this.pendingClaim ? {
                ...this.pendingClaim,
                pollTimer: undefined
            } : null
        };
    }
    getPendingClaim() {
        return this.pendingClaim;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return ()=>{
            this.listeners.delete(listener);
        };
    }
    emit() {
        for (const l of this.listeners){
            try {
                l();
            } catch  {}
        }
    }
    // Start a claim flow: generate code, surface URL in the Minecraft console,
    // poll until user accepts, exchange for secret, return it via onComplete.
    // The caller (engine) passes a `log` function that pushes lines into the
    // Minecraft server's console so the user sees the URL there.
    startClaimFlow(opts) {
        // Cancel any existing claim flow
        if (this.pendingClaim?.pollTimer) {
            clearInterval(this.pendingClaim.pollTimer);
        }
        const code = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(5).toString('hex');
        const url = `https://playit.gg/claim/${code}`;
        const pending = {
            code,
            url,
            status: 'waiting_for_visit',
            startedAt: Date.now(),
            pollTimer: null,
            onComplete: opts.onComplete,
            log: opts.log
        };
        this.pendingClaim = pending;
        this.log(opts, 'INFO', `[BlockHost/INFO]: ── playit.gg tunnel setup ──`);
        this.log(opts, 'INFO', `[BlockHost/INFO]: To make this server public, open this URL in your browser:`);
        this.log(opts, 'INFO', `[BlockHost/INFO]: ${url}`);
        this.log(opts, 'INFO', `[BlockHost/INFO]: After you approve, your server will be reachable at a *.playit.gg address.`);
        this.emit();
        // Start polling
        let pollCount = 0;
        pending.pollTimer = setInterval(async ()=>{
            pollCount++;
            try {
                const res = await fetch(`${API_BASE}/claim/setup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        code: pending.code,
                        agent_type: 'assignable',
                        version: 'playit-blockhost-1.0'
                    })
                });
                const data = await res.json();
                // data shape: { status: 'success'|'fail', data: 'WaitingForUserVisit'|... }
                if (data.status !== 'success') {
                    // Some transient API error — keep polling
                    return;
                }
                const setupStatus = data.data;
                if (setupStatus === 'WaitingForUserVisit' && pending.status !== 'waiting_for_visit') {
                    pending.status = 'waiting_for_visit';
                    this.emit();
                } else if (setupStatus === 'WaitingForUser' && pending.status !== 'waiting_for_approval') {
                    pending.status = 'waiting_for_approval';
                    this.log(opts, 'INFO', `[BlockHost/INFO]: You opened the link — click "Approve" in your browser to confirm.`);
                    this.emit();
                } else if (setupStatus === 'UserAccepted' && pending.status !== 'exchanging') {
                    pending.status = 'exchanging';
                    this.log(opts, 'INFO', `[BlockHost/INFO]: Approved! Exchanging claim for agent secret...`);
                    this.emit();
                    // Exchange the code for a secret
                    try {
                        const exRes = await fetch(`${API_BASE}/claim/exchange`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                code: pending.code
                            })
                        });
                        const exData = await exRes.json();
                        if (exData.status !== 'success') {
                            throw new Error(exData.data || 'exchange failed');
                        }
                        const secret = exData.data.secret_key;
                        pending.status = 'completed';
                        pending.secret = secret;
                        if (pending.pollTimer) clearInterval(pending.pollTimer);
                        this.log(opts, 'INFO', `[BlockHost/INFO]: Secret obtained. Starting playit agent...`);
                        this.emit();
                        // Start the agent with the new secret
                        const startRes = this.start(secret);
                        if (!startRes.ok) {
                            this.log(opts, 'ERROR', `[BlockHost/ERROR]: Agent failed to start: ${startRes.error}`);
                            opts.onComplete?.(null, startRes.error);
                        } else {
                            opts.onComplete?.(secret);
                        }
                    } catch (e) {
                        pending.status = 'error';
                        pending.error = e?.message || 'exchange failed';
                        this.log(opts, 'ERROR', `[BlockHost/ERROR]: Failed to exchange claim: ${pending.error}`);
                        if (pending.pollTimer) clearInterval(pending.pollTimer);
                        opts.onComplete?.(null, pending.error);
                        this.emit();
                    }
                } else if (setupStatus === 'UserRejected' && pending.status !== 'rejected') {
                    pending.status = 'rejected';
                    this.log(opts, 'WARN', `[BlockHost/WARN]: You rejected the claim in your browser. Tunnel setup cancelled.`);
                    if (pending.pollTimer) clearInterval(pending.pollTimer);
                    opts.onComplete?.(null, 'User rejected the claim');
                    this.emit();
                }
            } catch (e) {
            // Network error — keep polling
            }
            // Auto-cancel after 10 minutes
            if (pollCount > 300) {
                if (pending.pollTimer) clearInterval(pending.pollTimer);
                pending.status = 'error';
                pending.error = 'Claim timed out after 10 minutes';
                this.log(opts, 'WARN', `[BlockHost/WARN]: Claim timed out after 10 minutes. Restart the server to try again.`);
                opts.onComplete?.(null, pending.error);
                this.emit();
            }
        }, 2000);
        return {
            code,
            url
        };
    }
    cancelClaimFlow() {
        if (this.pendingClaim?.pollTimer) {
            clearInterval(this.pendingClaim.pollTimer);
        }
        this.pendingClaim = null;
        this.emit();
    }
    // Full reset: cancel any pending claim flow AND stop the running agent.
    // Used when the user wants to start over with a fresh playit.gg account —
    // e.g., they paired to the wrong account, or they want to release the
    // current agent and claim a new one.
    // The caller is responsible for clearing the saved secret from the user's
    // account in the DB (so the next server start triggers a fresh claim flow).
    reset() {
        // Cancel any pending claim flow
        if (this.pendingClaim?.pollTimer) {
            clearInterval(this.pendingClaim.pollTimer);
        }
        this.pendingClaim = null;
        // Stop the running agent (if any)
        if (this.proc) {
            try {
                this.proc.kill('SIGTERM');
            } catch  {}
            // Force kill after 3s
            setTimeout(()=>{
                if (this.proc) {
                    try {
                        this.proc.kill('SIGKILL');
                    } catch  {}
                }
            }, 3000);
        }
        this.status = 'stopped';
        this.pid = null;
        this.secret = null;
        this.lastError = '';
        this.tunnels.clear();
        this.emit();
        return {
            ok: true
        };
    }
    log(opts, level, text) {
        try {
            opts.log?.(level, text);
        } catch  {}
    }
    // Start the agent with the given secret. If already running with the same secret, no-op.
    ensureRunning(secret) {
        if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(PLAYIT_BIN)) {
            return {
                ok: false,
                error: 'playit binary not installed'
            };
        }
        if (!secret || secret.length < 10) {
            return {
                ok: false,
                error: 'invalid playit secret'
            };
        }
        if (this.status === 'running' && this.secret === secret) {
            return {
                ok: true
            };
        }
        if (this.status === 'running' && this.secret !== secret) {
            this.stop();
        }
        return this.start(secret);
    }
    start(secret) {
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"])(PLAYIT_DIR, {
            recursive: true
        });
        this.secret = secret;
        this.status = 'starting';
        this.lastError = '';
        this.stdoutBuf = '';
        try {
            // NOTE: --secret and --secret-path are mutually exclusive in the playit binary.
            // When using --secret (inline), we must NOT pass --secret-path.
            this.proc = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["spawn"])(PLAYIT_BIN, [
                '--secret',
                secret,
                '--socket-path',
                SOCKET_PATH,
                '--log-path',
                LOG_PATH
            ], {
                stdio: [
                    'ignore',
                    'pipe',
                    'pipe'
                ],
                env: {
                    ...process.env
                },
                detached: false
            });
        } catch (e) {
            this.status = 'error';
            this.lastError = `Failed to spawn: ${e?.message || e}`;
            this.emit();
            return {
                ok: false,
                error: this.lastError
            };
        }
        this.pid = this.proc?.pid ?? null;
        this.proc.stdout?.on('data', (data)=>{
            this.stdoutBuf += data.toString('utf8');
            let idx;
            while((idx = this.stdoutBuf.indexOf('\n')) >= 0){
                const line = this.stdoutBuf.slice(0, idx).trim();
                this.stdoutBuf = this.stdoutBuf.slice(idx + 1);
                this.handleLine(line);
            }
        });
        this.proc.stderr?.on('data', (data)=>{
            this.stdoutBuf += data.toString('utf8');
            let idx;
            while((idx = this.stdoutBuf.indexOf('\n')) >= 0){
                const line = this.stdoutBuf.slice(0, idx).trim();
                this.stdoutBuf = this.stdoutBuf.slice(idx + 1);
                this.handleLine(line);
            }
        });
        this.proc.on('error', (err)=>{
            this.status = 'error';
            this.lastError = `Process error: ${err.message}`;
            this.pid = null;
            this.emit();
        });
        this.proc.on('exit', (code, signal)=>{
            this.status = 'stopped';
            this.pid = null;
            this.proc = null;
            if (code !== 0) {
                this.lastError = `Agent exited with code ${code} (signal ${signal})`;
            }
            this.emit();
        });
        setTimeout(()=>{
            if (this.status === 'starting') {
                this.status = 'running';
                this.emit();
            }
        }, 5000);
        this.emit();
        return {
            ok: true
        };
    }
    handleLine(line) {
        const lower = line.toLowerCase();
        if (lower.includes('playit.gg') || lower.includes('tunnel')) {
            const portMatch = line.match(/port[:\s]+(\d+)/i);
            const addrMatch = line.match(/([\w-]+(?:\.[\w-]+)+\.playit\.gg)[:\s]*(\d+)/i);
            if (portMatch && addrMatch) {
                const localPort = parseInt(portMatch[1], 10);
                const assigned = `${addrMatch[1]}:${addrMatch[2]}`;
                const proto = lower.includes('udp') ? 'udp' : 'tcp';
                const key = `${proto}:${localPort}`;
                this.tunnels.set(key, {
                    localPort,
                    proto,
                    assignedAddress: assigned
                });
                this.emit();
            }
        }
        if (line.toLowerCase().includes('error') || line.toLowerCase().includes('failed')) {
            this.lastError = line.slice(0, 200);
        }
    }
    stop() {
        if (this.proc) {
            try {
                this.proc.kill('SIGTERM');
            } catch  {}
            setTimeout(()=>{
                if (this.proc) {
                    try {
                        this.proc.kill('SIGKILL');
                    } catch  {}
                }
            }, 3000);
        }
        this.status = 'stopped';
        this.pid = null;
        this.tunnels.clear();
        this.emit();
    }
    setTunnelAddress(localPort, address, proto = 'tcp') {
        const key = `${proto}:${localPort}`;
        this.tunnels.set(key, {
            localPort,
            proto,
            assignedAddress: address
        });
        this.emit();
    }
    getTunnelForPort(localPort, proto = 'tcp') {
        const key = `${proto}:${localPort}`;
        return this.tunnels.get(key) || null;
    }
}
const g = globalThis;
if (!g.__playitAgent) {
    g.__playitAgent = new PlayitAgent();
}
function getPlayitAgent() {
    return globalThis.__playitAgent;
}
function isPlayitInstalled() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(PLAYIT_BIN);
}
}),
"[project]/src/lib/mc/fabric.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFabricLaunchJar",
    ()=>getFabricLaunchJar,
    "getLatestFabricLoader",
    ()=>getLatestFabricLoader,
    "installFabric",
    ()=>installFabric,
    "isFabricInstalled",
    ()=>isFabricInstalled
]);
// Fabric mod loader support.
// Uses the official Fabric installer to generate a server launch jar for any
// Minecraft version that has a Fabric loader available.
//
// Flow:
//   1. Find the latest stable Fabric loader version for the requested MC version
//      via https://meta.fabricmc.net/v2/versions/loader/{mc}
//   2. Run `java -jar fabric-installer.jar server -mcversion {mc} -loader {loader} -downloadMinecraft`
//      in the server's working directory. This generates:
//        - fabric-server-launch.jar (the launcher to run with java -jar)
//        - libraries/ (Fabric libs)
//        - server.jar (the vanilla Minecraft server.jar)
//   3. Subsequent server starts use `java -jar fabric-server-launch.jar nogui`
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
const FABRIC_INSTALLER_PATH = '/home/z/my-project/mc-bin/fabric-installer.jar';
const META_BASE = 'https://meta.fabricmc.net/v2/versions/loader';
// Cache: mc version → latest stable loader version
const loaderCache = new Map();
async function getLatestFabricLoader(mcVersion) {
    if (loaderCache.has(mcVersion)) return loaderCache.get(mcVersion);
    try {
        const res = await fetch(`${META_BASE}/${encodeURIComponent(mcVersion)}`);
        if (!res.ok) return null;
        const data = await res.json();
        // Pick the latest stable loader; fall back to latest unstable if none stable
        const stable = data.find((l)=>l.loader.stable);
        const chosen = (stable || data[0])?.loader.version;
        if (chosen) loaderCache.set(mcVersion, chosen);
        return chosen || null;
    } catch (e) {
        console.error('Failed to fetch Fabric loader versions:', e);
        return null;
    }
}
function isFabricInstalled(serverDir) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(serverDir, 'fabric-server-launch.jar'));
}
async function installFabric(serverDir, mcVersion) {
    if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(FABRIC_INSTALLER_PATH)) {
        return {
            ok: false,
            error: 'Fabric installer jar not found'
        };
    }
    const loaderVersion = await getLatestFabricLoader(mcVersion);
    if (!loaderVersion) {
        return {
            ok: false,
            error: `No Fabric loader available for Minecraft ${mcVersion}`
        };
    }
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"])(serverDir, {
        recursive: true
    });
    return new Promise((resolve)=>{
        const proc = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["spawn"])('java', [
            '-jar',
            FABRIC_INSTALLER_PATH,
            'server',
            '-mcversion',
            mcVersion,
            '-loader',
            loaderVersion,
            '-downloadMinecraft',
            '-nogui'
        ], {
            cwd: serverDir,
            stdio: [
                'ignore',
                'pipe',
                'pipe'
            ],
            env: {
                ...process.env
            }
        });
        let stdout = '';
        let stderr = '';
        proc.stdout?.on('data', (d)=>{
            stdout += d.toString();
        });
        proc.stderr?.on('data', (d)=>{
            stderr += d.toString();
        });
        proc.on('exit', (code)=>{
            if (code === 0 && (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(serverDir, 'fabric-server-launch.jar'))) {
                resolve({
                    ok: true,
                    loaderVersion
                });
            } else {
                resolve({
                    ok: false,
                    error: `Fabric installer exited with code ${code}. ${stderr.slice(-500) || stdout.slice(-500)}`,
                    loaderVersion
                });
            }
        });
        proc.on('error', (e)=>{
            resolve({
                ok: false,
                error: `Failed to run installer: ${e.message}`
            });
        });
    });
}
function getFabricLaunchJar() {
    return 'fabric-server-launch.jar';
}
}),
"[project]/src/lib/mc/engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEngine",
    ()=>getEngine
]);
// Real Minecraft server process engine.
// Spawns actual `java -jar server.jar` processes for any Mojang version,
// supports all standard server.properties fields, and integrates with
// the playit.gg agent for public tunneling.
//
// Sandbox note: the Caddy gateway only proxies HTTPS, so external Minecraft
// clients cannot reach the server directly via TCP. With playit.gg enabled,
// the server is reachable at the assigned *.playit.gg address.
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$versions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mc/versions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$playit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mc/playit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$fabric$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mc/fabric.ts [app-route] (ecmascript)");
;
;
;
;
;
;
const BASE_DIR = '/home/z/my-project/mc-bin';
const SERVERS_DIR = '/home/z/my-project/mc-servers';
const JDK_17_DIR = '/home/z/my-project/jdk/jdk-17.0.13+11';
const JDK_25_DIR = '/home/z/my-project/jdk/jdk-25.0.5+8';
const MAX_RUNNING = 1 // Resource constraint: only one Java server at a time
;
const MAX_CONSOLE_LINES = 500;
const STOP_TIMEOUT_MS = 12000;
// Pick the right JDK binary for a required major Java version.
// Minecraft versions specify their required javaVersion (e.g. 17, 21, 25).
// We bundle Temurin 17 (for MC 1.18-1.20.4), use system Java 21 (for MC 1.20.5-1.21.x),
// and Temurin 25 (for the new 26.x series).
function pickJavaBin(requiredMajor) {
    if (requiredMajor <= 17) {
        const bin = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(JDK_17_DIR, 'bin', 'java');
        if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(bin)) return bin;
    }
    if (requiredMajor >= 25) {
        const bin = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(JDK_25_DIR, 'bin', 'java');
        if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(bin)) return bin;
    }
    // 18-24: use system Java (21) — works for MC 1.20.5 through 1.21.x
    return 'java';
}
class McEngine {
    processes = new Map();
    serverDirs = new Map();
    listeners = new Map();
    statsTimer = null;
    playitTimer = null;
    constructor(){
        if ("TURBOPACK compile-time truthy", 1) {
            this.statsTimer = setInterval(()=>this.sampleStats(), 2000);
            if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(SERVERS_DIR)) (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"])(SERVERS_DIR, {
                recursive: true
            });
            // Periodically refresh playit tunnel info into process state
            this.playitTimer = setInterval(()=>this.refreshPlayit(), 3000);
        }
    }
    serverDir(id) {
        let dir = this.serverDirs.get(id);
        if (!dir) {
            dir = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(SERVERS_DIR, id);
            this.serverDirs.set(id, dir);
        }
        return dir;
    }
    ensureServerDir(id) {
        const dir = this.serverDir(id);
        if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(dir)) (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"])(dir, {
            recursive: true
        });
        return dir;
    }
    writeServerProperties(opts) {
        const dir = this.ensureServerDir(opts.id);
        // Symlink shared libraries (1.20.4's libraries work for many versions, but
        // each version extracts its own on first boot — let the server do it)
        const libsLink = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(dir, 'libraries');
        if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(libsLink)) {
            try {
                symlinkSafe((0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(BASE_DIR, 'libraries'), libsLink);
            } catch  {}
        }
        // Always accept the EULA (we acknowledge Mojang's terms on behalf of the host operator)
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(dir, 'eula.txt'), 'eula=true\n');
        // Build server.properties from the user's settings
        const props = {
            'motd': opts.motd.slice(0, 59),
            'max-players': String(opts.maxPlayers),
            'server-port': String(opts.port),
            'difficulty': opts.difficulty,
            'gamemode': opts.gamemode,
            'pvp': String(opts.pvp),
            'enforce-whitelist': String(opts.whitelist),
            'white-list': String(opts.whitelist),
            'level-name': 'world',
            'online-mode': String(opts.onlineMode),
            'enable-status': 'true',
            // World generation
            'level-type': opts.levelType,
            'generate-structures': String(opts.generateStructures),
            'level-seed': opts.levelSeed || '',
            // Performance
            'view-distance': String(opts.viewDistance),
            'simulation-distance': String(opts.simulationDistance),
            'spawn-protection': String(opts.spawnProtection),
            'max-world-size': String(opts.maxWorldSize),
            'max-tick-time': String(opts.maxTickTime),
            // Behavior
            'hardcore': String(opts.hardcore),
            'allow-nether': String(opts.allowNether),
            'allow-flight': String(opts.allowFlight),
            'enable-command-block': String(opts.enableCommandBlock),
            'enforce-secure-profile': String(opts.enforceSecureProfile),
            // Resource pack
            'resource-pack': opts.resourcePack || '',
            'resource-pack-sha1': opts.resourcePackSha1 || '',
            'require-resource-pack': String(opts.requireResourcePack),
            // Misc
            'allow-flight': String(opts.allowFlight),
            'broadcast-console-to-ops': 'true',
            'enable-query': 'false',
            'enable-rcon': 'false',
            'network-compression-threshold': '256',
            'op-permission-level': '4',
            'function-permission-level': '2',
            'prevent-proxy-connections': 'false',
            'use-native-transport': 'true',
            'snooper-enabled': 'false'
        };
        const lines = Object.entries(props).map(([k, v])=>`${k}=${v}`);
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(dir, 'server.properties'), `#Minecraft server properties\n#Generated by BlockHost\n${lines.join('\n')}\n`);
    }
    pushLine(state, level, text) {
        state.consoleLines.push({
            id: Math.random().toString(36).slice(2, 11),
            ts: Date.now(),
            level,
            text
        });
        if (state.consoleLines.length > MAX_CONSOLE_LINES) {
            state.consoleLines.splice(0, state.consoleLines.length - MAX_CONSOLE_LINES);
        }
    }
    emit(id) {
        const state = this.processes.get(id);
        if (!state) return;
        const subs = this.listeners.get(id);
        if (!subs) return;
        for (const l of subs){
            try {
                l(state);
            } catch (e) {
                console.error('listener error', e);
            }
        }
    }
    register(opts) {
        let state = this.processes.get(opts.id);
        if (!state) {
            state = {
                id: opts.id,
                proc: null,
                pid: null,
                status: 'offline',
                consoleLines: [],
                startedAt: null,
                stoppedAt: null,
                lastCpuTime: null,
                lastSampleAt: null,
                cpu: 0,
                ram: 0,
                members: [],
                pendingForceKill: null,
                jarPath: null,
                javaVersion: 17,
                playitAddress: null
            };
            this.processes.set(opts.id, state);
        }
        this.writeServerProperties(opts);
        return state;
    }
    getState(id) {
        return this.processes.get(id);
    }
    async start(opts) {
        const state = this.register(opts);
        if (state.status === 'online' || state.status === 'starting') {
            return {
                ok: false,
                error: 'Server is already running'
            };
        }
        // Enforce the one-running-server limit
        let runningCount = 0;
        for (const s of this.processes.values()){
            if (s.status === 'online' || s.status === 'starting') runningCount++;
        }
        if (runningCount >= MAX_RUNNING) {
            for (const [otherId, s] of this.processes.entries()){
                if ((s.status === 'online' || s.status === 'starting') && otherId !== opts.id) {
                    this.stop(otherId);
                }
            }
        }
        // Ensure the right server.jar is downloaded for this version
        const ramMax = Math.min(opts.ramMax, 768);
        const dir = this.serverDir(opts.id);
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: Preparing Minecraft ${opts.version} ${opts.type} server`);
        this.emit(opts.id);
        const jarInfo = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$versions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureServerJar"])(opts.version);
        if (jarInfo.error || !jarInfo.path) {
            this.pushLine(state, 'ERROR', `[BlockHost/ERROR]: ${jarInfo.error || 'Failed to download server.jar'}`);
            state.status = 'crashed';
            this.emit(opts.id);
            return {
                ok: false,
                error: jarInfo.error || 'Failed to download server.jar'
            };
        }
        state.jarPath = jarInfo.path;
        state.javaVersion = jarInfo.javaVersion;
        // If this is a Fabric server, run the Fabric installer to generate the
        // launch jar + libraries (only needed once per server dir; subsequent
        // starts reuse the existing fabric-server-launch.jar).
        let runJarName = 'server.jar' // which jar to run with java -jar
        ;
        if (opts.type === 'fabric') {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$fabric$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFabricInstalled"])(dir)) {
                this.pushLine(state, 'INFO', `[BlockHost/INFO]: Installing Fabric loader for MC ${opts.version}...`);
                this.emit(opts.id);
                const fabricResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$fabric$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["installFabric"])(dir, opts.version);
                if (!fabricResult.ok) {
                    this.pushLine(state, 'ERROR', `[BlockHost/ERROR]: Fabric install failed: ${fabricResult.error}`);
                    state.status = 'crashed';
                    this.emit(opts.id);
                    return {
                        ok: false,
                        error: fabricResult.error || 'Fabric install failed'
                    };
                }
                this.pushLine(state, 'INFO', `[BlockHost/INFO]: Fabric loader ${fabricResult.loaderVersion} installed. Mods go in the "mods/" folder.`);
            } else {
                this.pushLine(state, 'INFO', `[BlockHost/INFO]: Using existing Fabric installation.`);
            }
            runJarName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$fabric$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFabricLaunchJar"])();
        }
        // Reset state for a fresh boot
        state.consoleLines = [];
        state.members = [];
        state.cpu = 0;
        state.ram = 0;
        state.lastCpuTime = null;
        state.lastSampleAt = null;
        state.status = 'starting';
        state.startedAt = Date.now();
        state.stoppedAt = null;
        state.playitAddress = null;
        if (state.pendingForceKill) {
            clearTimeout(state.pendingForceKill);
            state.pendingForceKill = null;
        }
        // Pick the right JDK for the version. Minecraft versions specify a required
        // major Java version (e.g. 1.20.4 → Java 17, 1.20.5+ → Java 21, 26.x → Java 25).
        // We bundle Temurin JDK 17 and JDK 25 in /home/z/my-project/jdk/, and fall
        // back to the system Java 21 for anything in between.
        const javaBin = pickJavaBin(state.javaVersion);
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: Starting real Minecraft server (Java ${state.javaVersion})`);
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: Working directory: ${dir}`);
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: JVM heap: -Xmx${ramMax}M`);
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: JDK: ${javaBin}`);
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: World type: ${opts.levelType.replace(/minecraft\\/, '')}${opts.levelSeed ? ', seed: ' + opts.levelSeed : ''}`);
        this.emit(opts.id);
        // Build the Java command
        // For vanilla servers: symlink the version-specific server.jar into the server's directory.
        // For Fabric servers: the installer already downloaded server.jar + libs + launch jar, so we just run the launch jar.
        if (opts.type !== 'fabric') {
            const jarLink = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(dir, 'server.jar');
            try {
                if ((0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(jarLink)) (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"])(jarLink);
                symlinkSafe(state.jarPath, jarLink);
            } catch  {}
        }
        const args = [
            `-Xmx${ramMax}M`,
            `-Xms${Math.min(256, ramMax)}M`,
            '-Dlog4j2.formatMsgNoLookups=true',
            '-jar',
            runJarName,
            'nogui'
        ];
        let proc;
        try {
            // Prepend the JDK's bin dir to PATH so the JVM can find its own tools
            const jdkDir = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["dirname"])(javaBin);
            const env = {
                ...process.env,
                MALLOC_ARENA_MAX: '2'
            };
            env.PATH = `${jdkDir}:${env.PATH || ''}`;
            // JAVA_HOME helps some Minecraft versions find their runtime
            env.JAVA_HOME = jdkDir.replace('/bin', '');
            proc = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["spawn"])(javaBin, args, {
                cwd: dir,
                stdio: [
                    'pipe',
                    'pipe',
                    'pipe'
                ],
                env,
                detached: false
            });
        } catch (e) {
            state.status = 'crashed';
            this.pushLine(state, 'ERROR', `[BlockHost/ERROR]: Failed to spawn Java process: ${e?.message || e}`);
            this.emit(opts.id);
            return {
                ok: false,
                error: 'Failed to start Java process'
            };
        }
        state.proc = proc;
        state.pid = proc.pid ?? null;
        let stdoutBuf = '';
        let stderrBuf = '';
        const parseAndAppend = (raw, stream)=>{
            const combined = (stream === 'stdout' ? stdoutBuf : stderrBuf) + raw;
            const lines = combined.split('\n');
            if (stream === 'stdout') stdoutBuf = lines.pop() || '';
            else stderrBuf = lines.pop() || '';
            for (const line of lines){
                const trimmed = line.replace(/\r$/, '');
                if (!trimmed) continue;
                const parsed = this.parseLogLine(trimmed);
                this.pushLine(state, parsed.level, parsed.text);
                // Detect "Done" message → server is online
                if (parsed.text.includes('Done (') && parsed.text.includes(')! For help, type "help"')) {
                    state.status = 'online';
                    state.startedAt = state.startedAt || Date.now();
                }
                // Detect player join/leave
                const joinMatch = parsed.text.match(/^(\w[\w_]{2,15}) joined the game$/);
                if (joinMatch) {
                    const name = joinMatch[1];
                    if (!state.members.includes(name)) state.members.push(name);
                }
                const leaveMatch = parsed.text.match(/^(\w[\w_]{2,15}) left the game$/);
                if (leaveMatch) {
                    const name = leaveMatch[1];
                    state.members = state.members.filter((n)=>n !== name);
                }
            }
            this.emit(opts.id);
        };
        proc.stdout?.on('data', (data)=>parseAndAppend(data.toString('utf8'), 'stdout'));
        proc.stderr?.on('data', (data)=>parseAndAppend(data.toString('utf8'), 'stderr'));
        proc.on('error', (err)=>{
            this.pushLine(state, 'ERROR', `[BlockHost/ERROR]: Process error: ${err.message}`);
            state.status = 'crashed';
            this.emit(opts.id);
        });
        proc.on('exit', (code, signal)=>{
            if (state.pendingForceKill) {
                clearTimeout(state.pendingForceKill);
                state.pendingForceKill = null;
            }
            const wasStopping = state.status === 'stopping';
            state.status = 'offline';
            state.stoppedAt = Date.now();
            state.pid = null;
            state.proc = null;
            state.cpu = 0;
            state.ram = 0;
            state.members = [];
            state.playitAddress = null;
            if (code === 0 || wasStopping) {
                this.pushLine(state, 'INFO', `[BlockHost/INFO]: Server process exited (code ${code}).`);
            } else {
                state.status = 'crashed';
                this.pushLine(state, 'ERROR', `[BlockHost/ERROR]: Server process exited unexpectedly (code ${code}, signal ${signal}).`);
            }
            this.emit(opts.id);
        });
        // Servers are PRIVATE by default — they only listen on the local network
        // (0.0.0.0:<port>) and are not exposed to the internet. Players on the same
        // LAN can connect directly. To expose a server publicly, the user must opt
        // in via the Tunnel tab (which starts the playit agent explicitly).
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: Server will listen on 0.0.0.0:${opts.port} (private — LAN only by default)`);
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: To expose this server publicly, open the Tunnel tab and start a playit.gg tunnel.`);
        // Note: playit agent is NOT auto-started here. The Tunnel tab drives it.
        return {
            ok: true
        };
    }
    stop(id) {
        const state = this.processes.get(id);
        if (!state) return {
            ok: false,
            error: 'Server not registered'
        };
        if (!state.proc || state.status === 'offline' || state.status === 'stopping') {
            return {
                ok: false,
                error: 'Server is not running'
            };
        }
        state.status = 'stopping';
        this.pushLine(state, 'CMD', `[CONSOLE]: stop`);
        this.pushLine(state, 'INFO', `[Server thread/INFO]: Stopping the server`);
        this.emit(id);
        try {
            state.proc.stdin?.write('stop\n');
            state.proc.stdin?.end();
        } catch  {}
        if (state.pendingForceKill) clearTimeout(state.pendingForceKill);
        state.pendingForceKill = setTimeout(()=>{
            const s = this.processes.get(id);
            if (s && s.proc && s.status !== 'offline') {
                try {
                    this.pushLine(s, 'WARN', `[BlockHost/WARN]: Server did not stop gracefully within ${STOP_TIMEOUT_MS / 1000}s — force killing.`);
                    s.proc.kill('SIGKILL');
                } catch  {}
                this.emit(id);
            }
        }, STOP_TIMEOUT_MS);
        return {
            ok: true
        };
    }
    async restart(opts) {
        const state = this.processes.get(opts.id);
        if (!state) {
            return await this.start(opts);
        }
        if (state.status === 'online' || state.status === 'starting') {
            this.stop(opts.id);
            await new Promise((r)=>setTimeout(r, 4000));
            return await this.start(opts);
        } else {
            return await this.start(opts);
        }
    }
    sendCommand(id, command) {
        const state = this.processes.get(id);
        if (!state) return {
            ok: false,
            error: 'Server not registered'
        };
        if (state.status !== 'online' || !state.proc) {
            return {
                ok: false,
                error: 'Server is not online'
            };
        }
        this.pushLine(state, 'CMD', `[CONSOLE]: ${command}`);
        this.emit(id);
        try {
            state.proc.stdin?.write(command + '\n');
        } catch (e) {
            return {
                ok: false,
                error: 'Failed to write to stdin: ' + e?.message
            };
        }
        return {
            ok: true
        };
    }
    parseLogLine(line) {
        const m = line.match(/^\[\d{2}:\d{2}:\d{2}\]\s*\[([^\]]+)\/([^\]]+)\]:\s*(.*)$/);
        if (m) {
            const level = m[2].toUpperCase();
            const text = m[3];
            if (level === 'ERROR' || level === 'FATAL') return {
                level: 'ERROR',
                text
            };
            if (level === 'WARN') return {
                level: 'WARN',
                text
            };
            return {
                level: 'INFO',
                text
            };
        }
        if (/error|exception|failed/i.test(line)) return {
            level: 'ERROR',
            text: line
        };
        if (/warn/i.test(line)) return {
            level: 'WARN',
            text: line
        };
        return {
            level: 'INFO',
            text: line
        };
    }
    sampleStats() {
        for (const [id, state] of this.processes.entries()){
            if (!state.pid || state.status === 'offline' || state.status === 'crashed') continue;
            try {
                const status = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])(`/proc/${state.pid}/status`, 'utf8');
                const rssMatch = status.match(/^VmRSS:\s*(\d+)\s*kB/m);
                if (rssMatch) {
                    state.ram = Math.round(parseInt(rssMatch[1], 10) / 1024);
                }
                const stat = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])(`/proc/${state.pid}/stat`, 'utf8');
                const commEnd = stat.lastIndexOf(')');
                const afterComm = stat.slice(commEnd + 2).trim().split(/\s+/);
                const utime = parseInt(afterComm[11], 10);
                const stime = parseInt(afterComm[12], 10);
                const totalTicks = utime + stime;
                const now = Date.now();
                if (state.lastCpuTime !== null && state.lastSampleAt !== null) {
                    const dticks = totalTicks - state.lastCpuTime;
                    const dms = now - state.lastSampleAt;
                    const hz = 100;
                    const cpuPct = dticks / hz / (dms / 1000) * 100;
                    state.cpu = Math.max(0, Math.min(100, Math.round(cpuPct * 10) / 10));
                }
                state.lastCpuTime = totalTicks;
                state.lastSampleAt = now;
                this.emit(id);
            } catch (e) {
            // Process might have exited — ignore
            }
        }
    }
    refreshPlayit() {
        const agent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$playit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPlayitAgent"])();
        for (const [id, state] of this.processes.entries()){
            if (state.status !== 'online' || !state.proc) continue;
            // We don't know the port from ProcessState directly, but we can read it
            // from server.properties in the server dir
            const dir = this.serverDirs.get(id);
            if (!dir) continue;
            try {
                const props = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"])(dir, 'server.properties'), 'utf8');
                const portMatch = props.match(/^server-port=(\d+)$/m);
                if (!portMatch) continue;
                const port = parseInt(portMatch[1], 10);
                const tunnel = agent.getTunnelForPort(port);
                if (tunnel && tunnel.assignedAddress && tunnel.assignedAddress !== state.playitAddress) {
                    state.playitAddress = tunnel.assignedAddress;
                    this.pushLine(state, 'INFO', `[BlockHost/INFO]: Public tunnel established: ${tunnel.assignedAddress}`);
                    this.emit(id);
                }
            } catch  {}
        }
    }
    // Allow the API to set the playit address manually (for tunnels created via the playit.gg web UI)
    setPlayitAddress(id, address) {
        const state = this.processes.get(id);
        if (!state) return;
        state.playitAddress = address;
        if (address) {
            this.pushLine(state, 'INFO', `[BlockHost/INFO]: Public playit.gg address set: ${address}`);
        }
        this.emit(id);
    }
    subscribe(id, listener) {
        if (!this.listeners.has(id)) this.listeners.set(id, new Set());
        this.listeners.get(id).add(listener);
        const state = this.processes.get(id);
        if (state) listener(state);
        return ()=>{
            this.listeners.get(id)?.delete(listener);
        };
    }
    getConsoleSince(id, sinceTs) {
        const state = this.processes.get(id);
        if (!state) return [];
        return state.consoleLines.filter((l)=>l.ts > sinceTs);
    }
    getStats(id) {
        const state = this.processes.get(id);
        if (!state) return null;
        const uptime = state.startedAt && (state.status === 'online' || state.status === 'starting' || state.status === 'stopping') ? Math.floor((Date.now() - state.startedAt) / 1000) : 0;
        return {
            cpu: state.cpu,
            ram: state.ram,
            players: state.members.length,
            uptime,
            status: state.status,
            tickRate: state.status === 'online' ? 20.0 : 0,
            members: [
                ...state.members
            ],
            playitAddress: state.playitAddress,
            javaVersion: state.javaVersion
        };
    }
    dispose() {
        if (this.statsTimer) clearInterval(this.statsTimer);
        if (this.playitTimer) clearInterval(this.playitTimer);
        for (const [, state] of this.processes.entries()){
            if (state.pendingForceKill) clearTimeout(state.pendingForceKill);
            try {
                state.proc?.kill('SIGTERM');
            } catch  {}
        }
        this.processes.clear();
        this.listeners.clear();
    }
}
function symlinkSafe(target, link) {
    try {
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["symlinkSync"])(target, link, 'file');
    } catch (e) {
        // Try as a directory if file fails
        try {
            (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["symlinkSync"])(target, link, 'dir');
        } catch  {}
    }
}
const g = globalThis;
if (!g.__mcEngine) {
    g.__mcEngine = new McEngine();
}
function getEngine() {
    return globalThis.__mcEngine;
}
}),
"[project]/src/app/api/stats/system/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db-v2.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mc/engine.ts [app-route] (ecmascript)");
;
;
;
;
;
const dynamic = 'force-dynamic';
let lastCpuSample = null;
function readCpuUsage() {
    try {
        const stat = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])('/proc/stat', 'utf8');
        // First line is aggregate: "cpu  user nice system idle iowait irq softirq steal guest guest_nice"
        const line = stat.split('\n')[0];
        const parts = line.trim().split(/\s+/);
        if (parts[0] !== 'cpu') return {
            cpuPercent: 0,
            sampleAge: 0
        };
        const user = parseInt(parts[1], 10);
        const nice = parseInt(parts[2], 10);
        const system = parseInt(parts[3], 10);
        const idle = parseInt(parts[4], 10);
        const iowait = parseInt(parts[5], 10) || 0;
        const irq = parseInt(parts[6], 10) || 0;
        const softirq = parseInt(parts[7], 10) || 0;
        const steal = parseInt(parts[8], 10) || 0;
        const totalIdle = idle + iowait;
        const totalNonIdle = user + nice + system + irq + softirq + steal;
        const total = totalIdle + totalNonIdle;
        const now = Date.now();
        if (lastCpuSample) {
            const dTotal = total - lastCpuSample.total;
            const dIdle = totalIdle - lastCpuSample.idle;
            const cpuPercent = dTotal > 0 ? Math.max(0, Math.min(100, (dTotal - dIdle) / dTotal * 100)) : 0;
            lastCpuSample = {
                idle: totalIdle,
                total,
                ts: now
            };
            return {
                cpuPercent: Math.round(cpuPercent * 10) / 10,
                sampleAge: now - lastCpuSample.ts
            };
        }
        lastCpuSample = {
            idle: totalIdle,
            total,
            ts: now
        };
        // First sample — return 0 (need two samples to compute delta)
        return {
            cpuPercent: 0,
            sampleAge: 0
        };
    } catch  {
        return {
            cpuPercent: 0,
            sampleAge: 0
        };
    }
}
function readMemInfo() {
    try {
        const meminfo = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])('/proc/meminfo', 'utf8');
        const get = (key)=>{
            const m = meminfo.match(new RegExp(`^${key}:\\s+(\\d+)\\s+kB`, 'm'));
            return m ? parseInt(m[1], 10) : 0;
        };
        const totalKb = get('MemTotal');
        const availableKb = get('MemAvailable') || get('MemFree') + get('Buffers') + get('Cached');
        const totalMb = Math.round(totalKb / 1024);
        const availableMb = Math.round(availableKb / 1024);
        const usedMb = totalMb - availableMb;
        const usedPercent = totalMb > 0 ? Math.round(usedMb / totalMb * 1000) / 10 : 0;
        return {
            totalMb,
            availableMb,
            usedMb,
            usedPercent
        };
    } catch  {
        return {
            totalMb: 0,
            availableMb: 0,
            usedMb: 0,
            usedPercent: 0
        };
    }
}
async function GET() {
    try {
        const cpu = readCpuUsage();
        const mem = readMemInfo();
        const activeSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getActiveSessionCount"])();
        // Count all servers across all users
        const allServers = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].server.findMany({
            select: {
                id: true,
                status: true,
                ownerId: true,
                name: true,
                version: true,
                type: true,
                players: true,
                port: true
            }
        });
        const runningCount = allServers.filter((s)=>s.status === 'online' || s.status === 'starting').length;
        const offlineCount = allServers.filter((s)=>s.status === 'offline' || s.status === 'crashed').length;
        const stoppingCount = allServers.filter((s)=>s.status === 'stopping').length;
        const totalPlayers = allServers.reduce((sum, s)=>sum + (s.players || 0), 0);
        // Engine stats — sum of running Java processes' CPU + RAM
        const engine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getEngine"])();
        let totalEngineCpu = 0;
        let totalEngineRam = 0;
        let runningServerIds = [];
        for (const s of allServers){
            const stats = engine.getStats(s.id);
            if (stats && (stats.status === 'online' || stats.status === 'starting')) {
                totalEngineCpu += stats.cpu;
                totalEngineRam += stats.ram;
                runningServerIds.push(s.id);
            }
        }
        const totalUsers = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.count();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            system: {
                cpuPercent: cpu.cpuPercent,
                memory: mem,
                loadAverage: readLoadAvg(),
                uptime: readSystemUptime()
            },
            platform: {
                activeSessions,
                totalUsers,
                totalServers: allServers.length,
                serversRunning: runningCount,
                serversOffline: offlineCount,
                serversStopping: stoppingCount,
                totalPlayers,
                runningServerIds
            },
            engine: {
                totalCpuPercent: Math.round(totalEngineCpu * 10) / 10,
                totalRamMb: Math.round(totalEngineRam),
                runningCount: runningServerIds.length
            }
        });
    } catch (e) {
        console.error('GET /api/stats/system error:', e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to read system stats'
        }, {
            status: 500
        });
    }
}
function readLoadAvg() {
    try {
        const s = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])('/proc/loadavg', 'utf8');
        return s.split(/\s+/).slice(0, 3).map(Number);
    } catch  {
        return [
            0,
            0,
            0
        ];
    }
}
function readSystemUptime() {
    try {
        const s = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"])('/proc/uptime', 'utf8');
        return Math.floor(parseFloat(s.split(/\s+/)[0]));
    } catch  {
        return 0;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e5895e5a._.js.map