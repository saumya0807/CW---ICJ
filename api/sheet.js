// Serverless proxy for the published Google Sheet CSV.
//
// The Google URL 307-redirects to googleusercontent.com, and that redirect hop
// carries no CORS header — which browsers tolerate from an https:// page but
// reject from a file:// page. Fetching server-side sidesteps the whole problem,
// so the standalone single-file build points its CSV_URL here.

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1TXoLGg2zDVw0OaL146Lx7pw4UY2hXNY_8vv9nA0oF-mZiduu5QxZaNRGSVDH7M2a_PCOKHr2W8i0/pub?gid=0&single=true&output=csv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  try {
    const upstream = await fetch(CSV_URL, { redirect: 'follow' });
    const body = await upstream.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.status(upstream.ok ? 200 : 502).send(body);
  } catch (err) {
    res.status(502).send(`sheet proxy error: ${err.message}`);
  }
}
