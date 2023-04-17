import { Inter, Lato } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--header-font-family",
  weight: "700",
});

export const lato = Lato({
  subsets: ["latin"],
  variable: "--base-font-family",
  weight: ["400", "700"],
});
