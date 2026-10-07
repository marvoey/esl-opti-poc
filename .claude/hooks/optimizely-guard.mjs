#!/usr/bin/env node
// Environment guard for the Optimizely SaaS MCP server and CMS schema pushes.
//
// Usage (wired in .claude/settings.json):
//   node optimizely-guard.mjs pre     PreToolUse  (MCP tools, Bash, PowerShell)
//   node optimizely-guard.mjs post    PostToolUse (MCP tools)
//   node optimizely-guard.mjs status  human-readable state, for troubleshooting
//
// Guarantees:
//   1. .env must be the testing instance and must differ from .env.vercel (production).
//   2. No MCP tool runs in a session until the connected instance is fingerprinted as
//      testing (start page _metadata.url.base === testing app host).
//   3. MCP schema-write tools are always denied: code (cms:push:local) owns the schema.
//   4. MCP content writes are limited to "[WF]"-prefixed items tracked in a ledger.
//   5. Production pushes and any use of .env.vercel from the shell are denied.
//   6. The Optimizely server reached under any name other than config.mcpServer (for
//      example a duplicate registration created by drive-letter casing) is denied outright.
//   7. Test experiences are created inside the ESL Start Page site and start with an empty
//      Blank Section (preview + Visual Builder properties-panel requirements).
//
// Fails closed: any internal error while evaluating an MCP call or a push denies it.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CONFIG_PATH = path.join(PROJECT_DIR, '.claude', 'optimizely-env.json');
const STATE_DIR = path.join(PROJECT_DIR, '.claude', 'state');
const VERIFY_PATH = path.join(STATE_DIR, 'optimizely-env-verified.json');
const LEDGER_PATH = path.join(STATE_DIR, 'optimizely-ledger.json');

const SCHEMA_WRITE_TOOLS = new Set([
  'cms_create_content_type',
  'cms_update_content_type',
  'cms_delete_content_type',
  'cms_create_property_group',
  'cms_create_display_template',
  'cms_update_display_template',
]);
const OUT_OF_SCOPE_TOOLS = new Set(['cms_create_content_variation']);
const READ_TOOLS = new Set([
  'cms_list_content_types',
  'cms_get_content_type_details',
  'cms_list_property_groups',
  'cms_list_display_templates',
  'cms_get_display_template',
  'cms_get_content_data',
  'cms_get_content_preview_url',
  'graph_content_type_schema',
  'graph_content_graphql_executor',
  'graph_content_search_tool',
]);
const CREATE_TOOLS = new Set(['cms_create_content_item', 'cms_upload_media']);
// Every tool the Optimizely server exposes (confirmed 2026-09-23). Used to recognise the
// server when it is registered under a name other than config.mcpServer.
const ALL_OPTIMIZELY_TOOLS = new Set([
  ...SCHEMA_WRITE_TOOLS,
  ...OUT_OF_SCOPE_TOOLS,
  ...READ_TOOLS,
  ...CREATE_TOOLS,
  'cms_update_content_item',
  'cms_publish_content_item',
  'cms_delete_content_item',
]);

// ---------------------------------------------------------------- helpers

function readJson(file, fallback) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2));
}

function parseEnvFile(file) {
  const out = {};
  const raw = readFileSync(path.join(PROJECT_DIR, file), 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    out[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  }
  return out;
}

const normalizeUrl = (u) => (u || '').trim().replace(/\/+$/, '').toLowerCase();
const normalizeQuery = (q) => (q || '').replace(/\s+/g, ' ').trim();
const normalizeKey = (k) => (k || '').replace(/-/g, '').toLowerCase();

function emitPre(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: decision,
        permissionDecisionReason: `[optimizely-guard] ${reason}`,
      },
    })
  );
  process.exit(0);
}

function emitPostContext(text) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `[optimizely-guard] ${text}` },
    })
  );
  process.exit(0);
}

// Returns null when .env is safely the testing instance, else a reason string.
function checkEnvFiles(config) {
  let testEnv;
  try {
    testEnv = parseEnvFile(config.testing.envFile);
  } catch {
    return `${config.testing.envFile} is missing or unreadable.`;
  }
  const cmsUrl = normalizeUrl(testEnv.OPTIMIZELY_CMS_URL);
  const appHost = normalizeUrl(testEnv.OPTIMIZELY_APP_HOST);
  if (!cmsUrl) return `${config.testing.envFile} has no OPTIMIZELY_CMS_URL.`;
  if (cmsUrl === normalizeUrl(config.production.cmsUrl)) {
    return `${config.testing.envFile} points at the PRODUCTION CMS (${cmsUrl}).`;
  }
  if (cmsUrl !== normalizeUrl(config.testing.cmsUrl)) {
    return `${config.testing.envFile} OPTIMIZELY_CMS_URL (${cmsUrl}) is not the configured testing CMS (${config.testing.cmsUrl}).`;
  }
  if (appHost !== normalizeUrl(config.testing.appHost)) {
    return `${config.testing.envFile} OPTIMIZELY_APP_HOST (${appHost}) is not the configured testing app host (${config.testing.appHost}).`;
  }
  try {
    const prodEnv = parseEnvFile(config.production.envFile);
    if (normalizeUrl(prodEnv.OPTIMIZELY_CMS_URL) === cmsUrl) {
      return `${config.testing.envFile} and ${config.production.envFile} point at the same CMS instance.`;
    }
    if (prodEnv.OPTIMIZELY_CMS_CLIENT_ID && prodEnv.OPTIMIZELY_CMS_CLIENT_ID === testEnv.OPTIMIZELY_CMS_CLIENT_ID) {
      return `${config.testing.envFile} and ${config.production.envFile} share the same CMS client id.`;
    }
  } catch {
    // No production env file on this machine: nothing to compare against.
  }
  return null;
}

function currentVerification(config, sessionId) {
  const state = readJson(VERIFY_PATH, null);
  if (!state || state.status !== 'verified') return null;
  if (state.sessionId !== sessionId) return null;
  const ageMinutes = (Date.now() - Date.parse(state.verifiedAt)) / 60000;
  if (!(ageMinutes >= 0 && ageMinutes <= config.verificationTtlMinutes)) return null;
  if (normalizeUrl(state.appHost) !== normalizeUrl(config.testing.appHost)) return null;
  return state;
}

function ledgerHas(key) {
  const ledger = readJson(LEDGER_PATH, { items: [] });
  return ledger.items.some((i) => normalizeKey(i.key) === normalizeKey(key));
}

function stringField(input, ...names) {
  for (const n of names) {
    if (typeof input?.[n] === 'string' && input[n].trim()) return input[n].trim();
  }
  return '';
}

// ---------------------------------------------------------------- MCP registrations

// Every MCP server registration Claude Code can load for this project: project .mcp.json,
// plus user and per-project (any path casing) entries in ~/.claude.json.
function findRegistrations() {
  const regs = [];
  const add = (servers, source) => {
    for (const [name, cfg] of Object.entries(servers || {})) {
      if (cfg && typeof cfg.url === 'string') regs.push({ name, url: cfg.url, source });
    }
  };
  add(readJson(path.join(PROJECT_DIR, '.mcp.json'), {}).mcpServers, '.mcp.json');
  const user = readJson(path.join(homedir(), '.claude.json'), {});
  add(user.mcpServers, '~/.claude.json user');
  const here = PROJECT_DIR.replace(/\\/g, '/').toLowerCase();
  for (const [projectPath, entry] of Object.entries(user.projects || {})) {
    if (projectPath.replace(/\\/g, '/').toLowerCase() === here) {
      add(entry?.mcpServers, `~/.claude.json local "${projectPath}"`);
    }
  }
  return regs;
}

// The Optimizely server reached under any other name bypasses the name-based permission
// rules, so it is denied outright rather than guarded.
function preMcpAlias(config, server, tool) {
  const pointsAtOptimizely = findRegistrations().some(
    (r) => r.name === server && normalizeUrl(r.url) === normalizeUrl(config.mcpUrl)
  );
  if (!pointsAtOptimizely && !ALL_OPTIMIZELY_TOOLS.has(tool)) process.exit(0);
  emitPre(
    'deny',
    `The Optimizely MCP server is registered here as "${server}", but the guard only permits "${config.mcpServer}". Calls through any other name are blocked because the permission rules would not apply. Fix: remove the "${server}" registration (claude mcp remove "${server}" -s local) so only "${config.mcpServer}" from .mcp.json remains, then restart the session.`
  );
}

// The canonical name must resolve to the Optimizely URL only.
function assertCanonicalUrl(config) {
  const urls = findRegistrations()
    .filter((r) => r.name === config.mcpServer)
    .map((r) => normalizeUrl(r.url));
  if (urls.some((u) => u !== normalizeUrl(config.mcpUrl))) {
    emitPre('deny', `"${config.mcpServer}" is registered with a URL other than ${config.mcpUrl}. Fix the registration before using it.`);
  }
}

// ---------------------------------------------------------------- PreToolUse

function preShell(config, command) {
  const cmd = command || '';
  if (/\.env\.vercel/i.test(cmd)) {
    emitPre('deny', 'Commands that reference .env.vercel (production) are reserved for manual execution by a human.');
  }
  if (/cms:push(?!:local)/.test(cmd)) {
    emitPre('deny', 'Only `npm run cms:push:local` (testing) may be run by the agent. Production/Vercel pushes are manual-only.');
  }
  if (/(optimizely-cms-cli|cms-cli[\\/]+bin[\\/]+run\.js)[^|;&]*config\s+push/.test(cmd)) {
    emitPre('deny', 'Do not invoke the CMS CLI push directly. Use `npm run cms:push:local` so the testing .env is always used.');
  }
  if (/cms:push:local/.test(cmd)) {
    const problem = checkEnvFiles(config);
    if (problem) emitPre('deny', `cms:push:local blocked: ${problem}`);
  }
  process.exit(0);
}

function preMcp(config, tool, input, sessionId) {
  const envProblem = checkEnvFiles(config);
  if (envProblem) emitPre('deny', `MCP call blocked: ${envProblem}`);

  if (SCHEMA_WRITE_TOOLS.has(tool)) {
    emitPre(
      'deny',
      `${tool} is disabled: content types, property groups and display templates are defined in code and pushed with \`npm run cms:push:local\`. Use MCP only to read/verify schema.`
    );
  }
  if (OUT_OF_SCOPE_TOOLS.has(tool)) {
    emitPre('deny', `${tool} is outside the component workflow (variations/experiments).`);
  }

  const verified = currentVerification(config, sessionId);
  if (!verified) {
    const isFingerprint =
      tool === 'graph_content_graphql_executor' &&
      normalizeQuery(input?.query) === normalizeQuery(config.fingerprintQuery);
    if (isFingerprint) process.exit(0);
    emitPre(
      'deny',
      'The MCP target instance has not been verified as TESTING in this session. First call graph_content_graphql_executor with EXACTLY the `fingerprintQuery` from .claude/optimizely-env.json (no variables). Every other MCP tool is blocked until that check passes.'
    );
  }

  if (READ_TOOLS.has(tool)) process.exit(0);

  const prefix = config.testContentPrefix;
  if (tool === 'cms_update_content_item') {
    const key = stringField(input, 'ContentKey', 'contentKey');
    if (!key) {
      const name = stringField(input, 'DisplayName', 'displayName');
      // The component key follows the prefix directly: no personal initials or names.
      if (!name.startsWith(`${prefix} Esl`)) {
        emitPre('deny', `New test content must be named "${prefix} Esl<PascalName> ..." with nothing between the prefix and the component key (e.g. "${prefix} EslMyComponent preview"; no initials).`);
      }
      const segment = stringField(input, 'RouteSegment', 'routeSegment');
      if (segment && !segment.startsWith('wf-')) {
        emitPre('deny', `Test pages need a RouteSegment starting with "wf-" (e.g. "wf-my-component") so their URL cannot collide with real pages and is recognisable as test content.`);
      }
      checkExperienceCreate(input, verified);
      process.exit(0);
    }
    if (ledgerHas(key)) process.exit(0);
    emitPre('ask', `ContentKey ${key} was not created by this workflow (not in .claude/state/optimizely-ledger.json). Editing existing CMS content needs explicit approval.`);
  }
  if (CREATE_TOOLS.has(tool)) {
    if (EXPERIENCE_TYPE.test(stringField(input, 'ContentType', 'contentType'))) {
      emitPre('deny', `Create test experiences with cms_update_content_item (no ContentKey), so the Container and the Blank Section node can be set and checked in the same call. See SKILL Phase 7, step 4.`);
    }
    const name = stringField(input, 'DisplayName', 'displayName');
    if (!name.startsWith(prefix)) {
      emitPre('deny', `${tool} requires a DisplayName starting with "${prefix}" so test content is identifiable and can be cleaned up.`);
    }
    process.exit(0);
  }
  if (tool === 'cms_delete_content_item') {
    const key = stringField(input, 'ContentKey', 'contentKey');
    if (key && ledgerHas(key)) process.exit(0);
    emitPre('deny', 'Only content created by this workflow (tracked in the ledger) may be deleted through MCP.');
  }
  if (tool === 'cms_publish_content_item') {
    emitPre(
      'ask',
      'Publishing is not needed for Visual Builder preview (drafts preview fine). A published test page is public on the testing site at its own URL until it is deleted. Approve only if intended.'
    );
  }
  emitPre('ask', `${tool} is not classified by the guard. Approve manually if it is safe for the testing instance.`);
}

const EXPERIENCE_TYPE = /Experience$/;
const BLANK_SECTION_NODE =
  '{ "displayName": "Blank Section", "nodeType": "section", "layoutType": "grid", "component": { "contentType": "BlankSection" } }';

function asObject(value) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value && typeof value === 'object' ? value : null;
}

// Test experiences must live inside the Start Page site (preview is configured per site, so a
// page at the CMS root cannot be previewed) and must carry an empty Blank Section (without a
// section node, Visual Builder cannot open the properties panel of inline components).
function checkExperienceCreate(input, verified) {
  const contentType = stringField(input, 'ContentType', 'contentType');
  if (!EXPERIENCE_TYPE.test(contentType)) return;

  const container = normalizeKey(stringField(input, 'Container', 'container'));
  if (!container) {
    emitPre('deny', `Test experiences must be created inside the ESL Start Page site: pass Container (for ${contentType}: see SKILL Phase 7, step 4). Without it the page lands at the CMS root, where no preview is configured.`);
  }
  const startPageKeys = (verified?.startPageKeys || []).map(normalizeKey);
  if (contentType === 'EslHomeExperience' && !startPageKeys.includes(container)) {
    emitPre('deny', `An EslHomeExperience test page must be created directly under the ESL Start Page (Container = ${startPageKeys.join(' or ') || 'the _metadata.key from the fingerprint query'}).`);
  }

  const properties = asObject(input?.Properties ?? input?.properties);
  const composition = asObject(properties?.composition ?? properties?.Composition);
  const nodes = Array.isArray(composition?.nodes) ? composition.nodes : [];
  const hasBlankSection = nodes.some(
    (node) => node?.nodeType === 'section' && asObject(node?.component)?.contentType === 'BlankSection'
  );
  if (!hasBlankSection) {
    emitPre('deny', `Test experiences need an empty Blank Section as the first composition node (Visual Builder properties-panel workaround). Add ${BLANK_SECTION_NODE} before the component node.`);
  }
}

// ---------------------------------------------------------------- PostToolUse

function extractAll(text, fieldNames) {
  const names = fieldNames.join('|');
  const re = new RegExp(`\\\\*"(?:${names})\\\\*"\\s*:\\s*\\\\*"([^"\\\\]+)`, 'gi');
  return [...text.matchAll(re)].map((m) => m[1]);
}

function postMcp(config, tool, input, response, sessionId) {
  const text = typeof response === 'string' ? response : JSON.stringify(response ?? '');

  if (
    tool === 'graph_content_graphql_executor' &&
    normalizeQuery(input?.query) === normalizeQuery(config.fingerprintQuery)
  ) {
    const bases = extractAll(text, ['base']).map(normalizeUrl);
    const expected = normalizeUrl(config.testing.appHost);
    const forbidden = config.production.appHosts.map(normalizeUrl);
    // Testing may host several sites (one start page per domain), so other bases are fine as
    // long as the testing host is among them and no production host appears.
    const ok = bases.includes(expected) && !bases.some((b) => forbidden.includes(b));
    const record = {
      status: ok ? 'verified' : 'failed',
      sessionId,
      verifiedAt: new Date().toISOString(),
      appHost: ok ? config.testing.appHost : null,
      observedBases: [...new Set(bases)],
      startPageKeys: [...new Set(extractAll(text, ['key']))],
    };
    writeJson(VERIFY_PATH, record);
    if (ok) {
      emitPostContext(`MCP instance VERIFIED as TESTING (url.base=${config.testing.appHost}). MCP tools are unlocked for this session.`);
    }
    emitPostContext(
      `MCP instance is NOT the testing instance (observed url.base: ${record.observedBases.join(', ') || 'none'}). STOP the workflow. Ask the user to re-authenticate the optimizely-cms-saas server via /mcp against the testing CMS (${config.testing.cmsUrl}).`
    );
  }

  if (tool === 'cms_update_content_item' || CREATE_TOOLS.has(tool)) {
    const keys = extractAll(text, ['contentKey', 'ContentKey', 'key']).filter((k) => /^[0-9a-f-]{32,36}$/i.test(k));
    if (keys.length > 0) {
      const ledger = readJson(LEDGER_PATH, { items: [] });
      const displayName = stringField(input, 'DisplayName', 'displayName');
      for (const key of new Set(keys.map(normalizeKey))) {
        if (!ledger.items.some((i) => normalizeKey(i.key) === key)) {
          ledger.items.push({ key, displayName, tool, contentType: stringField(input, 'ContentType'), sessionId, createdAt: new Date().toISOString() });
        }
      }
      writeJson(LEDGER_PATH, ledger);
    }
  }
  process.exit(0);
}

// ---------------------------------------------------------------- main

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

const mode = process.argv[2];
const config = readJson(CONFIG_PATH, null);

if (mode === 'status') {
  if (!config) {
    console.log(`Missing config: ${CONFIG_PATH}`);
    process.exit(1);
  }
  console.log('env files     :', checkEnvFiles(config) ?? 'OK (.env = testing, differs from production)');
  console.log('verification  :', JSON.stringify(readJson(VERIFY_PATH, { status: 'none' })));
  console.log('ledger items  :', readJson(LEDGER_PATH, { items: [] }).items.length);
  const regs = findRegistrations(config);
  for (const r of regs) console.log('mcp register  :', `${r.name} -> ${r.url}  [${r.source}]`);
  const aliases = regs.filter((r) => normalizeUrl(r.url) === normalizeUrl(config.mcpUrl) && r.name !== config.mcpServer);
  const hijack = regs.filter((r) => r.name === config.mcpServer && normalizeUrl(r.url) !== normalizeUrl(config.mcpUrl));
  console.log(
    'mcp names     :',
    aliases.length || hijack.length
      ? `PROBLEM: ${[...aliases.map((a) => `alias "${a.name}" (unguarded, will be denied)`), ...hijack.map((h) => `"${h.name}" points at ${h.url}`)].join('; ')}`
      : regs.some((r) => r.name === config.mcpServer)
        ? `OK (only "${config.mcpServer}" points at ${config.mcpUrl})`
        : `PROBLEM: no registration named "${config.mcpServer}"`
  );
  process.exit(0);
}

let payload = {};
try {
  payload = JSON.parse(readStdin() || '{}');
} catch {
  payload = {};
}
const toolName = payload.tool_name || '';
const canonicalServer = config?.mcpServer ?? 'optimizely-cms-saas';
const mcpPrefix = `mcp__${canonicalServer}__`;
const isMcp = toolName.startsWith(mcpPrefix);
const isShell = toolName === 'Bash' || toolName === 'PowerShell';
const isPush = isShell && /cms:push|config\s+push|\.env\.vercel/.test(payload.tool_input?.command || '');
const mcpMatch = !isMcp && toolName.match(/^mcp__(.+?)__(.+)$/);

try {
  if (!config) throw new Error(`missing ${CONFIG_PATH}`);
  if (mode === 'pre' && mcpMatch) preMcpAlias(config, mcpMatch[1], mcpMatch[2]);
  if (mode === 'pre' && isMcp) assertCanonicalUrl(config);
  if (mode === 'pre' && isShell) preShell(config, payload.tool_input?.command);
  if (mode === 'pre' && isMcp) preMcp(config, toolName.slice(mcpPrefix.length), payload.tool_input, payload.session_id);
  if (mode === 'post' && isMcp) postMcp(config, toolName.slice(mcpPrefix.length), payload.tool_input, payload.tool_response, payload.session_id);
  process.exit(0);
} catch (error) {
  if (mode === 'pre' && (isMcp || isPush || (mcpMatch && ALL_OPTIMIZELY_TOOLS.has(mcpMatch[2])))) {
    emitPre('deny', `Guard error, failing closed: ${error instanceof Error ? error.message : String(error)}`);
  }
  process.exit(0);
}
