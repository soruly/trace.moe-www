import Layout from "../components/layout";
import {
  container,
  page,
  pageHeader,
  section,
  sectionHeader,
  sectionItem,
} from "../components/layout.module.css";

const News = () => (
  <Layout title="News">
    <div className={`${container} ${page}`}>
      <div className={pageHeader}>News</div>
      <div className={section}>
        <div className={sectionHeader}>trace.moe database dump 2021-10</div>
        <small>10 Oct 2021</small>
        <p>
          <a href="https://nyaa.si/view/1442127">https://nyaa.si/view/1442127</a>
          <br />
          <br />
          This is the most recent database dump for trace.moe which contains image hashes of 31000
          hours of anime. (No video files included)
          <br />
          <br />
          As mentioned previously, the hashing libarary has upgraded. So these is a complete re-hash
          of all anime, and these hashes are incompatible with sola. It is only compatible with
          latest liresolr. Comparing to last DB dump, this data set has recent anime added, and has
          replaced many subbed versions with raw anime.
          <br />
          <br />
          These can be loaded into a local liresolr database for anime scene search. You can follow
          the project on GitHub if you are interested.
          <br />
          <br />
          <a href="https://github.com/soruly/trace.moe#hosting-your-own-tracemoe-system">
            https://github.com/soruly/trace.moe
          </a>
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Software updates and Improving Search Accuracy</div>
        <small>29 Sep 2021</small>
        <p>
          some anime not found previously can now be found after these updates and a re-hash of all
          anime. See details below:
        </p>
        <p>
          Upgraded from java-1.8.0-openjdk (java 8) to java-latest-openjdk (java 17) for worker
          nodes
          <br />
          Upgraded from solr 7.5.0 to 8.9.0
          <br />
          Upgraded liresolr with image cache issues fixed and updated LIRE.
          <br />
          <a href="https://github.com/soruly/liresolr">https://github.com/soruly/liresolr</a>
          <br />
          Upgraded LIRE from 1.0_b05.jar to 1.0_b06.jar This is a breaking change so it requires a
          re-hash of all video.
          <br />
          <a href="https://github.com/soruly/LIRE">https://github.com/soruly/LIRE</a>
          <br />
          The 83203 videos have just been re-hashed with an latest version of liresolr. This should
          fix some broken video and timecode.
          <br />
          An archive of the hashes (~23GB) would be published in October.
          <br />
          Accuracy is tuned up from 2% to 3%, which takes 300-500ms longer to search on average.
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Add trace.moe to windows context menu</div>
        <small>19 Sep 2021</small>
        <p>
          You can search images directly from windows context menu by installing this powershell
          script. See instructions below
        </p>
        <p>
          <a href="https://github.com/soruly/trace.moe-windows-menu">
            https://github.com/soruly/trace.moe-windows-menu
          </a>
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Microsoft Edge Add-on is published on store now</div>
        <small>19 Jul 2021</small>
        <p>
          <a href="https://microsoftedge.microsoft.com/addons/detail/search-anime-by-screensho/bkigcpancdclbiekidfbcghedaielbda">
            https://microsoftedge.microsoft.com/addons/detail/search-anime-by-screensho/bkigcpancdclbiekidfbcghedaielbda
          </a>
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>trace.moe database dump 2021-04</div>
        <small>2 Jun 2021</small>
        <p>
          <a href="https://nyaa.si/view/1393270">https://nyaa.si/view/1393270</a>
          <br />
          <br />
          This is the most recent database dump for trace.moe which contains image hashes of ~5000
          anime titles. (No video files included)
          <br />
          <br />
          Comparing to last DB dump, this data set has recent anime added, and has replaced many
          subbed versions with raw anime.
          <br />
          <br />
          These can be loaded into sola database for searching locally. You can follow the project
          on GitHub if you are interested.
          <br />
          <br />
          <a href="https://github.com/soruly/sola">https://github.com/soruly/sola</a>
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>New trace.moe API published</div>
        <small>10 May 2021</small>
        <p>
          <a href="https://soruly.github.io/trace.moe-api/">
            https://soruly.github.io/trace.moe-api/
          </a>
          <br />
          <br />
          The new trace.moe API is finallized. There are quite a lot of changes so please read the
          above API docs. It also has a migration guide for developers to update their program. The
          old API is planned to shut down on 30th June 2021, depending on how fast developers
          migrate their programs.
          <br />
          <br />
          According to the API changes, the sponsor tiers have also changed. Starting from next
          month, existing patrons would receive a email of your trace.moe account according to your
          sponsor tiers. If you can't wait to try it out, you can also message me to get an early
          access.
          <br />
          <br />
          You can also choose to use GitHub sponsor if you perfer. The sponsor tiers are exactly the
          same. But you'll have to email me your GitHub ID and email address to claim the rewards
          for sponsors.
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Recent updates</div>
        <small>2 May 2021</small>
        <p>
          Traffic Graph You can now see the server's traffic on{" "}
          <a href="https://trace.moe/about">https://trace.moe/about</a>
          <br />
          <br />
          Account Page You can check your search quota and limits on{" "}
          <a href="https://trace.moe/account">https://trace.moe/account</a>
          <br />
          <br />
          Making Anilist info optional Actually crawling anilist data violates Anilist API's terms
          of service. Instead of crawling everything upfront, I think it's better to query anilist
          data on-the-fly when necessary. The website and telegram bot has updates to behave like
          this. In this way, this would reduce future API changes due to anilist's data structure.
          The chinese translated titles are also separated from my database now. So it can run as a
          standalone proxy that injects chinese titles on-the-fly. If you're interested in
          serverless/cloudflare workers, take a look at this repo.{" "}
          <a href="https://github.com/soruly/anilist-chinese">
            https://github.com/soruly/anilist-chinese
          </a>
          <br />
          <br />
          Rate Limits In recent months I've been working hard to regulate the traffic to avoid
          crashing the server due to overload. Apart from rate limit and concurrent search limit,
          I've also added a queue of database search. Sadly, the queue still often gets full during
          rush hours, especially when there are a few slow search requests that blocks the rest of
          the queue. I'm still evaluating the parameters so the actual numbers are not finalized
          yet. I'm expecting to complete and release the new API in 1-2 months. So for those whom
          may concern, join the discussion on Discord{" "}
          <a href="https://discord.gg/K9jn6Kj">https://discord.gg/K9jn6Kj</a>
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Webpage re-design</div>
        <small>18 Feb 2021</small>
        <p>
          I've rewritten the webpage.
          <br />
          <br />
          Now it shows animated GIF preview for all results instead of static thumbnails. Generating
          that many animated previews is cpu-consuming, so the number of results are capped to top 5
          only.
          <br />
          <br />
          On top left, you can see your search image that is used for searching. Previously this was
          drawn behind canvas which is a bit confusing.
          <br />
          <br />
          Now it only shows important informations from anilist. Details like staff/characters are
          removed, please visit anilist for details if you're interested.
          <br />
          <br />
          Site navigation is moved from top to bottom of the page, including all important urls to
          related sites.
          <br />
          <br />
          This update also dropped old browsers like Internet Explorer. If you're having issues with
          the new website, please report to me.
          <br />
          <br />
          The source code of the website is now located at{" "}
          <a href="https://github.com/soruly/trace.moe-www">
            https://github.com/soruly/trace.moe-www
          </a>{" "}
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Updates to trace.moe API</div>
        <small>30 Jan 2021</small>
        <p>
          - Change: image preview endpoint has changed, the url is now consistent with video preview
          <br />
          - New: size param for image/video preview
          <br />
          <br />
          Please refer to{" "}
          <a href="https://soruly.github.io/trace.moe/#/#previews">
            https://soruly.github.io/trace.moe/#/#previews
          </a>
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>trace.moe database dump 2020-10</div>
        <small>18 Oct 2020</small>
        <p>
          This is the most recent database dump for trace.moe which contains image hashes of ~5000
          anime titles. (No video files included)
          <br />
          <br />
          Comparing to last DB dump, this data set has recent anime added, and has replaced many
          subbed versions with raw anime.
          <br />
          <br />
          These can be loaded into sola database for searching locally. You can follow the project
          on GitHub if you are interested.
          <br />
          <br />
          <a href="https://github.com/soruly/sola">https://github.com/soruly/sola</a>
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>New Image Search Algorithm (JCD)</div>
        <small>13 Apr 2020</small>
        <p>
          A new search algorithm has been added to trace.moe. You can try this using the "Use new
          algo" check box near the search button. This new algorithm has better support on flipped
          and cropped images. See results above.
          <br />
          <br />
          This new algorithm still needs fine-tuning of its parameters, so I'm now opening this
          option for everyone to try. For developers using the API, you can use /search?method=jc .
          In upcoming months, I'll review the performance and accuracy of these two algorithms and
          see if JCD is good enough to replace ColorLayout. Or else, methods to combine the two.
          <br />
          <br />
          The new algorithm, JCD (Joint Composite Descriptor) is composed of CEDD (Color and Edge
          Directivity Descriptor) and FCTH (Fuzzy Color and Texture Histogram), takes both color,
          edge (shape) and texture into image analysis. trace.moe has been using ColorLayout
          descriptor, which does not analyze the image edge and shape but only the distribution of
          colors in a 8x8 grid. With this new algorithm, it makes it possible to search for
          flipped/cropped images which previously fails.
          <br />
          <br />
          Note that none of these Image Descriptors are invented by me. If you're interested in the
          principles of the the algorithm(s), please read the paper from the original author. and
          its open source implementation, LIRE.
          <br />
          <br />
          When indexed on the same video data set, the size of indexed database (extracted) is
          232GB, 85% larger than that of ColorLayout (125GB). The database cache of two algos and
          memory for apache solr now occupies 420GB RAM (out of 512GB) RAM on server.
          <br />
          <br />
          Serving the database for the new algorithm requires powerful servers. Please continue to
          support this project for ACG fans! :3
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>trace.moe database dump 2020-04</div>
        <small>13 Apr 2020</small>
        <p>
          This is the most recent database dump for trace.moe which contains image hashes of
          ~100,000 anime files. (No video files included)
          <br />
          <br />
          Comparing to last DB dump, this data set has recent anime added and versions from
          different subgroups de-duplicated. For most anime, only one version of the same episode is
          kept in db. This results a smaller database size and faster search time.
          <br />
          <br />
          These can be loaded into sola database for searching locally. I'm still modifying sola and
          document the the steps how to do so. You can follow the project on GitHub if you are
          interested.
          <br />
          <br />
          <a href="https://github.com/soruly/sola">https://github.com/soruly/sola</a>
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added dark theme support</div>
        <small>14 Sep 2019</small>
        <p>
          If your OS is in dark mode, it would switch to dark mode automatically without any
          settings.
          <br />
          For windows, it'd be in settings =&gt; personalization =&gt; color
          <br />
          For macOS, it'd be in system preferences =&gt; general =&gt; appearance <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added image URL support to trace.moe API</div>
        <small>4 May 2019</small>
        <p>
          You can now easily use http://trace.moe API directly with image URL
          <br />
          <br />
          <a href="https://soruly.github.io/trace.moe/">https://soruly.github.io/trace.moe/</a>
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>trace.moe database dump 2019-04</div>
        <small>4 May 2019</small>
        <p>
          This is the most recent database dump for trace.moe which contains image hashes of
          ~100,000 anime files. (No video files included)
          <br />
          <br />
          These can be loaded into sola database for searching locally. I'm still modifying sola and
          document the the steps how to do so. You can follow the project on GitHub if you are
          interested.
          <br />
          <a href="https://github.com/soruly/sola">https://github.com/soruly/sola</a>
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Optimizing website loading speed</div>
        <small>1 May 2019</small>
        <p>
          Recently I've been improving webpage loading times in various ways:
          <br />
          - Re-write webpage js to remove heavy libraries like jQuery / bootstrap.js
          <br />
          - Use HTTP/2 Push to reduce round-trip times
          <br />
          - Upgraded Cloudflare CDN to pro plan ($20/month)
          <br />
          <br />
          Now the webpage can complete loading in just 90ms!! (from regions close to origin server)
          <br />
          <br />
          trace.moe is now scoring 98 and 100 in{" "}
          <a href="https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Ftrace.moe&tab=desktop">
            Google PageSpeed Insights
          </a>
          .<br />
          <br />
          I've also improved website security to score A+ (115/100) in{" "}
          <a href="https://observatory.mozilla.org/analyze/trace.moe">Mozilla Observatory test</a>.
          <br />
          <br />
          Recently I've found that Cloudflare's free plan did not route to nearest edge server due
          to it's network capacity. When traffic is busy for the region during that period, it may
          route to thousands of miles away which increase page load time by hundreds of
          milliseconds. That's why I've upgraded to Cloudflare pro plan to ensure the website is
          consistently fast from the whole world. I hope your support can cover the increased cost.
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Recent updates to trace.moe</div>
        <small>3 Feb 2019</small>
        <p>
          New web UI layout for mobile devices!
          <br />
          A few days ago, I redesigned a the webpage layout a bit to better support mobile devices.
          (finally!) Though the layout isn't very perfect, at least it's easier to use and browse
          compared to the fixed viewport before. Try the webpage now at https://trace.moe
          <br />
          <br />
          Natural Scene Cutter for video preview
          <br />I started a new project late October 2018 to cut video scene previews naturally, by
          detecting timestamp boundaries of a scene. This method is better than the fixed time
          offset cutting. So you can loop the video of the scene. I'm still writing description of
          this project, which you can find it on Github{" "}
          <a href="https://github.com/soruly/trace.moe-media">
            https://github.com/soruly/trace.moe-media
          </a>
          <br />
          <br />
          GIF Preview for Telegram bot
          <br />
          To try the natural scene cutter, you can use the Telegram bot.
          <br />
          <a href="https://telegram.me/WhatAnimeBot">https://telegram.me/WhatAnimeBot</a>
          <br />
          Send an image with caption "mute", and it will return a muted video preview (same as GIF),
          which can loop a scene.
          <br />
          <br />
          API updates
          <br />
          The natural scene cutter can also be used via API now.
          <br />
          The API and API docs have updated to resolve some confusions around search image format
          and error handling issues. Now the API has removed strict restrictions on image format and
          is supporting both JSON and FORM POST. Details are written in{" "}
          <a href="https://soruly.github.io/trace.moe/">https://soruly.github.io/trace.moe/</a>
          <br />
          <br />
          Dockerizing sola
          <br />
          sola is now mostly dockerized. It is a lot easier for developers to setup their own video
          scene search engine now. Instructions are written in details in the project:
          <br />
          <a href="https://github.com/soruly/sola">https://github.com/soruly/sola</a>
          <br />
          <br />
          <br />
          The domain incident hit this project quite hard last October. But with the help of fans
          and developers around the world, the daily search queries has now restored to same levels
          as half a year ago. Thank you for all your support!! ;)
          <br />
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Moving to new domain: trace.moe</div>
        <small>22 Oct 2018</small>
        <p>
          Yesterday, the .ga domain provided by Freenom (domain name registrar) was suddenly
          suspended. I had no choice but immediately moved to trace.moe which I've been planning to
          move to.
          <br />
          As of today, officially supported integrations (WebExtensions, Telegram bot), and some
          major integrations (Discord, SauceNAO) has been updated to the new domain. In upcoming
          days I'll work with developers of remaining 3rd party integrations (including API users)
          to notify the change.
          <br />
          <br />
          Why the name trace.moe?
          <br />
          This search engine tells you more than the anime name, but actually trace back the moment
          of the scene. And quite a number of users actually need "time tracing" even they already
          know the anime. That's why I think using "trace" instead of "whatanime" better describes
          this search engine.
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>open sourcing scene search with sola</div>
        <small>2 May 2018</small>
        <p>
          The last piece of puzzle in whatanime.ga has published.
          <br />
          The whatanime repository on GitHub has gain lot of developers' attention. However, it only
          include the code for the website and is not a fully functional system. Some of them are
          puzzled when they try to look into the code.
          <br />
          <br />
          Last month, I've re-written those messy scripts into a new project - sola.
          <br />
          <br />
          This include all the scripts that whatanime.ga currently used to put mp4 video files into
          solr for search. It has been running for a month, so this should be stable enough to
          publish. sola is not limited to searching anime, any types of video (like movies, TV
          shows) can also be indexed. It does not depends on whatanime and anilist, the only
          dependeny is liresolr. So users that doesn't need anime info and web UI can avoid those
          complexities.
          <br />
          <br />
          sola is a node.js app. Many developers would feel easy to read and modify the code.
          Hopefully this would encourage contribution to the project. It has just ~700 lines of code
          in total. For developers that doesn't like Javascript (or would like to avoid GPLv3), it's
          not difficult to rewrite the whole thing.
          <br />
          <br />
          I've written a setup guide for developers to easily setup their own video scene search
          engine. Spread the news to developers and let them try!
          <br />
          <br />
          <a href="https://github.com/soruly/sola">https://github.com/soruly/sola</a>
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Speeding up search on whatanime.ga</div>
        <small>2 Apr 2018</small>
        <p>
          <a href="https://youtu.be/HjL5O3k3C7s">https://youtu.be/HjL5O3k3C7s</a>
          <br />
          <br />
          New testing site on https://beta.whatanime.ga
          <br />
          I've been testing a new beta site with improved performance on search speed.
          <br />
          A copy of the 130GB solr core from http://whatanime.ga is split into 10 smaller cores
          (10-16GB each, with 59-89 million hashes). Each search queries all 10 solr cores in
          parallel and then merge back. Early tests shows that it can query 950 million image hashes
          in 1.35 seconds! Almost 10 times as much than the existing one.
          <br />
          <br />
          I've rewritten a lot of backend scripts into a nice CLI tool. I'm going to publish it on
          github later this month, after I've completed the docs and tutorial. For experienced
          developers, it will be a lot easier to setup their own video reverse search engine.
          <br />
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added auto black border crop</div>
        <small>13 Nov 2017</small>
        <p>
          This will automatically detect and crop black borders on search image, significantly
          increase the accuracy on bad screenshots
          <br />
          This is applied to both web, telegram bot and all API clients
          <br />
          This is achieved by openCV using a simple python script
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Telegram Channel</div>
        <small>26 Aug 2017</small>
        <p>
          You can subscribe the <a href="https://telegram.me/whatanimeupdates">Telegram Channel</a>{" "}
          for database and news updates.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>GIF and video support for Telegram Bot</div>
        <small>24 Aug 2017</small>
        <p>
          You can now send GIF or video to the{" "}
          <a href="https://telegram.me/WhatAnimeBot">Telegram Bot</a>.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Group chat support for Telegram Bot</div>
        <small>23 Aug 2017</small>
        <p>
          You can now add the <a href="https://telegram.me/WhatAnimeBot">Telegram Bot</a> to
          Telegram group. Use @ to mention the bot on any photo to search.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>
          Fix search requests failed when Google Analytics is blocked
        </div>
        <small>5 Aug 2017</small>
        <p>Identified and fixed an issue where browsers failed to search due to blocked scripts.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added 2017-04 database dump</div>
        <small>26 Jul 2017</small>
        <p>Database dump updated to 2017-04.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added demo for the upcoming search engine update</div>
        <small>14 Jun 2017</small>
        <p>Take a look at a demo on demo.whatanime.ga</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>New Icon</div>
        <small>5 Jun 2017</small>
        <p>
          <img src="/favicon128.png" alt="favicon" />
          <br />
          This is the new icon for whatanime.ga
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>2017 Presentation slides updates</div>
        <small>4 Jun 2017</small>
        <p>
          Want to know more about whatanime.ga? Read the{" "}
          <a href="https://go-talks.appspot.com/github.com/soruly/slides/whatanime.ga-2017.slide">
            Presentation slides on June 2017
          </a>
          .
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Search changes</div>
        <small>30 Apr 2017</small>
        <p>
          You can now search scenes with any aspect ratio. Thumbnail preview also respect aspect
          ratio now. Recaptcha is removed, you must wait up to 10 minutes once you have reached
          search quota limit (20 search per 10 minutes). Homepage code has been re-written, the
          webpage now loads faster. And a new loading animation was added.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Search for more results</div>
        <small>23 Apr 2017</small>
        <p>
          You can now keep searching the database for more results. Previously, the search would
          stop when it has found any result &gt; 90% similarity. Now keep searching to discover more
          results with even higher similarity!
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Search in specific season</div>
        <small>18 Apr 2017</small>
        <p>
          You can now select a particular year / season to search. If you like this project, feel
          free to <a href="https://www.patreon.com/soruly">Support whatanime.ga on Patreon.</a>
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>System maintenance</div>
        <small>15 Apr 2017</small>
        <p>
          Server upgrade and cleanup was completed on 15 Apr 2017. An additional hard drive and new
          network adapter has been installed.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>System status page</div>
        <small>14 Apr 2017</small>
        <p>
          You can now see the system status in{" "}
          <a href="https://status.whatanime.ga">https://status.whatanime.ga</a> (Powered by
          UptimeRobot).
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Partial service interruption</div>
        <small>23 Feb 2017</small>
        <p>
          Anime info panel was not showing since Feb 21 21:13 UTC , the service has been restored on
          Feb 23 03:34 UTC.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Image proxy relocated</div>
        <small>21 Feb 2017</small>
        <p>
          The image proxy server has been moved from Singapore (Digital Ocean) to Tokyo (Linode). It
          may affect loading times of images from ?url= params.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Video preview for Telegram Bot</div>
        <small>4 Feb 2017</small>
        <p>
          The <a href="https://telegram.me/WhatAnimeBot">Telegram Bot</a> will now sends you a video
          preview.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Official API released</div>
        <small>17 Jan 2017</small>
        <p>
          The official API is now open for testing. Interested developers may read the page on{" "}
          <a href="https://soruly.github.io/whatanime.ga/">GitHub Pages</a>.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>WebExtension updated</div>
        <small>16 Nov 2016</small>
        <p>
          The image extraction method of WebExtension has changed. This would be able to fix some
          issues on grabbing the correct image on webpage to search. Now the Extension also supports
          Microsoft Edge. You may try loading the zip from{" "}
          <a href="https://github.com/soruly/whatanime.ga-WebExtension/releases">GitHub</a> by
          enabling extension developer features in about:flags.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Enabled autoplay on mobile</div>
        <small>11 Nov 2016</small>
        <p>Now mobile devices will mute and autoplay the video preview.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added URL params for playback options</div>
        <small>29 Oct 2016</small>
        <p>You can now use URL params to control playback options, for example:</p>
        <pre>https://trace.moe/?autoplay=0&loop&mute=1&url=</pre>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Improved performance</div>
        <small>23 Oct 2016</small>
        <p>
          Reduced search result candidates from 10 Million to 3 Million. This would reduce accuracy
          but greatly improves performance.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added links to database dump</div>
        <small>5 Oct 2016</small>
        <p>You can now download a complete dump of the database.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added more server status</div>
        <small>1 Oct 2016</small>
        <p>You can see server load and recently indexed files in /about</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Adding Raw Anime</div>
        <small>1 Oct 2016</small>
        <p>The database has started indexing raw anime from now on.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added Telegram Bot</div>
        <small>14 Sep 2016</small>
        <p>
          This telegram bot can tell you where an anime screenshot is taken from. Just send /
          forward an image to{" "}
          <a href="https://telegram.me/WhatAnimeBot">https://telegram.me/WhatAnimeBot</a> .
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>WebExtension Changes</div>
        <small>14 Aug 2016</small>
        <p>The ?auto url param is no longer used. Now it would always automatically search.</p>
        <p>
          WebExtension has updated. Now it would copy and paste using dataURL in background. It
          allows searching images from pages that's not publicly available such as Facebook Feeds.
          It also supports searching from HTML5 videos using the frame extracted at the moment you
          click it. Now extensions no longer use the ?url to send search images.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>WebExtension for Chrome, Firefox and Opera</div>
        <small>1 July 2016</small>
        <p>
          {" "}
          <a href="https://chrome.google.com/webstore/detail/search-anime-by-screensho/gkamnldpllcbiidlfacaccdoadedncfp">
            Chrome Extension
          </a>
          ,{" "}
          <a href="https://addons.mozilla.org/en-US/firefox/addon/search-anime-by-screenshot/">
            Firefox Add-on
          </a>
          ,{" "}
          <a href="https://addons.opera.com/en/extensions/details/search-anime-by-screenshot/">
            Opera Add-on
          </a>{" "}
          has been relased.
          <br />
          Source code available on{" "}
          <a href="https://github.com/soruly/whatanime.ga-WebExtension">GitHub</a>
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Improved anime title language</div>
        <small>30 Jun 2016</small>
        <p>It now shows anime titles according to users' browser language.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added loading icon</div>
        <small>30 Jun 2016</small>
        <p>
          It now shows a loading icon (instead of blurring) while searching. Also display a loading
          icon when the video preview is loading.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added preview thumbnails</div>
        <small>30 May 2016</small>
        <p>
          The thumbnail may not be at the exact moment, since the seeking is not very accurate. Play
          the preview to see if it's what you are looking for.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Fixed some bugs in URL loading</div>
        <small>6 May 2016</small>
        <p>
          In case the image cannot be loaded, upload the image from file or copy image itself (not
          URL) then Ctrl+V
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Speed up image load from URL</div>
        <small>23 Apr 2016</small>
        <p>
          Images load from URL would be compressed. This would speed up loading GIF and large images
          from URL.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Performance Tweaks</div>
        <small>18 Apr 2016</small>
        <p>
          Server will now cache some search results. Search results would be cached for 5-30
          minutes. The better the search results, the longer the results would be cached.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Updated Chrome Extension</div>
        <small>8 Apr 2016</small>
        <p>
          Once the image completes loading, it would search automatically. You can change the
          setting in Chrome Extension. Also see how you can search in Firefox in{" "}
          <a href="/faq">FAQ</a>.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added index cache status</div>
        <small>7 Apr 2016</small>
        <p>
          You can now see how much data is cached in RAM from About page. The higher the percentage
          faster the search. It usually stays around 33% due to limited RAM.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Incorrect timestamp issue identified</div>
        <small>6 Apr 2016</small>
        <p>
          There has been some incorrect timestamp in search results due to image analyze scripts
          parsing outputs of ffmpeg incorrectly. The script has been updated now. From now on new
          animes should have a correct timestamp, while it would take at about two months to fix
          already indexed animes. The new script is also 33% faster when indexing anime.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Fixes some image editing issue</div>
        <small>10 Mar 2016</small>
        <p>Image would sometimes gone black when clicking fit / flip button. Now fixed.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added Fit Width / Height option</div>
        <small>6 Mar 2016</small>
        <p>
          You can now choose to Fit Width / Height for your search image. Also fixed some flickering
          issue on previews.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Fixed some Image URL issue</div>
        <small>3 Mar 2016</small>
        <p>Fixed some cross-site image URL linking issue. Most image URL should load now.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>New Anime Info Panel UI</div>
        <small>1 Mar 2016</small>
        <p>A better layout for more Anime information.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added Image URL Option</div>
        <small>1 Mar 2016</small>
        <p>You can now search by Image URL</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added Safe Search Option</div>
        <small>28 Feb 2016</small>
        <p>
          The Safe Search Option can hide most Hentai Anime from search result. But you should aware
          that some regular season Animes can still be obscene. (NSFW)
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Try the Chrome Extension</div>
        <small>28 Feb 2016</small>
        <p>
          Now you can use the{" "}
          <a href="https://chrome.google.com/webstore/detail/search-anime-by-screensho/gkamnldpllcbiidlfacaccdoadedncfp">
            Chrome Extension
          </a>{" "}
          to search.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added some Heitai Anime</div>
        <small>28 Feb 2016</small>
        <p>About 168 Heitai Anime series has been added.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added sample screenshot in FAQ</div>
        <small>28 Feb 2016</small>
        <p>
          To help users to understand how the search engine works, we have added some good and bad
          screenshots in <a href="/faq">FAQ</a>.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Performance Improvement</div>
        <small>21 Feb 2016</small>
        <p>Improved caching method to warmup cold data.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>More fixes</div>
        <small>20 Feb 2016</small>
        <p>
          Database has been cleaned up and reloaded. This should fix most video previews. Fixed some
          anime titles still being null.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Bug Fix</div>
        <small>17 Feb 2016</small>
        <p>
          Fixed the empty search result. The issue has been resolved. A large number of files has
          been relocated, video preview may be missing for some search results.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Improved Performance</div>
        <small>01 Jan 2016</small>
        <p>
          Increased cache size to improve performance when the server has been idle for a long time.
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Added a Flip Button</div>
        <small>31 Dec 2015</small>
        <p>
          You may now flip the image before searching. If you can't find a match, try to flip your
          image and search again. (Especially useful for AMV)
        </p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Search Algorithm Changed</div>
        <small>21 Dec 2015</small>
        <p>Switched to use a new searching algorithm. The search is slower but more accurate.</p>
      </div>
      <div className={section}>
        <div className={sectionHeader}>Public Beta</div>
        <small>19 Dec 2015</small>
        <p>Adding some informative pages.</p>
      </div>
      <p>&nbsp;</p>
    </div>
  </Layout>
);
export default News;
