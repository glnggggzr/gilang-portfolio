# Scene specs — Gilang's portfolio

5 scenes · scroll-through · isometric clay-diorama world · accent-driven.
Replace `assets/scenes/<id>.svg` placeholders with generated stills + clips.

## Brand kit

| Field            | Value                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| `SUBJECT`        | Personal portfolio of Gilang — a web developer building with Laravel & CodeIgniter. |
| `BRAND_NAME`     | `Gilang`                                                               |
| `PALETTE`        | cream `#F5EDE0` (BG), plum `#241d2b` (ink), lavender `#8a7bb5` (default accent). |
| `TONE`           | confident · casual · developer-friendly                                |
| `STYLE`          | Isometric low-poly clay diorama, soft matte, tilt-shift miniature, warm studio lighting. |

### Per-scene accents

Each scene overrides `--sw-accent` via the `accent` field in `index.html`:

| # | Scene       | Accent     | Why                                |
| - | ----------- | ---------- | ---------------------------------- |
| 1 | Hero        | `#8a7bb5`  | lavender — welcoming, soft          |
| 2 | About       | `#ffb347`  | amber — friendly, warm              |
| 3 | KlinikApp   | `#7dd3a8`  | sage — medical / clean              |
| 4 | KlikKode    | `#ec5b8e`  | pink — playful / energetic          |
| 5 | Contact     | `#5b8def`  | blue — trustworthy / calm           |

The scene backgrounds in the SVGs are lightly tinted toward the accent —
match this when generating the real stills so the page reads as one world.

---

## Scene 1 · Hero — `id=hero`

**Mini scene subject (what to render):**
A friendly dev workshop viewed from the outside. Soft warm lighting. Inside:
a curved desk with a screen showing colourful code, a mechanical keyboard,
a few stickers, a mug, an analog clock, a small plant. A pinboard with
sticky notes behind the desk. ~3 tiny abstract figures (no real people) at
the desk. Soft tilt-shift miniature effect to make the room feel like a
diorama.

**Copy that pins to this scene:**

| Field       | Value                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `eyebrow`   | `Hi, I'm`                                                                                              |
| `title`     | `I build web apps that don't suck.`                                                                    |
| `body`      | `I'm Gilang — a web developer who ships in Laravel & CodeIgniter, and gets a little too excited about gamification.` |
| `tags`      | `Indonesia`, `PHP · Laravel · CodeIgniter`, `Open to work`                                             |

**Pacing:** `scroll: 1.6, linger: 0.45` — the hero gets the longest dwell
and the camera settles around the title's apex.

---

## Scene 2 · About — `id=about`

**Mini scene subject:**
An open toolbox / workshop bench. Tools arranged neatly:
stacks of branded crates labelled "Laravel", "CodeIgniter", "PHP", "MySQL",
"Git", each with a tiny icon. A neat row of small monitors showing empty
editors. A clipboard with "Currently learning: AI-assisted workflows".
Warm amber light from above.

**Copy:**

| Field       | Value                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `eyebrow`   | `About`                                                                                                |
| `title`     | `Stack, story, and what I'm learning next.`                                                            |
| `body`      | `Four repos shipped this month, a Laravel clinic in production, and a CodeIgniter sidekick on standby. Currently exploring AI tooling.` |
| `tags`      | `Laravel 11`, `CodeIgniter 4`, `PHP 8.3`, `MySQL`, `Git · GitHub`, `Higgsfield-powered scenes`         |

**Pacing:** `scroll: 1.3, linger: 0.40` — brisk transit, a touch of breathing room.

---

## Scene 3 · KlinikApp — `id=klinik`

**Mini scene subject:**
A miniature 3D clinic. One building, slight tilt-shift. Visible interior:
- a waiting area (3 little chairs with magazines)
- a reception desk with a small sign "KlinikApp"
- a doctor's office with a desk, computer, and a few clipboards
- a vitals sign with a tiny heartbeat line on the wall
Sage-green accents throughout. Soft contact shadow.

**Copy:**

| Field       | Value                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `eyebrow`   | `Project 01`                                                                                           |
| `title`     | `A clinic app that feels calm.`                                                                        |
| `body`      | `Laravel 11 · MySQL · appointments, patient records, dashboards. Built end-to-end with migrations, seeders, and a clean CRUD baseline.` |
| `tags`      | `github.com/gilangg24/KlnikApp`, `Laravel 11`, `Blade · Tailwind`                                      |

**Pacing:** `scroll: 1.5, linger: 0.45` — narrative scene, gets a beat.

---

## Scene 4 · KlikKode — `id=klikkode`

**Mini scene subject:**
A miniature "trophy hall" — an open-plan gaming-style room:
- three podiums (gold/silver/bronze) with abstract leaderboard avatars
- a giant leaderboard screen on the back wall showing names + XP
- a question card floating on a podium with `<?>` symbol
- floating "+XP" particles drifting upward
Pink/magenta palette accents throughout. Snappy energy.

**Copy:**

| Field       | Value                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `eyebrow`   | `Project 02`                                                                                           |
| `title`     | `A quiz that turns learning into XP.`                                                                  |
| `body`      | `CodeIgniter 4 · gamified quiz app — XP, leaderboards, topic paths. The kind of project that makes you forget you're studying.` |
| `tags`      | `github.com/gilangg24/klikkode`, `CodeIgniter 4`, `Gamification`                                       |

**Pacing:** `scroll: 1.5, linger: 0.45` — paragraph scene, gives the reader time to read.

---

## Scene 5 · Contact — `id=contact`

**Mini scene subject:**
The dev workshop (Scene 1) again — same room, but the front wall has
swung open like a garage door, and the camera is now flying OUTSIDE through
that opening. Outside: a wide path leading toward the camera. At the
opening, large floating icons — an `@` for email and a `<>` for GitHub —
and on the desk inside, a small speech bubble with "Let's build —". The
transition suggests "step into my world → work with me."

**Copy:**

| Field       | Value                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------ |
| `eyebrow`   | `Let's build something`                                                                                |
| `title`     | `Open for freelance & full-time roles.`                                                                |
| `body`      | `Got an idea, a project, or a position in mind? I'm one email or one DM away. Let me know what you're building.` |
| `tags`      | `gilangramdhani708@gmail.com`, `GitHub: @gilangg24`, `Based in Indonesia`                              |
| `cta`       | primary `Email me` → `mailto:gilangramdhani708@gmail.com`                                              |
|             | secondary `GitHub` → `https://github.com/gilangg24`                                                    |

**Pacing:** `scroll: 1.4, linger: 0.50` — finale, holds CTA the longest.

---

## Connectors (4)

Per `references/prompts.md §connector`. Each connector pairs the LAST
frame of the source dive with the FIRST frame of the next dive for a
seamless aerial transition.

| # | From → To               | Slot in `index.html`          |
| - | ----------------------- | ----------------------------- |
| 1 | Hero → About            | `connectors[0]`               |
| 2 | About → KlinikApp       | `connectors[1]`               |
| 3 | KlinikApp → KlikKode    | `connectors[2]`               |
| 4 | KlikKode → Contact      | `connectors[3]`               |

If a connector can't be generated (e.g. NSFW false-positive), leave the
slot `null` in the config — the engine crossfades that seam directly.
