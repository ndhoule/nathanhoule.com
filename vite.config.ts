import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    plugins: ["typescript", "oxc", "react", "jsx-a11y", "node"],
    categories: {
      correctness: "error",
      suspicious: "error",
      pedantic: "error",
      perf: "error",
      style: "error",
      nursery: "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    ignorePatterns: [".astro/", "dist/", "public/"],
    rules: {
      "no-console": "warn",
      "no-empty": "error",
      "no-inline-comments": "off",
      "typescript/no-explicit-any": "error",
      "typescript/no-non-null-assertion": "error",
      "typescript/use-unknown-in-catch-callback-variable": "error",

      eqeqeq: ["error", "smart"],
      // `declare module` blocks in ambient .d.ts files can't use `import type`.
      "typescript/consistent-type-imports": [
        "error",
        { disallowTypeAnnotations: false },
      ],
      "no-redeclare": "off", // Covered by tsc
      "no-undef": "off", // Covered by tsc
      "require-await": "off", // Replaced by typescript/require-await
      "react/react-in-jsx-scope": "off",

      // Rules that conflict with this codebase's conventions.
      "capitalized-comments": "off",
      "id-length": "off",
      "init-declarations": "off",
      "jsx-a11y/control-has-associated-label": "off",
      "max-lines-per-function": "off",
      "max-statements": "off",
      "no-magic-numbers": "off",
      "no-shadow": "off",
      "no-ternary": "off",
      "no-warning-comments": "off",
      "one-var": "off",
      "oxc/no-map-spread": "off",
      "prefer-named-capture-group": "off",
      "react/function-component-definition": "off",
      "react/hook-use-state": "off",
      "react/jsx-max-depth": "off",
      "react/jsx-props-no-spreading": "off",
      "sort-imports": "off",
      "sort-keys": "off",
      "typescript/consistent-type-definitions": "off",
      "typescript/no-unsafe-type-assertion": "off",
      "typescript/prefer-readonly-parameter-types": "off",
    },
  },
  fmt: {
    // Match the Prettier defaults this project used before Oxfmt.
    printWidth: 80,
    sortPackageJson: false,
    astro: true,
    ignorePatterns: ["data/"],
  },
});
