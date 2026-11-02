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
"[project]/src/app/api/versions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$versions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mc/versions.ts [app-route] (ecmascript)");
;
;
const dynamic = 'force-dynamic';
async function GET(req) {
    try {
        const url = new URL(req.url);
        const filter = url.searchParams.get('filter') || 'recommended';
        if (filter === 'recommended') {
            const [recommended, latest] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$versions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listRecommendedVersions"])(),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$versions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLatestVersion"])()
            ]);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                latest,
                versions: recommended
            });
        }
        const versions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$versions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listVersions"])(filter);
        const latest = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mc$2f$versions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLatestVersion"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            latest,
            versions
        });
    } catch (e) {
        console.error('GET /api/versions error:', e);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch versions'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d32c9f56._.js.map