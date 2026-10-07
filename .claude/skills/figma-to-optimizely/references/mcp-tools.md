# Optimizely SaaS MCP server (`optimizely-cms-saas`): tool reference for this workflow

Server: `https://cms.mcp.opal.optimizely.com/mcp` (HTTP, OAuth; reports itself as `opal-mcp-server`). It is registered once, in the project `.mcp.json`, as `optimizely-cms-saas`, so the tools are named `mcp__optimizely-cms-saas__<tool>`. Do not register it at local or user scope: the VS Code extension records this project as `c:/…` while the CLI records `C:/…`, so local registrations split by drive-letter case. The guard denies the server under any other name.

The server's own instructions describe it as the interface for "defining new content types, building complex page or experience layouts, or dynamically querying existing content data through GraphQL", with modifications that "adhere to the CMS's defined structural and hierarchical constraints". Its tool descriptions carry Optimizely's best practices. **Read a tool's description before its first use in a session**; the rules below summarize them.

Guard legend: **R** allowed after the session fingerprint check · **W** allowed for `[WF]` ledger content only · **A** asks the human · **X** always denied (code owns it).

## CMS schema: read (discovery and verification)

| Tool | What it does | Workflow use | Guard |
|---|---|---|---|
| `cms_list_content_types` | Lists all content types (no properties). Optional `BaseType` (`_page`, `_experience`, `_component`, `_section`, `_element`, `_image`, `_video`, `_media`, `_folder`) and `CompositionBehavior` filters. | Phase 2: key uniqueness; Phase 6: find live `Esl*` types missing from the manifest. | R |
| `cms_get_content_type_details` | Full definition of one (`ContentTypeKey`) or many (`ContentTypeKeys`, comma-separated) types, including properties; `IncludeRelatedTypes` pulls referenced types too. | Phase 2: copy conventions from analogous types; Phase 6: drift diff; Phase 7: confirm the push. | R |
| `cms_list_property_groups` | Lists property groups (`IncludeSystemGroups` required). Every property's `group` must reference an existing group. | Phase 2: choose a group key. | R |
| `cms_list_display_templates` | Lists display templates with a settings summary; each template targets one `nodeType`, `baseType` or `contentType`. | Phase 2: reuse setting names/choices. | R |
| `cms_get_display_template` | Full settings/choices of one (`Key`) or many (`Keys`) templates. | Phase 2 and 7. | R |

## CMS schema: write (denied: schema is defined in code)

These 6 tools, plus `cms_create_content_variation`, are in the `deny` list of `.claude/settings.json`, so Claude Code hides them from the session: expect to see 15 tools, not 22. Their descriptions below come from a listing made before the deny rules existed. To re-check them, temporarily remove the deny rules in a throwaway session that does no other work.

| Tool | What it does | Why denied |
|---|---|---|
| `cms_create_content_type` | Creates a content type (`Key`, `DisplayName`, `Description`, `BaseType`, `Properties`, `CompositionBehaviors`, `MayContainTypes`). Its best practice: create `_component` types before the types that reference them; groups must already exist. | The next `cms:push:local --force` would overwrite it, and it would never reach git. The same ordering rule applies in code: child types are registered before parents. |
| `cms_update_content_type` | JSON-merge-patch update; non-breaking by default, `AllowBreakingChanges` to force. | Same as above. |
| `cms_delete_content_type` | Deletes a type only if unused and unreferenced. | Same as above. |
| `cms_create_property_group` | Creates a group (`Key`, `DisplayName`, `SortOrder`). | Groups live in `optimizely.config.mjs` `propertyGroups`. |
| `cms_create_display_template` / `cms_update_display_template` | Create/replace a display template (update **replaces all settings**). | Templates are exported with `displayTemplate()` from the component's `Esl<Name>.tsx`. |

## Content: test data, preview, cleanup

| Tool | What it does | Workflow use | Guard |
|---|---|---|---|
| `cms_update_content_item` | **Preferred create+update.** Without `ContentKey` it creates (needs `ContentType`, `DisplayName`, `Locale`; optional `Container`, `RouteSegment`) and populates in one call. With `ContentKey` it merge-patches; a published item gets a new draft. Supports experience outline (composition) and link collections. | Phase 7: create the `[WF]` component instance and the `[WF]` draft experience. Experiences always pass `Container` (inside the ESL Start Page site) and a composition whose first node is an empty Blank Section (SKILL Phase 7, step 4). | W (create needs `[WF]` DisplayName; an experience create also needs a `Container`, with the verified Start Page as the parent of an `EslHomeExperience`, plus a `BlankSection` section node; updates only for ledger keys, otherwise A) |
| `cms_create_content_item` | Creates an **empty** draft with only a display name (then needs `cms_update_content_item`). | Rarely; prefer the upsert above. Never for experiences. | W (experiences denied: they could not carry the container and Blank Section checks) |
| `cms_get_content_data` | Reads an item's properties (`ContentKey`, optional `ContentVersion`, `Statuses`, `Locale`). | Phase 7: copy the exact composition shape from an existing experience; read back what you wrote. | R |
| `cms_upload_media` | Downloads a file from `FileUrl` and uploads it as media (auto-published). Reference it as `cms://content/{contentKey}`. | Phase 7: sample images. | W (`[WF]` DisplayName) |
| `cms_get_content_preview_url` | Generates tokenized preview URLs for a `ContentKey` + exact `ContentVersion` for every configured application. | Phase 7: preview link for Visual Builder. | R |
| `cms_publish_content_item` | Publishes a version now or at `DelayPublishUntil`. | Not needed. Drafts preview fine; a published test page is public on the testing site until deleted. | A |
| `cms_delete_content_item` | Moves an item (all versions) to the wastebasket (restorable). Needs the GUID. | Phase 8 cleanup of `[WF]` items. | W (ledger only) |
| `cms_create_content_variation` | Creates an A/B or audience variation of a page/experience. | Out of scope. | X |

## Content Graph (delivery GraphQL)

| Tool | What it does | Workflow use | Guard |
|---|---|---|---|
| `graph_content_type_schema` | "Start here." Returns content types and their Graph fields for a `searchPhrase` (compact `{Type{Base}}=Field:Type` notation). | Phase 2: learn Graph shapes for rich text, links, images. Phase 7: confirm the new type is indexed. | R |
| `graph_content_graphql_executor` | Executes a GraphQL `query` (with `variablesAsJson`) against the instance's Graph. Best practice: discover the schema first and use exact field names. | Phase 0: **environment fingerprint** (the only tool allowed before verification, with the exact query). Phase 7: query the fields the renderer reads. | R |
| `graph_content_search_tool` | Full-text search over content (`searchPhrase`, optional `contentTypeName`, `outputFieldsAsGraphQLOutput`). | Find existing media or sample content to reuse. | R |

## How the testing-instance guarantee works

1. **Env files:** before any MCP call or push, the guard checks that `.env` `OPTIMIZELY_CMS_URL` equals the configured testing CMS and differs from `.env.vercel` (URL and client id), and that `OPTIMIZELY_APP_HOST` equals the testing host.
2. **Live fingerprint:** the MCP server's target is decided by the OAuth login, not by `.env`. So every session starts locked. The only allowed call is the fingerprint query, which reads every start page's `_metadata.url.base` (one per site). Testing returns `http://localhost:5002`; production returns `https://opti-1920.move-esl-forward.org`. (The start page GUID is identical on both instances because content was copied, so GUIDs cannot be used.) The post-hook unlocks MCP for **that session only** (8-hour TTL) if the testing host is among the observed `url.base` values and no production host (`production.appHosts` in `optimizely-env.json`, which must list every production site) appears.
3. **Shell:** `cms:push` variants other than `cms:push:local`, direct CLI pushes and anything referencing `.env.vercel` are denied. Permission `deny` rules duplicate the critical blocks.
4. **Fail closed:** any guard error denies MCP calls and pushes.

If the fingerprint fails: `/mcp` → `optimizely-cms-saas` → clear authentication → authenticate, and pick the testing CMS instance during sign-in.
