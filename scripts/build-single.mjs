// Builds a single self-contained ICJ-Walkthrough.html.
//
// - JS + CSS are inlined (vite-plugin-singlefile, enabled by SINGLEFILE=1).
// - Images are NOT inlined (the media set is tens of MB); instead the file
//   loads them from the deployed site via VITE_MEDIA_BASE.
// - The Google Sheet is still fetched live at runtime.
//
// Result: one ~250 KB .html that opens by double-click and shows current
// content, as long as the machine is online.

import { build } from 'vite';
import { copyFile } from 'node:fs/promises';

process.env.SINGLEFILE = '1';
process.env.VITE_MEDIA_BASE = 'https://cw-icj.vercel.app/media/';
process.env.VITE_CSV_URL = 'https://cw-icj.vercel.app/api/sheet';

await build();
await copyFile('dist-single/index.html', 'ICJ-Walkthrough.html');

console.log('\n✓ Wrote ICJ-Walkthrough.html (open it directly in a browser)');
