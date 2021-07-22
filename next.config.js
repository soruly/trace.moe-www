const { NEXT_PUBLIC_API_ENDPOINT, NEXT_PUBLIC_MEDIA_ENDPOINT } = process.env;
module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, x-trace-secret",
          },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' www.google-analytics.com static.cloudflareinsights.com",
              "style-src * 'self' 'unsafe-inline'",
              `img-src * 'self' data: blob: ${NEXT_PUBLIC_MEDIA_ENDPOINT}`,
              "font-src 'self'",
              "frame-src www.youtube-nocookie.com www.youtube.com www.google.com",
              `media-src blob: 'self' ${NEXT_PUBLIC_MEDIA_ENDPOINT}`,
              "form-action 'self'",
              "base-uri 'none'",
              "frame-ancestors 'none'",
              "manifest-src 'self'",
              "block-all-mixed-content",
              `connect-src blob: 'self' ${NEXT_PUBLIC_API_ENDPOINT} ${NEXT_PUBLIC_MEDIA_ENDPOINT} www.google-analytics.com stats.g.doubleclick.net`,
            ].join("; "),
          },
        ],
      },
    ];
  },
};
