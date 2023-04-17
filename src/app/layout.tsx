import "../styles/reset.css";
import "../styles/reset_overrides.css";
import "../styles/globals.css";

import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/maplibre-gl-overrides.css";

import cn from "classnames";
import { type Metadata } from "next";
import React from "react";
import * as fonts from "../styles/fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Nathan Houle",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={cn([fonts.inter.variable, fonts.lato.variable])}>
    <body>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
