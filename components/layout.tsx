import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/png" href="/favicon128.png" sizes="128x128" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
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

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Link href="/">trace.moe</Link>
            </div>
            <div className={styles.sectionItem}>
              <Link href="/news">News</Link>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://github.com/soruly/trace.moe">GitHub</a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://discord.gg/K9jn6Kj">Discord</a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://t.me/whatanimeupdates">Telegram</a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://soruly.github.io/trace.moe-api/">API Docs</a>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>Apps</div>
            <div className={styles.sectionItem}>
              <a href="https://telegram.me/WhatAnimeBot">Telegram Bot</a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://chrome.google.com/webstore/detail/search-anime-by-screensho/gkamnldpllcbiidlfacaccdoadedncfp">
                Chrome Extension
              </a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://addons.mozilla.org/en-US/firefox/addon/search-anime-by-screenshot/">
                Firefox Add-on
              </a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://microsoftedge.microsoft.com/addons/detail/search-anime-by-screensho/bkigcpancdclbiekidfbcghedaielbda">
                Edge Add-on
              </a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://addons.opera.com/en/extensions/details/search-anime-by-screenshot/">
                Opera Add-on
              </a>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>Donate</div>
            <div className={styles.sectionItem}>
              <a href="https://www.patreon.com/soruly">Patreon</a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://github.com/sponsors/soruly">GitHub Sponsors</a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://www.paypal.me/soruly">PayPal</a>
            </div>
            <div className={styles.sectionItem}>
              <Link href="/account">Account</Link>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>Help</div>
            <div className={styles.sectionItem}>
              <Link href="/faq">FAQ</Link>
            </div>
            <div className={styles.sectionItem}>
              <Link href="/about">About</Link>
            </div>
            <div className={styles.sectionItem}>
              <Link href="/terms">Terms &amp; Privacy</Link>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://t.me/soruly">Contact</a>
            </div>
            <div className={styles.sectionItem}>
              <a href="https://status.trace.moe">System Status</a>
            </div>
          </div>
        </div>
      </footer>
      <script src="/js/pwa.js" defer></script>
    </>
  );
}
