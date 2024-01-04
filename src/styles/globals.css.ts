import { globalStyle } from "@vanilla-extract/css";
import { breakpoints } from "./breakpoints";
import { softBlack } from "./colors";
import { hsl } from "./utils";

/*
 * App-specific CSS
 */

globalStyle("html, body", {
  height: "100%",
  width: "100vw",
});

/*
 * Typography
 */

/**
 * Headers are modularly scaled at a 1.25 ratio on desktop, 1.15 on mobile.
 * https://www.modularscale.com/?1=&em=&1.25=
 */
globalStyle("html", {
  color: hsl(softBlack),
  fontFamily: "var(--base-font-family)",
  fontSize: "16px",
  letterSpacing: "0.15px",

  [`@media only screen and (max-width: ${breakpoints.sm.px})`]: {
    fontSize: "15px",
  },
});

globalStyle("h1, h2, h3, h4, h5, h6", {
  fontFamily: "var(--header-font-family)",
});

globalStyle("h1", {
  fontSize: "3.815em",
  letterSpacing: "-1.5px",

  [`@media only screen and (max-width: ${breakpoints.sm.px})`]: {
    fontSize: "2.986em",
  },
});

globalStyle("h2", {
  fontSize: "3.052em",
  letterSpacing: "-0.5px",

  [`@media only screen and (max-width: ${breakpoints.sm.px})`]: {
    fontSize: "2.488em",
  },
});

globalStyle("h3", {
  fontSize: "2.441em",
  letterSpacing: "0px",

  [`@media only screen and (max-width: ${breakpoints.sm.px})`]: {
    fontSize: "2.074em",
  },
});

globalStyle("h4", {
  fontSize: "1.953em",
  letterSpacing: "0.25px",

  [`@media only screen and (max-width: ${breakpoints.sm.px})`]: {
    fontSize: "1.728em",
  },
});

globalStyle("h5", {
  fontSize: "1.563em",
  letterSpacing: "0px",

  [`@media only screen and (max-width: ${breakpoints.sm.px})`]: {
    fontSize: "1.44em",
  },
});

globalStyle("h6", {
  fontSize: "1.25em",
  letterSpacing: "0.15px",

  [`@media only screen and (max-width: ${breakpoints.sm.px})`]: {
    fontSize: "1.2em",
  },
});
