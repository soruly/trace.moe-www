import {
  searchBar,
  greet,
  searchBarReady,
  searchBarContent,
  logo,
  title,
  subtitle,
  formControls,
  imageUrlInput,
  anilistFilterInput,
  file,
  cutBordersBtn,
  searchBtn,
  iconSearch,
  iconCheck,
  iconCross,
} from "./search-bar.module.css";

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
    <div className={searchImageSrc ? searchBarReady : searchBar}>
      <div className={searchBarContent}>
        {!searchImageSrc && (
          <div className={greet}>
            paste or drop image here; trace back the scene from an anime screenshot
          </div>
        )}
        {searchImageSrc && (
          <a href="/">
            <div className={logo}>
              <div className={title}>trace.moe</div>
              <div className={subtitle}>-- Anime Scene Search Engine</div>
            </div>
          </a>
        )}
        <div className={formControls}>
          <form>
            <input
              type="url"
              pattern="https?://.+"
              required
              name="imageURL"
              className={imageUrlInput}
              placeholder="Image URL"
              value={imageURL}
              onInput={imageURLInput}
            />
            <input type="submit" />
            <div className={file}>
              <input type="file" name="files[]" accept="image/*" onChange={handleFileSelect} />
            </div>
          </form>
          {searchImageSrc && (
            <>
              <input
                type="text"
                className={anilistFilterInput}
                placeholder="anilist ID"
                value={anilistFilter}
                onChange={(e) => {
                  setAnilistFilter(e.target.value);
                }}
              />
              <button className={cutBordersBtn} onClick={() => setIsCutBorders(!isCutBorders)}>
                <span className={`icon ${isCutBorders ? iconCheck : iconCross}`}></span> Cut Borders
              </button>
              <button
                className={searchBtn}
                disabled={isSearching}
                onClick={() => search(searchImage)}
              >
                <span className={iconSearch}></span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
