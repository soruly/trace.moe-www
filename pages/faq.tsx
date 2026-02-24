import Layout from "../components/layout";

import styles from "../components/layout.module.css";

const FAQ = () => (
  <Layout title="FAQ">
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.pageHeader}>FAQ</div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Why I can't find the search result?</div>
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
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Examples of bad screenshots</div>
        <h4>Extra border added</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/border-bad.jpg" />
            <div>Bad Screenshot</div>
          </div>
          <div>
            <img alt="" src="/img/border-good.jpg" />
            <div>Original Screenshot</div>
          </div>
        </div>
        <p>
          In case your screenshot has extra borders, please trim off the extra borders before you
          search.
        </p>
        <h4>Cropped Image</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/cropped-bad.jpg" />
            <div>Bad Screenshot</div>
          </div>
          <div>
            <img alt="" src="/img/cropped-good.jpg" />
            <div>Original Screenshot</div>
          </div>
        </div>
        <p>Cropping the image would result a huge loss of information content.</p>
        <h4>Flipped image</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/flipped-bad.jpg" />
            <div>Bad Screenshot</div>
          </div>
          <div>
            <img alt="" src="/img/flipped-good.jpg" />
            <div>Original Screenshot</div>
          </div>
        </div>
        <p>
          This screenshot from{" "}
          <a href="https://www.youtube.com/watch?v=TUoWYoTWcnA&feature=youtu.be&t=2m59s">
            AMV - Animegraphy 2015
          </a>{" "}
          flipped the original scene in the anime. Try to search with a flipped image if you guess
          the image has been flipped.
        </p>
        <h4>Tinted images</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/tinted-bad.jpg" />
            <div>Not a good Screenshot</div>
          </div>
          <div>
            <img alt="" src="/img/tinted-good.jpg" />
            <div>Original Screenshot</div>
          </div>
        </div>
        <p>
          Tinted images are hard to search. Because the applied filter effects heavily distorted the
          information in the original screenshot. The color layout image descriptor can no longer
          find such images.
        </p>
        <h4>Old Japanese Anime</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/old-bad.jpg" />
            <div>Sample Screenshot</div>
          </div>
        </div>
        <p>Anime of this age are not indexed.</p>
        <h4>Not from Anime Screenshot</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/notanime-bad.jpg" />
            <div>Sample Screenshot</div>
          </div>
        </div>
        <p>
          You should try <a href="https://saucenao.com/">SauceNAO</a> and{" "}
          <a href="https://iqdb.org/">https://iqdb.org/</a> to search anime / doujin artwork.
        </p>
        <h4>Not Japanese Anime</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/nonjapanese-bad.jpg" />
            <div>Sample Screenshot</div>
          </div>
        </div>
        <p>Tom and Jerry is obviously not a Japanese Anime.</p>
        <h4>Dark image</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/dark-bad.jpg" />
            <div>Sample Screenshot</div>
          </div>
        </div>
        <p>Dark images are hard to distinguish using the colorlayout descriptor.</p>
        <h4>Low resolution image</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/lowres-bad.jpg" />
            <div>Sample Screenshot</div>
          </div>
        </div>
        <p>Your image should be at least 320x180px to search effectively.</p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Examples of acceptable screenshots</div>
        <h4>Slightly distorted size</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/distorted-bad.jpg" />
            <div>Acceptable Screenshot</div>
          </div>
          <div>
            <img alt="" src="/img/distorted-good.jpg" />
            <div>Original Screenshot</div>
          </div>
        </div>
        <h4>Reasonably sized subtitles</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/subtitles-bad.jpg" />
            <div>Acceptable Screenshot</div>
          </div>
          <div>
            <img alt="" src="/img/subtitles-good.jpg" />
            <div>Original Screenshot</div>
          </div>
        </div>
        <h4>A frame of GIF</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/gif-bad.jpg" />
            <div>Acceptable Screenshot</div>
          </div>
          <div>
            <img alt="" src="/img/gif-good.jpg" />
            <div>Original Screenshot</div>
          </div>
        </div>
        <p>If the color distortion is acceptable, GIF is also OK.</p>
        <h4>Drawings of the anime scene</h4>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/draw2-bad.jpg" />
            <div>Acceptable Screenshot</div>
          </div>
          <div>
            <img alt="" src="/img/draw2-good.jpg" />
            <div>Original Screenshot</div>
          </div>
        </div>
        <div className={styles.example}>
          <div>
            <img alt="" src="/img/draw4-bad.jpg" />
            <div>Acceptable Screenshot</div>
          </div>
          <div>
            <img alt="" src="/img/draw4-good.jpg" />
            <div>Original Screenshot</div>
          </div>
        </div>
        <p>
          The search image does not has to be taken from anime screencap directly. You can use
          drawings of some scenes as long as it is similar to the original one.
        </p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>How do I search for a more accurate result?</div>
        <p>
          Crop your screenshot to 16:9 or 4:3 before searching. Remove any extra borders in
          screencap (if any). By default, it crops the image to 16:9, if you upload a 16:10
          screenshot, it should be cropped automatically. If the position is incorrect, you can drag
          the image and adjust the crop position. If your image is tinted, you are out of luck.
        </p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>What anime are being indexed?</div>
        <p>
          Most Japanese anime since 2000 are indexed, plus some popular anime in 1990s, and little
          anime before 1990. A list of anime are incomplete in index at this stage, including
          Yu-Gi-Oh!, Crayon Shin-chan, Doraemon, Chibi Maruko-chan.
        </p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Why can't I preview the search result?</div>
        <p>
          Some anime are being removed or relocated, so some of the previews may go offline. The
          preview uses a considerable amount of network bandwidth, it would take some time to load
          if you have a slow connection.
        </p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Why are the anime chinese-subbed?</div>
        <p>
          I am still collecting raw anime, and it would take a number of powerful servers several
          months to complete. It will switch to the new dataset once it is ready. The current
          dataset uses Chinese-subbed anime because the current index is provided by some Asian
          users.
        </p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Cannot open the website!</div>
        <p>
          trace.moe requires TLS 1.2 to work. Try upgrading or use another browser. Primary
          supported browsers are Chrome and Firefox. You may also try disabling some of your
          browsers extensions/add-ons.
        </p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>How can I watch the entire anime?</div>
        <p>
          You cannot do that. This website is not intended for watching anime. If you wish to watch
          the anime, you may check which TV channel is broadcasting the anime in your country. For
          those which has finished airing, consider buying or renting the original Blu-ray/DVDs.
        </p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>How can I share the search result?</div>
        <p>You can only have a sharable URL if you search by image URL.</p>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>How to add trace.moe to Image Search Options</div>
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
