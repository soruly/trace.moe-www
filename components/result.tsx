import { memo, useMemo } from "react";
import styles from "./result.module.css";
import { formatTime } from "./utils";

const Result = ({ searchResult: entry, active: isActive }) => {
  const timeCode = useMemo(() => {
    const start = formatTime(entry.from);
    const end = formatTime(entry.to);
    return start === end ? start : `${start} - ${end}`;
  }, [entry.from, entry.to]);

  return (
    <div
      className={`${styles.result} ${isActive ? styles.active : ""}`}
      style={{ display: entry.anilist.isAdult ? "none" : "flex" }}
      onClick={entry.playResult}
    >
      <div className={styles.title}>
        {entry.anilist.title?.native || entry.anilist.title?.romaji || entry.anilist?.id}
      </div>
      <div className={styles.detail}>
        <div className={styles.ep}>
          {entry.episode && `Episode ${entry.episode.toString().padStart(2, "0")}`}
        </div>
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
};

export default memo(Result);
