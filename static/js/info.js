const showAnilistInfo = async (anilistID) => {
  document.querySelector(".info-pane").style.opacity = 0;
  document.querySelector(".info-pane .poster a img").style.opacity = 0;
  const data = await (await fetch(`https://api.trace.moe/info/${anilistID}`)).json();

  displayInfo(data);
  document.querySelector(".info-pane").style.opacity = 1;
};

const displayInfo = (src) => {
  document.querySelector(".info-pane .title").innerText = src.title.native;
  document.querySelector(".info-pane .subtitle").innerText = src.title.romaji;

  if (src.coverImage.large) {
    document.querySelector(".info-pane .poster a").href = `//anilist.co/anime/${src.id}`;
    document.querySelector(".info-pane .poster a img").src = src.coverImage.large;
    document.querySelector(".info-pane .poster a img").addEventListener("load", (e) => {
      e.target.style.opacity = 1;
    });
  }

  let naturalText = "";

  if (src.duration) {
    if (src.episodes === 1) {
      naturalText += `${src.duration} minutes `;
    }
  }

  if (src.episodes) {
    if (src.format !== "MOVIE") {
      naturalText += `${src.episodes} episode `;
    }
  }
  if (src.duration) {
    if (src.episodes > 1) {
      naturalText += `${src.duration}-minute `;
    }
  }
  if (src.format) {
    naturalText += `${src.format.length > 3 ? src.format.toLowerCase() : src.format} `;
  }
  naturalText += " anime. ";

  let strStartDate =
    src.startDate && src.startDate.year && src.startDate.month && src.startDate.day
      ? `${src.startDate.year}-${src.startDate.month}-${src.startDate.day}`
      : null;
  let strEndDate =
    src.endDate && src.endDate.year && src.endDate.month && src.endDate.day
      ? `${src.endDate.year}-${src.endDate.month}-${src.endDate.day}`
      : null;

  naturalText += "<br>";
  if (strStartDate && strEndDate) {
    if (src.format === "MOVIE") {
      if (strStartDate === strEndDate) {
        naturalText += `Released on ${strStartDate}`;
      } else {
        naturalText += `Released during ${strStartDate} to ${strEndDate}`;
      }
    } else if (strStartDate === strEndDate) {
      naturalText += `Released on ${strStartDate}`;
    } else {
      naturalText += `Airing from ${strStartDate} to ${strEndDate}`;
    }
  } else if (strStartDate) {
    if (src.format === "TV" || src.format === "TV_SHORT") {
      naturalText += `Airing since ${strStartDate}`;
    }
  }

  naturalText += ". ";
  document.querySelector(".info-pane .natural-text").innerHTML = naturalText;

  let table = document.createElement("table");
  table.id = "table";

  document.querySelector(".info-pane .alias").innerHTML = "";
  Array.from(
    new Set(
      [
        src.title.chinese || "",
        src.title.english || "",
        ...(src.synonyms || []),
        ...(src.synonyms_chinese || []),
      ]
        .filter((e) => e)
        .filter((e) => e !== src.title.native || e !== src.title.romaji)
    )
  )
    .sort()
    .forEach((title) => {
      document.querySelector(".info-pane .alias").appendChild(document.createTextNode(title));
      document.querySelector(".info-pane .alias").appendChild(document.createElement("br"));
    });

  document.querySelector(".info-pane .genre").innerText = "";
  if (src.genres.length > 0) {
    document.querySelector(".info-pane .genre").innerText = src.genres.join(", ");
  }

  document.querySelector(".info-pane .studio").innerHTML = "";
  if (src.studios && src.studios && src.studios.edges.length > 0) {
    src.studios.edges.forEach((entry) => {
      if (entry.node.siteUrl) {
        let a2 = document.createElement("a");
        a2.href = entry.node.siteUrl;
        a2.innerText = entry.node.name;
        document.querySelector(".info-pane .studio").appendChild(a2);
        document.querySelector(".info-pane .studio").appendChild(document.createElement("br"));
      } else {
        let span = document.createElement("span");
        span.innerText = entry.node.name;
        document.querySelector(".info-pane .studio").appendChild(span);
        document.querySelector(".info-pane .studio").appendChild(document.createElement("br"));
      }
    });
  }

  document.querySelector(".info-pane .external-links").innerHTML = "";
  if (src.externalLinks && src.externalLinks.length > 0) {
    src.externalLinks.forEach((entry) => {
      let a3 = document.createElement("a");
      a3.href = entry.url;
      a3.innerText = entry.site + " ";
      document.querySelector(".info-pane .external-links").appendChild(a3);
      document
        .querySelector(".info-pane .external-links")
        .appendChild(document.createElement("br"));
    });
  }
};
