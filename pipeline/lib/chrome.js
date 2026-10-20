// Path of the Google Chrome binary used by the login and editor scripts (the bundled Chromium is
// rejected by accounts.shopify.com). Override with CHROME_BIN.
import fs from 'node:fs';

const CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Users/Shared/Previously Relocated Items/Google Chrome.app/Contents/MacOS/Google Chrome',
];

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const hit = CANDIDATES.find(p => fs.existsSync(p));
  if (!hit) throw new Error(`Google Chrome not found. Set CHROME_BIN to the browser binary. Looked in: ${CANDIDATES.join(', ')}`);
  return hit;
}

export const CHROME = findChrome();
