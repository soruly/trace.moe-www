if (document.querySelector(".alert")) {
  document.querySelector(".alert").onclick = () => {
    document.querySelector(".alert").style.display = "none";
  };
}

const updateURLParam = () => {
  if (document.querySelector(".image-url").value) {
    history.replaceState(
      null,
      null,
      `/?url=${encodeURIComponent(document.querySelector(".image-url").value.replace(/ /g, "%20"))}`
    );
  } else {
    history.replaceState(null, null, "/");
  }
};

const formatTime = (timeInSeconds) => {
  const sec_num = parseInt(timeInSeconds, 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;
  return [
    hours < 10 ? `0${hours}` : hours,
    minutes < 10 ? `0${minutes}` : minutes,
    seconds < 10 ? `0${seconds}` : seconds,
  ].join(":");
};

const zeroPad = (n, width) => {
  if (n.length === undefined) {
    return n.toString();
  }
  return n.length >= width
    ? n.toString()
    : new Array(width - n.toString().length + 1).join("0") + n;
};

const player = document.querySelector(".player");
const preview = document.querySelector(".preview");
const originalImage = document.querySelector("#originalImage");

originalImage.onload = () => {
  document.querySelector(".wrap").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".wrap").style.opacity = 1;
  }, 0);
  document.querySelector(".search-bar").classList.add("ready");
  if (document.querySelector(".drop-target")) {
    document.querySelector(".drop-target").remove();
  }
  resetAll();
  // clear the input if user upload/paste image
  if (/^blob:/.test(originalImage.src)) {
    document.querySelector(".image-url").value = "";
  }
  // updateURLParam();
  prepareSearchImage();
};

window.addEventListener("load", (event) => {
  if (originalImage.dataset.url) {
    startLoadImage(originalImage.dataset.url);
  } else {
    document.querySelector(".search-bar").style.opacity = 1;
  }
});

let imgData;
const search = async () => {
  document.querySelector(".loading").style.display = "block";
  document.querySelector(".loader").classList.add("ripple");
  document.querySelector(".sound-btn").classList.remove("icon-volume-up");
  document.querySelector(".sound-btn").classList.remove("icon-volume-off");
  document.querySelector(".sound-btn").classList.add("icon-volume-off");
  player.volume = 0;
  player.muted = true;

  document.querySelectorAll(".result-list > div:not(.search-image)").forEach((each) => {
    each.remove();
  });

  document.querySelector(".file-name-display").innerText = "";
  document.querySelector(".time-code-display").innerText = "";

  resetInfo();
  animeInfo = null;
  document.querySelector(".player").pause();
  preview.removeEventListener("click", playPause);
  document.querySelector(".search-btn").disabled = true;
  document.querySelector(".image-url").disabled = true;
  document.querySelector(".anilist-filter").disabled = true;

  document.querySelector(".message-text").innerText = "Searching...";

  const startSearchTime = performance.now();

  const formData = new FormData();
  formData.append("image", imgData);
  const queryString = [
    document.querySelector(".cut-borders-btn .icon").classList.contains("icon-check")
      ? "cutBorders=1"
      : "cutBorders=",
    document.querySelector(".anilist-filter").value
      ? `anilistID=${document.querySelector(".anilist-filter").value}`
      : "anilistID=",
  ].join("&");
  const res = await fetch(`https://api.trace.moe/search?${queryString}`, {
    method: "POST",
    body: formData,
  });

  document.querySelector(".search-btn").disabled = false;
  document.querySelector(".image-url").disabled = false;
  document.querySelector(".anilist-filter").disabled = false;

  document.querySelector(".loading").style.display = "none";
  document.querySelector(".loader").classList.remove("ripple");
  document.querySelector(".search-btn").disabled = false;
  document.querySelector(".image-url").disabled = false;
  document.querySelector(".anilist-filter").disabled = false;

  if (res.status === 429) {
    document.querySelector(".message-text").innerText =
      "You searched too many times, please try again later.";
    return;
  }
  if (res.status !== 200) {
    document.querySelector(".message-text").innerText = "Failed to connect server.";
    return;
  }
  const { frameCount, result } = await res.json();

  document.querySelector(".message-text").innerHTML = `Searched ${frameCount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} frames in ${(
    (performance.now() - startSearchTime) /
    1000
  ).toFixed(2)}s`;

  if (result.length === 0) {
    document.querySelector(".message-text").innerText = "Cannot find any result";
    return;
  }

  result.slice(0, 5).forEach((entry, index) => {
    const result = document.querySelector("#template").content.firstElementChild.cloneNode(true);

    result.classList.add("result");
    if (entry.anilist.isAdult) {
      result.classList.add("hidden");
    }

    result.querySelector(".title").innerText =
      entry.anilist.title.native || entry.anilist.title.romaji;
    if (entry.episode) {
      result.querySelector(".ep").innerText = `Episode ${zeroPad(entry.episode, 2)}`;
    }
    if (formatTime(entry.from) === formatTime(entry.to)) {
      result.querySelector(".time").innerText = formatTime(entry.from);
    } else {
      result.querySelector(".time").innerText = `${formatTime(entry.from)} - ${formatTime(
        entry.to
      )}`;
    }
    result.querySelector(".similarity").innerText = `~${(entry.similarity * 100).toFixed(
      2
    )}% Similarity`;
    result.querySelector("video").src = `${entry.video}&size=s`;
    result.querySelector("video").poster = `${entry.image}&size=s`;
    result.querySelector("video").muted = true;

    const opacity =
      Math.pow(entry.similarity, 4) + 0.3 > 1 ? 1 : Math.pow(entry.similarity, 4) + 0.3;
    // result.style.opacity = opacity > 1 ? 1 : opacity;

    result.addEventListener("click", (e) => {
      playfile(result, entry.video, entry.filename, entry.anilist.id, entry.from);
    });

    document.querySelector(".result-list").appendChild(result);
    setTimeout((e, o) => {
      result.style.opacity = opacity;
    }, index * 150);
    // result.style.opacity = opacity > 1 ? 1 : opacity;
  });

  if (result.slice(0, 5).find((e) => e.anilist.isAdult)) {
    const nswfMsg = document.createElement("div");
    nswfMsg.style.textAlign = "center";
    const showNSFWBtn = document.createElement("button");
    showNSFWBtn.type = "button";
    showNSFWBtn.classList.add("btn", "btn-default", "btn-sm", "btn-primary");
    showNSFWBtn.innerText = `Click here to show ${
      result.slice(0, 5).filter((e) => e.anilist.isAdult).length
    } NSFW results`;
    showNSFWBtn.addEventListener("click", () => {
      document.querySelectorAll(".result.hidden").forEach((e) => e.classList.remove("hidden"));
      showNSFWBtn.remove();
    });
    nswfMsg.appendChild(showNSFWBtn);
    document.querySelector(".result-list").appendChild(nswfMsg);
  }

  if (!document.querySelectorAll(".result")[0].classList.contains("hidden")) {
    document.querySelectorAll(".result")[0].click();
  }
};

document.querySelector(".search-btn").addEventListener("click", search);

const startLoadImage = (src) => {
  document.querySelector(".search-bar").classList.add("ready");
  originalImage.src = src;
};

let fetchImageDelay;

document.querySelector(".image-url").addEventListener("input", function () {
  clearTimeout(fetchImageDelay);
  if (document.querySelector(".image-url").value.length) {
    if (document.querySelector("form").checkValidity()) {
      fetchImageDelay = setTimeout(function () {
        startLoadImage(
          `https://trace.moe/image-proxy?url=${encodeURIComponent(
            document.querySelector(".image-url").value.replace(/ /g, "%20")
          )}`
        );
        history.replaceState(
          null,
          null,
          "/?url=" +
            encodeURIComponent(document.querySelector(".image-url").value.replace(/ /g, "%20"))
        );
      }, 10);
    } else {
      document.querySelector("input[type=submit]").click();
    }
  }
});

document.querySelector(".sound-btn").addEventListener("click", () => {
  document.querySelector(".sound-btn").classList.toggle("icon-volume-up");
  document.querySelector(".sound-btn").classList.toggle("icon-volume-off");
  if (document.querySelector(".sound-btn").classList.contains("icon-volume-up")) {
    player.volume = 1;
    player.muted = false;
  } else {
    player.volume = 0;
    player.muted = true;
  }
});

document.querySelector(".cut-borders-btn").addEventListener("click", () => {
  document.querySelector(".cut-borders-btn .icon").classList.toggle("icon-cross");
  document.querySelector(".cut-borders-btn .icon").classList.toggle("icon-check");
});

let drawVideoPreview = function () {
  preview_heartbeat = window.requestAnimationFrame(drawVideoPreview);
  if (preview.getContext("2d")) {
    preview.getContext("2d").drawImage(player, 0, 0, preview.width, preview.height);
  }
};

preview.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

let preview_heartbeat;
let time;
let animeInfo = null;
let playfile = async (target, videoURL, fileName, anilistID, timeCode) => {
  [].forEach.call(document.querySelectorAll(".result"), function (result) {
    result.classList.remove("active");
  });

  target.classList.add("active");
  document.querySelector(".player").pause();
  window.cancelAnimationFrame(preview_heartbeat);

  document.querySelector(".player-info").style.opacity = 0;
  if (animeInfo !== anilistID) {
    animeInfo = anilistID;
    resetInfo();
    showAnilistInfo(anilistID);
    document.querySelector(".player-info").style.display = "flex";
    document.querySelector(".player-control").style.display = "block";
    document.querySelector(".info-pane").style.maxHeight = "800px";
  }

  document.querySelector(".loading").style.display = "block";
  document.querySelector(".loader").classList.add("ripple");
  let response = await fetch(`${videoURL}&size=l`);
  document.querySelector(".player").src = URL.createObjectURL(await response.blob());
  let duration = response.headers.get("x-video-duration");

  document.querySelector(".file-name-display").innerText = fileName;
  document.querySelector(".time-code-display").innerText = `${formatTime(timeCode)} / ${formatTime(
    duration
  )}`;
  let left = (parseFloat(timeCode) / parseFloat(duration)) * 640 - 6;

  document.querySelector(".player-info").style.opacity = 1;
  document.querySelector(".player-control").style.opacity = 1;
  document.querySelector(".progress-bar-control").style.left = left + "px";
};

let playPause = function () {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
};

let loadedmetadata = function () {
  let aspectRatio;

  if (player.height === 0 && player.width === 0) {
    aspectRatio = player.videoWidth / player.videoHeight;
  } else {
    aspectRatio = player.width / player.height;
  }

  preview.width = 640;
  preview.height = 640 / aspectRatio;
  document.querySelector(".drop-effect").style.height = preview.height - 10 + "px";
  document.querySelector(".loading").style.height = preview.height + "px";
  document.querySelector(".loader").style.top = (preview.height - 800) / 2 + "px";
  preview.addEventListener("click", playPause);
  document.querySelector(".drop-effect").addEventListener("click", playPause);
  player.oncanplaythrough = () => {
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".loader").classList.remove("ripple");
    window.cancelAnimationFrame(preview_heartbeat);
    preview_heartbeat = window.requestAnimationFrame(drawVideoPreview);
  };
  player.play();
};

document.querySelector(".player").addEventListener("loadedmetadata", loadedmetadata, false);

let searchImage = document.createElement("canvas");

let resetAll = function () {
  preview.width = 640;
  preview.height = 360;
  document.querySelector(".sound-btn").classList.remove("icon-volume-up");
  document.querySelector(".sound-btn").classList.remove("icon-volume-off");
  document.querySelector(".sound-btn").classList.add("icon-volume-off");
  player.volume = 0;
  player.muted = true;

  document.querySelector(".file-name-display").innerText = "";
  document.querySelector(".time-code-display").innerText = "";
  document.querySelector(".player-info").style.display = "none";
  document.querySelector(".player-control").style.display = "none";
  document.querySelector(".drop-effect").style.height = preview.height - 10 + "px";
  document.querySelector(".loading").style.height = preview.height + "px";
  document.querySelector(".loader").style.top = (preview.height - 800) / 2 + "px";
  preview.getContext("2d").fillStyle = "#FFFFFF";
  preview.getContext("2d").fillRect(0, 0, preview.width, preview.height);
  document.querySelectorAll(".result-list > div:not(.search-image)").forEach((each) => {
    each.remove();
  });
  resetInfo();
  document.querySelector(".player").pause();
  preview.removeEventListener("click", playPause);
  window.cancelAnimationFrame(preview_heartbeat);
};

originalImage.onerror = function () {
  document.querySelector(".message-text").innerText = "Failed to load search image";
};

let prepareSearchImage = function () {
  let img = originalImage;
  let imageAspectRatio = img.width / img.height;

  document.querySelector("#originalImage").style.transform = `scale(${160 / img.width})`;
  document.querySelector(".query-image").style.height = `${160 / imageAspectRatio}px`;

  searchImage.width = 640;
  searchImage.height = 640 / imageAspectRatio;

  searchImage
    .getContext("2d")
    .drawImage(img, 0, 0, img.width, img.height, 0, 0, searchImage.width, searchImage.height);

  preview.height = searchImage.height;
  document.querySelector(".drop-effect").style.height = preview.height - 10 + "px";
  document.querySelector(".loading").style.height = preview.height + "px";
  document.querySelector(".loader").style.top = (preview.height - 800) / 2 + "px";

  preview.getContext("2d").drawImage(searchImage, 0, 0, searchImage.width, searchImage.height);

  searchImage.toBlob(
    function (blob) {
      imgData = blob;
      search();
    },
    "image/jpeg",
    80
  );
};

let handleFileSelect = function (evt) {
  evt.stopPropagation();
  evt.preventDefault();

  let file;

  if (evt.dataTransfer) {
    file = evt.dataTransfer.files[0];
  } else {
    file = evt.target.files[0];
  }

  if (file) {
    if (file.type.match("image.*")) {
      if (document.querySelector(".drop-target")) {
        document.querySelector(".drop-target").classList.remove("dropping");
        document.querySelector(".drop-target").innerText = "";
      }
      if (document.querySelector(".drop-effect")) {
        document.querySelector(".drop-effect").classList.remove("dropping");
      }
      URL.revokeObjectURL(originalImage.src);
      startLoadImage(URL.createObjectURL(file));
    } else {
      if (document.querySelector(".drop-target")) {
        document.querySelector(".drop-target").innerText = "Error: File is not an image";
      }
      if (document.querySelector(".drop-effect")) {
        document.querySelector(".drop-effect").innerText = "Error: File is not an image";
      }
      return false;
    }
  }
};

const dropZone = document.querySelector(".drop-target");
dropZone.addEventListener("drop", handleFileSelect, false);
dropZone.addEventListener(
  "dragover",
  (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
  },
  false
);
dropZone.addEventListener(
  "dragenter",
  (e) => {
    document.querySelector(".drop-target").classList.add("dropping");
    document.querySelector(".drop-target").innerText = "Drop image here";
  },
  false
);
dropZone.addEventListener(
  "dragleave",
  (e) => {
    document.querySelector(".drop-target").classList.remove("dropping");
  },
  false
);

const dropZone2 = document.querySelector(".drop-effect");
dropZone2.addEventListener("drop", handleFileSelect, false);
dropZone2.addEventListener(
  "dragover",
  (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
  },
  false
);
preview.addEventListener(
  "dragenter",
  (e) => {
    document.querySelector(".drop-effect").classList.add("dropping");
  },
  false
);
dropZone2.addEventListener(
  "dragenter",
  (e) => {
    document.querySelector(".drop-effect").classList.add("dropping");
    document.querySelector(".drop-effect").innerText = "Drop image here";
  },
  false
);
dropZone2.addEventListener(
  "dragleave",
  (e) => {
    document.querySelector(".drop-effect").classList.remove("dropping");
  },
  false
);

document.querySelector("input[type=file]").addEventListener("change", handleFileSelect, false);

let CLIPBOARD = new CLIPBOARD_CLASS(preview);

function CLIPBOARD_CLASS(canvas_elm) {
  let _self = this;
  let canvas = canvas_elm;
  let ctx = canvas_elm.getContext("2d");
  let ctrl_pressed = false;
  let pasteCatcher;
  let paste_mode;

  document.addEventListener(
    "paste",
    function (e) {
      _self.paste_auto(e);
    },
    false
  );

  this.init = (function () {
    pasteCatcher = document.createElement("div");
    pasteCatcher.setAttribute("contenteditable", "");
    pasteCatcher.style.cssText = "opacity:0;position:fixed;top:0px;left:0px;";
    document.body.appendChild(pasteCatcher);
    pasteCatcher.addEventListener(
      "DOMSubtreeModified",
      function () {
        if (paste_mode === "auto" || ctrl_pressed === false) {
          return true;
        }
        if (pasteCatcher.children.length === 1) {
          if (pasteCatcher.firstElementChild.src) {
            _self.paste_createImage(pasteCatcher.firstElementChild.src);
          }
        }
        // register cleanup after some time.
        setTimeout(function () {
          pasteCatcher.innerHTML = "";
        }, 20);
      },
      false
    );
  })();
  // default paste action
  this.paste_auto = function (e) {
    if (
      e.target !== document.querySelector(".image-url") &&
      e.target !== document.querySelector(".anilist-filter")
    ) {
      paste_mode = "";
      pasteCatcher.innerHTML = "";

      if (e.clipboardData) {
        let items = e.clipboardData.items;

        if (items) {
          paste_mode = "auto";
          // access data directly
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
              // image
              let blob = items[i].getAsFile();
              let URLObj = window.URL || window.webkitURL;
              let source = URLObj.createObjectURL(blob);

              this.paste_createImage(source);
            }
          }
          e.preventDefault();
        }
      }
    }
  };
  // draw image
  this.paste_createImage = function (source) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let pastedImage = new Image();

    pastedImage.onload = function () {
      ctx.drawImage(pastedImage, 0, 0);
    };
    startLoadImage(source);
  };
}

let resetInfo = function () {
  document.querySelector(".player-control").style.opacity = 0;
  document.querySelector(".info-pane").style.opacity = 0;
  document.querySelector(".info-pane").style.maxHeight = 0;
};

window.onerror = function (message, source, lineno, colno, error) {
  if (error) {
    message = error.stack;
  }
  if (typeof ga === "function") {
    ga("send", "event", "error", message);
  }
};
