import fetch from "node-fetch";

export default async (req, res) => {
  const status = await fetch("https://api.trace.moe/status").then((e) => e.json());
  let numDocs = 0;
  let sizeInBytes = 0;
  let lastModified = new Date(0);
  for (const [_, server] of Object.entries(status)) {
    for (const core of server) {
      numDocs += core.index.numDocs;
      sizeInBytes += core.index.sizeInBytes;
      lastModified =
        lastModified > new Date(core.index.lastModified)
          ? lastModified
          : new Date(core.index.lastModified);
    }
  }
  res.json({ lastModified, sizeInBytes, numDocs });
};
