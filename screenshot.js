// Capture each section of the new editorial layout.
const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));

  console.log('Loading …');
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  async function shot(id, name, opts={}) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, id);
    await page.waitForTimeout(opts.wait || 700);
    await page.screenshot({ path: path.join(OUT, name + '.png') });
    console.log('shot', name);
  }

  // 1. Hero
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, '01-hero.png') });
  console.log('shot 01-hero');

  // 2. Projects
  await shot('work', '02-projects-top');
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, '03-projects-mid.png') });
  console.log('shot 03-projects-mid');
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, '04-projects-bottom.png') });
  console.log('shot 04-projects-bottom');

  // 3. About
  await shot('about', '05-about');

  // 4. Deeper
  await shot('deeper', '06-deeper');

  // 5. Contact
  await shot('contact', '07-contact');

  // 6. Mobile preview
  await ctx.close();
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mpage = await mctx.newPage();
  await mpage.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 30000 });
  await mpage.waitForTimeout(1500);
  await mpage.screenshot({ path: path.join(OUT, '08-mobile-hero.png') });
  console.log('shot 08-mobile-hero');
  await mpage.evaluate(() => document.getElementById('work')?.scrollIntoView({ block: 'start' }));
  await mpage.waitForTimeout(700);
  await mpage.screenshot({ path: path.join(OUT, '09-mobile-projects.png') });
  console.log('shot 09-mobile-projects');

  await browser.close();
  console.log('\ndone.');
})().catch(e => { console.error('FATAL:', e); process.exit(1); });
