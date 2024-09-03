import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import Result from "../components/result";
import Player from "../components/player";
import Info from "../components/info";
import SearchBar from "../components/search-bar";
import {
  dropTarget,
  dropping,
  main,
  mainReady,
  searchImageDisplay,
  messageTextLabel,
  detail,
  originalImageDisplay,
  resultList,
  wrap,
  playerInfoPane,
  hidden,
  closeBtn,
} from "../components/index.module.css";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const NEXT_PUBLIC_ANILIST_ENDPOINT =
  process.env.NEXT_PUBLIC_ANILIST_ENDPOINT || "https://graphql.anilist.co";

const Index = () => {
  const [dropTargetText, setDropTargetText] = useState("");
  const [isCutBorders, setIsCutBorders] = useState(true);
  const [anilistFilter, setAnilistFilter] = useState();
  const [messageText, setMessageText] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [searchImage, setSearchImage] = useState("");
  const [searchImageSrc, setSearchImageSrc] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState();
  const [showNSFW, setshowNSFW] = useState(false);
  const [anilistInfo, setAnilistInfo] = useState();
  const [playerSrc, setPlayerSrc] = useState();
  const [playerTimeCode, setPlayerTimeCode] = useState("");
  const [playerFileName, setPlayerFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("url")) {
      setImageURL(searchParams.get("url"));
      setSearchImageSrc(
        searchParams.get("url").startsWith(location.origin)
          ? searchParams.get("url")
          : `/image-proxy?url=${encodeURIComponent(searchParams.get("url"))}`,
      );
    }
    document.addEventListener(
      "paste",
      (e) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        const item = Array.from(items).find((e) => e.type.startsWith("image"));
        if (!item) return;
        setSearchImageSrc(URL.createObjectURL(item.getAsFile()));
        e.preventDefault();
      },
      false,
    );

    window.onerror = function (message, source, lineno, colno, error) {
      if (typeof ga === "function") {
        ga("send", "event", "error", error ? error.stack : message);
      }
    };
  }, []);

  const imageURLInput = (e) => {
    e.preventDefault();
    if (!e.target.value.length) {
      setImageURL("");
      history.replaceState(null, null, "/");
      return;
    }
    if (e.target.parentNode.checkValidity()) {
      setImageURL(e.target.value);
      setSearchImageSrc(`/image-proxy?url=${encodeURIComponent(e.target.value)}`);
      history.replaceState(null, null, `/?url=${encodeURIComponent(e.target.value)}`);
    } else {
      e.target.parentNode.querySelector("input[type=submit]").click();
    }
  };

  const handleFileSelect = function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (imageURL) {
      setImageURL();
      history.replaceState(null, null, "/");
    }
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file || !file.type.match("image.*")) {
      setDropTargetText("Error: File is not an image");
      return "Error: File is not an image";
    }
    setDropTargetText("");
    e.target.classList.remove(dropping);
    setSearchImageSrc(URL.createObjectURL(file));
    return "";
  };

  useEffect(() => {
    if (!searchImageSrc) return;
    setIsLoading(true);
    setMessageText("Loading search image...");
    const image = new Image();
    image.onload = (e) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (e.target.width <= 640 && e.target.height <= 640) {
        canvas.width = e.target.width;
        canvas.height = e.target.height;
      } else if (e.target.width > e.target.height) {
        canvas.width = 640;
        canvas.height = 640 * (e.target.height / e.target.width);
      } else {
        canvas.width = 640 * (e.target.width / e.target.height);
        canvas.height = 640;
      }
      ctx.drawImage(
        e.target,
        0,
        0,
        e.target.width,
        e.target.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      canvas.toBlob(
        function (blob) {
          setIsLoading(false);
          setSearchImage(blob);
          search(blob);
        },
        "image/jpeg",
        0.8,
      );
    };
    image.onerror = () => {
      setMessageText("Failed to load search image");
    };
    image.src = searchImageSrc;
  }, [searchImageSrc]);

  const searchAnilist = async (ids) => {
    if (ids.length > 0) {
      let [statusCode, data] = await queryAnilist(ids);

      if (statusCode >= 400) {
        setMessageText("Failed to get Anilist info, reduced information available!");
      }

      return data;
    } else {
      return [];
    }
  };

  const queryAnilist = async (ids) => {
    const response = await fetch(NEXT_PUBLIC_ANILIST_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        query: `query ($ids: [Int]) {
            Page(page: 1, perPage: 50) {
              media(id_in: $ids, type: ANIME) {
                id
                title {
                  native
                  romaji
                  english
                }
                type
                format
                status
                startDate {
                  year
                  month
                  day
                }
                endDate {
                  year
                  month
                  day
                }
                season
                episodes
                duration
                source
                coverImage {
                  large
                  medium
                }
                bannerImage
                genres
                synonyms
                studios {
                  edges {
                    isMain
                    node {
                      id
                      name
                      siteUrl
                    }
                  }
                }
                isAdult
                externalLinks {
                  id
                  url
                  site
                }
                siteUrl
              }
            }
          }
          `,
        variables: { ids },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const statusCode = response.status;
    const data = statusCode === 200 ? ((await response.json()).data.Page.media ?? []) : [];
    return [statusCode, data];
  };

  const search = async (imageBlob) => {
    setMessageText("Searching...");
    setSearchResults([]);
    setSelectedResult();
    setAnilistInfo();
    setPlayerSrc();
    setPlayerFileName("");
    setPlayerTimeCode("");
    setIsSearching(true);
    const startSearchTime = performance.now();
    const formData = new FormData();
    formData.append("image", imageBlob);
    const queryString = [
      isCutBorders ? "cutBorders" : "",
      anilistFilter ? `anilistID=${anilistFilter}` : "",
    ].join("&");
    const res = await fetch(`${NEXT_PUBLIC_API_ENDPOINT}/search?${queryString}`, {
      method: "POST",
      body: formData,
    });
    setIsSearching(false);

    if (res.status === 429) {
      setMessageText("You searched too many times, please try again later.");
      return;
    }
    if (res.status === 503) {
      for (let i = 5; i > 0; i--) {
        setMessageText(`Server is busy, retrying in ${i}s`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      search(imageBlob);
      return;
    }
    if (res.status >= 400) {
      setMessageText(`${(await res.json()).error} Please try again later.`);
      return;
    }
    const { frameCount, result } = await res.json();

    const searchTime = (performance.now() - startSearchTime) / 1000;

    if (frameCount > 0) {
      setMessageText(
        `Searched ${frameCount.toLocaleString(navigator.language)} frames in ${searchTime.toFixed(2)}s`,
      );
    } else {
      setMessageText(`Searched in ${searchTime.toFixed(2)}s`);
    }

    if (result.length === 0) {
      setMessageText("Cannot find any result");
      return;
    }

    const topResults = result.slice(0, 5);
    const topResultAnilistIds = topResults.map((e) => e.anilist).filter((id) => !!id);
    const metadata = await searchAnilist(topResultAnilistIds);

    const topSearchResults = topResults.map((entry) => {
      const id = entry.anilist ?? 0;
      const entryMetadata = metadata.find(entry => entry.id === id);

      if (entryMetadata) {
        entry.anilist = entryMetadata;
      } else if (!!id) {
        entry.anilist = id;
      } else {
        entry.anilist = entry.filename;
      }

      entry.playResult = () => {
        setSelectedResult(entry);
        setPlayerSrc(entry.video);
        setPlayerFileName(entry.filename);
        setPlayerTimeCode(entry.from);
        if (entryMetadata) {
          setAnilistInfo(entry.anilist);
        } else {
          setAnilistInfo();
        }
      };

      return entry;
    });

    setSearchResults(topSearchResults);

    const [firstResult] = topSearchResults;
    if (firstResult && !firstResult.anilist.isAdult && window.innerWidth > 1008) {
      firstResult.playResult();
    }
  };

  return (
    <Layout title="Anime Scene Search Engine">
      <Head>
        <meta name="theme-color" content="#f9f9fb" />
        <meta itemProp="name" content="WAIT: What Anime Is This?" />
        <meta
          itemProp="description"
          content="Anime Scene Search Engine. Lookup the exact moment and the episode."
        />
        <meta itemProp="image" content="https://trace.moe/favicon128.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@soruly" />
        <meta name="twitter:title" content="WAIT: What Anime Is This?" />
        <meta
          name="twitter:description"
          content="Anime Scene Search Engine. Lookup the exact moment and the episode."
        />
        <meta name="twitter:creator" content="@soruly" />
        <meta name="twitter:image" content="https://trace.moe/favicon128.png" />
        <meta
          name="twitter:image:alt"
          content="Anime Scene Search Engine. Lookup the exact moment and the episode."
        />

        <meta property="og:title" content="WAIT: What Anime Is This?" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://trace.moe" />
        <meta property="og:image" content="https://trace.moe/favicon128.png" />
        <meta
          property="og:description"
          content="Anime Scene Search Engine. Lookup the exact moment and the episode."
        />
        <meta property="og:site_name" content="trace.moe" />

        <link rel="dns-prefetch" href={NEXT_PUBLIC_API_ENDPOINT} />
      </Head>
      {/* inject target for WebExtension */}
      <img
        id="originalImage"
        src=""
        style={{ display: "none" }}
        onLoad={(e) => {
          setSearchImageSrc(e.target.src);
        }}
      />
      {/* legacy element for not breaking WebExtension */}
      <input id="autoSearch" type="checkbox" style={{ display: "none" }}></input>

      <div className={searchImageSrc ? mainReady : main}>
        {!searchImageSrc && (
          <div
            className={dropTarget}
            onDrop={handleFileSelect}
            onDragOver={(e) => {
              e.stopPropagation();
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }}
            onDragEnter={(e) => {
              e.target.classList.add(dropping);
              setDropTargetText("Drop image here");
            }}
            onDragLeave={(e) => {
              e.target.classList.remove(dropping);
            }}
          >
            {dropTargetText}
          </div>
        )}
        <SearchBar
          searchImageSrc={searchImageSrc}
          imageURL={imageURL}
          imageURLInput={imageURLInput}
          handleFileSelect={handleFileSelect}
          anilistFilter={anilistFilter}
          setAnilistFilter={setAnilistFilter}
          isCutBorders={isCutBorders}
          setIsCutBorders={setIsCutBorders}
          isSearching={isSearching}
          search={search}
          searchImage={searchImage}
        ></SearchBar>

        {searchImageSrc && (
          <div className={wrap}>
            <div className={resultList}>
              <div className={searchImageDisplay}>
                <div className={detail}>Your search image</div>
                <img
                  className={originalImageDisplay}
                  src={searchImageSrc}
                  crossOrigin="anonymous"
                  onError={() => {
                    setMessageText("Failed to load search image");
                  }}
                />
                <div className={messageTextLabel}>{messageText}</div>
              </div>
              {searchResults
                .filter((e) => showNSFW || !e.anilist.isAdult)
                .map((searchResult, i) => {
                  return (
                    <Result
                      key={i}
                      searchResult={searchResult}
                      active={searchResult === selectedResult}
                    ></Result>
                  );
                })}
              {searchResults.find((e) => e.anilist.isAdult) && (
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={(e) => {
                      setshowNSFW(!showNSFW);
                    }}
                  >
                    {showNSFW ? "Hide" : "Show"}{" "}
                    {searchResults.filter((e) => e.anilist.isAdult).length} NSFW results
                  </button>
                </div>
              )}
            </div>

            <div className={selectedResult ? playerInfoPane : [playerInfoPane, hidden].join(" ")}>
              <Player
                src={playerSrc}
                timeCode={playerTimeCode}
                fileName={playerFileName}
                isLoading={isLoading}
                isSearching={isSearching}
                onDrop={handleFileSelect}
              ></Player>
              <div
                className={closeBtn}
                onClick={(e) => {
                  setSelectedResult();
                  setAnilistInfo();
                  setPlayerSrc();
                  setPlayerFileName("");
                  setPlayerTimeCode("");
                }}
              >
                ❌
              </div>
              {!isSearching && <Info anilist={anilistInfo}></Info>}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Index;
