# Quick-start runbook

Get from "this scaffold" to a live, scrollable 3D portfolio in ~1–2 hours
if you have Higgsfield credits or Codex CLI logged in. ~30 minutes if you
just want the static stills version (no flights between scenes yet).

## 0 · Get the tools

| Tool        | Why                                | Install                                                                  |
| ----------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `higgsfield` | generate the stills + dive clips  | `npm i -g @higgsfield/cli` then `higgsfield auth login`                |
| `ffmpeg`    | encode for smooth scrubbing        | https://www.ffmpeg.org/download.html (Windows: scoop / choco / manual)  |
| `codex`     | alternative stills source         | optional; `npm i -g @openai/codex` then `codex login`                    |
| `node`      | already on system (we used it)    | —                                                                        |

## 1 · Decide the backend (Step 1.6 of SKILL.md)

- **Codex CLI installed + logged in** → use it for stills (subscription-billed, zero credits):
  ```bash
  codex login status   # should show "logged in"
  ```
- **No Codex, have Higgsfield** → use `gpt_image_2` for stills.
- **Neither** → run with placeholder stills (the .svg files in `assets/scenes/`); ship as soon as the page looks coherent, generate real ones later.

## 2 · Generate the stills (one per scene)

```bash
mkdir -p assets/stills

# Using Codex CLI (one at a time; not too many in parallel):
for i in 1-hero 2-about 3-klinik 4-klikkode 5-contact; do
  codex exec -C . -s workspace-write --skip-git-repo-check \
    "Use the image generation tool (\$imagegen) to generate: \"$(cat references/prompts.md | sed -n '/^### Scene '/,\$p | grep -A 8 \"Scene $i\")\" Wide 3:2 landscape, high resolution. Save it as ./assets/stills/${i}.png. Do not do anything else."
done
```

Or using Higgsfield:

```bash
for i in 1-hero 2-about 3-klinik 4-klikkode 5-contact; do
  higgsfield generate create gpt_image_2 \
    --prompt "$(cat references/prompts.md)" \
    --aspect_ratio 3:2 --resolution 2k --quality high \
    --wait --wait-timeout 15m \
    --json > "assets/stills/${i}.json" 2> "assets/stills/${i}.err"
  curl "$(jq -r '.[0].result_url' "assets/stills/${i}.json")" -o "assets/stills/${i}.webp"
done
```

**Cohesion check:** open all 5 stills in a viewer — angle, lighting, palette
should read as one world. If any one is off-style, regenerate *just that one*
(optionally passing another still as `--image` reference to lock the look).

## 3 · Generate the dive-in clips (one per scene)

```bash
mkdir -p assets/src

for i in 1-hero 2-about 3-klinik 4-klikkode 5-contact; do
  higgsfield generate create seedance_2_0 \
    --prompt "$(cat references/prompts.md | grep -A 4 'Dive-in clip')" \
    --start-image "assets/stills/${i}.webp" \
    --mode std --resolution 1080p --aspect_ratio 16:9 --duration 8 \
    --wait --wait-timeout 20m \
    --json > "assets/src/${i}.json" 2> "assets/src/${i}.err"
  curl "$(jq -r '.[0].result_url' "assets/src/${i}.json")" -o "assets/src/${i}.mp4"
done
```

## 4 · Generate the connector clips

(After all 5 dives exist.)

```bash
# Extract the boundary frames
for i in 1 2 3 4; do
  next=$((i+1))
  ffmpeg -y -sseof -0.15 -i "assets/src/${!next}.mp4" -frames:v 1 -q:v 2 "assets/src/conn-${i}-${next}_last.png" 2>/dev/null   # placeholder
done
# Run the upstream §6 connector batch script with the connector prompt.

for i in 1-2 2-3 3-4 4-5; do
  # parse "1-2" into i=1, j=2 for --start-image / --end-image
  a="${i%-*}"; b="${i#*-}"
  src="assets/src/${a}.mp4"; dst="assets/src/${b}.mp4"
  ffmpeg -y -sseof -0.15 -i "$src" -frames:v 1 -q:v 2 "assets/src/_${a}_last.png"
  ffmpeg -y -ss 0 -i          "$dst" -frames:v 1 -q:v 2 "assets/src/_${b}_first.png"
  higgsfield generate create seedance_2_0 \
    --prompt "$(cat references/prompts.md | grep -A 4 'Connector clip')" \
    --start-image "assets/src/_${a}_last.png" \
    --end-image   "assets/src/_${b}_first.png" \
    --mode std --resolution 1080p --aspect_ratio 16:9 --duration 5 \
    --wait --wait-timeout 20m --json > "assets/src/conn-${i}.json" 2> "assets/src/conn-${i}.err"
  curl "$(jq -r '.[0].result_url' "assets/src/conn-${i}.json")" -o "assets/src/conn-${i}.mp4"
done
```

## 5 · Encode for the engine

Use the loop in `pipeline.md`. Output lands in `assets/vid/`.

## 6 · Wire it up

1. Replace `assets/scenes/<id>.svg` references in `index.html` with `.webp`
   (or just rename the encoded PNG to .webp). Update the file extensions.
2. Uncomment the `connectors[]` and `connectorsMobile[]` lines in `index.html`.
3. Save. The page now scrubs through real clips.

## 7 · Test + deploy

- Open `index.html` locally (drag-drop into browser).
- Open DevTools → Mobile toggle → confirm `-m.mp4` loads when present.
- Verify by scrolling on a real phone (iOS Safari especially).
- See `SKILL.md §8 QA` for the seam-pop test.

## Sanity-script (Laravel-like)

```bash
# All assets present?
ls assets/vid/*.mp4 | wc -l   # → 9 (5 dives + 4 connectors) for desktop-only
                               # → 18 if you also generated mobile variants

# ffprobe each:
ffprobe -v error -show_entries format=duration -of default=nw=1 assets/vid/1-hero.mp4
```

If `9`, you're good to ship. If `< 9`, look at the latest `.err` files.
