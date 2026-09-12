# AGENTS.md

## Project Overview

**trace.moe-www** is the official web frontend for [trace.moe](https://trace.moe) (anime scene search engine). Built with Next.js and React, it enables users to search anime scenes by image upload, URL, drag-and-drop, or video/image clipboard pasting, preview video clips, inspect AniList metadata, and manage account search quotas.

### Core Tech Stack

- **Framework**: Next.js (Pages Router) + React 19
- **Language**: TypeScript & JavaScript
- **Visual Descriptor Extraction**: `trace.moe-id` (client-side in-browser border cropping and 33-element MPEG-7 Color Layout Descriptor extraction)
- **Data Visualization**: Native SVG Charts
- **Code Quality & Formatting**: `oxlint`, `oxfmt`

---

## Directory Structure

```
├── pages/                       # Next.js page components & API routes
│   ├── _app.tsx                 # Root application wrapper
│   ├── index.tsx                # Main scene search page
│   ├── about.tsx                # About & database inspection page
│   ├── account.tsx              # Account settings & quota usage charts
│   ├── login.tsx                # User authentication & API key login
│   ├── faq.tsx                  # Frequently asked questions
│   ├── terms.tsx                # Terms of service & privacy policy
│   ├── 404.tsx                  # Not found fallback page
│   └── api/                     # Next.js API routes (e.g. image-proxy)
├── components/                  # Reusable React components (Player, Info, Auth, Layout)
├── styles/                      # CSS modules & global style sheets
├── public/                      # Static public assets (icons, service worker for PWA)
├── lib/                         # Client-side helper utilities
├── image-proxy.js               # Standalone image proxy server
├── ao.js                        # Cloudflare Worker proxy integration
├── Dockerfile                   # Production container definition
├── wrangler.toml                # Cloudflare Worker configuration
├── package.json                 # Project configuration, dependencies, and scripts
├── tsconfig.json                # TypeScript compiler configuration
├── .oxfmtrc.json                # oxfmt code formatter configuration
├── README.md                    # Project overview & running instructions
├── CHANGELOG.md                 # Project version history
├── LICENSE                      # MIT License
├── SECURITY.md                  # Security policy
└── CODE_OF_CONDUCT.md           # Contributor Covenant Code of Conduct
```

---

## Command Reference

| Action                 | Command               | Notes                                            |
| :--------------------- | :-------------------- | :----------------------------------------------- |
| **Development Server** | `npm run dev`         | Starts Next.js dev server                        |
| **Build App**          | `npm run build`       | Compiles TypeScript & static export via Next.js  |
| **Start Production**   | `npm start`           | Starts Next.js production server                 |
| **Build & Start**      | `npm run build-start` | Compiles and starts production server            |
| **Format Code**        | `npm run format`      | Formats all project files in-place using `oxfmt` |
| **Lint**               | `npm run lint`        | Checks code using `oxlint`                       |
| **Lint & Fix**         | `npm run lint:fix`    | Automatically fixes lint issues with `oxlint`    |
| **Test & Verify**      | `npm test`            | Runs `oxfmt --check` and `oxlint`                |

---

## Coding & Operational Guidelines

### 1. In-Browser Feature Extraction

- Images submitted via file upload, drag-and-drop, or paste are processed client-side:
  - Letterbox/pillarbox borders are trimmed on an HTML5 `<canvas>`.
  - The 33-element MPEG-7 Color Layout Descriptor vector is computed in the browser using `trace.moe-id`.
  - Only the compact precomputed vector is transmitted to the backend API (`/search`), preserving user bandwidth and privacy.

### 2. Next.js & React Conventions

- Next.js uses the Pages Router (`pages/`).
- Shared layout components reside in `components/layout.tsx` and UI modules in `components/`.
- Styling is implemented using CSS Modules (`styles/*.module.css`).

### 3. Verification Workflow

Before committing changes, ensure formatting and linting pass:

```bash
npm test
```
