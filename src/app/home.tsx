import React from "react";
import { Navigation } from "../components/Navigation";
import * as styles from "./home.css";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.layoutOuter}>
    <div className={styles.layoutInner}>{children}</div>
  </div>
);

const Home = () => (
  <Layout>
    <Navigation />

    <main>
      <h1 className={styles.hero}>I&apos;m Nathan Houle.</h1>

      <p className={styles.subhead}>
        I&apos;m a San Francisco Bay Area-based software engineer.
      </p>
    </main>
  </Layout>
);

export const HomePage = () => <Home />;
