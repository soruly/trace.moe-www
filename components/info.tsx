import { useMemo } from "react";
import styles from "./info.module.css";

export default function Layout({ anilist: src }) {
  if (!src) {
    return <div></div>;
  }
  let naturalText1 = "";

  if (src.duration && src.episodes === 1) {
    naturalText1 += `${src.duration} minutes `;
  }
  if (src.episodes && src.format !== "MOVIE") {
    naturalText1 += `${src.episodes} episode `;
  }
  if (src.duration && src.episodes > 1) {
    naturalText1 += `${src.duration}-minute `;
  }
  if (src.format) {
    naturalText1 += `${src.format.length > 3 ? src.format.toLowerCase() : src.format} `;
  }
  naturalText1 += " anime. ";

  let strStartDate =
    src.startDate && src.startDate.year && src.startDate.month && src.startDate.day
      ? `${src.startDate.year}-${src.startDate.month}-${src.startDate.day}`
      : null;
  let strEndDate =
    src.endDate && src.endDate.year && src.endDate.month && src.endDate.day
      ? `${src.endDate.year}-${src.endDate.month}-${src.endDate.day}`
      : null;

  let naturalText2 = "";
  if (strStartDate && strEndDate) {
    if (src.format === "MOVIE") {
      if (strStartDate === strEndDate) {
        naturalText2 += `Released on ${strStartDate}`;
      } else {
        naturalText2 += `Released during ${strStartDate} to ${strEndDate}`;
      }
    } else if (strStartDate === strEndDate) {
      naturalText2 += `Released on ${strStartDate}`;
    } else {
      naturalText2 += `Airing from ${strStartDate} to ${strEndDate}`;
    }
  } else if (strStartDate) {
    if (src.format === "TV" || src.format === "TV_SHORT") {
      naturalText2 += `Airing since ${strStartDate}`;
    }
  }

  naturalText2 += ". ";

  const synonyms = useMemo(
    () =>
      Array.from(
        new Set(
          [
            src.title.chinese || "",
            src.title.english || "",
            ...(src.synonyms || []),
            ...(src.synonyms_chinese || []),
          ]
            .filter((e) => e)
            .filter((e) => e !== src.title.native || e !== src.title.romaji),
        ),
      )
        .sort()
        .map((title, i) => {
          return <div key={i}>{title}</div>;
        }),
    [src.title, src.synonyms, src.synonyms_chinese],
  );

  let studio = [];
  if (src.studios && src.studios && src.studios.edges.length > 0) {
    studio = src.studios.edges.map((entry, i) => {
      if (entry.node.siteUrl) {
        return (
          <div key={i}>
            <a href={entry.node.siteUrl}>{entry.node.name}</a>
          </div>
        );
      } else {
        return <div key={i}>{entry.node.name}</div>;
      }
    });
  }

  let externalLinks = [];
  if (src.externalLinks && src.externalLinks.length > 0) {
    externalLinks = src.externalLinks.map((entry, i) => {
      return (
        <div key={i}>
          <a href={entry.url}>{entry.site}</a>
        </div>
      );
    });
  }

  return (
    <div className={styles.infoPane}>
      <div className={styles.title}>{src.title.native}</div>
      <div className={styles.subtitle}>{src.title.romaji}</div>
      <div className={styles.divider}></div>

      <div className={styles.detail}>
        <table>
          <tbody>
            <tr>
              <td colSpan={2}>
                {naturalText1}
                <br />
                {naturalText2}
              </td>
            </tr>
            <tr>
              <td>Alias</td>
              <td>{synonyms}</td>
            </tr>
            <tr>
              <td>Genre</td>
              <td>{src.genres.join(", ")}</td>
            </tr>
            <tr>
              <td>Studio</td>
              <td>{studio}</td>
            </tr>
            <tr>
              <td>External Links</td>
              <td>{externalLinks}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.poster}>
          <a href={`//anilist.co/anime/${src.id}`}>
            <img
              key={src.coverImage.large}
              src={src.coverImage.large}
              onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.opacity = "1";
              }}
            />
          </a>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.footNotes}>
        Information provided by <a href="https://anilist.co">anilist.co</a>
      </div>
    </div>
  );
}
