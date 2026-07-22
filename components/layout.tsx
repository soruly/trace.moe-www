import Head from "next/head";
import { useEffect, useState } from "react";

import UserMenu from "./user-menu";

import styles from "./footer.module.css";
import sponsorStyles from "./sponsor.module.css";

export default function Layout({ children, title }) {
  const [showSponsor, setShowSponsor] = useState(false);

  useEffect(() => {
    if (navigator.language.startsWith("en")) {
      setShowSponsor(true);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#f9f9fb" />
        <meta
          name="description"
          content="Search Anime by ScreenShot. Lookup the exact moment and the episode."
        />
        <meta
          name="keywords"
          content="Anime Scene Search, Search by image, Anime Image Search, アニメのキャプ画像"
        />
        <title>{`${title} - trace.moe`}</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" sizes="32x32" href="/favicon32.png" />
        <link rel="apple-touch-icon" href="/favicon144.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <UserMenu></UserMenu>
      <main className={styles.main}>{children}</main>

      <div
        className={
          showSponsor ? sponsorStyles.sponsor : sponsorStyles.sponsor + " " + sponsorStyles.hidden
        }
      >
        <div>
          <div className={sponsorStyles.title}>Found the show? Track it on AnimeOshi.</div>
          <div className={sponsorStyles.subTitle}>
            Ratings, episode tracking, and community - free.
          </div>
        </div>
        <a
          className={sponsorStyles.link}
          href="https://www.animeoshi.com?utm_source=trace.moe&utm_medium=referral&utm_campaign=footer"
          target="_blank"
          rel="noopener noreferrer"
        >
          animeoshi.com →
        </a>
      </div>

      <script src="/js/pwa.js" defer></script>
    </>
  );
}
