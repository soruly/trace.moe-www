import Head from "next/head";
import Link from "next/link";
import { footer, container, section, sectionHeader, sectionItem } from "./footer.module.css";

export default function Layout({ children, title }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f9f9fb" />
        <meta
          name="description"
          content="Search Anime by ScreenShot. Lookup the exact moment and the episode."
        />
        <meta
          name="keywords"
          content="Anime Scene Search, Search by image, Anime Image Search, アニメのキャプ画像"
        />
        <title>{title} - trace.moe</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/png" href="/favicon128.png" sizes="128x128" />
      </Head>
      {children}
      <footer className={footer}>
        <div className={container}>
          <div className={section}>
            <div className={sectionHeader}>
              <Link href="/">trace.moe</Link>
            </div>
            <div className={sectionItem}>
              <Link href="/news">News</Link>
            </div>
            <div className={sectionItem}>
              <a href="https://github.com/soruly/trace.moe">GitHub</a>
            </div>
            <div className={sectionItem}>
              <a href="https://discord.gg/K9jn6Kj">Discord</a>
            </div>
            <div className={sectionItem}>
              <a href="https://t.me/whatanimeupdates">Telegram</a>
            </div>
            <div className={sectionItem}>
              <a href="https://soruly.github.io/trace.moe-api/">API Docs</a>
            </div>
          </div>
          <div className={section}>
            <div className={sectionHeader}>Apps</div>
            <div className={sectionItem}>
              <a href="https://telegram.me/WhatAnimeBot">Telegram Bot</a>
            </div>
            <div className={sectionItem}>
              <a href="https://chrome.google.com/webstore/detail/search-anime-by-screensho/gkamnldpllcbiidlfacaccdoadedncfp">
                Chrome Extension
              </a>
            </div>
            <div className={sectionItem}>
              <a href="https://addons.mozilla.org/en-US/firefox/addon/search-anime-by-screenshot/">
                Firefox Add-on
              </a>
            </div>
            <div className={sectionItem}>
              <a href="https://microsoftedge.microsoft.com/addons/detail/search-anime-by-screensho/bkigcpancdclbiekidfbcghedaielbda">
                Edge Add-on
              </a>
            </div>
            <div className={sectionItem}>
              <a href="https://addons.opera.com/en/extensions/details/search-anime-by-screenshot/">
                Opera Add-on
              </a>
            </div>
          </div>
          <div className={section}>
            <div className={sectionHeader}>Donate</div>
            <div className={sectionItem}>
              <a href="https://www.patreon.com/soruly">Patreon</a>
            </div>
            <div className={sectionItem}>
              <a href="https://github.com/sponsors/soruly">GitHub Sponsors</a>
            </div>
            <div className={sectionItem}>
              <a href="https://www.paypal.me/soruly">PayPal</a>
            </div>
            <div className={sectionItem}>
              <Link href="/account">Account</Link>
            </div>
          </div>
          <div className={section}>
            <div className={sectionHeader}>Help</div>
            <div className={sectionItem}>
              <Link href="/faq">FAQ</Link>
            </div>
            <div className={sectionItem}>
              <Link href="/about">About</Link>
            </div>
            <div className={sectionItem}>
              <Link href="/terms">Terms &amp; Privacy</Link>
            </div>
            <div className={sectionItem}>
              <a href="https://t.me/soruly">Contact</a>
            </div>
            <div className={sectionItem}>
              <a href="https://status.trace.moe">System Status</a>
            </div>
          </div>
        </div>
      </footer>
      <script src="/js/analytics.js" defer></script>
    </>
  );
}
