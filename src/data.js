import Papa from 'papaparse';
import { CSV_URL } from './config.js';

// The single seam between the app and its data source.
// Nav, page rendering and CTA buttons all consume the array this returns and
// never touch the network or the CSV format themselves.
//
// Returns: Promise<Page[]> where Page is
//   { id, metaSection, eventName, eventSubSection, title, entryPoint,
//     details, media: string[], ctas: Cta[] }
//   - metaSection / eventName / eventSubSection are the three nav tiers
//     (State / Event Name / Event Sub Section) — see nav.js for how they're
//     grouped into a tree, and for the synthetic State "menu" pages
//   - title is what's actually shown as the page heading: the Sub Section
//     text, falling back to the Event Name for rows that don't split further
//   - entryPoint is a boolean (sheet holds "Y"/"N"); unused by the V2 sheet,
//     which has no such column, so this is always false there
//   - media is a list of bare filenames, split on "|"
//   - ctas: one { copy, ref } per CTAn column that has a non-empty ref.
//       ref  = CTAn      -> the row to navigate to (by ID, or by name as a
//                           fallback — see resolvePage in nav.js)
//       copy = CTAn-Copy -> the button label (falls back to the target's
//                           title when blank)
export async function getPages() {
  const res = await fetch(CSV_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);
  }

  const csv = await res.text();
  const { data, errors } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });
  if (errors.length) {
    console.warn('CSV parse warnings:', errors);
  }

  return data
    .map((row) => {
      const eventName = (row['Event Name'] || '').trim();
      const eventSubSection = (row['Event Sub Section'] || '').trim();
      return {
        id: (row.ID || '').trim(),
        metaSection: (row['Meta Section'] || '').trim(),
        eventName,
        eventSubSection,
        title: eventSubSection || eventName,
        entryPoint: /^y$/i.test((row['Entry Point'] || '').trim()),
        details: row.Details || '',
        media: (row.Media || '')
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean)
          // Bare names get a .png default; anything with an extension is left as-is.
          .map((name) => (/\.[a-z0-9]+$/i.test(name) ? name : `${name}.png`)),
        ctas: [1, 2, 3, 4, 5, 6, 7]
          .map((n) => ({
            copy: (row[`CTA${n}-Copy`] || '').trim(),
            ref: (row[`CTA${n}`] || '').trim(),
          }))
          .filter((cta) => cta.ref),
      };
    })
    // A row needs an ID and a State to be placeable in the nav; skip
    // incomplete/stray rows rather than showing a blank nav entry.
    .filter((row) => row.id && row.metaSection);
}
