---
name: figma-to-optimizely
description: Implements a brand-new component end-to-end from a Figma screenshot or design image - pure organism (Next.js RSC, atoms, CSS tokens, tests), Optimizely SaaS content type(s), renderer, page enablement for Visual Builder, schema push to the TESTING instance, and live validation through the Optimizely MCP server (optimizely-cms-saas). Use whenever a user shares a Figma frame/screenshot/spec of a component to build, or asks to create a new CMS-editable component.
---

# Figma → Optimizely SaaS component workflow

You turn one Figma screenshot into one **new**, fully editable, Visual-Builder-enabled component. The Optimizely MCP server (`optimizely-cms-saas`) is the source of truth for everything that already lives in the CMS: conventions, keys, property groups, display templates, the Graph shape, preview. Code is the only source of truth for the **schema** you add.

Follow the phases in order. Each ends with a gate. Do not start a phase until the previous gate passes. If a gate fails, stop and report it; do not work around it.

Reference files (read when the phase says so):
- [references/mcp-tools.md](references/mcp-tools.md): every MCP tool, what it does, when this workflow uses it, what the guard allows.
- [references/cms-patterns.md](references/cms-patterns.md): Figma element → property type → Graph selection → renderer helper; content type, display template, renderer and test templates.
- [references/integration-touchpoints.md](references/integration-touchpoints.md): the exact existing files you add lines to, and how.
- [references/graph-query-troubleshooting.md](references/graph-query-troubleshooting.md): how the SDK builds page queries, why a component shows as `_Component`, the dev-server restart, the SDK query check, MCP preview-token limits and the rich text checklist.

---

## Non-negotiable rules

1. **New component, zero regressions.** Every component that already exists and works stays exactly as it is: its organism, atoms it uses, CSS, content type, renderer, tests and behavior. You create new files for the new component. You may import existing atoms/helpers read-only. If an existing atom is not quite right, wrap or compose it inside the new component's folder; never edit it.
   - **Direct Atom Import Rule**: Always import atoms directly from their dedicated paths (e.g. `@/components/atoms/heading/Heading`, `@/components/atoms/button/Button`). **Never import from the `@/components/atoms` barrel index**, because re-exported modules pull all 20+ atom CSS modules into every consuming chunk.
2. **Integration touchpoints are additive only.** To make the component available on a page you must add lines to a small set of shared files (registry, `mayContainTypes`, `KNOWN_COMPONENT_NAMES`, page tests). Only append entries. Never reorder, rename, reformat or delete existing entries. See `references/integration-touchpoints.md`.
3. **Testing instance only.** Every MCP call and every push targets the testing instance defined by `.env`. The guard hook (`.claude/hooks/optimizely-guard.mjs`) enforces this; never try to bypass it, and never run or suggest `npm run cms:push`, `npm run cms:push:vercel`, or anything referencing `.env.vercel`. Production sync is manual and human-only.
4. **Code owns the schema.** Content types, property groups and display templates are defined in `src/components/cms/**` and `optimizely.config.mjs`, and reach the CMS only through `npm run cms:push:local`. MCP schema-write tools are denied by design. MCP is used to *read* schema, write *test content*, and *verify*.
5. **Nothing visible is hard-coded.** Every piece of text, image, link, list item and visual option in the screenshot becomes a CMS field or a display-template setting. The renderer may supply structural fallbacks (empty string, `null`), never marketing copy. Mock copy lives only in `<name>Data.ts` fixtures and tests.
6. **Test content is labelled and tracked.** Every item you create through MCP has a DisplayName starting with `[WF]` (and, for pages, a RouteSegment starting with `wf-`), stays in draft, and is recorded in `.claude/state/optimizely-ledger.json` (the guard does this automatically). Every `[WF]` experience is created **inside the ESL Start Page site** (never at the CMS root) and its composition **starts with an empty Blank Section** (Phase 7, step 4); the guard denies a create that breaks either rule.

---

## Phase 0: Preflight (environment and repo)

1. `node .claude/hooks/optimizely-guard.mjs status` must report `env files: OK` **and** `mcp names: OK`. The server must be reachable only as `optimizely-cms-saas` (defined in the project `.mcp.json`). If the status reports an alias, or your MCP tools are prefixed with anything other than `mcp__optimizely-cms-saas__`, stop: the guard denies aliases, and the fix is to remove the extra registration and restart.
2. **Fingerprint the MCP target.** Call `graph_content_graphql_executor` with the `fingerprintQuery` string from `.claude/optimizely-env.json`, copied exactly, no variables. The guard's post-hook replies with either `VERIFIED as TESTING` or `NOT the testing instance`.
   - Not verified → stop. Tell the user to run `/mcp`, choose `optimizely-cms-saas`, clear authentication, and sign in again against the testing CMS (`https://app-fecu01saas6fn6qt001.cms.optimizely.com`).
   - If MCP tools are missing entirely, the server is not connected or not authenticated in this session: stop and ask the user to authenticate via `/mcp`.
   - Seeing **15 of the 22** tools is expected: the 7 schema-write/variation tools are in the `deny` list of `.claude/settings.json`, and Claude Code hides denied tools. Do not report it as a problem.
3. **Sync the repo so your future push is a superset of the team's schema.** `git fetch`, then:
   - HEAD must contain `origin/main` and the current branch's upstream (`git merge-base --is-ancestor <ref> HEAD`). If not, ask the user before rebasing or merging.
   - For every other `origin/*` branch with commits not in HEAD, check whether those commits touch schema (`git diff --stat HEAD...<ref> -- src/components/cms optimizely.config.mjs`). If any do, stop and ask the user: pushing without them would drop their schema. Branches with no schema changes are reported as information only and do not block the gate.

**Gate 0:** env OK, MCP verified as testing, branch up to date.

## Phase 1: Decompose the screenshot into a Component Spec

Study the image and produce a written spec before touching code. Show it to the user and get confirmation. Include:

- **Name:** PascalName, kebab folder name, content type key `Esl<PascalName>`, display name `ESL <Human Name>`.
- **Anatomy:** every region of the design, top to bottom, with the atom that renders it. Typography maps only to `<Heading level>` / `<Text variant>` / `<Eyebrow>` / `<Display>` / `<Stat>` (see `FRONTEND.md` §1 & §6); buttons to `<Button variant>` (`primary`, `secondary`, `outline`); links to `<TextLink>` or `<SimpleLink>`; badges to `<Badge>`; icons to `Icon` names that exist; images to `<CmsImage>` or container-fill Next `<Image>`.
- **Heading hierarchy:** the organism must accept an optional `headingLevel?: HeadingLevel` prop (defaulting to `"h2"`) to allow pages to preserve WCAG 1.3.1 heading structure.
- **Fields:** a table of property name, CMS type, required?, group, sortOrder, and the Figma element it comes from. Use `references/cms-patterns.md` for type mapping and standardized DisplayNames.
- **Child item types:** any repeated card/row/tile becomes its own `_component` content type (`elementEnabled`) referenced by an `array` of `component` on the parent, rendered inside semantic `<ul>`/`<ol>` and `<li>` elements.
- **Composition behaviors:** state them for every type in the spec, following the rule in Phase 4, step 2. A parent that holds child items (any `array` of `component`, or a `component` property) is **`sectionEnabled` only**; Optimizely rejects such a property on an `elementEnabled` type at push time.
- **Visual options:** variants in the design (theme, alignment, image side, density) become **display template settings**, not string fields.
- **Tokens:** strictly follow the 3-Tier Design Token Architecture (`FRONTEND.md` §3 & §5). Tier 1 primitives (e.g. `--color-navy-950`, raw hex) are **strictly forbidden** in component CSS. Consume only Tier 2 semantic tokens (`--color-text-primary`, `--color-surface`, `--color-border-card`, `--color-border-accent`, etc.). Transitions use `--transition-all`, `--duration-smart`, and `--ease-out-smart` for `transform`/`opacity`.
- **Vertical rhythm:** normalize line heights to integer multiples of 4px to avoid fractional baseline drift.
- **Interactivity:** what, if anything, needs a `"use client"` leaf (tabs, carousel, accordion). Everything else is RSC.
- **Target pages:** which experience types allow the component in Visual Builder. **Default: all three** (`EslHomeExperience`, `EslProductFamilyExperience`, `EslProductDetailExperience`). Use a subset only when the user names specific pages; do not ask when they don't. State the choice in the spec either way ("all three (default)" or the pages the user named), so it can be corrected at Gate 1.
- **Accessibility:** heading level in page outline, landmarks, alt text source, focus order, reduced motion.

**Gate 1:** user confirms the spec (name, fields, child types, target pages).

## Phase 2: Live schema discovery through MCP (read-only)

Read `references/mcp-tools.md` first. Then:

1. `cms_list_content_types` (BaseType `_component`): confirm `Esl<PascalName>` and every child key are unused. Also check no branch already claims them: `git grep -n "key: 'Esl<PascalName>'" $(git for-each-ref --format='%(refname)' refs/remotes/origin)`.
2. `cms_get_content_type_details` with `ContentTypeKeys` for 2-3 existing components closest to the design, `IncludeRelatedTypes: true`. Align field names, property groups, and standardized field DisplayNames (commit `b562370`):
   - `eyebrow`: `displayName: 'Eyebrow'`
   - `title`: `displayName: 'Heading'`
   - `description`: `displayName: 'Copy'` (for descriptions/body copy)
   - `cta`: `displayName: 'CTA Link'`
   - `subhead`: `displayName: 'Subheading'`
   - `image`: `displayName: 'Image'` or `displayName: 'Background Image'`
   - `sortOrder` in increments of 10 (`10, 20, 30...`).
3. `cms_list_property_groups` (IncludeSystemGroups false): reuse an existing group key. If a new group is truly needed, it is added in `optimizely.config.mjs`, never through MCP.
4. `cms_list_display_templates`, and `cms_get_display_template` for any template on similar components: reuse setting names and choice keys where they fit.
5. `graph_content_type_schema` with the analogous type keys as `searchPhrase`: learn how each property type is projected into Graph (rich text `{ json html }`, links `{ text title target url { default } }`, images `{ key url { default } }`). The renderer's field mapping and the Phase 7 query must follow these shapes.
6. Record decisions and the evidence (which live types you matched) in the spec.

**Gate 2:** keys confirmed unique live and across branches; field names, groups and templates aligned with live conventions.

## Phase 3: Organism, test-first

Create only new files under `src/components/organisms/<kebab-name>/`:

| File | Purpose |
|---|---|
| `<kebabName>Data.ts` | Typed fixture props used by tests (the only place sample copy lives). |
| `<PascalName>.test.tsx` | Written first. Vitest + Testing Library: renders every slot, omits empty optional slots, heading level, alt text, links/buttons roles, variant classes, list lengths. **Next `<Image>` testing rule:** assert image URLs using `decodeURIComponent(img.getAttribute('src') ?? '').toContain('/images/...')` rather than strict `toBe()`. |
| `<PascalName>.tsx` | Pure presentational component. Plain domain props, no CMS/SDK imports. RSC unless a leaf needs state. |
| `<PascalName>.module.css` | Tier 2 semantic tokens only (strictly no raw hex colors, use `var(--color-...)` or `currentColor`); Grid for 2D, Flex for 1D; `@container` queries; max 3 nesting levels; no `font-*`, `line-height`, `letter-spacing` (typography comes from atoms); animate only `transform`/`opacity` with `--duration-smart` / `--ease-out-smart`. Follow the "Atom sizing" rules below. |
| `index.ts` | Barrel export of the component, its prop types and fixtures. |

**Atom sizing (labels must never overflow their box).** The `Button` label is `white-space: nowrap` (as are `Chip`, `Badge` and tab labels), so the button can never be narrower than its text. jsdom cannot see overflow, so this is a CSS review rule:
- Never put a fixed `width`/`inline-size`/`max-inline-size` on a button (or on the cell, track or column that holds it) that can end up smaller than its label. Size buttons with `fit-content`, `fullWidth`, or `inline-size: 100%` plus a generous `max-inline-size` cap, and let the container grow.
- Tables that hold buttons use `table-layout: auto` (column widths are hints, and columns still grow to the button's min-content width). With `table-layout: fixed`, columns ignore their content and nowrap labels spill out of the pill. Grid tracks use `minmax(min-content, …)` or `auto`, not fixed lengths.
- Check against the **longest** CMS label you expect (e.g. "Open Premier Money Maker"), not just the Figma copy, at desktop and at a 600px viewport.
- If the design truly needs a wrapped two-line button label, wrap the atom in a component-local element; never edit the atom.

Run `npx vitest run src/components/organisms/<kebab-name>` until green, then `npm run lint:css`. TypeScript must be strictly typed (no `any` types; prefer `unknown` or explicit types).

**Gate 3:** organism tests pass; stylelint clean; the CSS passes the atom-sizing review above.

## Phase 4: CMS layer

Read `references/cms-patterns.md`. Create only new files under `src/components/cms/components/`:

1. **Child item types first:** `Esl<Child>.tsx` with `contentType({ baseType: '_component', compositionBehaviors: ['elementEnabled'], ... })`. Use standardized field DisplayNames (`'Heading'`, `'Copy'`, `'CTA Link'`, `'Image'`).
2. **Parent type:** `Esl<PascalName>.tsx` with `baseType: '_component'`, standardized DisplayNames, arrays referencing child content types, and `export type Esl<PascalName>Data = Partial<ContentProps<typeof Esl<PascalName>ContentType>>`. Choose `compositionBehaviors` by this rule; it is enforced by the CMS at push time, not by the SDK types:
   - The type has **any** `array` of `component` or `component` property → **`['sectionEnabled']` only**. Optimizely rejects these properties on an `elementEnabled` type ("The property 'X' is not allowed when content type has ElementEnabled") and does not create the type. Live precedent: `EslFilterableProductCardGrid`, `EslKeyFactsRow`, `EslLongTextLeftCardsRight`.
   - Only flat properties (string, richText, link, contentReference, boolean, `array` of `string`/`link`) → `['sectionEnabled', 'elementEnabled']`, as in `EslSideBySide`.
   - Child item types follow the same rule: `['elementEnabled']` only while they have no component properties of their own.
   - The CMS test asserts the exact `compositionBehaviors` array.
3. **Display template (if the spec has visual options):** export a `displayTemplate({ key: 'Esl<PascalName>Default', contentType: 'Esl<PascalName>', isDefault: true, settings: {...} })` from the same `Esl<PascalName>.tsx` so `cms:push:local` picks it up.
4. **Renderer:** `Esl<PascalName>Renderer.tsx`, default export named `Esl<PascalName>`. It unwraps `const effectiveContent = content?.component ?? content`, maps every field with shared helpers, reads `displaySettings`, drops empty child items, and returns `null` when required content is missing (strict rule: zero hardcoded copy). Rich text fields follow the rich text checklist in `references/graph-query-troubleshooting.md`: accept `{ json, html }` and plain strings, render `json` with SDK `RichText` and fall back to `html`, treat empty payloads as missing, and wrap them in `<Text as="div">`. Do not write GraphQL queries for pages: the SDK builds them from the registry.
5. **CMS test:** `Esl<PascalName>.test.tsx` covering the content type definition (key, baseType, behaviors, property types), full mapping, nested `component` unwrapping, empty/partial content returning `null` or omitting slots, display settings mapping, and that no fixture copy appears when fields are empty.

**Gate 4:** CMS tests pass.

## Phase 5: Enable on pages (additive touchpoints)

Follow `references/integration-touchpoints.md` exactly: registry (types + resolver), the `mayContainTypes` of each target experience from the spec (all three by default), `KNOWN_COMPONENT_NAMES`, and the page tests that assert allowed types. Show the user the diff of these shared files before moving on.

From this point until the push in Phase 6, the CMS doesn't know the new type. Pages still render, just without the new component, and the server log shows `[cms] Graph does not know these registered types` (see `src/infrastructure/cms/unknownTypeRecovery.ts`). That is expected until `cms:push:local`.

**Any `next dev` process that is already running now holds a stale query.** The SDK caches the generated page queries and the content-type list for the life of the process, and hot reload does not reset them (`references/graph-query-troubleshooting.md`, Rule 2). Such a server keeps rendering the new component as "No component found for content type `_Component`", even after the push. It is restarted in Phase 7, step 5; do not use it to check the new component before then.

**Gate 5:** the shared-file diff is additive. Run the `git diff --numstat` command in `integration-touchpoints.md`: 0 deletions, except one count-assertion line per page test and lines that only gained a trailing comma.

## Phase 6: Local verification, drift check, push to testing

1. Run `npm run check` (or `npm run lint:all && npx tsc --noEmit && npm test`). All must pass with 0 errors. Compare the test count against the pre-change baseline; no existing test may break.
2. **Schema drift check.** Build the manifest without sending it: `mkdir -p .claude/state && npm run cms:push:local -- --dryRun --output .claude/state/manifest.json` (the CLI does not create the folder; `--dryRun` returns before anything is sent). Then, with MCP `cms_get_content_type_details`, compare the live definitions of every `Esl*` type in the manifest:
   - New keys from this component: expected to be absent live.
   - Any existing type whose live definition differs from the manifest means someone else pushed newer schema, or your branch is stale. **Stop** and report the differences. `--force` would overwrite their changes.
   - Live `Esl*` types missing from the manifest: another developer's unmerged work. Report them and stop unless the user confirms.
3. **Composition-behavior check** on the same manifest, before pushing. It must print `behaviors OK`:
   ```bash
   node -e "const m=require('./.claude/state/manifest.json');const bad=m.contentTypes.filter(c=>(c.compositionBehaviors||[]).includes('elementEnabled')&&Object.entries(c.properties||{}).some(([,p])=>p.type==='component'||(p.type==='array'&&p.items?.type==='component')));console.log(bad.length?'FIX (elementEnabled with component properties): '+bad.map(c=>c.key).join(', '):'behaviors OK')"
   ```
   Any listed type must drop `elementEnabled` (Phase 4, step 2) before the push.
4. Only with a clean drift check and `behaviors OK`: `npm run cms:push:local`. Read **both** blocks it prints. `Outcomes:` can report successes while `Errors:` lists rejected types: a rejected content type is not created, and anything that depends on it (its display template, the experiences' `mayContainTypes` entry) fails with "Unable to find a content type". Any line under `Errors:` fails the gate: fix the cause in code, rerun steps 1–3, and push again.

**Gate 6:** all checks green; drift check clean; behaviors OK; push succeeded with **no** `Errors:` block.

## Phase 7: Validate live through MCP

1. `cms_get_content_type_details` for the new keys: properties, groups, behaviors and display template match the manifest.
2. `graph_content_type_schema` with the new key: the type is indexed in Graph (it can lag a minute after push; retry a few times before failing).
3. `graph_content_graphql_executor`: query every field the renderer reads, as `query { Esl<PascalName>(limit: 1) { items { __typename ...fields... } } }`. Pages get their query from the SDK (built from the registry), so there is no route fragment to add; this checks the Graph shapes the renderer assumes. It must return without schema errors (an empty `items` is fine before content exists). In this hand-written query, alias any field whose name clashes with a differently typed field in the same selection (typically `description`: `string` on one type, `richText` on another).
3a. **SDK query check.** Run the temporary test from "The SDK query check" in `references/graph-query-troubleshooting.md`, then delete it. It builds, from the current registry, the exact page query the app sends for the test page's type. It asserts that the query contains `fragment Esl<PascalName>` and that `_IComponent` spreads it, then runs it against Graph with the app's single key on a published page of that type; the result must have no errors. This catches rich text, field-clash and unknown-type problems in the SDK-generated query, which the hand-written query in step 3 cannot see.
4. **Test content (draft only):**
   - Upload any images the spec needs with `cms_upload_media` (DisplayName `[WF] …`, public image URL), or reuse existing media keys found with `graph_content_search_tool`.
   - Read an existing experience of the test page's type (the first target page in the spec: `EslHomeExperience` with the default) with `cms_get_content_data` to copy the exact composition/outline property shape.
   - **Pick the container inside the ESL Start Page site.** Preview is configured per site (the Start Page's application), so an experience created at the CMS root, outside the Start Page, cannot be previewed at all, and it gets an `/en/<segment>` URL that the site never serves. Allowed parents follow the live `mayContainTypes`:
     | Test page type | `Container` |
     |---|---|
     | `EslHomeExperience` (default) | the **ESL Start Page** key: `_metadata.key` from the Phase 0 fingerprint result (also stored as `startPageKeys` in `.claude/state/optimizely-env-verified.json`) |
     | `EslProductFamilyExperience` | the Home experience under that Start Page (`EslHomeExperience` whose `_metadata.container` is the Start Page key) |
     | `EslProductDetailExperience` | a Product Family experience under that Home |
     Never use `Home` as the container of an `EslHomeExperience`: Home only accepts Product Family experiences, and the CMS rejects the create.
   - Create **one** draft experience of that type with `cms_update_content_item` (no ContentKey; `Container` from the table; DisplayName `[WF] Esl<PascalName> preview`, with no personal initials or names; RouteSegment `wf-<kebab-name>`, adding `-2`, `-3`, ... only if that URL is already taken). Its composition holds **two top-level nodes, in this order**:
     1. An empty Blank Section. It works around a Visual Builder bug: on an outline experience without a section node, clicking an inline component in Live Preview never opens its properties panel (`GetLayout?sectionKey=…` returns 404). `BlankSectionRenderer` renders nothing for an empty section outside edit mode, so it does not change the page.
        ```json
        { "displayName": "Blank Section", "nodeType": "section", "layoutType": "grid", "component": { "contentType": "BlankSection" } }
        ```
     2. One instance of the new component (`"nodeType": "component"`), filled with the copy from the screenshot.

     The guard denies a create of an experience with no `Container`, an `EslHomeExperience` whose `Container` is not the verified Start Page, or a composition without that Blank Section node.
   - Read the item back with `cms_get_content_data` and confirm both nodes, the container and the default display template's settings.
   - Do **not** publish by default. Every page is found by its own URL (`src/app/sites/[site]/[[...slug]]/page.tsx`), so a published test page cannot replace another page, but a published page is public on the testing site until it is deleted.
5. **Restart the dev server, then check the preview.**
   - Stop every `next dev` process on port 5002 and start a new `npm run dev` (commands in Rule 2 of `references/graph-query-troubleshooting.md`). This is required even if a server is running and hot reload looks fine: a process started before Phase 5 sends a cached query without the new fragment. If the running server was started by the user rather than by this session, say so before stopping it.
   - Call `cms_get_content_preview_url` for the draft experience's key and version, and fetch the URL. Expect **HTTP 404**: MCP-issued preview tokens make the app's first Graph call fail for every page (Rule 3), so this fetch can neither prove nor disprove rendering. Do not report that 404 as a component failure.
   - Give the user the preview URL and ask them to open the draft in Visual Builder, which issues working tokens. The check: the component renders, the HTML contains `data-component-type="Esl<PascalName>"`, and neither "No component found for content type `_Component`" nor a `visual-builder-constraint-alert` appears. Also ask them to click the component in Live Preview and confirm its properties panel opens (this is what the Blank Section from step 4 guarantees). If `_Component` appears, follow Rule 1 in `references/graph-query-troubleshooting.md` (stale server, Graph still indexing, or missing registration).
5a. **Visual check against the Figma, once a renderable URL exists** (the user published the page, or approved `cms_publish_content_item`). Headless Edge ships with Windows and needs no install; it cannot go below about 500px, so use 600px for the narrow shot:
   ```bash
   EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
   "$EDGE" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=8000 --window-size=1300,900 --screenshot="<scratchpad>/desk.png" http://localhost:5002/wf-<kebab-name>
   "$EDGE" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=8000 --window-size=600,900  --screenshot="<scratchpad>/narrow.png" http://localhost:5002/wf-<kebab-name>
   ```
   Read both images and compare with the screenshot: every button or chip label sits inside its pill, nothing overlaps or is clipped, and the spacing and column proportions match. A label spilling out of its button is the atom-sizing defect from Phase 3: fix the component CSS and re-shoot. If no renderable URL exists, ask the user to make the same comparison in Visual Builder.
6. **Tell the user how the page's public URL works**, so a 404 isn't mistaken for a bug:
   - A page created directly under the ESL Start Page with RouteSegment `wf-my-component` is served at `/wf-my-component/` (`_metadata.url.default`). Deeper pages add their parents' segments, with the CMS `/home` prefix removed (`/home/x` redirects to `/x`). A page at the CMS root, outside the Start Page, shows `/en/<segment>`, which no site serves; it must be recreated in the right container.
   - Pages are served by `src/app/sites/[site]/[[...slug]]/page.tsx` through the Graph single key, which returns **published content only**. So while the page is a draft (the default), the public URL returns 404 and the preview URL is the check. That is expected.
   - If the user wants to see the public URL, they publish it themselves (or approve `cms_publish_content_item`). Then fetch the public URL and check it contains `data-component-type="Esl<PascalName>"`.

**Gate 7:** schema live and indexed, field query valid, SDK query check passed, dev server restarted after the registry change, the `[WF]` page sits inside the Start Page site and starts with a Blank Section, and the draft renders the component. That rendering must be confirmed by the user in Visual Builder (properties panel opens on click), or by the published page containing `data-component-type="Esl<PascalName>"` and passing the visual check.

## Phase 8: Hand-off

Report:
- Files created, and each shared file changed (with line counts).
- Test, type-check and lint results.
- Content types, display templates and property groups pushed to **testing**, which the human must later push to production manually, ideally before this code is deployed there. Until then production pages render without the new component (other pages are unaffected) and its server log shows the `[cms] Graph does not know these registered types` warning.
- A reminder that any `next dev` or other long-running server the user started before this change must be restarted to pick up the new component; otherwise it renders "No component found for content type `_Component`". Deployed environments pick it up on their next deploy.
- Preview URL, the public URL the page has (`/<segment>/` under the Start Page, served only once published), and `[WF]` items in the ledger. Offer to delete them (`cms_delete_content_item` works only on ledger items) or leave them for review.
- For every ledger experience, its current status (Graph `_metadata.status` via `graph_content_graphql_executor`). If any is **Published**, say it is publicly visible on the testing site until deleted.
- Any spec gaps (missing tokens, icons, or design ambiguities) and how you resolved them.

---

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| "No component found for content type `_Component`" on a page or in Visual Builder | The query that ran had no fragment for the component's type. Usually a dev server started before the registry change: restart it. Right after a push, Graph may still reject the type (log: `[cms] Graph does not know these registered types`): wait a minute and reload. Details and checks: `references/graph-query-troubleshooting.md`, Rules 1 and 2. |
| "No component found for content type `EslX`" | The type reached the data but has no renderer: the resolver entry is missing from `optimizely-registry.ts` (Phase 5), or the resolver key differs from the content type key. |
| MCP preview URL returns 404 for every page | MCP preview tokens lack the role list that Visual Builder tokens carry (Rule 3). Check in Visual Builder or on the published page instead. |
| A hand-written query fails with a field conflict on `description` (or another shared name) | Two inline fragments select the same field name with different types (`string` vs `richText`). Alias one of them. SDK page queries are aliased automatically. |
| The Graph gateway answers a script with an HTML 403 | The single key was sent as `?auth=`. Send `Authorization: epi-single <key>`, as the SDK does. |
| Push prints `Errors: The property 'X' is not allowed when content type has ElementEnabled`, then `Unable to find a content type 'EslX'` | A type with an `array` of `component` (or a `component`) property declares `elementEnabled`. The type was not created, and its display template and `mayContainTypes` entries failed with it. Make it `['sectionEnabled']` (Phase 4, step 2), update its CMS test, rerun the Phase 6 behaviors check, and push again. |
| Clicking the component in Live Preview does not open its properties panel | The experience has no section node, so Visual Builder's `GetLayout?sectionKey=…` call returns 404 (a CMS bug). Add an empty Blank Section as the first composition node (Phase 7, step 4). |
| The `[WF]` page cannot be previewed, or its URL is `/en/wf-…` | It was created outside the ESL Start Page site (for example at the CMS root), where no preview application is configured. Create it with `Container` set as in Phase 7, step 4. |
| CMS rejects the create: "Content type 'EslHomeExperience' is not allowed to be created under parent of content type 'EslHomeExperience'" | Home only accepts Product Family experiences. An `EslHomeExperience` test page goes directly under the Start Page. |
| A button label spills outside its pill or overlaps the next cell | The button or its container is narrower than the nowrap label (fixed `max-inline-size`, `table-layout: fixed`, fixed grid track). Follow the Phase 3 atom-sizing rules. |
