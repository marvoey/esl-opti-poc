import { fileURLToPath } from "node:url";

// Design tokens: the single source of truth for custom properties.
// Resolved to an absolute path because the plugin resolves relative paths from the CWD.
const tokensFile = fileURLToPath(new URL("./src/styles/tokens.css", import.meta.url));

// Custom properties that are intentionally NOT declared in CSS because they are set at runtime:
// - next/font injects --font-albert-sans / --font-league-spartan via a class on <html> (app layout).
// - TabbedIconCards writes the --tab-* geometry from JS (inline style); CSS keeps a var() fallback.
const runtimeCustomProperties = {
  customProperties: {
    "--font-albert-sans": "set by next/font",
    "--font-league-spartan": "set by next/font",
    "--tab-1-width": "set inline by TabbedIconCards",
    "--tab-2-offset": "set inline by TabbedIconCards",
    "--tab-2-width": "set inline by TabbedIconCards",
  },
};

/** @type {import('stylelint').Config} */
const config = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-value-no-unknown-custom-properties"],
  rules: {
    // Every var(--x) must resolve to a token (or a runtime property listed above).
    // Component-scoped tokens declared inside a CSS module are also recognized: the plugin
    // collects every custom property declared in the linted file (it does not check that the
    // declaring selector is an ancestor of the using one, so keep module tokens on the root).
    // Undefined custom properties are invalid at computed-value time and fail silently.
    "csstools/value-no-unknown-custom-properties": [
      true,
      {
        importFrom: [tokensFile, runtimeCustomProperties],
      },
    ],
    // Ban var() fallbacks. The rule above skips any var() that has a fallback, so a typo'd
    // token with a fallback would render the fallback silently. Only the JS-set runtime
    // --tab-* geometry props (see runtimeCustomProperties) may keep a fallback for first paint.
    "declaration-property-value-disallowed-list": [
      {
        "/.*/": ["/var\\(\\s*--(?!tab-(?:1-width|2-offset|2-width)\\s*,)[\\w-]+\\s*,/"],
      },
      {
        message: "Unexpected var() fallback: reference a defined design token without a fallback",
      },
    ],
    // Allow both camelCase (CSS Modules standard) and kebab-case class names
    "selector-class-pattern": [
      "^[a-z][a-zA-Z0-9]*(-[a-z0-9]+)*$",
      {
        message: "Expected class selector to be camelCase or kebab-case",
      },
    ],
    // Allow camelCase and kebab-case for keyframes
    "keyframes-name-pattern": [
      "^[a-z][a-zA-Z0-9]*(-[a-z0-9]+)*$",
      {
        message: "Expected keyframe name to be camelCase or kebab-case",
      },
    ],
    // CSS Modules `composes` (e.g. the shared container primitive in styles/layout.module.css)
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes"],
      },
    ],
    // Support CSS Modules :global()
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    // Strict Token Architecture: Forbid raw hex colors in component modules
    "color-no-hex": true,
    // Font family names keep their canonical casing; currentColor keeps its conventional casing.
    "value-keyword-case": [
      "lower",
      {
        ignoreProperties: ["--font-family-sans", "--font-family-mono", "font-family"],
        ignoreKeywords: ["currentColor"],
      },
    ],

    // Kept disabled: satisfying it requires reordering rules, which changes the cascade
    // (and therefore rendering) wherever two selectors match the same element.
    "no-descending-specificity": null,
    // Blank lines group related custom properties (e.g. token tiers in tokens.css); they are
    // optional between custom properties but still required after a regular declaration.
    "custom-property-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        ignore: ["after-comment", "after-custom-property", "inside-single-line-block"],
      },
    ],
    // String notation matches how the app imports CSS (and Tailwind's `@import "tailwindcss"`).
    "import-notation": "string",
    // Prefixes still required by supported browsers: Safari < 18 needs -webkit-backdrop-filter,
    // iOS Safari only supports -webkit-text-size-adjust.
    "property-no-vendor-prefix": [
      true,
      {
        ignoreProperties: ["-webkit-backdrop-filter", "-webkit-text-size-adjust"],
      },
    ],
  },
  overrides: [
    {
      // Tokens file is the single source of truth where hex primitives are defined
      files: ["src/styles/tokens.css", "**/tokens.css"],
      rules: {
        "color-no-hex": null,
        // Tokens store exact design ratios (e.g. 1.078125 = 34.5 / 32); rounding them to the
        // default 4 decimals would change computed values.
        "number-max-precision": 6,
      },
    },
  ],
};

export default config;
