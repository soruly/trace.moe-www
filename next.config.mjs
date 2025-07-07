import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

const NEXT_PUBLIC_API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

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
                { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
                { key: "Referrer-Policy", value: "no-referrer" },
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                  key: "Content-Security-Policy",
                  value: [
                    "default-src 'none'",
                    "script-src 'self' 'unsafe-eval' static.cloudflareinsights.com",
                    "style-src * 'self' 'unsafe-inline'",
                    `img-src * 'self' data: blob: ${NEXT_PUBLIC_API_ENDPOINT}`,
                    "font-src 'self'",
                    `media-src blob: 'self' ${NEXT_PUBLIC_API_ENDPOINT}`,
                    "worker-src 'self'",
                    "form-action 'self'",
                    "base-uri 'none'",
                    "frame-ancestors 'none'",
                    "manifest-src 'self'",
                    "block-all-mixed-content",
                    `connect-src blob: 'self' https://cloudflareinsights.com ${NEXT_PUBLIC_API_ENDPOINT}`,
                  ].join("; "),
                },
              ],
            },
          ];
        },
      };
