/** @type {import('stylelint').Config} */
const config = {
  extends: ["stylelint-config-standard"],
  rules: {
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
    // Support CSS Modules :global()
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    // Strict Token Architecture: Forbid raw hex colors in component modules
    "color-no-hex": true,

    // Practical CSS Modules and Design Token ergonomics
    "no-descending-specificity": null,
    "custom-property-empty-line-before": null,
    "color-function-notation": null,
    "color-function-alias-notation": null,
    "color-hex-length": null,
    "alpha-value-notation": null,
    "hue-degree-notation": null,
    "comment-empty-line-before": null,
    "rule-empty-line-before": null,
    "import-notation": null,
    "property-no-vendor-prefix": null,
    "media-feature-range-notation": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "number-max-precision": null,
    "value-keyword-case": [
      "lower",
      {
        ignoreProperties: ["--font-family-sans", "--font-family-mono", "font-family"],
        ignoreKeywords: ["currentColor"],
      },
    ],
  },
  overrides: [
    {
      // Tokens file is the single source of truth where hex primitives are defined
      files: ["src/styles/tokens.css", "**/tokens.css"],
      rules: {
        "color-no-hex": null,
      },
    },
  ],
};

export default config;
