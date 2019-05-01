module.exports = {
  root: true,
  plugins: ["@emotion"],
  extends: [
    "@ndhoule/eslint-config/recommended",
    "@ndhoule/eslint-config/lodash",
    "@ndhoule/eslint-config/react",
  ],
  rules: {
    // stylelint only works on template literals, so enforce template literal usage everywhere.
    "@emotion/syntax-preference": ["error", "string"],
    // No longer required as of React 17, 16.14.0
    // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
  overrides: [
    // Configuration files
    {
      files: [
        "*.config.js",
        ".*rc",
        ".*rc.js",
        "gatsby-browser.js",
        "gatsby-config.js",
        "gatsby-node.js",
      ],
      extends: ["plugin:node/recommended-script"],
    },
    // TypeScript files
    {
      files: ["src/**/*.{ts,tsx}"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json",
      },
      extends: ["@ndhoule/eslint-config/typescript"],
    },
    // React components
    {
      files: ["src/**/*.{js,jsx}"],
      extends: ["@ndhoule/eslint-config/react"],
    },
    {
      files: ["src/**/*.{ts,tsx}"],
      extends: ["@ndhoule/eslint-config/react/typescript"],
    },
  ],
};
