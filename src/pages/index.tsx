import { Navigation } from "../components/Navigation";
import { breakpoints } from "../styles/breakpoints";
import { lightBlue } from "../styles/colors";
import { hsl } from "../styles/utils";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div
    css={{
      borderTopColor: hsl(lightBlue),
      borderTopStyle: "solid",
      borderTopWidth: "4px",
    }}
  >
    <div
      css={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: breakpoints.md.px,
      }}
    >
      {children}
    </div>
  </div>
);

const Home = () => (
  <Layout>
    <Navigation />

    <main>
      <h1 css={{ textAlign: "center" }}>I&apos;m Nathan Houle.</h1>

      <p css={{ textAlign: "center" }}>
        I&apos;m a San Francisco Bay Area-based software engineer.
      </p>
    </main>
  </Layout>
);

const HomePage = () => <Home />;

export default HomePage;
