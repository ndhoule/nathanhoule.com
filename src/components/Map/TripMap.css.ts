import { style } from "@vanilla-extract/css";

export const mapOuterContainer = style({
  height: "100%",

  display: "grid",
  gridTemplateAreas: '"announce announce" "controls surface"',
  gridTemplateColumns: "[vp-start] max-content 1fr [vp-end]",
  gridTemplateRows: "[vp-start] max-content 1fr [vp-end]",
});

export const mapInnerContainer = style({
  height: "100%",
  width: "100%",
  gridArea: "vp",
});
