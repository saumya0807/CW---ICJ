// Where the walkthrough gets its content.
//
// This is a Google Sheet published to the web as CSV
// (File > Share > Publish to web > entire sheet > CSV).
// Editing rows in that sheet updates the live app with no redeploy.
//
// To point the walkthrough at a different sheet, change only this URL.
export const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT1TXoLGg2zDVw0OaL146Lx7pw4UY2hXNY_8vv9nA0oF-mZiduu5QxZaNRGSVDH7M2a_PCOKHr2W8i0/pub?gid=0&single=true&output=csv';

// Media filenames from the sheet are resolved against this path.
// Files live in /public/media/ and are served from the site root.
export const MEDIA_BASE = '/media/';
