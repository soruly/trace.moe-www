import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
const NEXT_PUBLIC_MEDIA_ENDPOINT = process.env.NEXT_PUBLIC_MEDIA_ENDPOINT;
const NEXT_PUBLIC_ANILIST_ENDPOINT =
  process.env.NEXT_PUBLIC_ANILIST_ENDPOINT || "https://graphql.anilist.co";

export default (phase) =>
  phase === PHASE_PRODUCTION_BUILD
    ? { output: "export" }
    : {
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
                { key: "X-XSS-Protection", value: "1; mode=block" },
                {
                  key: "Content-Security-Policy",
                  value: [
                    "default-src 'self'",
                    "script-src 'self' 'unsafe-eval' static.cloudflareinsights.com",
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
                    `connect-src blob: 'self' https://cloudflareinsights.com ${NEXT_PUBLIC_API_ENDPOINT} ${NEXT_PUBLIC_MEDIA_ENDPOINT} ${NEXT_PUBLIC_ANILIST_ENDPOINT}`,
                  ].join("; "),
                },
              ],
            },
          ];
        },
      };
