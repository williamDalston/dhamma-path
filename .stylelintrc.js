module.exports = {
  extends: [
    'stylelint-config-standard',
  ],
  rules: {
    // Tailwind-specific rules
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],

    // CSS custom properties
    'custom-property-pattern': '^[a-z][a-zA-Z0-9-]*$',

    // Color validation
    'color-no-hex': false,
    'color-named': 'never',

    // Class ordering (handled by prettier-plugin-tailwindcss)
    'order/properties-alphabetical-order': null,

    // Disable rules that conflict with Tailwind
    'declaration-block-no-redundant-longhand-properties': null,
    'shorthand-property-no-redundant-values': null,
  },
  ignoreFiles: [
    '**/*.html',
    '**/node_modules/**',
  ],
};
