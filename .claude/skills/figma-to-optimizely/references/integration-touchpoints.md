# Integration touchpoints (the only existing files you may change)

Adding a component to Visual Builder requires appending to shared files. Every change here is **append-only**: add entries at the end of the relevant list, keep the existing formatting, and never modify, reorder or remove an existing entry. The one allowed modification is a page test's count assertion (see 5).

Precedent: commit `2f94dc4` (Compare Table, Final CTA, Learning Hub) shows the expected shape of these diffs.

## 1. Registry: `src/infrastructure/cms/optimizely-registry.ts`

- Append imports after the last import block:
  ```ts
  import { EslMyChildContentType } from '@/components/cms/components/EslMyChild';
  import { EslMyComponentContentType } from '@/components/cms/components/EslMyComponent';
  import EslMyComponent from '@/components/cms/components/EslMyComponentRenderer';
  ```
- Append every new content type (children first, then parent) to the end of the `initContentTypeRegistry([...])` array.
- Add **only the parent renderer** to `initReactComponentRegistry({ resolver: {...} })`, directly after the last component entry (currently `EslLearningHub`), so the page-level entries `EslSiteSettings` and `EslStartPage` stay last, as in the precedent commit. The resolver key must equal the content type key (`EslMyComponent`). Child items are rendered by the parent renderer, not resolved individually.

## 2. Allowed sections: target experience type(s)

Append the key to `mayContainTypes` for each target page in the spec. Unless the user named specific pages, that is **all three** below:

| Page | File |
|---|---|
| Home | `src/components/cms/pages/EslHomePage.tsx` |
| Product family | `src/components/cms/pages/EslProductFamilyPage.tsx` |
| Product detail | `src/components/cms/pages/EslProductDetailPage.tsx` |

Every page of every type is served by `src/app/sites/[site]/[[...slug]]/page.tsx`, found by its URL, with the query the SDK builds from the registry. There are no per-route queries or fragments to edit.

Without this, the page renderer's `ExperienceComponentWrapper` shows editors a "Visual Builder Constraint" alert and renders nothing on the live site.

## 3. Friendly name: `src/components/cms/shared/VisualBuilderConstraintAlert.tsx`

Append `EslMyComponent: 'ESL My Component',` to the end of `KNOWN_COMPONENT_NAMES`, using the content type's `displayName`.

## 4. (Removed) Route GraphQL fragments

Pages used to have hand-written per-route queries that needed one fragment per component. They are gone: the SDK builds the page query from the registry (1). Do not add queries to `src/app`.

## 5. Page tests that pin the allowed list

These tests assert the **exact** allowed list and its length, so update the one for each page you changed in (2). With the default (all three pages), that is all three:

- `src/components/cms/pages/EslHomePageRenderer.test.tsx`
- `src/components/cms/pages/EslProductFamilyPage.test.tsx`
- `src/components/cms/pages/EslProductDetailPage.test.tsx`

Append the new key to the expected array, add `expect(keys).toContain('EslMyComponent')`, and update the count assertion (e.g. `exposes exactly 14 allowed section items` becomes `15`). The count line is the only existing line you may modify. Mention it in the hand-off.

## 6. Only if genuinely needed: `optimizely.config.mjs`

Append a new entry to `propertyGroups` only if Phase 2 showed no existing group fits. The `components` globs already include `src/components/cms/**/*.tsx` (excluding tests and `*Renderer.tsx`), so new content types and display templates are discovered automatically. Never edit the globs.

## Gate check

```bash
git diff --numstat -- src/infrastructure/cms/optimizely-registry.ts src/components/cms/pages src/components/cms/shared src/app optimizely.config.mjs
```
Deleted-line counts must be 0, except exactly one per page test file for the count assertion, and any line that only gained a trailing comma. Show this output to the user.
