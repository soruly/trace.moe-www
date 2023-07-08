self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // incoming POST request for PWA share_target
  if (event.request.method === "POST" && url.origin === self.origin && url.pathname === "/") {
    event.respondWith(
      (async () => {
        const req = event.request.clone();
        try {
          const formData = await event.request.formData();
          const file = formData.get("image");

          const headers = new Headers();
          headers.set("Content-Type", file.type);
          const response = new Response(file.stream(), { headers });
          const cache = await caches.open("cache");
          cache.put(new Request("/temp.image"), response);

          return Response.redirect(`${event.request.url}?url=${event.request.url}temp.image`, 302);
        } catch (e) {
          return fetch(req);
        }
      })(),
    );
  }
  if (
    event.request.method === "GET" &&
    url.origin === self.origin &&
    url.pathname === "/temp.image"
  ) {
    event.respondWith(caches.match(event.request));
  }

  return;
});
