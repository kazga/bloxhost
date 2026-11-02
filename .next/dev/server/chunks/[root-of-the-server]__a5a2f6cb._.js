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
"[project]/src/app/api/servers/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db-v2.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.ts [app-route] (ecmascript)");
;
;
;
const dynamic = 'force-dynamic';
async function GET() {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        let servers;
        if (user) {
            // Show user's servers + any orphan "guest" servers from before login
            servers = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].server.findMany({
                where: {
                    OR: [
                        {
                            ownerId: user.id
                        },
                        {
                            ownerId: 'guest'
                        }
                    ]
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } else {
            servers = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].server.findMany({
                where: {
                    ownerId: 'guest'
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            servers,
            user
        });
    } catch (e) {
        console.error('GET /api/servers error:', e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch servers'
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        const ownerId = user?.id || 'guest';
        const ownerName = user?.name || 'Guest';
        const body = await req.json();
        const { name, type = 'vanilla', version = '1.20.4', motd = 'A Minecraft Server', maxPlayers = 20, ramMax = 768, difficulty = 'normal', gamemode = 'survival', pvp = true, whitelist = false, levelType = 'minecraft\\default', levelSeed = '', generateStructures = true, viewDistance = 8, simulationDistance = 8, spawnProtection = 16, maxWorldSize = 29999984, maxTickTime = 60000, hardcore = false, allowNether = true, allowFlight = false, enableCommandBlock = false, enforceSecureProfile = false, onlineMode = false, resourcePack = '', resourcePackSha1 = '', requireResourcePack = false } = body || {};
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Server name is required'
            }, {
                status: 400
            });
        }
        if (name.length > 32) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Server name must be 32 characters or less'
            }, {
                status: 400
            });
        }
        // Per-user limit: max 10 servers
        const count = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].server.count({
            where: {
                ownerId
            }
        });
        if (count >= 10) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Server limit reached (10 per account). Delete an existing server first.'
            }, {
                status: 400
            });
        }
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'server';
        const host = `${slug}.freemc.host`;
        const server = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2d$v2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].server.create({
            data: {
                name: name.trim(),
                type,
                version,
                motd,
                maxPlayers: Number(maxPlayers) || 20,
                ramMax: Math.min(Number(ramMax) || 768, 768),
                difficulty,
                gamemode,
                pvp: Boolean(pvp),
                whitelist: Boolean(whitelist),
                ownerId,
                ownerName,
                host,
                port: 25565 + Math.floor(Math.random() * 1000),
                status: 'offline',
                levelType,
                levelSeed,
                generateStructures: Boolean(generateStructures),
                viewDistance: Number(viewDistance) || 8,
                simulationDistance: Number(simulationDistance) || 8,
                spawnProtection: Number(spawnProtection) || 16,
                maxWorldSize: Number(maxWorldSize) || 29999984,
                maxTickTime: Number(maxTickTime) || 60000,
                hardcore: Boolean(hardcore),
                allowNether: Boolean(allowNether),
                allowFlight: Boolean(allowFlight),
                enableCommandBlock: Boolean(enableCommandBlock),
                enforceSecureProfile: Boolean(enforceSecureProfile),
                onlineMode: Boolean(onlineMode),
                resourcePack,
                resourcePackSha1,
                requireResourcePack: Boolean(requireResourcePack)
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            server
        });
    } catch (e) {
        console.error('POST /api/servers error:', e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create server'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a5a2f6cb._.js.map