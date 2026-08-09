// Smoke test — runs against the live Laragon site (gilang-portfolio.test).
// Usage: npm test   (requires the site to be served; see README Quickstart)
const { chromium } = require('playwright');

const BASE = 'http://gilang-portfolio.test/';
const WA_LINK = 'https://wa.me/6287713166791';

let failures = 0;
function check(name, ok, detail) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${!ok && detail ? '  [' + detail + ']' : ''}`);
  if (!ok) failures++;
}

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const d = await page.evaluate(() => ({
    over: document.documentElement.scrollWidth > innerWidth,
    imgsOk: [...document.images].every(i => i.complete && i.naturalWidth > 0),
    imgN: document.images.length,
    h1: document.querySelectorAll('h1').length,
    can: !!document.querySelector('link[rel="canonical"]'),
    ld: !!document.querySelector('script[type="application/ld+json"]'),
    ogAbs: (document.querySelector('meta[property="og:image"]')?.content || '').startsWith('https://'),
    skip: !!document.querySelector('.skip-link'),
    wa: document.querySelector('.contact-pills a[href*="wa.me"]')?.href,
    cvHref: document.querySelector('.contact-pills a[download]')?.getAttribute('href'),
    foot: document.querySelector('footer').innerText,
  }));
  check('desktop: no horizontal overflow', !d.over);
  check('desktop: 4 project images load', d.imgsOk && d.imgN === 4, `count=${d.imgN}`);
  check('desktop: exactly one h1', d.h1 === 1, `h1=${d.h1}`);
  check('desktop: canonical + JSON-LD + absolute og:image', d.can && d.ld && d.ogAbs);
  check('desktop: skip link present', d.skip);
  check('desktop: WhatsApp links to wa.me', d.wa === WA_LINK, d.wa);
  check('desktop: CV links to real file', d.cvHref === 'assets/cv.pdf', d.cvHref);
  check('desktop: footer honest (no scroll-world claim)', !d.foot.includes('scroll-world'));

  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE, { waitUntil: 'networkidle' });
  await m.waitForTimeout(800);
  const mb = await m.evaluate(() => ({
    over: document.documentElement.scrollWidth > innerWidth,
    tog: getComputedStyle(document.querySelector('.nav-toggle')).display !== 'none',
    closed: !document.querySelector('.nav-links').classList.contains('open'),
  }));
  check('mobile: no horizontal overflow', !mb.over);
  check('mobile: hamburger visible, menu closed', mb.tog && mb.closed);
  await m.click('.nav-toggle');
  await m.waitForTimeout(300);
  const mo = await m.evaluate(() => ({
    open: document.querySelector('.nav-links').classList.contains('open'),
    aria: document.querySelector('.nav-toggle').getAttribute('aria-expanded') === 'true',
    links: [...document.querySelectorAll('#site-nav a')].every(a => a.offsetParent !== null),
  }));
  check('mobile: hamburger opens (aria + links visible)', mo.open && mo.aria && mo.links);

  await m.click('.lang-switch');
  await m.waitForTimeout(250);
  await m.click('.lang-menu [data-lang="id"]');
  await m.waitForTimeout(300);
  const id = await m.evaluate(() => ({
    lang: document.documentElement.lang,
    stored: localStorage.getItem('portfolio-lang'),
    h1: document.querySelector('h1').innerText,
  }));
  check('i18n: switch to Indonesian', id.lang === 'id' && id.stored === 'id' && id.h1.includes('Saya bikin'), id.lang);
  await m.reload({ waitUntil: 'networkidle' });
  await m.waitForTimeout(600);
  const id2 = await m.evaluate(() => document.documentElement.lang);
  check('i18n: persists after reload', id2 === 'id', `lang=${id2}`);

  check('zero console/page errors', errors.length === 0, errors.join(' | '));
  await browser.close();
  console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
})().catch(e => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
