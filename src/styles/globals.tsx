import { breakpoints } from "./breakpoints";
import { softBlack } from "./colors";
import { inter, lato } from "./fonts";
import { hsl } from "./utils";
import { Global, css } from "@emotion/react";

const typographyStyles = css({
  html: {
    color: `${hsl(softBlack)}`,
    fontFamily: lato.style.fontFamily,
    fontSize: "16px",
    letterSpacing: "0.15px",

    [`& @media only screen and (max-width: ${breakpoints.sm.px})`]: {
      fontSize: "15px",
    },
  },

  "h1, h2, h3, h4, h5, h6": {
    fontFamily: inter.style.fontFamily,
    fontWeight: inter.style.fontWeight,
  },

  h1: {
    fontSize: "3.815em",
    letterSpacing: "-1.5px",
  },

  h2: {
    fontSize: "3.052em",
    letterSpacing: "-0.5px",
  },

  h3: {
    fontSize: "2.441em",
    letterSpacing: "0px",
  },

  h4: {
    fontSize: "1.953em",
    letterSpacing: "0.25px",
  },

  h5: {
    fontSize: "1.563em",
    letterSpacing: "0px",
  },

  h6: {
    fontSize: "1.25em",
    letterSpacing: "0.15px",
  },
});

export const globalStyles = (
  <Global
    styles={css([
      {
        "*": {
          boxSizing: "border-box",
        },

        "html, body": {
          margin: 0,
          padding: 0,
        },

        "html, body, #__next": {
          width: "100vw",
        },
      },
      typographyStyles,
    ])}
  />
);
