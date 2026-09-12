import { useEffect, useState } from "react";

import AccuracyChart from "../components/accuracy-chart";
import AnilistSearchInput from "../components/anilist-search-input";
import Layout from "../components/layout";
import SpeedChart, { PercentileItem } from "../components/speed-chart";
import TrafficChart, { TrafficItem } from "../components/traffic-chart";

import styles from "../components/layout.module.css";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

const AnilistCoverageInput = ({ setMessage }: { setMessage: (msg: string) => void }) => {
  const [inputValue, setInputValue] = useState("");

  const checkCoverage = async (id: number | string) => {
    if (!id) return;
    setMessage("Searching...");
    try {
      const status = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/status?id=${id}`).then((e) =>
        e.json(),
      );
      setMessage(`Found ${status.length} records`);
      const preEl =
        document.querySelector<HTMLPreElement>(`.${styles.fileList}`) ||
        document.querySelector<HTMLPreElement>("pre");
      if (preEl) {
        if (status.length) {
          preEl.innerText = status.map((e: any) => e.path.split("/").slice(1)).join("\n");
        } else {
          preEl.innerText = `Cannot find any record for ID ${id}`;
        }
      }
    } catch {
      setMessage("Error checking status");
    }
  };

  return (
    <AnilistSearchInput
      className={styles.numberInput}
      placeholder="Anilist ID or title"
      value={inputValue}
      onChange={(val) => {
        setInputValue(val);
        if (/^\d+$/.test(val.trim())) {
          checkCoverage(val.trim());
        }
      }}
      onSelect={(suggestion) => {
        checkCoverage(suggestion.id);
      }}
    />
  );
};

const About = () => {
  const [message, setMessage] = useState("");
  const [
    { updated, rowCount, memory, memoryUsage, mediaCount, mediaFramesTotal, mediaDurationTotal },
    setSystemStatus,
  ] = useState({
    updated: null,
    rowCount: 0,
    memory: 0,
    memoryUsage: 0,
    mediaCount: 0,
    mediaFramesTotal: 0,
    mediaDurationTotal: 0,
  });
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/status`)
      .then((e) => e.json())
      .then((e) => setSystemStatus(e));
  }, []);

  const [trafficPeriod, setTrafficPeriod] = useState<"minute" | "hour" | "day">("hour");
  const [trafficData, setTrafficData] = useState<TrafficItem[] | null>(null);
  const [trafficLoading, setTrafficLoading] = useState(false);
  useEffect(() => {
    setTrafficLoading(true);
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/stats?type=traffic&period=${trafficPeriod}`)
      .then((e) => e.json())
      .then((stats) => {
        if (Array.isArray(stats)) {
          stats.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
          setTrafficData(stats);
        }
      })
      .finally(() => setTrafficLoading(false));
  }, [trafficPeriod]);

  const [speedPeriod, setSpeedPeriod] = useState<"minute" | "hour" | "day">("hour");
  const [speedData, setSpeedData] = useState<PercentileItem[] | null>(null);
  const [speedLoading, setSpeedLoading] = useState(false);
  useEffect(() => {
    setSpeedLoading(true);
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/stats?type=speed&period=${speedPeriod}`)
      .then((e) => e.json())
      .then((stats) => {
        if (Array.isArray(stats)) {
          stats.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
          setSpeedData(stats);
        }
      })
      .finally(() => setSpeedLoading(false));
  }, [speedPeriod]);

  const [accuracyPeriod, setAccuracyPeriod] = useState<"minute" | "hour" | "day">("hour");
  const [accuracyData, setAccuracyData] = useState<PercentileItem[] | null>(null);
  const [accuracyLoading, setAccuracyLoading] = useState(false);
  useEffect(() => {
    setAccuracyLoading(true);
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/stats?type=accuracy&period=${accuracyPeriod}`)
      .then((e) => e.json())
      .then((stats) => {
        if (Array.isArray(stats)) {
          stats.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
          setAccuracyData(stats);
        }
      })
      .finally(() => setAccuracyLoading(false));
  }, [accuracyPeriod]);

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
        <div className={styles.section}>
          <div className={styles.sectionHeader}>System Status</div>
          <p>
            This search engine index latest anime automatically, usually within hours after
            broadcast. You can also check real-time service availability on{" "}
            <a href="https://status.trace.moe" target="_blank" rel="noopener noreferrer">
              System Status
            </a>
            .
          </p>
          <ul>
            <li>
              Analyzed Video:{" "}
              {mediaCount ? mediaCount.toLocaleString(navigator.language) : "counting..."}
            </li>
            <li>
              Total Duration:{" "}
              {mediaDurationTotal
                ? `${Number((mediaDurationTotal / 3600).toFixed(2)).toLocaleString(
                    navigator.language,
                  )} hours`
                : "counting..."}
            </li>
            <li>
              Analyzed Frames:{" "}
              {mediaFramesTotal
                ? mediaFramesTotal.toLocaleString(navigator.language)
                : "counting..."}
            </li>
            <li>
              Indexed Frames:{" "}
              {rowCount ? rowCount.toLocaleString(navigator.language) : "counting..."}{" "}
              {rowCount && mediaFramesTotal
                ? `(${((1 - rowCount / mediaFramesTotal) * 100).toFixed(2)}% de-duplicated)`
                : ""}
            </li>
            <li>
              Memory Usage:{" "}
              {memory && memoryUsage
                ? `${(memoryUsage / 1024 / 1024 / 1024).toFixed(2)} GB / ${(memory / 1024 / 1024 / 1024).toFixed(2)} GB`
                : "calculating..."}
            </li>
          </ul>
          <p>Last Database Update: {updated ? new Date(updated).toString() : ""}</p>
          <div>
            Check database entries: <AnilistCoverageInput setMessage={setMessage} /> {message}
          </div>
          <pre className={styles.fileList}></pre>
          <TrafficChart
            data={trafficData}
            period={trafficPeriod}
            onPeriodChange={setTrafficPeriod}
            loading={trafficLoading}
          />

          <SpeedChart
            data={speedData}
            period={speedPeriod}
            onPeriodChange={setSpeedPeriod}
            loading={speedLoading}
          />

          <AccuracyChart
            data={accuracyData}
            period={accuracyPeriod}
            onPeriodChange={setAccuracyPeriod}
            loading={accuracyLoading}
          />
        </div>
      </div>
    </Layout>
  );
};
export default About;
