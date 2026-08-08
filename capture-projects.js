// Capture real screenshots of the 4 actual projects for the portfolio Work section.
// Output: assets/projects/*.webp (920px wide, q82) — the shipped format.
// Re-run when an app's UI changes: `node capture-projects.js`
const { chromium } = require('playwright');
const path = require('path');

const OUT = path.join(__dirname, 'assets', 'projects');
const WIDTH = 920;

// Each project entry: base url, login flow (if any), screenshot URL path,
// credentials (laravel uses email+password, ci4 uses username+password).
const PROJECTS = [
  {
    name: 'klinik-app',
    file: 'klinik-app.webp',
    base: 'http://klinik-app.test/',
    loginPath: 'login',
    loginType: 'laravel',
    user: 'alex@contoh.com',
    pass: 'Teles123',
    shootPath: 'dashboard',
  },
  {
    name: 'klikkode',
    file: 'klikkode.webp',
    base: 'http://klikkode.test/',
    loginPath: null,
    shootPath: '',
  },
  {
    name: 'manajemen-produk',
    file: 'manajemen-produk.webp',
    base: 'http://aplikasi-produk.test/',
    loginPath: 'login',
    loginType: 'laravel',
    user: 'admin@dekalase.test',
    pass: 'admin123',
    shootPath: 'dashboard',
  },
  {
    name: 'sia-gilang',
    file: 'sia-gilang.webp',
    base: 'http://ci4-main.test/',
    loginPath: 'login',
    loginType: 'ci4',
    user: 'admin',
    pass: 'admin123',
    shootPath: '',
  },
];

(async () => {
  const fs = require('fs');
  const { execSync } = require('child_process');
  const tmp = path.join(__dirname, 'screenshots', 'recapture');
  if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

  for (const p of PROJECTS) {
    const page = await ctx.newPage();
    console.log('->', p.name);
    try {
      await page.goto(p.base + (p.loginPath || ''), { waitUntil: 'networkidle', timeout: 20000 });
    } catch {
      await page.goto(p.base + (p.loginPath || ''), { waitUntil: 'domcontentloaded', timeout: 20000 });
    }

    if (p.loginType === 'laravel') {
      await page.fill('input[name="email"]', p.user);
      await page.fill('input[name="password"]', p.pass);
      await Promise.all([
        page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}),
        page.click('button[type="submit"], input[type="submit"]'),
      ]);
    } else if (p.loginType === 'ci4') {
      await page.fill('input[name="username"]', p.user);
      await page.fill('input[name="password"]', p.pass);
      await Promise.all([
        page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}),
        page.click('button[type="submit"], .btn-login, input[type="submit"]'),
      ]);
    }

    if (p.shootPath) {
      try {
        await page.goto(p.base + p.shootPath, { waitUntil: 'networkidle', timeout: 15000 });
      } catch {
        await page.goto(p.base + p.shootPath, { waitUntil: 'domcontentloaded', timeout: 15000 });
      }
    }

    await page.waitForTimeout(2000);
    const raw = path.join(tmp, p.name + '.png');
    await page.screenshot({ path: raw, fullPage: false });
    console.log('   captured', raw);
    await page.close();
  }
  await browser.close();

  // Convert to WebP 920w using Python/PIL (available on this host)
  const script = `
from PIL import Image
import glob, os
for f in glob.glob(r'${tmp.replace(/\\/g, '/')}/*.png'):
    im = Image.open(f).convert('RGB')
    w = ${WIDTH}
    h = round(im.height * w / im.width)
    im = im.resize((w, h), Image.LANCZOS)
    out = os.path.join(r'${OUT.replace(/\\/g, '/')}', os.path.basename(f).replace('.png', '.webp'))
    im.save(out, 'WEBP', quality=82, method=6)
    print('converted', out, os.path.getsize(out) // 1024, 'KB')
`;
  execSync('python -c "' + script.replace(/"/g, '\\"') + '"', { stdio: 'inherit' });

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('\ndone.');
})().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
