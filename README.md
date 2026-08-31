# ICJ Interactive Walkthrough

A click-through simulation of Cambridge Wealth's ideal customer journey. Not a real
dashboard &mdash; a walkthrough people tap through to feel what a prospective or
existing client's path looks like across entry points (search, social, referral,
calls, the app).

## Status: walkthrough loop working (local)

Built and verified against the stub sheet:

- **Data seam** &mdash; `src/data.js` &rarr; `getPages()`: runtime CSV fetch +
  PapaParse. The only place the app knows where data lives.
- **Left nav** &mdash; one collapsible group per Meta Section, order taken from
  the sheet. Section name teleports to that section's Entry Point row.
- **Page render** &mdash; title, body, CTA row, media.
- **CTA navigation** &mdash; button label is the target row's Event Name, looked
  up automatically. A CTA pointing at an id not in the sheet renders disabled
  ("&hellip; &middot; coming soon").
- **Media cycling** &mdash; click the frame or the side arrows to advance;
  loops. Arrows + counter appear only with 2+ images. Missing files show the
  filename instead of a broken image.
- **Breadcrumb + URL state** &mdash; visited path as crumbs (click one to trim
  back), "Start over" resets to the default entry. Current page is in the URL
  as `?page=<id>`; Back/Forward and bookmarking work.

Not built: browser-chrome device frames around the media (plain image for now).

### Known: fix the sheet's `Media` column

Cells currently use `gmb1.png, gmb2.png, ...` (commas). The parser splits on
`|` per the brief, so today each cell is read as one filename and cycling can't
kick in. Change those cells to `gmb1.png|gmb2.png|gmb3.png|gmb4.png`.

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
