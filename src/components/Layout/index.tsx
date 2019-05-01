import { Global, ThemeProvider } from "@emotion/react";
import * as React from "react";
import theme, { Theme as CustomTheme } from "../../theme";
import SEO from "../SEO";
import globalStyles from "./global_styles";

declare module "@emotion/react" {
  export interface Theme extends CustomTheme {}
}

const Layout: React.FunctionComponent = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Global styles={globalStyles} />
    <SEO />
    {children}
  </ThemeProvider>
);

export default Layout;
