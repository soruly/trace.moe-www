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
  searchImage,
}) {
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
          {searchImageSrc && (
            <>
              <input
                type="text"
                className={styles.anilistFilterInput}
                placeholder="anilist ID"
                value={anilistFilter}
                onChange={(e) => {
                  setAnilistFilter(e.target.value);
                }}
              />
              <button
                className={styles.cutBordersBtn}
                onClick={() => setIsCutBorders(!isCutBorders)}
              >
                <span
                  className={`icon ${isCutBorders ? styles.iconCheck : styles.iconCross}`}
                ></span>{" "}
                Cut Borders
              </button>
              <button
                className={styles.searchBtn}
                disabled={isSearching}
                onClick={() => search(searchImage)}
              >
                <span className={styles.iconSearch}></span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
