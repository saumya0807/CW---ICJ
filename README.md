# ICJ Interactive Walkthrough

A click-through simulation of Cambridge Wealth's ideal customer journey. Not a real
dashboard &mdash; a walkthrough people tap through to feel what a prospective or
existing client's path looks like across entry points (search, social, referral,
calls, the app).

## Status: scaffold only

Done in this pass:

- Vite + React project, brand-styled (bg `#111213`, gold `#C9A84C`, DM Sans).
- `src/data.js` &rarr; `getPages()`: the single data-access seam. Fetches the
  published Google Sheet CSV at runtime and parses it with PapaParse. Nav, page
  render and CTA buttons will all consume its output and never touch the network
  or CSV format themselves.
- `src/config.js`: the CSV URL and media base path &mdash; the only things to
  change to repoint the walkthrough.
- Bare-bones `App.jsx` that verifies the pipeline (loads the sheet, reports row
  and Meta Section counts).

Not built yet: left nav, entry-page render, CTA navigation, media cycling,
breadcrumb / "start over", `?page=` URL state, device-frame media chrome.

## Run locally

```bash
npm install
npm run dev
```

## Data source

Content lives in a Google Sheet published to the web as CSV
(File &rarr; Share &rarr; Publish to web &rarr; CSV). Editing rows updates the
live app with no redeploy. The URL is in [`src/config.js`](src/config.js).

One row per page. Columns: `ID`, `Meta Section`, `Event Name`, `Entry Point`
(Y/N), `Details`, `Media` (bare filenames separated by `|`), `CTA1`&hellip;`CTA7`
(each the `ID` of another row).

## Media assets

Image files go in [`public/media/`](public/media/) and are committed to the repo,
not stored in the sheet. The sheet's `Media` column holds bare filenames
(`gmb1.png`); the app prepends `/media/`. Adding a genuinely new image needs a
commit + redeploy; text and flow changes are instant via the sheet.

## Deploy (Vercel)

Zero-config &mdash; Vercel auto-detects Vite (`npm run build` &rarr; `dist/`).
Import the repo in Vercel once; each `git push` auto-deploys.
