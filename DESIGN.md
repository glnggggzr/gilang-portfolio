# DESIGN.md

A reference for this portfolio. Read this before adding anything.

The point is: every choice below has a reason. When you add a section, a project card, a mock, or a line of CSS, you should be able to point to which decision it follows. If you can't, it's probably wrong.

---

## 1 · Intent

This is a **personal portfolio for Gilang**, an Indonesian web developer working in PHP (Laravel + CodeIgniter). The audience is recruiters, hiring managers, and freelance clients looking at someone with a real, recent body of work.

The site is one HTML file, no build step, no frameworks. It loads in one request and works offline. The whole thing is around 40KB.

What it is _not_: a Webflow template, a SaaS landing page, a portfolio that hides behind vague "passionate developer" copy. If something looks like a generic startup site, it's wrong.

---

## 2 · Voice & Copy

### Tone
- Confident, slightly irreverent. "I build web apps that don't suck" is the headline on purpose — it sets the voice.
- Specific. Use real numbers, real stack, real repo names. No "various technologies", no "passionate about creating elegant solutions".
- Self-aware without being apologetic. The "· portfolio" wordmark after "Gilang" is a small joke; the marquee is a small flex; the "— Gilang" signature at the end of the bio is a quiet closer.

### Patterns
- **Headlines**: short, slightly punchy, with a word in italic for rhythm. 3 to 8 words is the sweet spot.
- **Body copy**: 1 to 3 sentences. Plain language. One idea per paragraph.
- **Section eyebrow**: ALL CAPS, mono font, letter-spaced, with a 24px coral line in front. Example: `SELECTED WORK · 2026`.
- **Project numbers**: `01 · Featured`, `02 · Featured`, `03 · Scaffolding`. The bullet can be a category (`Featured`, `Coursework`, `Scaffolding`) so it carries meaning.
- **Tagline under project title**: one sentence. Concrete over aspirational.
- **CTA copy**: action verbs. "See the work", "Get in touch", "Hire me". Never "Learn more".
- **Avoid**: filler phrases, buzzwords, emojis in copy, exclamation points, AI-isms ("let me", "in this guide", "this is where").

---

## 3 · Visual Identity

### Color

One accent color. Everything else is neutral or derived from the cream background.

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#f5ede0` | Page background, warm cream |
| `--ink` | `#1a1530` | Primary text, dark plum-black |
| `--ink-2` | `#574c66` | Secondary text |
| `--ink-soft` | `#6f657e` | Tertiary text, eyebrows, captions (4.71:1 on bg — WCAG AA) |
| `--accent` | `#ff5b3a` | **Coral. The only saturated color.** Used for: brand mark, live dots, hover states, CTA hover, accent line on eyebrows |
| `--accent-deep` | `#d93f1d` | Darker coral for **text glyphs** on cream (italic `<em>` accents, signature). Passes 3:1 on large text where `--accent` (2.65:1) fails. Not a second accent — a legibility variant |
| `--accent-ink` | `#b5371a` | Darker coral, used inside coral backgrounds for readable text |
| `--line` | `rgba(26,21,48,0.10)` | Subtle borders |
| `--line-strong` | `rgba(26,21,48,0.20)` | Visible borders |

**Rule**: if a new color is needed, don't add it. Use existing tokens with different opacity instead. A second accent is forbidden. (`--accent-deep` exists only so italic text on cream stays readable — it is the same hue, darker.)

### Typography

Two fonts, two jobs. Google Fonts loaded once at top.

| Font | CSS var | Use |
|---|---|---|
| **Fraunces** (variable serif, opsz 9–144) | `--display` / `--body` | All headlines, brand wordmark, project titles, contact CTA, italic accents, long-form bio. The "editorial" voice. |
| **IBM Plex Mono** (400/500/600/700) | `--mono` | Eyebrows, hero intro, section subs, buttons, tag pills, project numbers, meta, marquee items. Anything that should look terminal-y. |

**Type scale** (use clamp where responsive is needed):
- Hero headline: `clamp(3rem, 9vw, 8.5rem)`, line-height `0.96`, letter-spacing `-0.035em`
- Section title: `clamp(2rem, 4.4vw, 3.6rem)`, line-height `1.04`
- Project name: `clamp(1.6rem, 2.6vw, 2.2rem)`
- Body (Fraunces): `16px` base, `1.05–1.18rem` for bio
- Mono (intro, subs, buttons): `0.95–1.18rem`, line-height `1.7`
- Mono caption: `10–11px`, letter-spacing `0.06–0.32em`, often uppercase

**Rule**: Fraunces italic is for accent, never full sentences. Mono text doesn't get italic for emphasis — use weight 600 instead.

### Brand wordmark

The brand is text-only: **"Gilang · portfolio"** in Fraunces 700. There is deliberately **no tile/monogram** — the G mark was tried and removed (2026-08, user: "logo G jelek mengganggu"). The favicon is a minimal coral "G" on transparent. Don't reintroduce a logo box; the wordmark + favicon are the identity.

---

## 4 · Layout

### Grid

Container: `max-width: 1200px`, centered with `margin: 0 auto`, padded with `--gutter` (clamp 1.25rem–3rem). Everything lives inside this.

### Sections

Order is intentional. Don't reorder.

1. **Hero** — single column, big serif headline, marquee strip directly below.
2. **Marquee** — full-bleed strip between hero and work. Visual breath + brand signature.
3. **Selected work** — single-column project list with alternating image/text grid.
4. **About** — 2-column grid (bio + skills), 1.05fr | 1fr ratio.
5. **Contact** — single column, centered, headline + sub + CTA + email + social pills.
6. **Footer** — single line, two-column inner (copyright left, attribution right).

### Section padding
- Top: 100–120px from previous section
- Bottom: 60–100px

### Hero specifics
- Min-height: `100vh` (or `100svh` on mobile for address bar)
- Padding-top: `140px` (clears the navbar)
- Padding-bottom: `60px` (room for marquee)

### Project card specifics
Two layouts, alternating. Both have `min-height: 380px` mock area, `gap: 14px` inside body.

- **Default**: `grid-template-columns: 1.3fr 1fr` (mock left, body right)
- **Reverse**: `grid-template-columns: 1fr 1.3fr` (body left, mock right)

Odd-indexed projects (1st, 3rd) use default. Even-indexed (2nd, 4th) use reverse. Add inline `style="grid-template-columns: 1fr 1.3fr;"` to reverse.

### Mobile

Below 760px:
- Project cards collapse to single column
- Skills grid: 2 columns still (fits comfortably)
- Nav links collapse into a hamburger button (≤720px); brand and language switcher stay
- Hero title: still readable but smaller (clamp handles it)
- Body fonts: reduce via clamp

Below 480px (phone portrait):
- Marquee: still works, just smaller
- Skills grid: stays 2 columns — 8 tiles in 1 column makes the page needlessly long

---

## 5 · Components

### Section header (`.sect-head`)

```html
<header class="sect-head">
  <p class="sect-eyebrow">Selected work · 2026</p>
  <h2 class="sect-title">Real projects, <em>real&nbsp;code</em>.</h2>
  <p class="sect-sub">...</p>
</header>
```

Eyebrow has a 24px coral `::before` line. Title can have one `<em>` for italic accent. Sub is 1 paragraph max.

### Project card (`.proj`)

```html
<article class="proj reveal" data-i="0">
  <div class="mock">
    <!-- screenshot in browser chrome (.shot-frame) -->
  </div>
  <div class="body">
    <span class="num"><span data-i18n="proj1.num">01</span> · <span data-i18n="proj1.tag">Featured</span></span>
    <h3 class="name" data-i18n="proj1.name">Project title here.</h3>
    <p class="tagline" data-i18n="proj1.tagline">One-sentence description.</p>
    <ul class="feat">
      <li data-i18n="proj1.f1">+ roles admin &amp; staf</li>
      <li data-i18n="proj1.f2">+ antarmuka ID/EN</li>
      <li data-i18n="proj1.f3">+ SKU · margin · riwayat stok</li>
    </ul>
    <div class="stack">
      <span>Laravel 11</span><span>Blade</span><span>MySQL</span>
    </div>
    <div class="meta">
      <a href="...">github.com/user/repo ↗</a>
      <span class="live-dot" aria-hidden="true"></span><span>· 2026</span>
    </div>
  </div>
</article>
```

For reverse layout: add `style="grid-template-columns: 1fr 1.3fr;"` to swap order.

The `.feat` list is 3 concrete feature points (mono, coral dot bullets) — real features only, never invented. The `.live-dot` marks the repo as active/current year.

### Mock components — project screenshots

Project cards show **real screenshots of the actual apps**, not generic shapes or CSS mockups. The KlikKode shot shows the real quiz UI; the Manajemen Produk shot shows the real dashboard with live totals. Anyone who knows the stack can verify the product exists.

Screenshots are generated with `capture-projects.js` (Playwright): it logs into each local app (Laragon `.test` domains) and captures a 1440×900 viewport shot of the dashboard/landing page. Shipped assets are **WebP, 920px wide, q82** (`assets/projects/*.webp`) — re-run the capture script, then convert (PIL: `Image.resize(920, LANCZOS)` + `save('WEBP', quality=82)`).

Rules:
- The screenshot must show **real data** — a dashboard with zero rows reads as broken. Seed the app first.
- Re-capture if the app's UI changed; a stale screenshot is worse than none.
- Don't ship a screenshot of a login page or an error page.
- Keep `capture-projects.js` in sync with the apps' current login credentials.

| Image | Use for | Don't use for |
|---|---|---|
| Dashboard shot | Apps with admin/data panels | Landing pages |
| Landing/quiz shot | Marketing-y or gamified apps | Dashboards |

When adding a new project: capture its real screen, convert to WebP 920w, drop it in `assets/projects/`. Don't reuse the same visual shape as the neighboring card — alternate dashboard / landing shots.

### Skills tile (`.skill`)

```html
<div class="skill reveal d1">
  <span class="ico laravel">
    <svg viewBox="0 0 128 128"><!-- Laravel logo path --></svg>
  </span>
  <div>
    <h4>Tool name</h4>
    <p>v1.0 · short detail</p>
  </div>
</div>
```

The `.ico` is a white tile (40px, radius 11, hairline border) holding the tool's **real brand logo as inline SVG** (original colors — Laravel red, CodeIgniter orange, PHP elephant, MySQL dolphin, Git, VS Code, Composer). Sources: Devicon (`laravel-original`, `php-original`, ...) and Simple Icons. The AI-assisted tile uses a coral ✦ sparkle (no official logo exists).

### Marquee (`.marquee`)

Full-bleed strip with horizontal scroll animation. Already exists. The content cycles are written twice for seamless loop. To change the words, edit both `<span class="marquee-item">` blocks identically.

### Contact CTA (`.contact-mail`)

A pill-shaped button (filled, dark) + serif italic email link beside it. This is the primary action on the page; everything else (project links, GitHub pills) is secondary.

---

## 6 · Motion

### What animates
- Loader: wordmark "Gilang" pulses for ~1.4s until fonts ready, then fades.
- Navbar: blur increases + bottom border appears when scrolled past 12px.
- Hero eyebrow dot: live-pulse every 1.6s.
- Project meta live-dots: same live-pulse (marks the repo as current).
- Hero scroll cue: "Scroll ↓" bobs gently at the bottom of the hero.
- Back-to-top button: fades/slides in after 600px of scroll.
- Marquee: 38s linear infinite horizontal scroll. Pauses on hover.
- Section reveals: opacity + translateY on intersection observer. Delays: 0, .12s, .24s, .36s.

### What does NOT animate
- Project cards do not animate internally. Hover only lifts them by 3px and adds shadow.
- Headlines don't animate in word-by-word or letter-by-letter.
- Project screenshots don't have animations inside them.

**Rule**: if something moves, it should be either contextually useful (live indicator) or ambient (marquee, scroll reveal). Decorative-only animations read as AI-generated.

### Reduced motion

Always respect `prefers-reduced-motion: reduce`. The marquee is the only animation that needs an explicit override (set `animation: none`).

---

## 7 · Adding things

### New section

```html
<section class="mynew wrap" id="mynew">
  <div class="sect-head reveal">
    <p class="sect-eyebrow">My new section</p>
    <h2 class="sect-title">Title here, <em>with italic</em>.</h2>
    <p class="sect-sub">One-sentence intro.</p>
  </div>
  <!-- section content -->
</section>
```

Add the `.wrap` class for the container. Add `id` for nav anchor if needed. Use `reveal` class on the sect-head so it fades in.

### New project card

1. Capture a real screenshot of the project (see § 5 — `capture-projects.js`, WebP 920w). Don't reuse the neighboring card's visual shape (dashboard vs landing).
2. Use the project card HTML structure above.
3. If the project has a real link (GitHub, demo), link it.
4. Tag pills (`.stack span`) are short — one or two words each.
5. The `num` value: count from the existing projects. Don't restart.

### New skill

Add a `.skill` block with one of the existing `.ico-*` classes. If you need a new icon class, add the gradient definition in the `.skill` block in CSS.

### Color override on a section
The accent color is global, but if a section really needs visual emphasis (rare), use `data-accent` and a per-section override. Don't add new colors.

---

## 8 · Don'ts

- **Don't** add a second accent color. The brand is one color.
- **Don't** use emojis in copy. Use them in mockup data if it fits (the trophy in KlikKode is debatable but doesn't carry meaning).
- **Don't** add `backdrop-filter` blur to elements that aren't sticky headers.
- **Don't** use gradients on text. Coral is solid.
- **Don't** add animation to project screenshots — they should look like static captures of real product.
- **Don't** ship fake contact data (WhatsApp numbers, phone, addresses). Leave a slot and ask, or omit it.
- **Don't** add dark mode. This portfolio is one mood.
- **Don't** add framework imports (Tailwind, Bootstrap, React). Plain CSS + vanilla JS only. This is a single HTML file by design.
- **Don't** use placeholder copy like "Lorem ipsum", "Coming soon", "TBD". If you don't have the words, the section isn't ready.
- **Don't** add a "About me" section about personality beyond what's already in the bio. The bio is 3 paragraphs max.
- **Don't** make mock components more elaborate than the actual project card needs. A 60% mock / 40% card ratio is the sweet spot.

---

## 9 · Code conventions

### File layout

```
index.html              # everything in one file
assets/
  projects/             # real app screenshots, WebP 920w (generated by capture-projects.js)
  og-image.jpg          # 1200x630 share card (JPG, ~40KB)
  cv.pdf                # one-page CV, rendered from cv.html
cv.html                 # CV source (A4, brand style); render via Playwright -> assets/cv.pdf
favicon.svg
capture-projects.js     # Playwright script: logs into the local apps and screenshots them
test/
  smoke.cjs             # npm test — Playwright smoke test against the live site
js/
  scrub-engine.js       # leftover from the scroll-world era (museum)
references/
  scenes.md             # scene specs (museum)
  prompts.md            # Higgsfield / Codex prompt templates (museum)
  pipeline.md           # generation scripts (museum)
  runbook.md            # end-to-end asset-generation runbook (museum)
README.md
LICENSE                 # MIT, with oso95/scroll-world attribution
.gitignore              # node_modules, screenshots, _*.cjs scratch, env
```

The `references/` directory is a museum — leftover from when the scroll-world experience was the centerpiece. The current main page doesn't use it. **Keep it** so future-you remembers how to rebuild the 3D experience.

### CSS

Single `<style>` block in `<head>`. Sections marked with plain comments like `/* 1 · HERO */`. No dashes-as-decoration, no emoji. BEM-ish naming (`.proj`, `.proj .body`, `.proj .num`) but no strict methodology.

Variables in `:root`. Reuse them, don't redefine.

### HTML

Semantic where it matters (`<header>`, `<section>`, `<article>`, `<nav>`, `<footer>`). `<div>` for layout containers. Single `<h1>` on the page (in hero). Section titles are `<h2>`, project names are `<h3>`.

### JS

Five small IIFEs at the bottom: loader fade, nav shadow on scroll, mobile nav toggle, intersection observer for reveals, and the i18n language switcher (which also handles the lang-menu keyboard navigation). No framework, no bundler. Total: ~280 lines.

### i18n

The page ships with **English** (default) and **Bahasa Indonesia**. The dictionary lives in a single `I18N` object at the bottom of `<body>`. Each translatable string in the HTML is tagged with `data-i18n="dotted.path"`, e.g. `data-i18n="hero.title.suck"`.

- **Switcher**: globe-icon + language code button in the topnav (top right). Click opens a dropdown listing the available languages. Click-outside or `Esc` closes it.
- **Persistence**: chosen language is saved to `localStorage` under `portfolio-lang`.
- **Auto-detect**: on first load, `navigator.language` is checked — any `id-*` browser auto-selects Indonesian; otherwise English.
- **No-flash init**: a tiny inline `<script>` in `<head>` sets `<html lang>` + `data-lang` immediately so screen readers and font shapers don't see the wrong language for one frame.
- **`<html lang>`**: updated dynamically on every switch so accessibility tools re-announce correctly.

### Adding a new language

1. Add a new key to `I18N` in the bottom script block, e.g. `fr: { ... }`. **Every key from `en` must exist** in the new language — the verifier in the test script counts keys per language.
2. Add an `<li>` to the `.lang-menu` listbox: `<button data-lang="fr" ...>Français <span class="lang-native">FR</span></button>`.
3. Update the auto-detect branch in `detect()` if you want the browser to suggest it (e.g. `nav.indexOf('fr') === 0 → 'fr'`).
4. Verify in browser: switch, reload (state should persist), check `<html lang>` and `localStorage`.

### What gets translated

- All section eyebrows, titles, body copy
- Nav links, CTAs, hero meta captions
- Skill tile descriptions (the small italic line under each tool name)
- Project names, taglines, category tags (`Featured`, `Coursework`)
- Footer copyright line

### What does NOT get translated

- **Brand & code**: "Gilang", "portfolio" (kept — though the brand wordmark `portofolio` swaps in ID)
- **Tool & framework names**: Laravel, CodeIgniter, MySQL, Git, GitHub, VS Code, Composer
- **Project names**: KlinikApp, KlikKode, SIA GILANG (these are GitHub repo slugs)
- **Marquee strip**: the rolling signature uses brand-voice English in both languages. Translating the marquee dilutes the brand.
- **OG / Twitter meta**: the share card stays English. Client-side swaps can't update server-rendered meta.
- **Code snippets in tagline**: `Laravel 11 · MySQL · Kategori + Produk` — technical, kept as-is.

### Commit messages

Format:
```
<scope>: <one-line summary>

<what changed, with motivation, in 3-8 sentences>

<verification: what to look at / how to confirm>
```

Scope is one of: `editorial redesign`, `polish navbar`, `animate scenes`, etc. Keep the prefix short and stable so `git log --oneline` reads as a story.

---

## 10 · Pre-flight checklist before committing

- [ ] The page loads in one request, no console errors.
- [ ] All section reveals animate in (scroll up and down).
- [ ] Mobile (375px wide): no horizontal scroll, nav links hide, CTAs still clickable.
- [ ] Color count is the same as before. New file should not introduce new colors.
- [ ] No AI-isms in copy. No "let me", "in this guide", "I hope this helps".
- [ ] No emojis in comments. Comments are plain.
- [ ] No unused CSS rules. Delete what isn't needed.
- [ ] `git diff --stat` shows small, focused changes — not 500 lines of unrelated tweaks.
- [ ] The pre-commit screenshot looks the same as last time, plus whatever was actually intended to change.