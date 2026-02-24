import { useEffect, useRef, useState } from "react";

import { formatTime } from "./utils";

import styles from "./player.module.css";

export default function Player({
  src,
  fileName,
  onDrop,
  timeCode,
  duration,
  isLoading,
  isSearching,
}) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isMute, setIsMute] = useState(true);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [playerSrc, setPlayerSrc] = useState(null);
  const [playerLoading, setPlayerLoading] = useState(isLoading);
  const [playerLoadingError, setPlayerLoadingError] = useState(false);
  const [dropTargetText, setDropTargetText] = useState("");

  const playPause = function () {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    if (!src) {
      setPlayerLoadingError(true);
      return;
    }
    videoRef.current.pause();
    setPlayerLoading(true);
    setPlayerLoadingError(false);
    setPlayerVisible(false);
    setPlayerSrc(`${src}?size=l`);
  }, [src]);

  useEffect(() => {
    if (src) return;
    if (isSearching) {
      videoRef.current.pause();
      setPlayerLoading(true);
      setPlayerLoadingError(false);
      setPlayerVisible(false);
      setPlayerSrc(null);
    } else {
      setPlayerLoading(false);
    }
  }, [isSearching]);

  progressBarRef.current?.style.setProperty("--progress", `${timeCode / duration}`);

  return (
    <div ref={playerRef} className={styles.playerPane}>
      {playerLoadingError ? <div className={styles.playerError}>No video available.</div> : null}
      <video
        ref={videoRef}
        className={`${styles.player} ${playerVisible ? styles.visible : ""}`}
        src={playerSrc}
        muted={isMute}
        autoPlay
        loop
        playsInline
        onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          setPlayerVisible(true);
          if (e.currentTarget.videoWidth && e.currentTarget.videoHeight) {
            playerRef.current.style.aspectRatio = `${e.currentTarget.videoWidth} / ${e.currentTarget.videoHeight}`;
          }
        }}
        onClick={playPause}
        onCanPlayThrough={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          setPlayerLoading(false);
          videoRef.current.play();
        }}
        onContextMenu={(e: React.MouseEvent<HTMLVideoElement>) => {
          e.preventDefault();
        }}
      ></video>
      <div
        className={styles.dropEffect}
        onClick={playPause}
        onDrop={(e: React.DragEvent<HTMLDivElement>) => {
          const result = onDrop(e);
          if (result) {
            setDropTargetText(result);
          } else {
            e.currentTarget.classList.remove(styles.dropping);
          }
        }}
        onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
          e.stopPropagation();
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
          e.currentTarget.classList.add(styles.dropping);
          setDropTargetText("Drop image here");
        }}
        onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
          e.currentTarget.classList.remove(styles.dropping);
        }}
        onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
          e.preventDefault();
        }}
      >
        {dropTargetText}
      </div>
      <div className={`${styles.loading} ${playerLoading || isSearching ? styles.active : ""}`}>
        <div className={playerLoading || isSearching ? styles.ripple : ""}></div>
      </div>

      <div className={styles.playerInfo}>
        <div className={styles.fileNameDisplay}>{fileName}</div>
        <div className={styles.timeCodeDisplay}>
          {timeCode ? formatTime(timeCode) : "--:--:--"}/
          {duration ? formatTime(duration) : "--:--:--"}
        </div>
      </div>
      <div className={styles.playerControl}>
        <div
          ref={progressBarRef}
          className={`${styles.progressBarControl} ${isSearching ? styles.seeking : ""}`}
        >
          ▲
        </div>
        <div
          className={`${styles.soundBtn} ${isMute ? styles.iconVolumeOff : styles.iconVolumeUp}`}
          onClick={() => {
            setIsMute(!isMute);
            videoRef.current.muted = !isMute;
          }}
        ></div>
      </div>
    </div>
  );
}
