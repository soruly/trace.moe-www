import { useEffect, useRef, useState } from "react";
import {
  dropEffect,
  dropping,
  fileNameDisplay,
  iconVolumeOff,
  iconVolumeUp,
  loading,
  player,
  playerControl,
  playerError,
  playerInfo,
  playerPane,
  progressBarControl,
  ripple,
  seek,
  soundBtn,
  timeCodeDisplay,
} from "./player.module.css";
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
  const [playerSrc, setPlayerSrc] = useState("");
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

  const handleResize = () => {
    setPlayerWidth(window.innerWidth > 640 ? 640 : window.innerWidth);
    setPlayerHeight((playerWidth / videoWidth) * videoHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

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
      setPlayerSrc("");
    } else {
      setPlayerLoading(false);
    }
  }, [isSearching]);

  return (
    <div className={playerPane}>
      {playerLoadingError ? (
        <div className={playerError} style={{ height: playerHeight, width: playerWidth }}>
          No video available.
        </div>
      ) : null}
      <video
        ref={playerRef}
        className={player}
        src={playerSrc}
        width={playerWidth}
        height={playerHeight}
        muted={isMute}
        autoPlay
        loop
        playsInline
        onLoadedMetadata={(e) => {
          e.target.style.opacity = 1;
          if (e.target.videoWidth && e.target.videoHeight) {
            setVideoWidth(e.target.videoWidth);
            setVideoHeight(e.target.videoHeight);
            setPlayerHeight((playerWidth / e.target.videoWidth) * e.target.videoHeight);
          } else {
            setPlayerHeight(360);
          }
        }}
        onClick={playPause}
        onCanPlayThrough={(e) => {
          setPlayerLoading(false);
          playerRef.current.play();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      ></video>
      <div
        className={dropEffect}
        style={{ height: playerHeight - 10 }}
        onClick={playPause}
        onDrop={(e) => {
          const result = onDrop(e);
          if (result) {
            setDropTargetText(result);
          } else {
            e.target.classList.remove(dropping);
          }
        }}
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
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        {dropTargetText}
      </div>
      <div
        className={loading}
        style={{ height: playerHeight, display: playerLoading || isSearching ? "flex" : "none" }}
      >
        <div
          className={playerLoading || isSearching ? ripple : ""}
          style={{ height: (playerHeight - 800) / 2 }}
        ></div>
      </div>

      <div className={playerInfo}>
        <div className={fileNameDisplay}>{fileName}</div>
        <div className={timeCodeDisplay}>
          {timeCode ? formatTime(timeCode) : "--:--:--"}/
          {duration ? formatTime(duration) : "--:--:--"}
        </div>
      </div>
      <div className={playerControl}>
        <div
          className={progressBarControl}
          style={{
            animationName: isSearching ? seek : "none",
            left: (timeCode / duration) * playerWidth - 6,
          }}
        >
          ▲
        </div>
        <div
          className={`${soundBtn} ${isMute ? iconVolumeOff : iconVolumeUp}`}
          onClick={() => {
            setIsMute(!isMute);
            playerRef.current.muted = !isMute;
          }}
        ></div>
      </div>
    </div>
  );
}
