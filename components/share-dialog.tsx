import { useEffect, useRef, useState } from "react";

import { formatTime } from "./utils";

import styles from "./share-dialog.module.css";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
}

const formatFormat = (fmt?: string) => {
  if (!fmt) return "";
  const map: Record<string, string> = {
    TV: "TV",
    TV_SHORT: "TV Short",
    MOVIE: "Movie",
    SPECIAL: "Special",
    OVA: "OVA",
    ONA: "ONA",
    MUSIC: "Music",
  };
  return map[fmt] || fmt;
};

const formatSeason = (season?: string, year?: number, language?: string) => {
  if (!season && !year) return "";
  const s = season ? season.charAt(0).toUpperCase() + season.slice(1).toLowerCase() : "";
  if (language === "chinese" || language === "native") {
    const seasonMap: Record<string, string> = {
      Winter: "冬",
      Spring: "春",
      Summer: "夏",
      Fall: "秋",
    };
    const seasonC = s ? seasonMap[s] || s : "";
    if (seasonC && year) return `${year} ${seasonC}`;
    if (seasonC) return seasonC;
    return `${year}`;
  }
  if (s && year) return `${s} ${year}`;
  if (s) return s;
  return `${year}`;
};

const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  isLatin: boolean,
): string[] => {
  const words = isLatin ? text.split(" ") : text.split("");
  if (words.length <= 1 && ctx.measureText(text).width > maxWidth) {
    const chars = Array.from(text);
    const lines: string[] = [];
    let cur = "";
    for (const ch of chars) {
      if (ctx.measureText(cur + ch).width > maxWidth && cur) {
        lines.push(cur);
        cur = ch;
      } else {
        cur += ch;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  const lines: string[] = [];
  let currentLine = "";
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine}${isLatin ? " " : ""}${words[i]}` : words[i];
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
};

export default function ShareDialog({ isOpen, onClose, result }: ShareDialogProps) {
  const [selectedLang, setSelectedLang] = useState<string>("native");
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>("");
  const [canShare, setCanShare] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const anilist = result?.anilist;

  const titleOptions = [
    { key: "native", label: "日本語 / Native", value: anilist?.title?.native },
    { key: "romaji", label: "Romaji", value: anilist?.title?.romaji },
    { key: "english", label: "English", value: anilist?.title?.english },
    { key: "chinese", label: "中文", value: anilist?.title?.chinese },
  ].filter((opt) => Boolean(opt.value));

  const activeTitle =
    titleOptions.find((opt) => opt.key === selectedLang)?.value ||
    anilist?.title?.native ||
    anilist?.title?.romaji ||
    anilist?.title?.english ||
    "";

  const formatStr = formatFormat(anilist?.format);
  const seasonStr = formatSeason(
    anilist?.season,
    anilist?.seasonYear || anilist?.startDate?.year,
    selectedLang,
  );
  const seasonAndFormat = [formatStr, seasonStr].filter(Boolean).join(" • ");

  const epStr = result?.episode
    ? selectedLang === "english" || selectedLang === "romaji"
      ? `Episode ${String(result.episode).padStart(2, "0")}`
      : `第 ${result.episode} 話`
    : "";
  const timeStr = `${result?.at ? formatTime(result.at) : "--:--:--"} / ${result?.duration ? formatTime(result.duration) : "--:--:--"}`;
  const episodeAndTime = [epStr, timeStr].filter(Boolean).join(" @ ");

  const shareText = [activeTitle, episodeAndTime, seasonAndFormat].filter(Boolean).join("\n");

  useEffect(() => {
    if (titleOptions.length > 0) {
      if (!titleOptions.some((opt) => opt.key === selectedLang)) {
        setSelectedLang(titleOptions[0].key);
      }
    }
  }, [result]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanShare(true);
    } else {
      setCanShare(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !result || !result.image) return;

    let isMounted = true;
    setIsGenerating(true);
    setNotification("");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!isMounted) return;

      const imgWidth = img.naturalWidth || 640;
      const imgHeight = img.naturalHeight || 360;

      // Create offscreen canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      canvas.width = imgWidth;

      const paddingX = 12;
      const paddingY = 10;
      const maxTextWidth = imgWidth - paddingX * 2;

      // Measure title text lines
      ctx.font =
        "bold 20px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      const titleLines = wrapText(
        ctx,
        activeTitle,
        maxTextWidth,
        selectedLang === "romaji" || selectedLang === "english",
      );
      const titleLineHeight = 24;

      // Meta lines
      const metaLines = [episodeAndTime, seasonAndFormat].filter(Boolean);
      const metaLineHeight = 20;

      const bannerHeight =
        paddingY +
        titleLines.length * titleLineHeight +
        (metaLines.length > 0 ? metaLines.length * metaLineHeight : 0) +
        paddingY;

      canvas.height = imgHeight + bannerHeight;

      // Draw preview image
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

      // Draw black banner background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, imgHeight, imgWidth, bannerHeight);

      // Draw title lines
      ctx.fillStyle = "#FFFFFF";
      ctx.font =
        "bold 20px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textBaseline = "top";
      let textY = imgHeight + paddingY;
      for (const line of titleLines) {
        ctx.fillText(line, paddingX, textY);
        textY += titleLineHeight;
      }

      // Draw meta lines
      if (metaLines.length > 0) {
        textY += 6;
        ctx.font =
          "16px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        ctx.fillStyle = "#FFFFFF";
        for (const meta of metaLines) {
          ctx.fillText(meta, paddingX, textY);
          textY += metaLineHeight;
        }
      }

      const dataUrl = canvas.toDataURL("image/png");
      setPreviewSrc(dataUrl);

      canvas.toBlob((blob) => {
        if (isMounted && blob) {
          setImageBlob(blob);
          setIsGenerating(false);
        }
      }, "image/png");
    };

    img.onerror = () => {
      if (isMounted) {
        setIsGenerating(false);
        setNotification("Failed to load scene image");
      }
    };

    img.src = `${result.image}?size=l`;

    return () => {
      isMounted = false;
    };
  }, [isOpen, result, selectedLang, activeTitle, episodeAndTime, seasonAndFormat]);

  const handleCopyText = async () => {
    if (!shareText) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setNotification("✓ Text copied to clipboard!");
        setTimeout(() => setNotification(""), 3000);
      } else {
        setNotification("Clipboard copy not supported in this browser");
      }
    } catch (err) {
      console.error(err);
      setNotification("Failed to copy text to clipboard");
    }
  };

  const handleCopyImage = async () => {
    if (!imageBlob) return;
    try {
      if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        const item = new ClipboardItem({ "image/png": imageBlob });
        await navigator.clipboard.write([item]);
        setNotification("✓ Copied to clipboard!");
        setTimeout(() => setNotification(""), 3000);
      } else {
        // Fallback for browsers without ClipboardItem
        setNotification("Clipboard image copy not supported in this browser");
      }
    } catch (err) {
      console.error(err);
      setNotification("Failed to copy image to clipboard");
    }
  };

  const handleShare = async () => {
    if (!imageBlob) return;
    const activeTitle =
      titleOptions.find((opt) => opt.key === selectedLang)?.value ||
      anilist?.title?.romaji ||
      anilist?.title?.native ||
      "";

    const epStr = result.episode ? ` Episode ${String(result.episode).padStart(2, "0")}` : "";
    const timeStr = result.at ? ` [${formatTime(result.at)}]` : "";

    const file = new File([imageBlob], "anime-scene.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: activeTitle,
          text: `${activeTitle}${epStr}${timeStr}`,
          files: [file],
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setNotification("Failed to share image");
        }
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: activeTitle,
          text: `${activeTitle}${epStr}${timeStr}`,
          url: window.location.href,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setNotification("Failed to share");
        }
      }
    } else {
      setNotification("Web Share not supported in this browser");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.dialog} ref={dialogRef} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.title}>Share Result</div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className={styles.body}>
          {titleOptions.length > 0 && (
            <div className={styles.languageRow}>
              <span className={styles.languageLabel}>Language:</span>
              <div className={styles.radioGroup} role="radiogroup" aria-label="Title Language">
                {titleOptions.map((opt) => (
                  <label key={opt.key} className={styles.radioOption}>
                    <input
                      type="radio"
                      name="titleLanguage"
                      value={opt.key}
                      checked={selectedLang === opt.key}
                      onChange={() => setSelectedLang(opt.key)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={styles.previewWrapper}>
            {isGenerating || !previewSrc ? (
              <div className={styles.spinner}>
                <div className={styles.loadingRipple}></div>
                <span>Generating image...</span>
              </div>
            ) : (
              <img
                src={previewSrc}
                alt="Customized Anime Scene Preview"
                className={styles.previewImg}
              />
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              onClick={handleCopyImage}
              disabled={isGenerating || !imageBlob}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>Copy Image</span>
            </button>

            {canShare && (
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleShare}
                disabled={isGenerating || !imageBlob}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>Share</span>
              </button>
            )}
          </div>

          {shareText && (
            <div className={styles.textBoxContainer}>
              <textarea
                readOnly
                className={styles.textBox}
                value={shareText}
                rows={3}
                aria-label="Title and scene metadata"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
              <button
                type="button"
                className={styles.copyTextBtn}
                onClick={handleCopyText}
                title="Copy text to clipboard"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy Text</span>
              </button>
            </div>
          )}

          {notification && <div className={styles.notification}>{notification}</div>}
        </div>
      </div>
    </div>
  );
}
