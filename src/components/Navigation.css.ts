import { globalStyle, style } from "@vanilla-extract/css";
import { lightBlue } from "../styles/colors";
import { hsl } from "../styles/utils";
import * as flexboxStyles from "./Flexbox.css";

export const navigationElement = style({
  selectors: {
    "&:not(:last-of-type)": {
      marginRight: "1.7em",
    },
  },
});

globalStyle(`${navigationElement} > a`, {
  color: hsl(lightBlue),
  textDecorationLine: "none",
});

globalStyle(`${navigationElement} > a:active`, {
  textDecorationLine: "underline",
});

globalStyle(`${navigationElement} > a:hover`, {
  textDecorationLine: "underline",
});

export const navigationSection = style([
  flexboxStyles.flexRow,
  {
    listStyleType: "none",
    margin: 0,
    marginBottom: "1em",
    marginTop: "1em",
    overflow: "hidden",
    padding: 0,
  },
]);

export const navigation = style({ justifyContent: "space-between" });
