addEventListener("fetch", async (event) => {
  event.respondWith(handleRequest(event.request));
});

const errorResponse = (errorMessage) =>
  new Response(errorMessage, {
    status: 400,
    statusText: "Bad Request",
  });

const handleRequest = async (originalRequest) => {
  if (originalRequest.headers.get("referrer")) {
    return new Response("Forbidden", {
      status: 403,
      statusText: "Forbidden",
    });
  }

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

  if (imageURL.protocol !== "http:" && imageURL.protocol !== "https:") {
    return errorResponse("Error: Protocol must be http or https");
  }

  if (isPrivateIP(imageURL.hostname)) {
    return errorResponse("Error: Forbidden URL");
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
      }),
    );
    if (response.status === 200) {
      const ogImageURL = await getOgImageFromStream(webResponse);

      if (ogImageURL && ogImageURL.match(/^https?:\/\//)) {
        response = await fetch(
          new Request(ogImageURL, {
            redirect: "follow",
            headers: {
              referer: imageURL.origin,
            },
          }),
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

  const res = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
  res.headers.set("Access-Control-Allow-Origin", "https://trace.moe");
  return res;
};

const getOgImageFromStream = async (response) => {
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let match;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value;
      match = buffer.match(/<(?=[^<]*?"og:image")[^<]*?content="([^"]*?)"[^<]*?>/);
      if (match) break;
      if (buffer.length > 65536) break;
    }
  } catch (e) {
  } finally {
    reader.cancel();
  }
  return match?.[1];
};

const isPrivateIP = (hostname) => {
  // IPv4
  const ipv4 = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (ipv4) {
    const [_, a, b, c, d] = ipv4.map(Number);
    // 127.0.0.0/8 (Loopback)
    // 10.0.0.0/8 (Private)
    // 172.16.0.0/12 (Private)
    // 192.168.0.0/16 (Private)
    // 169.254.0.0/16 (Link-local)
    // 0.0.0.0/8 (Current network)
    if (
      a === 127 ||
      a === 10 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254) ||
      a === 0
    ) {
      return true;
    }
  }

  // IPv6
  const ipv6 = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  // ::1 (Loopback)
  // fc00::/7 (Unique Local)
  // fe80::/10 (Link-local)
  if (ipv6 === "::1" || ipv6.match(/^f[cd]/) || ipv6.match(/^fe[89ab]/)) return true;

  return false;
};
