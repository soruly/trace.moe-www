import { useEffect, useState, useRef } from "react";

import styles from "./anilist-search-input.module.css";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export interface AnilistSuggestion {
  id: number;
  title: string;
  subtitle?: string;
  coverImage?: string;
  seasonYear?: number;
  season?: string;
  format?: string;
}

export interface AnilistSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: AnilistSuggestion) => void;
  className?: string;
  placeholder?: string;
  id?: string;
  name?: string;
}

export default function AnilistSearchInput({
  value,
  onChange,
  onSelect,
  className = "",
  placeholder = "anilist ID",
  id,
  name,
}: AnilistSearchInputProps) {
  const [suggestions, setSuggestions] = useState<AnilistSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [alignRight, setAlignRight] = useState(false);
  const debounceTimer = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showSuggestions) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    };

    const updatePosition = () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      if (rect.left + 320 > window.innerWidth - 16) {
        setAlignRight(true);
      } else {
        setAlignRight(false);
      }
    };

    updatePosition();
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", updatePosition);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    const trimmed = val.trim();

    if (/^\d+$/.test(trimmed) || !trimmed) {
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${NEXT_PUBLIC_API_ENDPOINT}/anilist?q=${encodeURIComponent(trimmed)}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const list: AnilistSuggestion[] = data
              .sort((a: any, b: any) => {
                const aSim = a.similarity || 0;
                const bSim = b.similarity || 0;
                const aHigh = aSim > 0.25;
                const bHigh = bSim > 0.25;

                if (aHigh && bHigh) return bSim - aSim;
                if (aHigh) return -1;
                if (bHigh) return 1;

                const aPop = a.anilist?.popularity || 0;
                const bPop = b.anilist?.popularity || 0;
                return bPop - aPop;
              })
              .map((item: any) => {
                const t = item.anilist?.title || {};
                const locale =
                  typeof navigator !== "undefined" && navigator.language
                    ? navigator.language.toLowerCase()
                    : "";

                let userTitle = t.native || t.romaji || "";
                if (locale.startsWith("zh")) {
                  userTitle = t.chinese || t.native || t.romaji;
                } else if (locale.startsWith("en")) {
                  userTitle = t.english || t.romaji;
                }

                userTitle =
                  userTitle ||
                  t.romaji ||
                  t.english ||
                  t.native ||
                  item.title ||
                  `ID: ${item.id || item.anilist?.id}`;

                let subtitle = item.title;

                return {
                  id: item.id || item.anilist?.id,
                  title: userTitle,
                  subtitle,
                  coverImage:
                    item.anilist?.coverImage?.large ||
                    item.anilist?.coverImage?.medium ||
                    item.anilist?.coverImage?.small,
                  seasonYear: item.anilist?.seasonYear,
                  season: item.anilist?.season,
                  format: item.anilist?.format,
                };
              });

            setSuggestions(list);
            setShowSuggestions(list.length > 0);
            setActiveSuggestionIndex(-1);
          }
        }
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      }
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === "Enter") {
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
          e.preventDefault();
          selectSuggestion(suggestions[activeSuggestionIndex]);
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    }
  };

  const selectSuggestion = (suggestion: AnilistSuggestion) => {
    onChange(`${suggestion.id}`);
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
    onSelect?.(suggestion);
  };

  return (
    <div className={styles.searchWrapper} ref={wrapperRef}>
      <input
        id={id}
        name={name}
        className={className}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className={`${styles.suggestionsList} ${alignRight ? styles.suggestionsListRight : ""}`}
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              className={`${styles.suggestionItem} ${
                index === activeSuggestionIndex ? styles.suggestionItemActive : ""
              }`}
              onClick={() => selectSuggestion(suggestion)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectSuggestion(suggestion);
                }
              }}
              role="option"
              aria-selected={index === activeSuggestionIndex}
              tabIndex={0}
            >
              <div className={styles.suggestionMain}>
                <span className={styles.suggestionTitle}>{suggestion.title}</span>
                {suggestion.subtitle && (
                  <span className={styles.suggestionSubtitle}>{suggestion.subtitle}</span>
                )}
                <div className={styles.suggestionMeta}>
                  {(suggestion.seasonYear || suggestion.season) && (
                    <span>
                      {suggestion.seasonYear || ""} {suggestion.season || ""}
                    </span>
                  )}
                  {suggestion.format && <span>{suggestion.format}</span>}
                </div>
              </div>
              {suggestion.coverImage && (
                <img
                  src={suggestion.coverImage}
                  alt=""
                  className={styles.suggestionPoster}
                  loading="lazy"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
