module.exports = {
  plugins: ["stylelint-prettier"],
  extends: [
    "stylelint-config-standard",

    "stylelint-config-prettier", // Must be last
  ],
  rules: {
    "prettier/prettier": true,
  },
};
