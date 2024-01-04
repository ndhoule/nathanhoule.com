import { globalStyle } from "@vanilla-extract/css";

/*
 * CSS reset overrides/customizations
 */

globalStyle(
  // Use default browser styles for checkbox/radio inputs
  "input[type='checkbox'], input[type='radio']",
  {
    all: "revert",
  },
);
