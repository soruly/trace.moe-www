import Layout from "../components/layout";
import {
  container,
  page,
  pageHeader,
  section,
  sectionHeader,
  sectionItem,
} from "../components/layout.module.css";

const FAQ = () => (
  <Layout title="FAQ">
    <div className={`${container} ${page}`}>
      <div className={pageHeader}>FAQ</div>
      <div className={section}>
        <div className={sectionHeader}>Why I can't find the search result?</div>
        <p>
          Possible reasons:
          <br />
          1. Your image is not an original anime screenshot.
          <br />
          2. The anime has not been added to database yet.
          <br />
          3. Your image is of modified. <br />
          Regarding 1. You may try to use <a href="https://saucenao.com/">SauceNAO</a> and{" "}
          <a href="https://iqdb.org/">iqdb.org</a> which is best for searching anime artwork.
          <br />
          Regarding 2. New animes currently airing would be analyzed around 24 hours after TV
          broadcast. Long-running animes / cartoons are excluded at this stage. See "What anime are
          indexed" at the bottom of this page.
          <br />
          As for 3. The image search algorithm is designed for almost-exact match, not similar
          match. It analyze the color layout of the image. So, when your image is not a full
          un-cropped original 16:9 screenshot (i.e. cropped image), the search would likely fail.{" "}
          <br />
          Color is an important factor for the correct search, if heavy tints and filters are
          applied to the screenshot (i.e. grayscale, contrast, saturation, brightness, sepia), too
          much information are lost. In this case the search would also fail. The Edge Histogram can
          solve this issue by ignoring colors and only search edges. But I am running out of
          computing resource to support another image descriptor.
          <br />
          Image transform is also an important factor. If the image is flipped, mirrored or rotated,
          the search would also fail.
          <br />
          Text occupied too much of the image. Large texts on the image would interfere the original
          image. The system is not smart enough to ignore the text.
          <br />
          If your image has too little distinguish features (e.g. dark images or images with large
          plain blocks of plain colors), the search would also fail.
          <br />
          Searching with a real photo (of an anime) definitely won't work.
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Examples of bad screenshots</div>
        <br />
        <h4>Extra border added</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/border-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Bad Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/border-good.jpg"
            style={{
              float: "left",
              maxWidth: "288px",
              maxHeight: "162px",
              verticalAlign: "middle",
            }}
          />
          <br />
          Original Screenshot
        </div>
        <p style={{ clear: "both" }}>
          In case your screenshot has extra borders, please trim off the extra borders before you
          search.
        </p>
        <br />
        <h4>Cropped Image</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/cropped-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Bad Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/cropped-good.jpg"
            style={{
              float: "left",
              maxWidth: "288px",
              maxHeight: "162px",
              verticalAlign: "middle",
            }}
          />
          <br />
          Original Screenshot
        </div>
        <p style={{ clear: "both" }}>
          Cropping the image would result a huge loss of information content.
        </p>
        <br />
        <h4>Flipped image</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/flipped-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Bad Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/flipped-good.jpg"
            style={{
              float: "left",
              maxWidth: "288px",
              maxHeight: "162px",
              verticalAlign: "middle",
            }}
          />
          <br />
          Original Screenshot
        </div>
        <p style={{ clear: "both" }}>
          This screenshot from{" "}
          <a href="https://www.youtube.com/watch?v=TUoWYoTWcnA&feature=youtu.be&t=2m59s">
            AMV - Animegraphy 2015
          </a>{" "}
          flipped the original scene in the anime. Try to search with a flipped image if you guess
          the image has been flipped.
        </p>
        <br />
        <h4>Tinted images</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/tinted-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Not a good Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/tinted-good.jpg"
            style={{
              float: "left",
              maxWidth: "288px",
              maxHeight: "162px",
              verticalAlign: "middle",
            }}
          />
          <br />
          Original Screenshot
        </div>
        <p style={{ clear: "both" }}>
          Tinted images are hard to search. Because the applied filter effects heavily distorted the
          information in the original screenshot. The color layout image descriptor can no longer
          find such images.
        </p>
        <br />
        <h4>Old Japanese Anime</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/old-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Sample Screenshot
        </div>
        <p style={{ clear: "both" }}>Anime of this age are not indexed.</p>
        <br />
        <h4>Not from Anime Screenshot</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/notanime-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Sample Screenshot
        </div>
        <p style={{ clear: "both" }}>
          You should try <a href="https://saucenao.com/">SauceNAO</a> and{" "}
          <a href="https://iqdb.org/">https://iqdb.org/</a> to search anime / doujin artwork.
        </p>
        <br />
        <h4>Not Japanese Anime</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/nonjapanese-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Sample Screenshot
        </div>
        <p style={{ clear: "both" }}>Tom and Jerry is obviously not a Japanese Anime.</p>
        <br />
        <h4>Dark image</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/dark-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Sample Screenshot
        </div>
        <p style={{ clear: "both" }}>
          Dark images are hard to distinguish using the colorlayout descriptor.
        </p>
        <br />
        <h4>Low resolution image</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/lowres-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Sample Screenshot
        </div>
        <p style={{ clear: "both" }}>
          Your image should be at least 320x180px to search effectively.
        </p>
        <br />
      </div>
      <div className={section}>
        <div className={sectionHeader}>Examples of acceptable screenshots</div>
        <h4>Slightly distorted size</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/distorted-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Acceptable Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/distorted-good.jpg"
            style={{
              float: "left",
              maxWidth: "288px",
              maxHeight: "162px",
              verticalAlign: "middle",
            }}
          />
          <br />
          Original Screenshot
        </div>
        <p style={{ clear: "both" }}></p>
        <br />
        <h4>Reasonably sized subtitles</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/subtitles-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Acceptable Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/subtitles-good.jpg"
            style={{
              float: "left",
              maxWidth: "288px",
              maxHeight: "162px",
              verticalAlign: "middle",
            }}
          />
          <br />
          Original Screenshot
        </div>
        <p style={{ clear: "both" }}></p>
        <br />
        <h4>A frame of GIF</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/gif-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Acceptable Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/gif-good.jpg"
            style={{
              float: "left",
              maxWidth: "288px",
              maxHeight: "162px",
              verticalAlign: "middle",
            }}
          />
          <br />
          Original Screenshot
        </div>
        <p style={{ clear: "both" }}>If the color distortion is acceptable, GIF is also OK.</p>
        <br />
        <h4>Drawings of the anime scene</h4>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/draw2-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Acceptable Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/draw2-good.jpg"
            style={{
              float: "left",
              maxWidth: "288px",
              maxHeight: "162px",
              verticalAlign: "middle",
            }}
          />
          <br />
          Original Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/draw4-bad.jpg"
            style={{ maxWidth: "288px", maxHeight: "162px", verticalAlign: "middle" }}
          />
          <br />
          Acceptable Screenshot
        </div>
        <div style={{ float: "left", textAlign: "center", width: "288px" }}>
          <img
            alt=""
            src="/img/draw4-good.jpg"
            style={{
              float: "left",
              maxWidth: "288px",
              maxHeight: "162px",
              verticalAlign: "middle",
            }}
          />
          <br />
          Original Screenshot
        </div>
        <p style={{ clear: "both" }}>
          The search image does not has to be taken from anime screencap directly. You can use
          drawings of some scenes as long as it is similar to the original one.
        </p>
        <br />
      </div>
      <div className={section}>
        <div className={sectionHeader}>How do I search for a more accurate result?</div>
        <p>
          Crop your screenshot to 16:9 or 4:3 before searching. Remove any extra borders in
          screencap (if any). By default, it crops the image to 16:9, if you upload a 16:10
          screenshot, it should be cropped automatically. If the position is incorrect, you can drag
          the image and adjust the crop position. If your image is tinted, you are out of luck.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>What anime are being indexed?</div>
        <p>
          Most Japanese anime since 2000 are indexed, plus some popular anime in 1990s, and little
          anime before 1990. A list of anime are incomplete in index at this stage, including
          Jewelpet, Yu-Gi-Oh!, Dragon Ball, Crayon Shin-chan, Doraemon, Pokemon, Detective Conan,
          Chibi Maruko-chan.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Why can't I preview the search result?</div>
        <p>
          Some anime are being removed or relocated, so some of the previews may go offline. The
          preview uses a considerable amount of network bandwidth, it would take some time to load
          if you have a slow connection.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Why are the anime chinese-subbed?</div>
        <p>
          I am still collecting raw anime, and it would take a number of powerful servers several
          months to complete. It will switch to the new dataset once it is ready. The current
          dataset uses Chinese-subbed anime because the current index is provided by some Asian
          users.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Cannot open the website!</div>
        <p>
          trace.moe requires TLS 1.2 to work. Try upgrading or use another browser. Primary
          supported browsers are Chrome and Firefox. You may also try disabling some of your
          browsers extensions/add-ons.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>How can I watch the entire anime?</div>
        <p>
          You cannot do that. This website is not intended for watching anime. If you wish to watch
          the anime, you may check which TV channel is broadcasting the anime in your country. For
          those which has finished airing, consider buying or renting the original Blu-ray/DVDs.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>How can I share the search result?</div>
        <p>You can only have a sharable URL if you search by image URL.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>How to add trace.moe to Image Search Options</div>
        <p>
          If you prefer to use trace.moe with{" "}
          <a href="https://chrome.google.com/webstore/detail/image-search-options/kljmejbpilkadikecejccebmccagifhl">
            Image Search Options
          </a>
          , go to settings and add this:
        </p>
        <pre>https://trace.moe/?url=</pre>
      </div>
    </div>
  </Layout>
);
export default FAQ;
