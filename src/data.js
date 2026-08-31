import Papa from 'papaparse';
import { CSV_URL } from './config.js';

// The single seam between the app and its data source.
// Nav, page rendering and CTA buttons all consume the array this returns and
// never touch the network or the CSV format themselves.
//
// Returns: Promise<Page[]> where Page is
//   { id, metaSection, eventName, entryPoint, details, media: string[], ctas: string[] }
//   - entryPoint is a boolean (sheet holds "Y"/"N")
//   - media is a list of bare filenames, split on "|"
//   - ctas is the list of non-empty CTA1..CTA7 cells, each an ID of another row
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
        .filter(Boolean),
      ctas: [1, 2, 3, 4, 5, 6, 7]
        .map((n) => (row[`CTA${n}`] || '').trim())
        .filter(Boolean),
    }))
    .filter((row) => row.id);
}
