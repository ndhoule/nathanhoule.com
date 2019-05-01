import "@openfonts/inter_all";
import "@openfonts/source-sans-pro_latin";

import { CSSObject } from "@emotion/react";

interface ThemeFont {
  family?: CSSObject["fontFamily"];
  size?: CSSObject["fontSize"];
  style?: CSSObject["fontStyle"];
  weight?: CSSObject["fontWeight"];
}

export interface Theme {
  colors: {
    content: string;
    primary: string;
  };
  fonts: {
    base: ThemeFont;
    h1: ThemeFont;
    h2: ThemeFont;
    h3: ThemeFont;
    h4: ThemeFont;
    h5: ThemeFont;
    h6: ThemeFont;
    p: ThemeFont;
  };
}

const theme: Theme = {
  colors: {
    content: "#333",
    primary: "#008cba",
  },
  fonts: {
    base: {
      family: "'Source Sans Pro', sans-serif",
      size: "16px",
      style: "normal",
      weight: "normal",
    },
    h1: {
      family: "'Inter', 'Helvetica', 'Arial', sans-serif",
      size: "3rem",
      weight: 700,
    },
    h2: {
      family: "'Inter', 'Helvetica', 'Arial', sans-serif",
      size: "2.5rem",
      weight: 700,
    },
    h3: {
      family: "'Inter', 'Helvetica', 'Arial', sans-serif",
      size: "2rem",
      weight: 700,
    },
    h4: {
      family: "'Inter', 'Helvetica', 'Arial', sans-serif",
      size: "1.5rem",
      weight: 700,
    },
    h5: {
      family: "'Inter', 'Helvetica', 'Arial', sans-serif",
      size: "1.25rem",
      weight: 700,
    },
    h6: {
      family: "'Inter', 'Helvetica', 'Arial', sans-serif",
      size: "1.15rem",
      weight: 700,
    },
    p: {
      size: "1rem",
    },
  },
};

export default theme;
