// Capture each animated SVG at two time points to verify animations are running.
const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'verify-svg');
fs.mkdirSync(OUT, { recursive: true });

const SCENES = [
  ['1-hero',     'Workshop at dusk'],
  ['2-about',    'The Armory'],
  ['3-klinik',   'The Clinic'],
  ['4-klikkode', 'Trophy Hall'],
  ['5-contact',  'Open Door'],
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (const [name, _desc] of SCENES) {
    await page.goto('http://localhost:4173/assets/scenes/' + name + '.svg', { waitUntil: 'networkidle', timeout: 15000 });
    // Wait a moment so CSS animation time has progressed
    await page.waitForTimeout(50);
    await page.screenshot({ path: path.join(OUT, name + '-t0.png') });
    // Wait 2 seconds (typical animation cycle mid-point)
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT, name + '-t2.png') });
    console.log('captured', name);
  }

  await browser.close();
  console.log('done. verify-svg/');
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
