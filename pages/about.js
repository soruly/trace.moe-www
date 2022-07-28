import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import Layout from "../components/layout";
import {
  container,
  page,
  pageHeader,
  section,
  sectionHeader,
  sectionItem,
  graph,
  graphControl,
} from "../components/layout.module.css";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const getMediaStatus = async () => {
  const { mediaCount, mediaFramesTotal, mediaDurationTotal } = await fetch(
    `${NEXT_PUBLIC_API_ENDPOINT}/stats?type=media`
  ).then((e) => e.json());
  return {
    mediaCount,
    mediaFramesTotal,
    mediaDurationTotal,
  };
};

const formatDate = (time, trafficPeriod) => {
  const isoString = new Date(time).toISOString();
  if (trafficPeriod === "year") return isoString.replace(/(\d+)-(\d+)-(\d+)T(\d+):.*$/, "$1");
  if (trafficPeriod === "month") return isoString.replace(/(\d+)-(\d+)-(\d+)T(\d+):.*$/, "$1-$2");
  if (trafficPeriod === "day") return isoString.replace(/(\d+)-(\d+)-(\d+)T(\d+):.*$/, "$2-$3");
  if (trafficPeriod === "hour") return isoString.replace(/(\d+)-(\d+)-(\d+)T(\d+):.*$/, "$4:00");
};

const About = () => {
  const [{ lastModified, numDocs, totalSize }, setDatabaseStatus] = useState({
    lastModified: new Date(0),
    numDocs: 0,
    totalSize: 0,
  });
  const [{ mediaCount, mediaFramesTotal, mediaDurationTotal }, setMediaStatus] = useState({
    mediaCount: 0,
    mediaFramesTotal: 0,
    mediaDurationTotal: 0,
  });
  useEffect(() => {
    getDatabaseStatus().then((e) => setDatabaseStatus(e));
    getMediaStatus().then((e) => setMediaStatus(e));
  }, []);

  const [trafficPeriod, setTrafficPeriod] = useState("hour");
  const [trafficData, setTrafficData] = useState(null);
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/stats?type=traffic&period=${trafficPeriod}`)
      .then((e) => e.json())
      .then((stats) => {
        stats.sort((a, b) => new Date(a.time) - new Date(b.time));
        setTrafficData({
          labels: stats.map((e) => formatDate(e.time, trafficPeriod)),
          datasets: [
            {
              label: "200",
              data: stats.map((e) => e["200"]),
              backgroundColor: ["rgba(0,255,0,0.2)"],
              borderColor: ["rgba(0,255,0,1)"],
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
              label: "402",
              data: stats.map((e) => e["402"]),
              backgroundColor: ["rgba(128,128,255,0.2)"],
              borderColor: ["rgba(128,128,255,1)"],
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
              label: "500",
              data: stats.map((e) => e["500"]),
              backgroundColor: ["rgba(255,128,255,0.2)"],
              borderColor: ["rgba(255,128,255,1)"],
              borderWidth: 1,
            },
            {
              label: "503",
              data: stats.map((e) => e["503"]),
              backgroundColor: ["rgba(255,128,128,0.2)"],
              borderColor: ["rgba(255,128,128,1)"],
              borderWidth: 1,
            },
          ],
        });
      });
  }, [trafficPeriod]);

  const [speedPeriod, setSpeedPeriod] = useState("hour");
  const [speedData, setSpeedData] = useState(null);
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/stats?type=speed&period=${speedPeriod}`)
      .then((e) => e.json())
      .then((stats) => {
        stats.sort((a, b) => new Date(a.time) - new Date(b.time));
        setSpeedData({
          labels: stats.map((e) => formatDate(e.time, speedPeriod)),
          datasets: [
            {
              label: "p0",
              data: stats.map((e) => (e.p0 ? e.p0 : null)),
              borderColor: "rgba(64,64,64,0)",
              backgroundColor: "rgba(64,64,64,0)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 1,
              pointHoverRadius: 3,
              pointBackgroundColor: "rgba(64,64,64,0.5)",
              hidden: true,
            },
            {
              label: "p10",
              data: stats.map((e) => (e.p10 ? e.p10 : null)),
              borderColor: "rgba(64,64,64,0.2)",
              backgroundColor: "rgba(64,64,64,0.2)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "rgba(64,64,64,0.5)",
            },
            {
              label: "p25",
              data: stats.map((e) => (e.p25 ? e.p25 : null)),
              borderColor: "hsl(227, 100%, 70%)",
              backgroundColor: "hsl(227, 100%, 70%)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "hsl(227, 100%, 70%)",
            },
            {
              label: "p50",
              data: stats.map((e) => (e.p50 ? e.p50 : null)),
              borderColor: "hsl(0, 100%, 66%)",
              backgroundColor: "hsl(0, 100%, 66%)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "hsl(0, 100%, 66%)",
            },
            {
              label: "p75",
              data: stats.map((e) => (e.p75 ? e.p75 : null)),
              borderColor: "hsl(227, 100%, 70%)",
              backgroundColor: "hsl(227, 100%, 70%)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "hsl(227, 100%, 70%)",
            },
            {
              label: "p90",
              data: stats.map((e) => (e.p90 ? e.p90 : null)),
              borderColor: "rgba(64,64,64,0.2)",
              backgroundColor: "rgba(64,64,64,0.2)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "rgba(64,64,64,0.5)",
            },
            {
              label: "p100",
              data: stats.map((e) => (e.p100 ? e.p100 : null)),
              borderColor: "rgba(64,64,64,0)",
              backgroundColor: "rgba(64,64,64,0)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 1,
              pointHoverRadius: 3,
              pointBackgroundColor: "rgba(64,64,64,0.5)",
              hidden: true,
            },
          ],
        });
      });
  }, [speedPeriod]);

  const [accuracyPeriod, setAccuracyPeriod] = useState("hour");
  const [accuracyData, setAccuracyData] = useState(null);
  useEffect(() => {
    fetch(`${NEXT_PUBLIC_API_ENDPOINT}/stats?type=accuracy&period=${accuracyPeriod}`)
      .then((e) => e.json())
      .then((stats) => {
        stats.sort((a, b) => new Date(a.time) - new Date(b.time));
        setAccuracyData({
          labels: stats.map((e) => formatDate(e.time, accuracyPeriod)),
          datasets: [
            {
              label: "p0",
              data: stats.map((e) => (e.p0 ? Number(e.p0?.toFixed(3)) : null)),
              borderColor: "rgba(64,64,64,0)",
              backgroundColor: "rgba(64,64,64,0)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 1,
              pointHoverRadius: 3,
              pointBackgroundColor: "rgba(64,64,64,0.5)",
              hidden: true,
            },
            {
              label: "p10",
              data: stats.map((e) => (e.p10 ? Number(e.p10?.toFixed(3)) : null)),
              borderColor: "rgba(64,64,64,0.2)",
              backgroundColor: "rgba(64,64,64,0.2)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "rgba(64,64,64,0.5)",
            },
            {
              label: "p25",
              data: stats.map((e) => (e.p25 ? Number(e.p25?.toFixed(3)) : null)),
              borderColor: "hsl(227, 100%, 70%)",
              backgroundColor: "hsl(227, 100%, 70%)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "hsl(227, 100%, 70%)",
            },
            {
              label: "p50",
              data: stats.map((e) => (e.p50 ? Number(e.p50?.toFixed(3)) : null)),
              borderColor: "hsl(0, 100%, 66%)",
              backgroundColor: "hsl(0, 100%, 66%)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "hsl(0, 100%, 66%)",
            },
            {
              label: "p75",
              data: stats.map((e) => (e.p75 ? Number(e.p75?.toFixed(3)) : null)),
              borderColor: "hsl(227, 100%, 70%)",
              backgroundColor: "hsl(227, 100%, 70%)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "hsl(227, 100%, 70%)",
            },
            {
              label: "p90",
              data: stats.map((e) => (e.p90 ? Number(e.p90?.toFixed(3)) : null)),
              borderColor: "rgba(64,64,64,0.2)",
              backgroundColor: "rgba(64,64,64,0.2)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 0,
              pointHoverRadius: 3,
              pointBackgroundColor: "rgba(64,64,64,0.5)",
            },
            {
              label: "p100",
              data: stats.map((e) => (e.p100 ? Number(e.p100?.toFixed(3)) : null)),
              borderColor: "rgba(64,64,64,0)",
              backgroundColor: "rgba(64,64,64,0)",
              borderWidth: 1,
              cubicInterpolationMode: "monotone",
              pointHitRadius: 8,
              pointRadius: 1,
              pointHoverRadius: 3,
              pointBackgroundColor: "rgba(64,64,64,0.5)",
              hidden: true,
            },
          ],
        });
      });
  }, [accuracyPeriod]);

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
          <ul>
            <li>
              Analyzed Video: {mediaCount ? mediaCount.toLocaleString("en-US") : "counting..."}
            </li>
            <li>
              Total Duration:{" "}
              {mediaDurationTotal
                ? `${Number((mediaDurationTotal / 3600).toFixed(2)).toLocaleString("en-US")} hours`
                : "counting..."}
            </li>
            <li>
              Analyzed Frames:{" "}
              {mediaFramesTotal ? mediaFramesTotal.toLocaleString("en-US") : "counting..."}
            </li>
            <li>
              Indexed Frames: {numDocs ? numDocs.toLocaleString("en-US") : "counting..."}{" "}
              {numDocs && mediaFramesTotal
                ? `(${((1 - numDocs / mediaFramesTotal) * 100).toFixed(2)}% de-duplicated)`
                : ""}
            </li>
            <li>
              Index Size:{" "}
              {totalSize ? `${(totalSize / 1000000000).toFixed(2)} GB` : "calculating..."}
            </li>
          </ul>
          {trafficData ? (
            <Bar
              className={graph}
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
                    distribution: "series",
                    ticks: {
                      maxRotation: 0,
                    },
                  },
                  y: {
                    beginAtZero: true,
                    stacked: true,
                  },
                },
              }}
              data={trafficData}
              width="680"
              height="500"
            ></Bar>
          ) : (
            <div className={graph}></div>
          )}
          <p className={graphControl}>
            <button onClick={() => setTrafficPeriod("hour")}>hourly</button>
            <button onClick={() => setTrafficPeriod("day")}>daily</button>
            <button onClick={() => setTrafficPeriod("month")}>monthly</button>
            <button onClick={() => setTrafficPeriod("year")}>yearly</button>
          </p>

          {speedData ? (
            <Line
              className={graph}
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
                    distribution: "series",
                    ticks: {
                      maxRotation: 0,
                    },
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
              data={speedData}
              width="680"
              height="500"
            ></Line>
          ) : (
            <div className={graph}></div>
          )}
          <p className={graphControl}>
            <button onClick={() => setSpeedPeriod("hour")}>hourly</button>
            <button onClick={() => setSpeedPeriod("day")}>daily</button>
          </p>

          {accuracyData ? (
            <Line
              className={graph}
              options={{
                animations: false,
                plugins: {
                  title: {
                    display: true,
                    text: "trace.moe accuracy distribution",
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                    distribution: "series",
                    ticks: {
                      maxRotation: 0,
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "accuracy (1=100%)",
                    },
                  },
                },
              }}
              data={accuracyData}
              width="680"
              height="500"
            ></Line>
          ) : (
            <div className={graph}></div>
          )}
          <p className={graphControl}>
            <button onClick={() => setAccuracyPeriod("hour")}>hourly</button>
            <button onClick={() => setAccuracyPeriod("day")}>daily</button>
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
