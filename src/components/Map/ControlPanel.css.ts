import { style } from "@vanilla-extract/css";

export const controlPanel = style({
  position: "absolute",
  top: 0,
  right: 0,
  maxWidth: "320px",
  background: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  padding: "12px 24px",
  margin: "20px",
  fontSize: "13px",
  lineHeight: 2,
  color: "#6b6b76",
  textTransform: "uppercase",
  outline: "none",
});
