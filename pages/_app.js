import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";

import Nav from "../components/nav";
import "../styles/index.css";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>youtube-dl-web</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col min-w-full min-h-screen bg-bunker-800">
        <Nav />
        <Component {...pageProps} />
      </div>
    </>
  );
}
