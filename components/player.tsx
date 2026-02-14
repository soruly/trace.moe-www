import { useEffect, useRef, useState } from "react";
import styles from "./player.module.css";
import { formatTime } from "./utils";

export default function Player({
  src,
  fileName,
  onDrop,
  timeCode,
  duration,
  isLoading,
  isSearching,
}) {
  const playerRef = useRef(null);
  const [isMute, setIsMute] = useState(true);
  const [playerWidth, setPlayerWidth] = useState(window.innerWidth > 640 ? 640 : window.innerWidth);
  const [playerHeight, setPlayerHeight] = useState(360);
  const [videoWidth, setVideoWidth] = useState(640);
  const [videoHeight, setVideoHeight] = useState(360);
  const [playerSrc, setPlayerSrc] = useState(null);
  const [playerLoading, setPlayerLoading] = useState(isLoading);
  const [playerLoadingError, setPlayerLoadingError] = useState(false);
  const [dropTargetText, setDropTargetText] = useState("");

  const playPause = function () {
    if (playerRef.current.paused) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  };

  useEffect(() => {
    let animationFrameId;
    const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const newWidth = window.innerWidth > 640 ? 640 : window.innerWidth;
        setPlayerWidth(newWidth);
        setPlayerHeight((newWidth / videoWidth) * videoHeight);
      });
    };
    window.addEventListener("resize", handleResize, false);
    return () => {
      window.removeEventListener("resize", handleResize, false);
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoWidth, videoHeight]);

  useEffect(() => {
    if (!src) {
      setPlayerLoadingError(true);
      return;
    }
    playerRef.current.pause();
    setPlayerLoading(true);
    setPlayerLoadingError(false);
    playerRef.current.style.opacity = 0;
    setPlayerSrc(`${src}?size=l`);
  }, [src]);

  useEffect(() => {
    if (src) return;
    if (isSearching) {
      playerRef.current.pause();
      setPlayerLoading(true);
      setPlayerLoadingError(false);
      playerRef.current.style.opacity = 0;
      setPlayerSrc(null);
    } else {
      setPlayerLoading(false);
    }
  }, [isSearching]);

  return (
    <div className={styles.playerPane}>
      {playerLoadingError ? (
        <div className={styles.playerError} style={{ height: playerHeight, width: playerWidth }}>
          No video available.
        </div>
      ) : null}
      <video
        ref={playerRef}
        className={styles.player}
        src={playerSrc}
        width={playerWidth}
        height={playerHeight}
        muted={isMute}
        autoPlay
        loop
        playsInline
        onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          e.currentTarget.style.opacity = "1";
          if (e.currentTarget.videoWidth && e.currentTarget.videoHeight) {
            setVideoWidth(e.currentTarget.videoWidth);
            setVideoHeight(e.currentTarget.videoHeight);
            setPlayerHeight(
              (playerWidth / e.currentTarget.videoWidth) * e.currentTarget.videoHeight,
            );
          } else {
            setPlayerHeight(360);
          }
        }}
        onClick={playPause}
        onCanPlayThrough={(e: React.SyntheticEvent<HTMLVideoElement>) => {
          setPlayerLoading(false);
          playerRef.current.play();
        }}
        onContextMenu={(e: React.MouseEvent<HTMLVideoElement>) => {
          e.preventDefault();
        }}
      ></video>
      <div
        className={styles.dropEffect}
        style={{ height: playerHeight - 10 }}
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
      <div
        className={styles.loading}
        style={{ height: playerHeight, display: playerLoading || isSearching ? "flex" : "none" }}
      >
        <div
          className={playerLoading || isSearching ? styles.ripple : ""}
          style={{ height: (playerHeight - 800) / 2 }}
        ></div>
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
          className={styles.progressBarControl}
          style={{
            animationName: isSearching ? styles.seek : "none",
            left: (timeCode / duration) * playerWidth - 6 || 0,
          }}
        >
          ▲
        </div>
        <div
          className={`${styles.soundBtn} ${isMute ? styles.iconVolumeOff : styles.iconVolumeUp}`}
          onClick={() => {
            setIsMute(!isMute);
            playerRef.current.muted = !isMute;
          }}
        ></div>
      </div>
    </div>
  );
}
