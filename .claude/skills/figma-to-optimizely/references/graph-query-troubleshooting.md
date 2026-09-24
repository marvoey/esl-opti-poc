# Graph queries, rich text and stale-query troubleshooting

Read this before Phase 7, and whenever a page or the Live Preview shows **"No component found for content type `_Component`"**. Everything below was verified on this project (SDK `@optimizely/cms-sdk` 2.2.0, testing Graph instance) while building Filterable Product Card Grid.

## How a page query is built

Pages and the preview never use hand-written queries. The SDK builds one query per page content type (`createSingleContentQuery` in `node_modules/@optimizely/cms-sdk/dist/esm/graph/createQuery.js`) from the **content-type registry** (`initContentTypeRegistry` in `src/infrastructure/cms/optimizely-registry.ts`):

- Every registered `_component` type that has `compositionBehaviors` gets a fragment, and all of them are spread into `fragment _IComponent on _IComponent { __typename ...EslA ...EslB ... }`.
- Composition nodes select `component { ..._IComponent }`.
- Every field is aliased with its type name: `EslMyComponent__description:description { html, json }`. Because of this aliasing, two types that both have a `description` (one `string`, one `richText`) do **not** clash in SDK queries. Rich text is always selected as `{ html, json }`; string arrays (`array` of `string`) are selected as plain fields; `component` and `array` of `component` properties use `...<Type>Property` fragments.

The only queries that need manual aliasing (for example `rowDescription: description { json html }`) are hand-written ones: Phase 7 checks, scripts, or the old per-route queries that no longer exist. Graph rejects same-named fields with different types across inline fragments of a hand-written query.

## Rule 1: Graph returns `_Component` when the query has no fragment for the type

Optimizely Graph reports the concrete `__typename` of a composition component **only if the query contains a fragment for that type**. Otherwise it returns the base type `_Component`. Measured against a published page whose component is `EslLongTextLeftCardsRight`:

| Selection on `component` | `__typename` returned |
|---|---|
| `{ __typename }` | `_Component` |
| `{ __typename ... on EslHeroSlider { variant } }` (other type) | `_Component` |
| `{ __typename ... on EslLongTextLeftCardsRight { title } }` | `EslLongTextLeftCardsRight` |

The SDK resolves the React component by `_metadata.types`, then by `__typename` (`findComponent` in `react/server.js`). With `_Component` nothing matches, so it renders the fallback "No component found for content type `_Component`". **That message always means the query that ran had no fragment for the component's type.** Three causes:

1. **Stale SDK query cache (the usual cause, see Rule 2).** The dev server built and cached the page query before the new type was registered.
2. **Graph did not know the type yet.** Right after `cms:push:local` Graph can take a minute to accept the new type. It rejects the query with `Unknown type "EslX"`; `retryWithoutUnknownTypes` (`src/infrastructure/cms/unknownTypeRecovery.ts`) strips that fragment and retries, so the page renders with `_Component` for that node. The server log shows `[cms] Graph does not know these registered types or fields ... EslX`. Wait a minute and reload. The recovery is per request and caches nothing.
3. **The type is missing from the registry or has no `compositionBehaviors`.** Then the SDK never generates its fragment. Phase 5 and the CMS test prevent this.

## Rule 2: the SDK caches queries for the life of the process; restart the dev server

The SDK keeps two process-wide caches that nothing in the app clears:

- `queryCache` in `util/cache.js` (`withQueryCaching`): the generated query per content type, e.g. `single:EslHomeExperience:...`.
- `allContentTypes` in `util/queryUtils.js` (`getCachedContentTypes`): the registered content types, refreshed only by `refreshCache()`.

`next dev` hot reload re-runs `optimizely-registry.ts` (it has no run-once guard), but it does not reload the SDK in `node_modules`. So a dev server that served any page before the new type was registered keeps sending the old query, without the new fragment, and the component shows as `_Component` until the process restarts. Hot reload is not enough.

**Therefore: after Phase 5 changes the registry, and before any preview or page check in Phase 7, stop every running dev server and start a new one.** On Windows:

```powershell
# Find what listens on the app port (5002) and stop its process tree
$c = Get-NetTCPConnection -LocalPort 5002 -State Listen -ErrorAction SilentlyContinue
$c | ForEach-Object { Get-CimInstance Win32_Process -Filter "ProcessId=$($_.OwningProcess)" | Select-Object ProcessId, ParentProcessId, CreationDate, CommandLine }
taskkill /PID <next-dev parent PID> /T /F
```

Then start `npm run dev` in the background and wait for `Ready in`. If the server on port 5002 is one the user started (not one this session started), tell them what you are about to stop before stopping it. A process that exits with `EADDRINUSE` right after a stop means the old one was still shutting down; start again.

## Rule 3: MCP preview tokens cannot render the preview

`cms_get_content_preview_url` returns URLs whose token has `"role": "Content Admins"` (a single string). Tokens issued by Visual Builder carry `"role": ["Content Admins", "Everyone", "Authenticated", "CmsAdmins"]`. With MCP tokens, the app's first Graph call (`GetContentMetadata`) gets HTTP 500 and the preview route returns **404 for every page**, including unchanged ones; Visual Builder tokens render the same pages with HTTP 200. A 404 on an MCP preview URL is therefore **not** evidence that the component is broken. Verify rendering with the SDK query check below, then with Visual Builder (the user) or the published page URL.

## The SDK query check (Phase 7)

This reproduces exactly the query the running app sends, against Graph, without a browser or a preview token. Create a temporary test, run it, and **delete it afterwards** (it must never be committed):

```ts
// src/__tmp_sdkquery.test.ts  (temporary, delete after running)
// @vitest-environment node
import { it, expect } from 'vitest';
import '@/infrastructure/cms/optimizely-registry';
import { createSingleContentQuery } from '../node_modules/@optimizely/cms-sdk/dist/esm/graph/createQuery.js';

const PAGE_TYPE = 'EslHomeExperience';            // the test page's type
const NEW_TYPE = 'EslMyComponent';                // the new component
const PUBLISHED_PAGE_KEY = '<key of any PUBLISHED page of PAGE_TYPE>';

it('SDK query includes the new type and Graph accepts it', async () => {
  process.loadEnvFile('.env');
  const query: string = createSingleContentQuery(PAGE_TYPE, false);
  expect(query).toContain(`fragment ${NEW_TYPE} on ${NEW_TYPE}`);
  expect(query).toMatch(new RegExp(`fragment _IComponent on _IComponent \\{[^}]*\\.\\.\\.${NEW_TYPE}\\b`));

  const gw = process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2';
  const url = new URL(gw.includes('/content/v2') ? gw : gw.replace(/\/$/, '') + '/content/v2');
  url.searchParams.append('cache', 'false');
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'sdk-query-check',
      Authorization: `epi-single ${process.env.OPTIMIZELY_GRAPH_SINGLE_KEY}`,
    },
    body: JSON.stringify({ query, variables: { where: { _metadata: { key: { eq: PUBLISHED_PAGE_KEY } } } } }),
  });
  const body = await res.json();
  expect(body.errors ?? []).toEqual([]);          // any "Unknown type", "Cannot query field" or field-conflict error fails here
  expect(body.data?._Content?.item?.__typename).toBe(PAGE_TYPE);
}, 60000);
```

Run with `npx vitest run src/__tmp_sdkquery.test.ts`, then `rm src/__tmp_sdkquery.test.ts`. Notes:

- The single key (`epi-single`) sees **published** content only, so point `PUBLISHED_PAGE_KEY` at any published page of the same type (the query is the same for every page of a type). The draft test page is not visible to it.
- Send the key in the `Authorization: epi-single <key>` header, exactly as the SDK does. `?auth=<key>` in the URL gets an HTML 403 from the gateway.
- Never print the key or `.env` values; load them with `process.loadEnvFile('.env')` or `node --env-file=.env`.
- A passing check proves the code builds a valid query that includes the new type. If the preview still shows `_Component` afterwards, the cause is Rule 2 (restart the dev server) or Rule 1 cause 2 (wait for Graph).

## Rich text checklist

- **Schema:** `type: 'richText'`. Graph projects it as `RichText = { html: String, json: JSON }`; the SDK selects `{ html, json }`.
- **Renderer:** accept `{ json, html }` objects and plain strings. Render `json` with `<RichText content={x.json} />` from `@optimizely/cms-sdk/react/richText`, fall back to `html`, and treat an object with neither (or whitespace-only `html`) as empty so the slot is omitted. Wrap the result in a `<Text as="div">` (not `p`), because rich text renders its own `<p>` elements; reset their margins in the component CSS (`.slot p { margin: 0 }`).
- **Hand-written queries only** (Phase 7 checks, scripts): alias a rich text field whenever another inline fragment in the same selection has a same-named field of a different type, for example a `string` `description` next to a `richText` `description`. SDK-built page queries alias automatically (`Type__field`).
- **Test content through MCP:** write rich text as `{ "value": { "html": "<p>…</p>" } }`; Graph fills in `json`.
- **CMS test:** mock `@optimizely/cms-sdk/react/richText` and cover both the `json` path and the `html` fallback.
