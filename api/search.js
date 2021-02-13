import os from "os";
import path from "path";
import fetch from "node-fetch";
import fs from "fs-extra";
import querystring from "querystring";
import FormData from "form-data";

export default async (req, res) => {
  let response;
  if (req.query.url) {
    response = await fetch(
      `https://api.trace.moe/search?url=${req.query.url}&cutBorders=1`
    ).then((e) => e.json());
  } else if (req.file) {
    const tmpPath = path.join(os.tmpdir(), "trace.moe-www", `${process.hrtime().join("")}.jpg`);
    fs.outputFileSync(tmpPath, req.file.buffer);
    const formData = new FormData();
    formData.append("image", fs.createReadStream(tmpPath));
    response = await fetch(`https://api.trace.moe/search?cutBorders=1`, {
      method: "POST",
      body: formData,
    }).then((e) => e.json());
    fs.removeSync(tmpPath);
  } else if (req.body.image) {
    const tmpPath = path.join(os.tmpdir(), "trace.moe-www", `${process.hrtime().join("")}.jpg`);
    fs.outputFileSync(tmpPath, Buffer.from(req.body.image.replace(/ /g, "+"), "base64"));
    const formData = new FormData();
    formData.append("image", fs.createReadStream(tmpPath));
    response = await fetch(`https://api.trace.moe/search?cutBorders=1`, {
      method: "POST",
      body: formData,
    }).then((e) => e.json());
    fs.removeSync(tmpPath);
  }
  if (response.error) {
    return res.send(response.error);
  }

  res.json({
    CacheHit: false,
    RawDocsCount: response.frameCount,
    RawDocsSearchTime: 0,
    ReRankSearchTime: 0,
    docs: response.result.map((e) => {
      return {
        anilist_id: e.anilist.id,
        anime: e.anilist.title.chinese,
        at: e.from + (e.to - e.from) / 2,
        episode: e.episode,
        filename: e.filename,
        from: e.from,
        is_adult: e.anilist.isAdult,
        mal_id: e.anilist.idMal,
        season: "",
        similarity: e.similarity,
        synonyms: e.anilist.synonyms,
        synonyms_chinese: e.anilist.synonyms_chinese,
        title: e.anilist.title.native,
        title_chinese: e.anilist.title.chinese,
        title_english: e.anilist.title.english,
        title_native: e.anilist.title.native,
        title_romaji: e.anilist.title.romaji,
        to: e.to,
        tokenthumb: querystring.parse(new URL(e.image).search).token,
      };
    }),
    limit: 10,
    limit_ttl: 60,
    quota: 1000,
    quota_ttl: 86400,
    trial: 1,
  });
};
