import { style } from "@vanilla-extract/css";

// FIXME(ndhoule): Figure out how to better share this layout
export { layoutOuter, layoutInner } from "../home.css";

export const mainContainer = style({
  paddingTop: "1em",
  paddingBottom: "1em",
});

// FIXME(ndhoule): Not currently used as a subhead
export const subhead = style({
  marginBottom: "1em",
});

// TODO(ndhoule): Move to common styles
export const bulletedList = style({
  listStyle: "inside",
});

// TODO(ndhoule): Move to common styles (and reuse in Navigation)?
export const link = style({
  fontWeight: "700",

  selectors: {
    "&:active": {
      textDecorationLine: "underline",
    },
    "&:hover": {
      textDecorationLine: "underline",
    },
  },
});
