import Link from "next/link";
import React from "react";
import { Navigation } from "../../components/Navigation";
import * as styles from "./hiking.css";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.layoutOuter}>
    <div className={styles.layoutInner}>{children}</div>
  </div>
);

const Hiking = () => (
  <Layout>
    <Navigation />

    <main className={styles.mainContainer}>
      <p className={styles.subhead}>
        I&apos;m an avid backpacker and occasional long-distance hiker.
      </p>

      <p className={styles.subhead}>
        Some of the hikes I&apos;ve done include:
      </p>

      <ul className={styles.bulletedList}>
        <li>
          <Link
            className={styles.link}
            href="/hiking/trips/2023/pacific-crest-trail/map"
          >
            Pacific Crest Trail (2023)
          </Link>
        </li>
        <li>
          <Link
            className={styles.link}
            href="/hiking/trips/2020/uinta-highline-trail/map"
          >
            Uinta Highline Trail (2020)
          </Link>
        </li>
        <li>
          <Link
            className={styles.link}
            href="/hiking/trips/2020/john-muir-trail/map"
          >
            John Muir Trail (2020)
          </Link>
        </li>
      </ul>
    </main>
  </Layout>
);

export const HikingPage = () => <Hiking />;
