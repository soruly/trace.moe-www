# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.x] - Unversioned

### Added

- In-browser visual descriptor extraction using `trace.moe-id`:
  - Client-side letterbox/pillarbox border cropping (`cutBorders`).
  - Client-side 33-element Color Layout Descriptor extraction transmitted via query string.
  - Image vector visualization as placeholder.
- Interactive quota meter and 24-hour quota countdown.
- Feature hash inspection.
- Upgraded to React 19 and Next.js 16 (Turbopack).
- Code quality and formatting tooling with `oxlint` and `oxfmt`.
- Support for PWA share target via service worker (`public/sw.js`).
- Standalone image proxy (`image-proxy.js`) with SSRF and private IP protection.

### Changed

- Upgraded TypeScript to v7.
- Replaced Prettier with Oxfmt.

## [2.0.0] - 2021-05-20

- Rewrite from express ejs to Next.js with TypeScript.

## [1.0.0] - 2021-02-13

### Added

- Initial release.
