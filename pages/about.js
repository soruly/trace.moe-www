import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Layout from "../components/layout";
import {
  container,
  page,
  pageHeader,
  section,
  sectionHeader,
  sectionItem,
  graphControl,
} from "../components/layout.module.css";

const { NEXT_PUBLIC_API_ENDPOINT } = process.env;

const getDatabaseStatus = async () => {
  const status = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/status`).then((e) => e.json());
  let numDocs = 0;
  let totalSize = 0;
  let lastModified = new Date(0);
  for (const [_, server] of Object.entries(status)) {
    for (const core of server) {
      numDocs += core.index.numDocs;
      totalSize += core.index.sizeInBytes;
      lastModified =
        lastModified > new Date(core.index.lastModified)
          ? lastModified
          : new Date(core.index.lastModified);
    }
  }
  return {
    lastModified,
    numDocs,
    totalSize,
  };
};

const About = () => {
  const [{ lastModified, numDocs, totalSize }, setDatabaseStatus] = useState({
    lastModified: new Date(0),
    numDocs: 0,
    totalSize: 0,
  });
  useEffect(async () => {
    setDatabaseStatus(await getDatabaseStatus());
  }, []);

  const [trafficPeriod, setTrafficPeriod] = useState("hourly");
  const [trafficData, setTrafficData] = useState("hourly");
  useEffect(async () => {
    const stats = await fetch(
      `${NEXT_PUBLIC_API_ENDPOINT}/stats?type=traffic&period=${trafficPeriod}`
    ).then((e) => e.json());
    setTrafficData({
      labels: stats.map((e) => e.period),
      datasets: [
        {
          label: "503",
          data: stats.map((e) => e["503"]),
          backgroundColor: ["rgba(255,128,128,0.2)"],
          borderColor: ["rgba(255,128,128,1)"],
          borderWidth: 1,
        },
        {
          label: "500",
          data: stats.map((e) => e["500"]),
          backgroundColor: ["rgba(255,128,255,0.2)"],
          borderColor: ["rgba(255,128,255,1)"],
          borderWidth: 1,
        },
        {
          label: "405",
          data: stats.map((e) => e["405"]),
          backgroundColor: ["rgba(128,128,128,0.2)"],
          borderColor: ["rgba(128,128,128,1)"],
          borderWidth: 1,
        },
        {
          label: "402",
          data: stats.map((e) => e["402"]),
          backgroundColor: ["rgba(128,128,255,0.2)"],
          borderColor: ["rgba(128,128,255,1)"],
          borderWidth: 1,
        },
        {
          label: "400",
          data: stats.map((e) => e["400"]),
          backgroundColor: ["rgba(192,192,0,0.2)"],
          borderColor: ["rgba(192,192,0,1)"],
          borderWidth: 1,
        },
        {
          label: "200",
          data: stats.map((e) => e["200"]),
          backgroundColor: ["rgba(0,255,0,0.2)"],
          borderColor: ["rgba(0,255,0,1)"],
          borderWidth: 1,
        },
      ],
    });
  }, [trafficPeriod]);

  const [perfPeriod, setPerfPeriod] = useState("hourly");
  const [perfData, setPerfData] = useState("hourly");
  useEffect(async () => {
    const stats = await fetch(
      `${NEXT_PUBLIC_API_ENDPOINT}/stats?type=performance&period=${perfPeriod}`
    ).then((e) => e.json());
    setPerfData({
      labels: stats.map((e) => e.period),
      datasets: [
        {
          label: "p0",
          data: stats.map((e) => e.p0),
          backgroundColor: ["rgba(0,0,0,0)"],
          borderColor: ["rgba(0,0,0,1)"],
          borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
          hidden: true,
        },
        {
          label: "p10",
          data: stats.map((e) => e.p10),
          backgroundColor: ["rgba(0,0,0,0)"],
          borderColor: ["rgba(0,0,0,1)"],
          borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
          hidden: false,
        },
        {
          label: "p50",
          data: stats.map((e) => e.p50),
          backgroundColor: ["rgba(0,0,0,0)"],
          borderColor: ["rgba(255,0,0,1)"],
          borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
        },
        {
          label: "p90",
          data: stats.map((e) => e.p90),
          backgroundColor: ["rgba(0,0,0,0)"],
          borderColor: ["rgba(0,0,0,1)"],
          borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
          hidden: false,
        },
        {
          label: "p100",
          data: stats.map((e) => e.p100),
          backgroundColor: ["rgba(0,0,0,0)"],
          borderColor: ["rgba(0,0,0,1)"],
          borderWidth: { top: 1, right: 0, bottom: 0, left: 0 },
          hidden: true,
        },
        {
          label: "p25-p75",
          data: stats.map((e) => [e.p25, e.p75]),
          backgroundColor: ["rgba(255,255,255,1)"],
          borderColor: ["rgba(128,128,128,1)"],
          borderWidth: 1,
          borderSkipped: "none",
        },
      ],
    });
  }, [perfPeriod]);

  return (
    <Layout title="About">
      <div className={`${container} ${page}`}>
        <div className={pageHeader}>About</div>

        <div className={section}>
          <div className={sectionHeader}>What is trace.moe?</div>
          <p>
            <b>trace.moe is an Anime Scene Search Engine</b> that helps users to trace back the
            original anime by a screenshot. It search in ~30000 hours of anime and find the best
            matching scene. It can tell the anime, the episode and the exact time that scene
            appears. Since the search result may not be correct, it provides a few seconds of
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
        <div className={section}>
          <div className={sectionHeader}>What trace.moe is NOT</div>
          <p>
            <b>This website is not for watching anime</b>. The server has effective measures to
            prevent users from accessing the original video beyond the preview limit. If you ask me
            where you can watch the anime in search result, I'll show you the way to Youtube,
            Amazon, Netflix, bilibili, etc (depending on your country).
          </p>
          <p>
            <b>trace.moe is not for comics / anime-style artworks</b>. This search engine only index
            anime officially published through TV/Web/DVD/Bluray. If you wish to search artwork /
            wallpapers, try to use <a href="https://saucenao.com/">SauceNAO</a> and{" "}
            <a href="https://iqdb.org/">iqdb.org</a>
          </p>
          <p>
            <b>trace.moe is not an AI</b>. It does not have a neural network that recognize and
            understand the things (like characters) on the images. It uses a technology called{" "}
            <a href="https://en.wikipedia.org/wiki/Content-based_image_retrieval">
              Content-based image retrieval
            </a>{" "}
            which compares only the colors and patterns of the images instead of trying to
            understanding the image. Thus, it is nothing related to Machine Learning and is not
            train-able. You may read the{" "}
            <a href="https://github.com/soruly/slides">presentations slides</a> for technical
            details.
          </p>
        </div>
        <div className={section}>
          <div className={sectionHeader}>System Status</div>
          <p>
            This search engine index latest anime automatically, usually within hours after
            broadcast. RSS Feeds{" "}
            <a href="https://api.trace.moe/rss.xml">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 8 8"
                width="16"
                height="16"
                style={{ verticalAlign: "text-bottom" }}
              >
                <rect fill="orange" stroke="none" width="8" height="8" rx="1.5" />
                <circle fill="white" stroke="none" cx="2" cy="6" r="1" />
                <path
                  fill="white"
                  stroke="none"
                  d="m 1,4 a 3,3 0 0 1 3,3 h 1 a 4,4 0 0 0 -4,-4 z"
                />
                <path
                  fill="white"
                  stroke="none"
                  d="m 1,2 a 5,5 0 0 1 5,5 h 1 a 6,6 0 0 0 -6,-6 z"
                />
              </svg>
            </a>
          </p>
          <p>Last Database Update: {lastModified.toString()}</p>
          <p>
            Database Index Size: {(numDocs / 1000000).toFixed(2)} Million analyzed frames (
            {(totalSize / 1000000000).toFixed(2)} GB)
          </p>
          <Bar
            options={{
              animations: false,
              plugins: {
                title: {
                  display: true,
                  text: "trace.moe search traffic",
                },
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  beginAtZero: true,
                  stacked: true,
                },
              },
            }}
            data={trafficData}
            width="680"
            height="400"
          ></Bar>
          <p className={graphControl}>
            <button onClick={() => setTrafficPeriod("hourly")}>hourly</button>
            <button onClick={() => setTrafficPeriod("daily")}>daily</button>
            <button onClick={() => setTrafficPeriod("monthly")}>monthly</button>
          </p>

          <Bar
            options={{
              animations: false,
              plugins: {
                title: {
                  display: true,
                  text: "trace.moe search time distribution",
                },
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "time (ms)",
                  },
                },
              },
            }}
            data={perfData}
            width="680"
            height="400"
          ></Bar>
          <p className={graphControl}>
            <button onClick={() => setPerfPeriod("hourly")}>hourly</button>
            <button onClick={() => setPerfPeriod("daily")}>daily</button>
            <button onClick={() => setPerfPeriod("monthly")}>monthly</button>
          </p>
        </div>

        <div className={section}>
          <div className={sectionHeader}>Credit</div>
          <div className={sectionItem}>
            Dr. Mathias Lux (<a href="http://www.lire-project.net/">LIRE Project</a>)<br />
          </div>
          <small>
            Lux Mathias, Savvas A. Chatzichristofis. Lire: Lucene Image Retrieval – An Extensible
            Java CBIR Library. In proceedings of the 16th ACM International Conference on
            Multimedia, pp. 1085-1088, Vancouver, Canada, 2008{" "}
            <a href="http://www.morganclaypool.com/doi/abs/10.2200/S00468ED1V01Y201301ICR025">
              Visual Information Retrieval with Java and LIRE
            </a>
          </small>
          <div className={sectionItem}>
            Josh (<a href="https://anilist.co/">Anilist</a>) and Anilist team
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default About;
