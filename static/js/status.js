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
  if (document.querySelector("#status")) {
    document.querySelector("#status").innerText = `${lastModified} with ${(
      numDocs / 1000000
    ).toFixed(2)} Million analyzed frames. (${(totalSize / 1000000000).toFixed(2)} GB)`;
  }
})();
