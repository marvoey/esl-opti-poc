# CMS patterns: from Figma element to editable field

Verified against `@optimizely/cms-sdk` 2.2.0 (`dist/esm/model/properties.d.ts`, `displayTemplates.d.ts`) and existing components in this repo. Confirm Graph shapes on the live instance with `graph_content_type_schema` before writing the renderer field mapping.

## Type mapping

| Figma element | CMS property | Graph selection | Renderer mapping |
|---|---|---|---|
| Eyebrow, heading, short label, stat value | `string` (add `maxLength` where the design has a limit) | `field` | `.trim()`, omit slot if empty |
| Paragraph with formatting or links | `richText` | `field { json html }` | `<RichText content={x.json} />` from `@optimizely/cms-sdk/react/richText`, falling back to `html` (see `EslSideBySideRenderer.tsx` `renderBody`) |
| Plain paragraph to be flattened | `richText` | `field { json html }` | text extraction as in `EslKeyFactsRowRenderer.tsx` |
| Image | `contentReference`, `allowedTypes: ['_image']`, plus `imageAlt: string` | `image { key url { default } }` | `resolveMediaUrl(image, { width, quality: 80, format: 'auto' })` from `@/infrastructure/cms/mediaUrl` (routes through first-party `/opti-media/` proxy to prevent Firefox Private Mode tracker blocking and keep Cloudflare edge optimization; render with `<CmsImage>` or `<Image fill sizes="..." />`) |
| Video | `contentReference`, `allowedTypes: ['_video']` (or a `url`) | `video { key url { default } }` | `resolveMediaUrl` or `parseVideoSource` |
| Button / CTA / text link | `link` | `cta { text title target url { default } }` | `resolveLink` pattern in `eslVideoStoryCardRowMapper.tsx` (label = text or title, `_blank` = external) |
| Repeated cards, tiles, rows | `array` with `items: { type: 'component', contentType: EslChildContentType }`; optional `minItems`/`maxItems` | `items { ...child fields }` | map, drop empty items, fall back to `_id` or index for React keys |
| Content choice (icon name, feature type) | `string` with `enum: [{ value, displayName }]` | `field` | map value to atom prop, default when unknown |
| Visual variant (theme, layout, image side, spacing) | **display template setting**, not a property | `displayTemplateKey` on the node; renderer receives `displaySettings` | `displaySettings?.<setting>` mapped to organism `variant` props |
| Toggle a slot on/off | `boolean` | `field` | `=== false` hides it |
| List of short labels (filter chips, tags) | `array` with `items: { type: 'string' }` | `field` (Graph `[String]`, no sub-selection) | trim, drop empty and duplicate entries |
| One grouped block of fields (a promo box inside a section) | `component` with `contentType: EslChildContentType` (child type without `compositionBehaviors`, like `EslMegaMenuPromo`) | `field { ...child fields }` (Graph `<Child>Property`) | arrives as a flat object; unwrap `x.component || x` |

Editor experience: give every property a standardized `displayName` (commit `b562370`):
- `eyebrow` -> `displayName: 'Eyebrow'`
- `title` -> `displayName: 'Heading'`
- `description` -> `displayName: 'Copy'`
- `cta` -> `displayName: 'CTA Link'`
- `subhead` -> `displayName: 'Subheading'`
- `image` -> `displayName: 'Image'` or `displayName: 'Background Image'`

Use a `sortOrder` in steps of 10 (`10, 20, 30...`), and an existing `group` (usually `content`). Use `isRequired: true` only for fields the component cannot render without.

## Child item type (`EslMyCardItem.tsx`)

```ts
import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const EslMyCardItemContentType = contentType({
  key: 'EslMyCardItem',
  displayName: 'ESL My Card Item',
  baseType: '_component',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    title: { type: 'string', displayName: 'Heading', group: 'content', sortOrder: 10 },
    description: { type: 'richText', displayName: 'Copy', group: 'content', sortOrder: 20 },
    image: { type: 'contentReference', allowedTypes: ['_image'], displayName: 'Image', group: 'content', sortOrder: 30 },
    imageAlt: { type: 'string', displayName: 'Image alt text', group: 'content', sortOrder: 40 },
    cta: { type: 'link', displayName: 'CTA Link', group: 'content', sortOrder: 50 },
  },
});

export type EslMyCardItemData = Partial<ContentProps<typeof EslMyCardItemContentType>>;
```

## Parent type plus display template (`EslMyComponent.tsx`)

```ts
import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { EslMyCardItemContentType } from './EslMyCardItem';

export const EslMyComponentContentType = contentType({
  key: 'EslMyComponent',
  displayName: 'ESL My Component',
  baseType: '_component',
  // Section only: `items` is an array of components, which the CMS refuses on an
  // elementEnabled type (see "Composition behaviors" below).
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    eyebrow: { type: 'string', displayName: 'Eyebrow', group: 'content', sortOrder: 10 },
    title: { type: 'string', displayName: 'Heading', group: 'content', sortOrder: 20, isRequired: true },
    description: { type: 'richText', displayName: 'Copy', group: 'content', sortOrder: 30 },
    items: {
      type: 'array',
      displayName: 'Cards',
      group: 'content',
      sortOrder: 40,
      items: { type: 'component', contentType: EslMyCardItemContentType },
    },
    cta: { type: 'link', displayName: 'CTA Link', group: 'content', sortOrder: 50 },
  },
});

export const EslMyComponentDefaultTemplate = displayTemplate({
  key: 'EslMyComponentDefault',
  displayName: 'ESL My Component',
  contentType: 'EslMyComponent',
  isDefault: true,
  settings: {
    theme: {
      displayName: 'Theme',
      editor: 'select',
      sortOrder: 10,
      choices: {
        light: { displayName: 'Light', sortOrder: 10 },
        navy: { displayName: 'Navy', sortOrder: 20 },
      },
    },
  },
});

export type EslMyComponentData = Partial<ContentProps<typeof EslMyComponentContentType>>;
```

The CLI discovers `contentType()` and `displayTemplate()` exports from every non-test, non-Renderer `.tsx` under `src/components/cms/`. The first display template defined in code is `EslTableCtaLeftColumnDefault` (`EslTableCtaLeftColumn.tsx`); the Hero Slider's `defaultVariant` template exists only in the CMS. Defining new ones in code keeps them versioned and reproducible. A display template whose content type was rejected at push time fails too ("Unable to find a content type").

## Composition behaviors

The SDK types accept any combination, but the CMS validates it at push time:

| Type has… | `compositionBehaviors` | Live examples |
|---|---|---|
| any `array` of `component`, or a `component` property | `['sectionEnabled']` | `EslFilterableProductCardGrid`, `EslKeyFactsRow`, `EslLongTextLeftCardsRight`, `EslTableCtaLeftColumn` |
| only flat properties (string, richText, link, contentReference, boolean, arrays of string/link) | `['sectionEnabled', 'elementEnabled']` | `EslSideBySide`, `EslSplitContentImage` |
| child item rendered by its parent | `['elementEnabled']` (flat properties only) | `EslKeyFactItem`, `EslTableCtaRow` |
| block used only as a `component` property value | none | `EslMegaMenuPromo`, `EslLongTextLeftCardsRightPromo` |

Breaking the first row produces `The property 'X' is not allowed when content type has ElementEnabled`, and the type is not created. The Phase 6 behaviors check catches this in the manifest before the push.

## Renderer (`EslMyComponentRenderer.tsx`)

Rules, as seen in `EslKeyFactsRowRenderer.tsx`, `EslSideBySideRenderer.tsx` and `EslHeroSliderRenderer.tsx`:

- Props: `{ content?: Data & { component?: Data } | null; displaySettings?: Record<string, string | boolean> | null; id?: string }`.
- `const c = content?.component || content;` (Visual Builder nodes wrap the data in `component`).
- Map every field. Trim strings. Resolve media with `resolveMediaUrl` and links with the `resolveLink` pattern. Rich text uses the SDK `RichText`; follow the rich text checklist in `graph-query-troubleshooting.md` (accept `{ json, html }` and strings, fall back to `html`, treat empty payloads as missing).
- Map children: `rawItem.component || rawItem`, skip items with no meaningful content.
- Return `null` when the required content (per the spec) is missing. Never inject fixture copy.
- Translate `displaySettings` into organism props with a safe default.
- The only imports allowed are the organism barrel, the content type file and shared helpers. No imports from other components' renderers except exported pure helpers.

## CMS test (`EslMyComponent.test.tsx`)

- Content type: key, displayName, baseType, compositionBehaviors, each property's `type`, child `contentType` reference; display template key, `contentType` and choices.
- Renderer: full payload renders every slot; nested `component` wrapper is unwrapped; empty or partial payload returns `null` or omits slots; empty child items are dropped; `displaySettings` changes the variant; links resolve with target; images use the optimized URL.
- Guard against hard-coding: with empty fields, none of the fixture strings from `<kebabName>Data.ts` appear in the output.
- External links: `SimpleLink` appends a visually hidden "(opens in a new tab)" to `target="_blank"` links, so match such links by prefix (`getByRole('link', { name: /^See Details/ })`), not by exact name.

## Test content values through MCP (`cms_update_content_item`)

Inside an experience composition, each property is wrapped in `{ "value": ... }`. Copy the rest of the shape from an existing experience read with `cms_get_content_data`, and read your item back afterwards.

| Property type | Value shape |
|---|---|
| `string`, `boolean`, `selectOne` | `{ "value": "text" }` |
| `richText` | `{ "value": { "html": "<p>…</p>" } }` (Graph fills in `json`) |
| `link` | `{ "value": { "url": "/path", "target": "_top", "text": "Label" } }` |
| `array` of `string` | `{ "value": ["A", "B"] }` |
| `component` (single block) | `{ "value": { "properties": { "field": { "value": … } } } }` |
| `array` of `component` | `{ "value": [ { "properties": { "field": { "value": … } } } ] }` |

The `[WF]` experience's composition (with `Container` = the ESL Start Page for an `EslHomeExperience`; see SKILL Phase 7, step 4) always starts with an empty Blank Section, then the component. This is the Visual Builder properties-panel workaround:

```json
{
  "composition": {
    "displayName": "[WF] EslMyComponent preview",
    "nodeType": "experience",
    "layoutType": "outline",
    "nodes": [
      { "displayName": "Blank Section", "nodeType": "section", "layoutType": "grid", "component": { "contentType": "BlankSection" } },
      { "displayName": "My Component", "nodeType": "component", "component": { "contentType": "EslMyComponent", "properties": { "title": { "value": "…" } } } }
    ]
  }
}
```

The node shape is copied from the published Home, Product Family and Product Detail experiences, which all start with the same empty Blank Section.
