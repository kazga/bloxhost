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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

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
"[project]/src/app/api/auth/me/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.ts [app-route] (ecmascript)");
;
;
const dynamic = 'force-dynamic';
async function GET() {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
    if (!user) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        user: null
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            playitSecret: user.playitSecret ? `${user.playitSecret.slice(0, 4)}…${user.playitSecret.slice(-4)}` : null,
            hasPlayit: Boolean(user.playitSecret)
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6a8896b9._.js.map