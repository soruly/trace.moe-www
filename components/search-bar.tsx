import { useState } from "react";

import AnilistSearchInput from "./anilist-search-input";

import styles from "./search-bar.module.css";

export default function SearchBar({
  searchImageSrc,
  imageURL,
  imageURLInput,
  handleFileSelect,
  anilistFilter,
  setAnilistFilter,
  isCutBorders,
  setIsCutBorders,
  isSearching,
  search,
}) {
  const [showAdvanced, setShowAdvanced] = useState(() => Boolean(anilistFilter));

  return (
    <div className={searchImageSrc ? styles.searchBarReady : styles.searchBar}>
      <div className={styles.searchBarContent}>
        {!searchImageSrc && (
          <div className={styles.greet}>
            paste or drop image here; trace back the scene from an anime screenshot
          </div>
        )}
        <div className={styles.formControls}>
          <form>
            <input
              type="url"
              pattern="https?://.+"
              required
              name="imageURL"
              className={styles.imageUrlInput}
              placeholder="Image URL"
              value={imageURL}
              onInput={imageURLInput}
            />
            <input type="submit" />
            <div className={styles.file}>
              <input type="file" name="files[]" accept="image/*" onChange={handleFileSelect} />
            </div>
          </form>
          {searchImageSrc ? (
            <>
              <AnilistSearchInput
                className={styles.anilistFilterInput}
                placeholder="filter anime"
                value={anilistFilter}
                onChange={(val) => {
                  setAnilistFilter(val);
                }}
              />
              <label className={styles.cutBordersBtn}>
                <input
                  type="checkbox"
                  checked={isCutBorders}
                  onChange={(e) => setIsCutBorders(e.target.checked)}
                />{" "}
                Cut Borders
              </label>
              <button
                type="button"
                className={styles.searchBtn}
                disabled={isSearching}
                onClick={() => search()}
              >
                <span className={styles.iconSearch}></span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={styles.advancedToggle}
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "▲" : "▼"} Advanced options
              </button>
              {showAdvanced && (
                <div className={styles.advancedOptions}>
                  <AnilistSearchInput
                    className={styles.anilistFilterInput}
                    placeholder="filter anime"
                    value={anilistFilter}
                    onChange={(val) => {
                      setAnilistFilter(val);
                    }}
                  />
                  <label className={styles.cutBordersBtn}>
                    <input
                      type="checkbox"
                      checked={isCutBorders}
                      onChange={(e) => setIsCutBorders(e.target.checked)}
                    />{" "}
                    Cut Borders
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
