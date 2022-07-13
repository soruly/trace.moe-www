import { useEffect, useState, useRef } from "react";
import {
  playerPane,
  player,
  loading,
  playerInfo,
  fileNameDisplay,
  timeCodeDisplay,
  playerControl,
  progressBarControl,
  soundBtn,
  iconVolumeOff,
  iconVolumeUp,
  dropEffect,
  dropping,
  ripple,
  seek,
} from "./player.module.css";
import { formatTime } from "./utils";

export default function Player({ src, fileName, onDrop, timeCode, isLoading, isSearching }) {
  const playerRef = useRef(null);
  const [isMute, setIsMute] = useState(true);
  const [duration, setDuration] = useState(0);
  const [playerWidth, setPlayerWidth] = useState(window.innerWidth > 640 ? 640 : window.innerWidth);
  const [playerHeight, setPlayerHeight] = useState(360);
  const [videoWidth, setVideoWidth] = useState(640);
  const [videoHeight, setVideoHeight] = useState(360);
  const [playerSrc, setPlayerSrc] = useState("");
  const [playerLoading, setPlayerLoading] = useState(isLoading);
  const [left, setLeft] = useState(-12);
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
    if (!src) return;
    playerRef.current.pause();
    setPlayerLoading(true);
    playerRef.current.style.opacity = 0;
    setDuration(0);
    (async () => {
      const response = await fetch(`${src}&size=l`);
      setPlayerSrc(URL.createObjectURL(await response.blob()));
      const videoDuration = parseFloat(response.headers.get("x-video-duration"));
      setDuration(videoDuration);
      setLeft((timeCode / videoDuration) * playerWidth - 6);
    })();
  }, [src, timeCode]);

  useEffect(() => {
    if (src) return;
    if (isSearching) {
      playerRef.current.pause();
      setPlayerLoading(true);
      playerRef.current.style.opacity = 0;
      setDuration(0);
      setPlayerSrc("");
      setDuration(0);
      setLeft(-12);
    } else {
      setPlayerLoading(false);
    }
  }, [isSearching]);

  return (
    <div className={playerPane}>
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
            animationName: duration ? "none" : seek,
            left,
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
