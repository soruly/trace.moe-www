addEventListener("fetch", async (event) => {
  event.respondWith(handleRequest(event.request));
});

const errorResponse = (errorMessage) =>
  new Response(errorMessage, {
    status: 400,
    statusText: "Bad Request",
  });

const handleRequest = async (originalRequest) => {
  let originalURL = new URL(originalRequest.url);
  if (!originalURL.searchParams.get("url")) {
    return errorResponse("Error: Cannot get url from param");
  }

  let imageURL = null;
  try {
    imageURL = new URL(originalURL.searchParams.get("url"));
  } catch (e) {}
  if (!imageURL) {
    return errorResponse("Error: Invalid URL string");
  }

  let imageRequest = new Request(imageURL, {
    redirect: "follow",
    headers: {
      referer: imageURL.origin,
    },
  });

  let response = await fetch(imageRequest, {
    cf: {
      polish: "lossy",
    },
  });

  if (response.status >= 400) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  if (
    response.headers.get("Content-Type").toLowerCase() !== "application/octet-stream" &&
    !["image", "video"].includes(response.headers.get("Content-Type").split("/")[0].toLowerCase())
  ) {
    // retry as bot to get og:image
    let webResponse = await fetch(
      new Request(imageURL, {
        redirect: "follow",
        headers: {
          referer: imageURL.origin,
          "User-Agent": "googlebot",
        },
      })
    );
    if (response.status === 200) {
      const ogImageURL = (await webResponse.text())
        ?.match(/<[^<]+?"og:image".*?>/, "$1")?.[0]
        ?.match(/content="(.*?)"/, "$1")?.[1];

      if (ogImageURL && ogImageURL.match(/^https?:\/\//)) {
        response = await fetch(
          new Request(ogImageURL, {
            redirect: "follow",
            headers: {
              referer: imageURL.origin,
            },
          })
        );
        if (response.status >= 400) {
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          });
        }
      }
    }
  }
  if (
    response.headers.get("Content-Type").toLowerCase() !== "application/octet-stream" &&
    !["image", "video"].includes(response.headers.get("Content-Type").split("/")[0].toLowerCase())
  ) {
    return errorResponse("Error: Content-Type is not image or video or application/octet-stream");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};
