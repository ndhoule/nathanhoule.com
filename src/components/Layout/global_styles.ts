import { Interpolation, css } from "@emotion/react";
import { Theme } from "../../theme";
import resetStyles from "./reset_styles";

const globalStyles: Interpolation<Theme> = (theme) =>
  css`
    ${resetStyles}

    body {
      color: ${theme.colors.content};
      font-family: ${theme.fonts.base.family};
      font-size: ${theme.fonts.base.size};
      font-style: ${theme.fonts.base.style};
      font-weight: ${theme.fonts.base.weight};
    }

    h1 {
      font-family: ${theme.fonts.h6.family};
      font-weight: ${theme.fonts.h6.weight};
      font-size: ${theme.fonts.h6.size};
    }

    h2 {
      font-family: ${theme.fonts.h6.family};
      font-weight: ${theme.fonts.h6.weight};
      font-size: ${theme.fonts.h6.size};
    }

    h3 {
      font-family: ${theme.fonts.h6.family};
      font-weight: ${theme.fonts.h6.weight};
      font-size: ${theme.fonts.h6.size};
    }

    h4 {
      font-family: ${theme.fonts.h6.family};
      font-weight: ${theme.fonts.h6.weight};
      font-size: ${theme.fonts.h6.size};
    }

    h5 {
      font-family: ${theme.fonts.h6.family};
      font-weight: ${theme.fonts.h6.weight};
      font-size: ${theme.fonts.h6.size};
    }

    h6 {
      font-family: ${theme.fonts.h6.family};
      font-weight: ${theme.fonts.h6.weight};
      font-size: ${theme.fonts.h6.size};
    }

    ul,
    ol,
    dl {
      font-size: 1rem;
    }

    p {
      font-size: ${theme.fonts.p.size};
    }

    a {
      color: ${theme.colors.primary};
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `;

export default globalStyles;
