const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const output = process.env.QA_OUTPUT || path.join(process.env.TMPDIR || os.tmpdir(), 'portfolio-qa');
fs.mkdirSync(output, { recursive: true });
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dict = vm.runInNewContext(`(${source.match(/var I18N = (\{[\s\S]*?\n      \});/)[1]})`);
const report = { layouts: [], interactions: [], assets: [], screenshots: [], errors: [] };
const mime = { '.html': 'text/html', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  try { res.setHeader('Content-Type', mime[path.extname(file)] || 'text/plain'); res.end(fs.readFileSync(file)); }
  catch { res.writeHead(404); res.end('Not found'); }
});
const normalize = value => value.replace(/\s+/g, ' ').trim();
async function shot(page, name, fullPage = false) {
  const file = path.join(output, name + '.png');
  await page.waitForTimeout(350);
  await page.screenshot({ path: file, fullPage });
  report.screenshots.push(file);
}
async function language(page, lang) {
  await page.locator('[data-lang-toggle]').click();
  await page.locator(`button[data-lang="${lang}"]`).click();
  await page.waitForTimeout(250);
  assert.equal(await page.locator('html').getAttribute('lang'), lang);
}
async function content(page, lang) {
  const nodes = await page.locator('[data-i18n]').evaluateAll(nodes => nodes.map(n => ({ key: n.dataset.i18n, text: n.textContent })));
  for (const node of nodes) assert.equal(normalize(node.text), dict[lang][node.key], `${lang}: ${node.key}`);
}
async function geometry(page, width, lang, expanded) {
  const result = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('body *')].filter(e => {
      const r = e.getBoundingClientRect();
      return r.width && getComputedStyle(e).visibility !== 'hidden' && (r.right > innerWidth + 1 || r.left < -1);
    }).map(e => e.tagName + '.' + e.className);
    const headings = [...document.querySelectorAll('h1,h2,h3,h4')];
    return {
      overflow: document.documentElement.scrollWidth - innerWidth,
      offscreen: boxes,
      headingWeightMax: Math.max(...headings.map(e => Number(getComputedStyle(e).fontWeight))),
      headingFonts: [...new Set(headings.map(e => getComputedStyle(e).fontFamily))],
      screenshotWidths: [...document.querySelectorAll('.proj-shot')].map(e => e.getBoundingClientRect().width),
      targets: [...document.querySelectorAll('a,button,summary')].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && !e.classList.contains('skip-link')).map(e => ({ label: e.textContent.trim(), height: e.getBoundingClientRect().height, width: e.getBoundingClientRect().width }))
    };
  });
  assert.equal(result.overflow, 0, `${width}/${lang}/expanded=${expanded}: overflow`);
  assert.deepEqual(result.offscreen, [], `${width}/${lang}: offscreen`);
  assert.ok(result.headingWeightMax <= 600);
  assert.ok(result.headingFonts.every(f => f.includes('Fraunces')));
  for (const target of result.targets) assert.ok(target.height >= 43.9 && target.width >= 43.9, `Small target: ${target.label} ${target.width}x${target.height}`);
  report.layouts.push({ width, lang, expanded, ...result });
}
(async () => {
  let browser;
  try {
    assert.deepEqual(Object.keys(dict.en).sort(), Object.keys(dict.id).sort());
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const executablePath = process.env.CHROME_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined);
    browser = await chromium.launch({ executablePath, headless: true });
    for (const width of [360, 390, 430, 620, 768, 960, 1024, 1280]) {
      const page = await browser.newPage({ viewport: { width, height: 860 }, reducedMotion: 'reduce' });
      page.on('pageerror', e => report.errors.push(e.message));
      page.on('console', msg => { if (msg.type() === 'error') report.errors.push(msg.text()); });
      await page.goto(base + '/?qa=' + Date.now(), { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      assert.equal(await page.locator('.proj-featured').count(), 1);
      assert.equal(await page.locator('.case-study').count(), 4);
      assert.deepEqual(await page.locator('.proj .name').allTextContents(), ['Dekalase', 'Ceritera', 'eCampus', 'UmmatStore']);
      for (const lang of ['en', 'id']) {
        await language(page, lang);
        await content(page, lang);
        await geometry(page, width, lang, false);
        for (const summary of await page.locator('.case-study summary').all()) {
          await summary.focus();
          await page.keyboard.press('Enter');
          assert.equal(await summary.evaluate(e => e.parentElement.open), true);
          assert.equal(await summary.evaluate(e => getComputedStyle(e).outlineStyle), 'solid');
        }
        await geometry(page, width, lang, true);
        for (const summary of await page.locator('.case-study summary').all()) {
          await summary.focus();
          await page.keyboard.press('Space');
          assert.equal(await summary.evaluate(e => e.parentElement.open), false);
          await summary.click();
          assert.equal(await summary.evaluate(e => e.parentElement.open), true);
          await summary.click();
        }
        report.interactions.push(`${width}/${lang}: all four case studies open with Enter/click, close with Space/click`);
        for (const id of ['work', 'about', 'process', 'contact']) {
          if (width <= 720) await page.locator('[data-nav-toggle]').click();
          await page.locator(`#site-nav a[href="#${id}"]`).click();
          await page.waitForTimeout(80);
          assert.equal(new URL(page.url()).hash, '#' + id);
          if (width <= 720) assert.equal(await page.locator('[data-nav-toggle]').getAttribute('aria-expanded'), 'false');
          const top = await page.locator('#' + id).evaluate(e => e.getBoundingClientRect().top);
          assert.ok(top >= 59, `${id} hidden under header at ${width}: ${top}`);
        }
        report.interactions.push(`${width}/${lang}: work/about/process/contact anchors, mobile auto-close, heading clear of header`);
        await page.locator('.brand').click();
        await page.waitForTimeout(80);
        await page.locator('.hero-actions .secondary').click();
        assert.equal(new URL(page.url()).hash, '#work');
        await page.locator('[data-to-top]').click();
        await page.waitForFunction(() => scrollY < 2);
        await page.locator('.hero-scroll').click();
        assert.equal(new URL(page.url()).hash, '#work');
        await page.locator('.brand').click();
        if ([390, 1280].includes(width)) {
          await page.evaluate(() => scrollTo(0, 0));
          await shot(page, `final-hero-${width}-${lang}`);
          await page.locator('#dekalase').evaluate(e => e.scrollIntoView({ block: 'start' }));
          await shot(page, `final-featured-${width}-${lang}`);
          await page.locator('#dekalase summary').click();
          await page.locator('#dekalase summary').evaluate(e => e.scrollIntoView({ block: 'start' }));
          await shot(page, `final-case-${width}-${lang}`);
          await page.locator('#dekalase summary').click();
          await page.locator('#contact').evaluate(e => e.scrollIntoView({ block: 'start' }));
          await shot(page, `final-contact-${width}-${lang}`);
          await shot(page, `final-full-${width}-${lang}`, true);
        }
      }
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').getAttribute('lang'), 'id');
      report.interactions.push(`${width}: language selection persisted after reload`);
      await page.locator('[data-lang-toggle]').focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.matches('button[data-lang="en"]')), true);
      await page.keyboard.press('ArrowDown');
      assert.equal(await page.evaluate(() => document.activeElement.matches('button[data-lang="id"]')), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => document.activeElement.matches('[data-lang-toggle]')), true);
      if (width <= 720) {
        await page.locator('[data-nav-toggle]').focus();
        await page.keyboard.press('Enter');
        await page.locator('#site-nav a').first().focus();
        await page.keyboard.press('Escape');
        assert.equal(await page.evaluate(() => document.activeElement.matches('[data-nav-toggle]')), true);
        await page.locator('[data-nav-toggle]').click();
        await page.mouse.click(5, 500);
        assert.equal(await page.locator('[data-nav-toggle]').getAttribute('aria-expanded'), 'false');
      }
      report.interactions.push(`${width}: language keyboard Enter/Tab/ArrowDown/Escape, focus restored; mobile menu Escape/outside-click`);
      if (width === 1280) {
        const hrefs = await page.locator('a[href]').evaluateAll(es => es.map(e => e.getAttribute('href')));
        assert.equal(hrefs.filter(h => h.startsWith('mailto:')).length, 1);
        assert.equal(hrefs.filter(h => h === 'https://wa.me/6287713166791').length, 2);
        const downloadPromise = page.waitForEvent('download');
        await page.locator('a[download]').click();
        const download = await downloadPromise;
        assert.equal(download.suggestedFilename(), 'cv.pdf');
        assert.equal(await download.failure(), null);
        report.interactions.push('CV: real local PDF download succeeded');
        // Capture outbound activation without sending messages or leaving the local test.
        await page.evaluate(() => { window.activatedLinks = []; document.addEventListener('click', e => { const a = e.target.closest('a'); if (a && /^(https:|mailto:)/.test(a.href)) { e.preventDefault(); window.activatedLinks.push(a.href); } }, true); });
        for (const a of await page.locator('a[href^="https:"],a[href^="mailto:"]').all()) await a.click();
        report.outboundActivations = await page.evaluate(() => window.activatedLinks);
        assert.equal(report.outboundActivations.length, 4);
        const assets = await page.evaluate(() => [...new Set([...document.querySelectorAll('img[src],link[href]')].map(e => e.getAttribute('src') || e.getAttribute('href')).filter(h => !h.startsWith('http')))]);
        assets.push('assets/cv.pdf', 'robots.txt', 'sitemap.xml');
        for (const asset of assets) { const response = await page.request.get(base + '/' + asset); assert.equal(response.status(), 200, asset); report.assets.push({ asset, status: response.status() }); }
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://glnggggzr.github.io/gilang-portfolio/');
        JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      }
      await page.close();
    }
    const nojs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 860 } });
    await nojs.goto(base);
    await content(nojs, 'en');
    assert.equal(await nojs.locator('#loader').isVisible(), false);
    assert.equal(await nojs.locator('#site-nav a').first().isVisible(), true);
    await nojs.locator('#site-nav a[href="#work"]').click();
    await nojs.locator('#dekalase summary').click();
    assert.equal(await nojs.locator('#dekalase details').getAttribute('open'), '');
    await shot(nojs, 'final-noscript-390');
    report.interactions.push('No JavaScript: English fallback matches dictionary, nav works, native case study expands');
    await nojs.close();
    assert.deepEqual(report.errors, []);
    report.status = 'PASS';
  } catch (e) { report.status = 'FAIL'; report.failure = e.stack; process.exitCode = 1; }
  finally {
    if (browser) await browser.close();
    server.close();
    fs.writeFileSync(path.join(output, 'local-report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ status: report.status, layouts: report.layouts.length, interactions: report.interactions.length, screenshots: report.screenshots.length, errors: report.errors, failure: report.failure, report: path.join(output, 'local-report.json') }, null, 2));
  }
})();
