import styles from "./result.module.css";
import { formatTime } from "./utils";

const zeroPad = (n, width) => {
  if (n.length === undefined) {
    return n.toString();
  }
  return n.length >= width
    ? n.toString()
    : new Array(width - n.toString().length + 1).join("0") + n;
};

export default function Result({ searchResult: entry, active: isActive }) {
  const timeCode =
    formatTime(entry.from) === formatTime(entry.to)
      ? formatTime(entry.from)
      : `${formatTime(entry.from)} - ${formatTime(entry.to)}`;

  return (
    <div
      className={`${styles.result} ${isActive ? styles.active : ""}`}
      style={{ display: entry.anilist.isAdult ? "hidden" : "flex" }}
      onClick={entry.playResult}
    >
      <div className={styles.title}>
        {entry.anilist.title?.native || entry.anilist.title?.romaji || entry.anilist}
      </div>
      <div className={styles.detail}>
        <div className={styles.ep}>{entry.episode && `Episode ${zeroPad(entry.episode, 2)}`}</div>
        <div className={styles.time}>{timeCode}</div>
        <div
          className={styles.similarity}
        >{`~${(entry.similarity * 100).toFixed(2)}% Similarity`}</div>
      </div>
      <video
        src={entry.similarity > 0.87 ? `${entry.video}?size=s` : ""}
        poster={`${entry.image}?size=s`}
        muted
        autoPlay
        loop
        playsInline
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      ></video>
    </div>
  );
}
