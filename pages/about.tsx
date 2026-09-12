import Layout from "../components/layout";

import styles from "../components/layout.module.css";

const About = () => {
  return (
    <Layout title="About">
      <div className={`${styles.container} ${styles.page}`}>
        <div className={styles.pageHeader}>About</div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>What is trace.moe?</div>
          <p>
            <b>trace.moe is an Anime Scene Search Engine</b> that helps users to trace back the
            original anime by a screenshot. It searches over tens of thousands of hours of anime and
            find the best matching scene. It can tell the anime, the episode and the exact time that
            scene appears. Since the search result may not be correct, it provides a few seconds of
            preview for verification. There has been a lot of anime screencaps and GIFs spreading
            around the internet without quoting the source. And trace.moe is built to fix that,
            helping people to get to know the source anime, not just some random piece of work in
            content farms.
          </p>
          <p>
            trace.moe is a free service and has no Ads. It relies entirely on donations for its
            operational costs.
          </p>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>What trace.moe is NOT</div>
          <p>
            <b>This website is not for watching anime</b>. The server has effective measures to
            prevent users from accessing the original video beyond the preview limit. If you ask me
            where you can watch the anime in search result, I'll show you the way to Youtube,
            Amazon, Netflix, bilibili, etc (depending on your country).
          </p>
          <p>
            <b>trace.moe is not for comics / anime-style artworks</b>. This search engine only index
            anime officially published through TV/Web/DVD/Bluray. If you wish to search artwork /
            wallpapers, try to use{" "}
            <a href="https://saucenao.com/" target="_blank" rel="noopener noreferrer">
              SauceNAO
            </a>{" "}
            and{" "}
            <a href="https://iqdb.org/" target="_blank" rel="noopener noreferrer">
              iqdb.org
            </a>
          </p>
          <p>
            <b>trace.moe is not an AI</b>. It does not have a neural network that recognize and
            understand the things (like characters) on the images. It uses a technology called{" "}
            <a
              href="https://en.wikipedia.org/wiki/Content-based_image_retrieval"
              target="_blank"
              rel="noopener noreferrer"
            >
              Content-based image retrieval
            </a>{" "}
            which compares only the colors and patterns of the images instead of trying to
            understanding the image. Thus, it is nothing related to Machine Learning and is not
            train-able. You may read the{" "}
            <a href="https://github.com/soruly/slides" target="_blank" rel="noopener noreferrer">
              presentations slides
            </a>{" "}
            for technical details.
          </p>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Official Apps</div>
          <ul>
            <li>
              Telegram Bot (
              <a href="https://telegram.me/WhatAnimeBot" target="_blank" rel="noopener noreferrer">
                @WhatAnimeBot
              </a>
              )
            </li>
            <li>
              Search Anime by Screenshot (
              <a
                href="https://chrome.google.com/webstore/detail/search-anime-by-screensho/gkamnldpllcbiidlfacaccdoadedncfp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chrome
              </a>
              {", "}
              <a
                href="https://addons.mozilla.org/en-US/firefox/addon/search-anime-by-screenshot/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Firefox
              </a>
              {", "}
              <a
                href="https://microsoftedge.microsoft.com/addons/detail/search-anime-by-screensho/bkigcpancdclbiekidfbcghedaielbda"
                target="_blank"
                rel="noopener noreferrer"
              >
                MSEdge
              </a>
              {", "}
              <a
                href="https://addons.opera.com/en/extensions/details/search-anime-by-screenshot/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Opera
              </a>
              )
            </li>
          </ul>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Developers Info</div>
          <ul>
            <li>
              <a
                href="https://soruly.github.io/trace.moe-api/"
                target="_blank"
                rel="noopener noreferrer"
              >
                trace.moe API Docs
              </a>
            </li>
            <li>
              <a
                href="https://github.com/soruly/trace.moe"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source Code on GitHub
              </a>
            </li>
            <li>
              <a
                href="https://huggingface.co/datasets/soruly/trace.moe-database-dump"
                target="_blank"
                rel="noopener noreferrer"
              >
                Database Dump
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Contact / Community</div>
          <p>
            If you have any questions, feedback, or need help, feel free to join our community on{" "}
            <a href="https://discord.gg/K9jn6Kj" target="_blank" rel="noopener noreferrer">
              Discord
            </a>{" "}
            or{" "}
            <a href="https://t.me/trace_moe" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
            .
          </p>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>Donate</div>
          <p>
            Donators get higher search quotas as a return. You can refer to the{" "}
            <a
              href="https://soruly.github.io/trace.moe-api/#/limits"
              target="_blank"
              rel="noopener noreferrer"
            >
              API limits documentation
            </a>{" "}
            for details.
          </p>
          <ul>
            <li>
              <a href="https://www.patreon.com/soruly" target="_blank" rel="noopener noreferrer">
                Patreon
              </a>
            </li>
            <li>
              <a
                href="https://github.com/sponsors/soruly"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Sponsors
              </a>
            </li>
            <li>
              <a href="https://www.paypal.me/soruly" target="_blank" rel="noopener noreferrer">
                PayPal
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};
export default About;
