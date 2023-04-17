import { style } from "@vanilla-extract/css";

export const box = style({
  boxSizing: "border-box",
  margin: 0,
  minWidth: 0,
});

export const flex = style([box, { display: "flex" }]);

export const flexColumn = style([flex, { flexDirection: "column" }]);

export const flexRow = style([flex, { flexDirection: "row" }]);
