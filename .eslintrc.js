module.exports = {
  root: true,
  extends: ["@ndhoule/eslint-config/recommended"],
  overrides: [
    /*
     * Application Source
     */

    {
      files: ["src/**/*.{ts,tsx}"],
      extends: ["@ndhoule/eslint-config/recommended-typescript"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
      },
    },
    {
      files: ["src/**/*.tsx"],
      extends: [
        "@ndhoule/eslint-config/react",
        "@ndhoule/eslint-config/react/jsx-runtime",
        "@ndhoule/eslint-config/react/typescript",
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
      },
      rules: {
        "react/no-unknown-property": ["error", { ignore: ["css"] }],
      },
    },

    /*
     * Tests
     */

    {
      files: ["src/**/*.test.{ts,tsx}"],
      extends: ["@ndhoule/eslint-config/jest"],
    },

    /*
     * Config Files
     */

    {
      files: [".*rc.js", "*.config.js"],
      extends: ["@ndhoule/eslint-config/node"],
    },
    {
      files: [".*rc.ts", "*.config.ts"],
      extends: ["@ndhoule/eslint-config/node/typescript"],
      parserOptions: {
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: "./tsconfig.config-files.json",
      },
    },
  ],
};
