import "../components/JmtMap/legend_control.styles.css";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { type AppProps as BaseAppProps } from "next/app";
import Head from "next/head";
import { globalStyles } from "../styles/globals";

export type AppProps = BaseAppProps;

const cache = createCache({ key: "css" });

const App = ({ Component, pageProps }: AppProps) => (
  <CacheProvider value={cache}>
    {globalStyles}

    <Head>
      <title>Nathan Houle</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
    </Head>

    <Component {...pageProps} />
  </CacheProvider>
);

export default App;
