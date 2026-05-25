export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = "https://www.animeoshi.com/api/anime/v1/anime/external" + url.search;
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: { "x-api-key": env.ANIMEOSHI_API_KEY },
      body: request.body,
      redirect: "manual",
    });

    try {
      const response = await fetch(proxyRequest);
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("Access-Control-Allow-Origin", "*");
      responseHeaders.set("Access-Control-Allow-Methods", "GET, OPTIONS");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      return new Response("Proxy Error: Unable to reach the target API.", { status: 502 });
    }
  },
};
