# Prompt templates — Gilang's portfolio

Adapt the upstream `oso95/scroll-world` prompt patterns to this project's
brand kit. Keep the **style preamble byte-for-byte identical across all
scenes** — that shared text is what makes the world feel like one place.

## Style preamble (use verbatim in every still/dive prompt)

```
Isometric low-poly 3D diorama floating as a small rounded island on a plain
solid cream #F5EDE0 background with a soft contact shadow beneath it. Soft
matte clay 3D render, rounded toy-model shapes, gentle warm studio lighting,
soft long shadows, tilt-shift miniature look. Cohesive palette:
cream #F5EDE0, plum #241d2b, lavender #8a7bb5, amber #ffb347, sage #7dd3a8,
pink #ec5b8e, blue #5b8def — biased toward the section's accent. Highly
detailed, centered composition, absolutely no text, no letters, no numbers,
no logos.
```

The last clause biases toward the per-scene accent — e.g. for Scene 4
(KlikKode), say "biased toward pink #ec5b8e" instead.

---

## Scene still prompt (1 per scene)

```
[STYLE PREAMBLE]
Subject: [SCENE-SUBJECT — copied from references/scenes.md §<n>]
```

Aspect `3:2`, `--resolution 2k --quality high`.

### Scene 1 — Hero subject

```
a friendly dev workshop viewed from outside. Inside: a curved desk with a
monitor showing colourful code, a mechanical keyboard, a few stickers, a
mug, an analog clock, a small plant. A pinboard with sticky notes behind
the desk. Three small abstract figures (no real people, no faces, no
identifiable features) sitting at the desk.
```

### Scene 2 — About subject

```
an open toolbox workshop bench. Neatly arranged stacks of small crates
labelled "Laravel", "CodeIgniter", "PHP", "MySQL", "Git" — each with a tiny
generic icon on the front. A row of small monitors showing empty editor
windows. A clipboard with the text "Learning: AI-assisted workflows" (text
ok in artwork — small details only).
```

### Scene 3 — KlinikApp subject

```
a miniature 3D clinic with a slight tilt-shift miniature effect. Visible
interior: a waiting area with three small chairs and a stack of magazines,
a reception desk with a small sign "KlinikApp", a doctor's office with a
desk and computer, a vitals sign on the wall with a tiny heartbeat line.
Soft sage-green accents.
```

### Scene 4 — KlikKode subject

```
a miniature gaming-style "trophy hall". Three podiums (gold, silver, bronze)
each with a small abstract avatar figure (no faces). A large leaderboard
screen on the back wall shows three short placeholder names with XP values
(use generic names like "aaa", "bbb", "ccc" — no real-looking names).
Floating "+XP" particles drift upward. Pink accents.
```

### Scene 5 — Contact subject

```
the same dev workshop as Scene 1, but the front wall has swung open like a
garage door — the camera is now flying OUTSIDE through that opening. Outside
on a wide path leading toward the camera, two large floating icons: a stylised
"@" symbol and a stylised "<>" symbol. Inside, on the desk, a small speech
bubble saying "Let's build —". Blue accents.
```

---

## Dive-in clip prompt (1 per scene)

`--start-image = the scene still`.

```
Single continuous cinematic camera move, no cuts. Begin high and far,
looking down at the whole <SCENE-SUBJECT> from outside like a tiny model.
The camera slowly glides forward and descends toward it, sweeping in toward
<the desk / the toolbox / the clinic reception / the trophy hall / the
opening>. As the camera pushes in, the roof and upper structure gently lift
and open away to reveal the warm interior. Soft matte clay diorama,
tilt-shift miniature, warm light, [PALETTE]. Smooth, graceful, slow motion,
subtle parallax. No text, no captions, no real human faces.
```

Params (seedance): `--mode std --resolution 1080p --aspect_ratio 16:9 --duration 8`.
(Kling3_0 alternative: drop `--resolution`, add `--sound off`, `--duration 10`.)

For Scene 5 (Contact), replace the "roof lifts open" clause with:
**"the camera glides forward, through the open garage-like wall of the workshop, into the bright outside path"**.

---

## Connector clip prompt (4 total)

`--start-image = dive_i LAST frame` (extracted from rendered video).
`--end-image = dive_{i+1} FIRST frame` (extracted).

```
Single continuous cinematic camera move, no cuts. The camera smoothly pulls
up and back out of <SCENE i>, rises into the sky, then glides forward across
the connected miniature world and arrives above <SCENE i+1>, beginning to
descend toward it. One connected miniature clay world, seamless flowing
aerial transition. Soft matte clay, tilt-shift miniature, warm light,
[PALETTE]. Smooth graceful slow motion. No text, no captions.
```

Params: `--mode std --resolution 1080p --aspect_ratio 16:9 --duration 5`.

For the final connector (Scene 4 → Scene 5): add
**"…and approaches a workshop with its front wall swung open — the camera tips gently out toward the outside."**

---

## Generation backend choice (Step 1.6 of SKILL.md)

Pick **one** for the whole chain:

| Backend       | Cost model                       | Notes                                                                  |
| ------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Higgsfield    | credits (paid)                   | default; `gpt_image_2` stills + `seedance_2_0` video, see SKILL Step 4 |
| Codex CLI     | ChatGPT subscription (no credits) | only if `codex` is on `$PATH`; `image_gen` for stills                 |

Mixing models mid-chain → visible style drift at seams → avoid.

For this project: **Codex is recommended if available** (zero credits);
Higgsfield if you have credits and want higher fidelity. Either way, stay
on one model throughout.
