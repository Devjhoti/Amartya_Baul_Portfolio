# /public/fonts — Satoshi (self-hosted)

`app/layout.js` loads the body face from this folder via `next/font/local`.
The build **fails** if these two files are missing:

| File | Weight | Used for |
|---|---|---|
| `Satoshi-Regular.woff2` | 400 | body text |
| `Satoshi-Medium.woff2` | 500 | buttons, nav, emphasised UI |

## Getting the files

Either run the fetch script from the repo root:

```bash
npm run fetch-fonts
```

…or download manually from <https://www.fontshare.com/fonts/satoshi> (free
download, no account), unzip, and copy `Satoshi-Regular.woff2` and
`Satoshi-Medium.woff2` from `Satoshi_Complete/Fonts/WEB/fonts/` into this
folder with exactly those names.

Only these two weights ship. No italics, no variable file — the site uses
400/500 only (PRD §3.4). Satoshi is free for commercial use under the
ITF Free Font License; self-hosting is permitted and required here
(no third-party font CDN in the render path, PRD §8.4).

Archivo and Martian Mono are **not** in this folder — they come through
`next/font/google`, which self-hosts them automatically at build time.
