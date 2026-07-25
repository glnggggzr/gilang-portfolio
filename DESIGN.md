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
| `--ink-soft` | `#948aa3` | Tertiary text, eyebrows, captions |
| `--accent` | `#ff5b3a` | **Coral. The only saturated color.** Used for: brand mark, live dots, hover states, CTA hover, marquee italics, accent line on eyebrows |
| `--accent-ink` | `#b5371a` | Darker coral, used inside coral backgrounds for readable text |
| `--line` | `rgba(26,21,48,0.10)` | Subtle borders |
| `--line-strong` | `rgba(26,21,48,0.20)` | Visible borders |

**Rule**: if a new color is needed, don't add it. Use existing tokens with different opacity instead. A second accent is forbidden.

### Typography

Three fonts, three jobs. Google Fonts loaded once at top.

| Font | CSS var | Use |
|---|---|---|
| **Fraunces** (variable serif, opsz 9–144) | `--display` | All headlines, brand, project titles, contact CTA, italic accents. The "editorial" voice. |
| **Inter** (400/500/600/700) | `--body` | All body copy, buttons, nav links, bio text. |
| **JetBrains Mono** (400/500/700) | `--mono` | Eyebrows, code, tag pills, project numbers, marquee items. Anything that should look terminal-y. |

**Type scale** (use clamp where responsive is needed):
- Hero headline: `clamp(3rem, 9vw, 8.5rem)`, line-height `0.96`, letter-spacing `-0.035em`
- Section title: `clamp(2rem, 4.4vw, 3.6rem)`, line-height `1.04`
- Project name: `clamp(1.6rem, 2.6vw, 2.2rem)`
- Body: `16px` base, `1.05–1.18rem` for hero/intro
- Mono caption: `10–11px`, letter-spacing `0.06–0.32em`, often uppercase

**Rule**: Fraunces italic is for accent, never full sentences. Inter doesn't get italic for emphasis — use weight 600 instead.

### Brand mark

The G monogram is the visual anchor. Use it consistently:
- 30×36px rounded square (radius 6px 6px 8px 8px — slightly tapered at bottom)
- Coral background, white serif "G" inside
- Soft shadow `0 6px 16px rgba(255,91,58,0.28)`
- On hover: rotate `-6deg` and `scale(1.05)` over 350ms

It appears in the navbar, the loader, and can be reused as a favicon or watermark. Don't make new versions of it (different sizes, colors, fonts).

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
- Nav links hide, brand stays, CTA stays but smaller padding
- Hero title: still readable but smaller (clamp handles it)
- Body fonts: reduce via clamp

Below 480px (phone portrait):
- Marquee: still works, just smaller
- Skills grid: 1 column is fine here

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
    <!-- mock component goes here -->
  </div>
  <div class="body">
    <span class="num">01 · Featured</span>
    <h3 class="name">Project title here.</h3>
    <p class="tagline">One-sentence description.</p>
    <div class="stack">
      <span>Laravel 11</span><span>Blade</span><span>MySQL</span>
    </div>
    <div class="meta">
      <a href="...">github.com/user/repo ↗</a>
      <span>· 2026</span>
    </div>
  </div>
</article>
```

For reverse layout: add `style="grid-template-columns: 1fr 1.3fr;"` to swap order.

### Mock components — what to make

Mockups show **real product content**, not generic shapes. The KlikKode mockup shows an actual quiz question (CSRF) because anyone who knows Laravel can verify it. The KlinikApp mockup shows a real dashboard with appointment data, not "lorem ipsum users".

| Mock | Use for | Don't use for |
|---|---|---|
| `m-dash` (dashboard) | Apps with admin/data panels | Landing pages |
| `m-quiz` (quiz UI) | Quiz/learning/gamification apps | E-commerce |
| `m-terminal` (terminal) | CLI tools, dev utilities, scaffolds | Marketing pages |
| `m-table` (data table) | CRUD apps, admin lists | Anything interactive |

When adding a new project, **don't reuse the same mock type** for two projects in a row — alternate. The visual rhythm matters.

### Skills tile (`.skill`)

```html
<div class="skill reveal d1">
  <span class="ico laravel">L</span>
  <div>
    <h4>Tool name</h4>
    <p>v1.0 · short detail</p>
  </div>
</div>
```

The `.ico` uses a 2-letter monogram + gradient background per tool:
- `laravel` (red), `codeigniter` (orange), `php` (purple), `mysql` (teal), `git` (orange-red), `vscode` (blue), `compose` (green), `ai` (coral).

To add a new tool: define a new `.ico-X` class with its brand color gradient.

### Marquee (`.marquee`)

Full-bleed strip with horizontal scroll animation. Already exists. The content cycles are written twice for seamless loop. To change the words, edit both `<span class="marquee-item">` blocks identically.

### Contact CTA (`.contact-mail`)

A pill-shaped button (filled, dark) + serif italic email link beside it. This is the primary action on the page; everything else (project links, GitHub pills) is secondary.

---

## 6 · Motion

### What animates
- Loader: monogram bounces for ~1.4s until fonts ready, then fades.
- Navbar: blur increases + bottom border appears when scrolled past 12px.
- Hero eyebrow dot: live-pulse every 1.6s.
- Marquee: 38s linear infinite horizontal scroll. Pauses on hover.
- Section reveals: opacity + translateY on intersection observer. Delays: 0, .12s, .24s, .36s.

### What does NOT animate
- Project cards do not animate internally. Hover only lifts them by 3px and adds shadow.
- Headlines don't animate in word-by-word or letter-by-letter.
- Mock components don't have animations inside them.

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

1. Choose a mock component that fits the project (don't reuse the last project's mock type).
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
- **Don't** add animation to project mockups — they should look like static screenshots of real product.
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
  scenes/               # animated SVGs for the scroll-world deeper view (currently unused on main page)
references/
  scenes.md             # scene specs (museum)
  prompts.md            # Higgsfield / Codex prompt templates (museum)
  pipeline.md           # generation scripts (museum)
  runbook.md            # end-to-end asset-generation runbook (museum)
README.md
LICENSE                 # MIT, with oso95/scroll-world attribution
.gitignore              # node_modules, screenshots, env, vendor
```

The `references/` directory is a museum — leftover from when the scroll-world experience was the centerpiece. The current main page doesn't use it. **Keep it** so future-you remembers how to rebuild the 3D experience.

### CSS

Single `<style>` block in `<head>`. Sections marked with plain comments like `/* 1 · HERO */`. No dashes-as-decoration, no emoji. BEM-ish naming (`.proj`, `.proj .body`, `.proj .num`) but no strict methodology.

Variables in `:root`. Reuse them, don't redefine.

### HTML

Semantic where it matters (`<header>`, `<section>`, `<article>`, `<nav>`, `<footer>`). `<div>` for layout containers. Single `<h1>` on the page (in hero). Section titles are `<h2>`, project names are `<h3>`.

### JS

Three small IIFEs at the bottom: loader fade, nav shadow on scroll, intersection observer for reveals. Plus the lazy-mount of the scroll-world engine. No framework, no bundler. Total: ~50 lines.

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