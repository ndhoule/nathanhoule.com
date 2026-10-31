import { style } from "@vanilla-extract/css";

export const photoPopupImage = style({
  height: "100%",
  inset: 0,
  objectFit: "cover",
  position: "absolute",
  width: "100%",
});

export const photoPopupImageLink = style({
  color: "blue",
  textDecorationLine: "underline",
  fontSize: "0.8em",
});
