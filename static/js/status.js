(async () => {
  const status = await fetch("https://api.trace.moe/status").then((e) => e.json());
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
  if (document.querySelector("#lastUpdate")) {
    document.querySelector("#lastUpdate").innerText = lastModified;
  }
  if (document.querySelector("#dbSize")) {
    document.querySelector("#dbSize").innerText = `${(numDocs / 1000000).toFixed(
      2
    )} Million analyzed frames (${(totalSize / 1000000000).toFixed(2)} GB)`;
  }
})();

const trafficChart = new Chart(document.getElementById("trafficGraph"), {
  type: "bar",
  options: {
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
  },
});

const getTrafficData = async (period) => {
  const stats = await fetch(`https://api.trace.moe/stats?type=traffic&period=${period}`).then((e) =>
    e.json()
  );

  trafficChart.data = {
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
  };
  trafficChart.update();
};

getTrafficData("hourly");

document.querySelectorAll(".traffic-btn").forEach((btn) => {
  btn.onclick = () => getTrafficData(btn.innerText);
});

const perfChart = new Chart(document.getElementById("perfGraph"), {
  type: "bar",
  options: {
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
  },
});

const getPerfData = async (period) => {
  const stats = await fetch(
    `https://api.trace.moe/stats?type=performance&period=${period}`
  ).then((e) => e.json());

  perfChart.data = {
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
  };
  perfChart.update();
};

getPerfData("hourly");

document.querySelectorAll(".perf-btn").forEach((btn) => {
  btn.onclick = () => getPerfData(btn.innerText);
});
