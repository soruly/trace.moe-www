self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // incoming POST request for PWA share_target
  if (event.request.method === "POST" && url.pathname === "/") {
    event.respondWith(
      (async () => {
        const request = new Request("/");
        const res = await fetch(request);
        const formData = await event.request.formData();
        // if (!formData) return res;
        const file = formData.get("image");

        const headers = new Headers();
        headers.set("Content-Type", file.type);
        const response = new Response(file.stream(), { headers });
        const cache = await caches.open("cache");
        cache.put(new Request("/temp.image"), response);

        return Response.redirect(`${event.request.url}?url=${event.request.url}temp.image`, 302);
      })()
    );
  }
  if (event.request.method === "GET" && url.pathname === "/temp.image") {
    event.respondWith(caches.match(event.request));
  }

  return;
});
