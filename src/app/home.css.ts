import { style } from "@vanilla-extract/css";
import { breakpoints } from "../styles/breakpoints";
import { lightBlue } from "../styles/colors";
import { hsl } from "../styles/utils";

export const layoutOuter = style({
  borderTopColor: hsl(lightBlue),
  borderTopStyle: "solid",
  borderTopWidth: "4px",
  paddingBottom: "4px",
  paddingLeft: "8px",
  paddingRight: "8px",
  paddingTop: "4px",
});

export const layoutInner = style({
  marginLeft: "auto",
  marginRight: "auto",
  maxWidth: breakpoints.md.px,
});

export const hero = style({
  marginBottom: "0.67em",
  marginTop: "0.67em",
  textAlign: "center",
});

export const subhead = style({
  marginBottom: "1em",
  marginTop: "1em",
  textAlign: "center",
});
