import "dotenv/config.js";
import path from "path";
import express from "express";
import rateLimit from "express-rate-limit";
import bodyParser from "body-parser";
import multer from "multer";
import me from "./api/me.js";
import search from "./api/search.js";
import status from "./api/status.js";
import child_process from "child_process";

const { SERVER_PORT, SERVER_ADDR } = process.env;

const rev = child_process.execSync("git rev-parse --short HEAD").toString().trim();

const app = express();

app.disable("x-powered-by");

app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, x-trace-secret");
  res.set("Referrer-Policy", "no-referrer");
  res.set("X-Content-Type-Options", "nosniff");
  res.set(
    "Content-Security-Policy",
    [
      "default-src 'none'",
      "script-src 'self' www.google-analytics.com static.cloudflareinsights.com",
      "style-src * 'self' 'unsafe-inline'",
      "img-src * 'self' data: blob: media.trace.moe",
      "font-src 'self'",
      "frame-src www.youtube-nocookie.com www.youtube.com www.google.com",
      "media-src blob: 'self' media.trace.moe",
      "form-action 'self'",
      "base-uri 'none'",
      "frame-ancestors 'none'",
      "manifest-src 'self'",
      "block-all-mixed-content",
      "connect-src blob: 'self' api.trace.moe media.trace.moe www.google-analytics.com stats.g.doubleclick.net",
    ].join("; ")
  );
  next();
});

app.use(
  rateLimit({
    max: 600, // 60 requests per IP address (per node.js process)
    windowMs: 60 * 1000, // per 1 minute
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const upload = multer({ storage: multer.memoryStorage() });

app.set("view engine", "ejs");

const pushAssets = [
  `</css/style.css?${rev}>; rel=preload; as=style`,
  `</css/bootstrap.min.css?${rev}>; rel=preload; as=style`,
  `</js/analytics.js?${rev}>; rel=preload; as=script`,
];

app.get("/", (req, res) => {
  let ogImage = "https://trace.moe/favicon128.png";
  if (req.query.url) {
    try {
      ogImage = new URL(req.query.url);
    } catch (e) {}
  }

  let imageURL = "";
  let originalImage = "";
  if (req.query.url) {
    try {
      imageURL = new URL(req.query.url);
      originalImage = `https://trace.moe/image-proxy?url=${encodeURIComponent(imageURL)}`;
    } catch (e) {}
  }

  res.header("Link", [
    `</css/index.css?${rev}>; rel=preload; as=style`,
    `</js/index.js?${rev}>; rel=preload; as=script`,
    `</js/info.js?${rev}>; rel=preload; as=script`,
    "</fonts/glyphicons-halflings-regular.woff>; rel=preload; as=font; crossorigin",
    ...pushAssets,
  ]);
  res.render("index", {
    ogImage,
    originalImage,
    imageURL,
    rev,
  });
});

app.get("/about", (req, res) => {
  res.header("Link", [`</js/status.js?${rev}>; rel=preload; as=script`, ...pushAssets]);
  res.render("about", { rev });
});

app.get("/changelog", (req, res) => {
  res.header("Link", pushAssets);
  res.render("changelog", { rev });
});

app.get("/faq", (req, res) => {
  res.header("Link", pushAssets);
  res.render("faq", { rev });
});

app.get("/terms", (req, res) => {
  res.header("Link", pushAssets);
  res.render("terms", { rev });
});

app.get("/api/me", me);

app.all("/api/search", upload.single("image"), search);

app.get("/api/status", status);

app.use(express.static(path.resolve("static")));

app.listen(SERVER_PORT, SERVER_ADDR, () =>
  console.log(`Web server listening on port ${SERVER_PORT}`)
);
