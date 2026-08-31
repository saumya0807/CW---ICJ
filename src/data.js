import Papa from 'papaparse';
import { CSV_URL } from './config.js';

// The single seam between the app and its data source.
// Nav, page rendering and CTA buttons all consume the array this returns and
// never touch the network or the CSV format themselves.
//
// Returns: Promise<Page[]> where Page is
//   { id, metaSection, eventName, entryPoint, details, media: string[], ctas: Cta[] }
//   - entryPoint is a boolean (sheet holds "Y"/"N")
//   - media is a list of bare filenames, split on "|"
//   - ctas: one { copy, ref } per CTAn column that has a non-empty ref.
//       ref  = CTAn      -> the row to navigate to (Event Name or ID)
//       copy = CTAn-Copy -> the button label (falls back to the target's
//                           Event Name when blank)
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
    .map((row) => ({
      id: (row.ID || '').trim(),
      metaSection: (row['Meta Section'] || '').trim(),
      eventName: (row['Event Name'] || '').trim(),
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
    }))
    .filter((row) => row.id);
}
