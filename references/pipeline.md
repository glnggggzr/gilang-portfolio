# Pipeline — generate & encode

Copy/paste the upstream pipeline (`references/pipeline.md` in `oso95/scroll-world`).
This file is the **project-specific patching** on top.

## Asset layout

```
assets/
  scenes/                     # stills (PNG/WebP, 1536×1024)
    1-hero.svg / .webp / .png
    2-about.svg / .webp / .png
    3-klinik.svg / .webp / .png
    4-klikkode.svg / .webp / .png
    5-contact.svg / .webp / .png
  vid/                        # desktop 1080p clips
    1-hero.mp4 / 2-about.mp4 / 3-klinik.mp4 / 4-klikkode.mp4 / 5-contact.mp4
    conn-1-2.mp4 / conn-2-3.mp4 / conn-3-4.mp4 / conn-4-5.mp4
  vid/*-m.mp4                  # mobile portrait 720p encodes (opt-in)
```

`assets/scenes/*.svg` are the placeholders baked into the repo. **Replace
them with generated stills** (same filename, swap extension to `.webp`) once
you have them — the engine will pick them up because `index.html` references
the `.svg` extension explicitly. Update `index.html` to point to the new
extension if you change format.

## Encode (Step 6 of SKILL.md)

ffmpeg is required. If missing locally, see `runbook.md` for install links.

```bash
# Desktop master encode — every clip, same flags (1080p, GOP 8, no audio)
for c in 1-hero 2-about 3-klinik 4-klikkode 5-contact conn-1-2 conn-2-3 conn-3-4 conn-4-5; do
  ffmpeg -y -i "assets/src/${c}.mp4" -an \
    -vf "unsharp=5:5:0.8:5:5:0.0,scale=1920:-2" \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
    -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart \
    "assets/vid/${c}.mp4"
done
```

```bash
# Mobile encode — portrait 720p, GOP 4, crf 23 (only if you opted in)
# Generate as a 9:16 portrait chain (see pipeline.md upstream §6b).
for c in 1-hero 2-about 3-klinik 4-klikkode 5-contact conn-1-2 conn-2-3 conn-3-4 conn-4-5; do
  ffmpeg -y -i "assets/src/${c}-m.mp4" -an \
    -vf "unsharp=5:5:0.8:5:5:0.0,scale=720:-2" \
    -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart \
    "assets/vid/${c}-m.mp4"
done
```

After encodes, re-edit `index.html` to **uncomment** the connector lines
in the `connectors[]` / `connectorsMobile[]` arrays.

## Sanity check (Step 8 of SKILL.md)

```bash
# Each clip's duration and dimensions:
for f in assets/vid/*.mp4; do
  echo "== $f =="; ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,duration -of default=nw=1 "$f"
done

# Verify seam frames match (only if you screenshot the page with Playwright/Puppeteer):
#   screenshots at y = dive_i.end - 0.05vh and y = conn_i.start + 0.05vh
#   must be near-identical (pop = bad seam).
```

## Deploy

The page is static HTML — any static host works.

| Host       | What to do                                                       |
| ---------- | ----------------------------------------------------------------- |
| GitHub Pages | Settings → Pages → branch `main` / folder `/` → Save            |
| Netlify    | Drag-and-drop the project folder at https://app.netlify.com/drop  |
| Vercel     | `vercel` in the project root — zero config                        |

For all three: **don't push the `assets/src/` master renders**, only the
encoded `assets/vid/*.mp4`. Master files are 10–100× bigger. Add
`assets/src/` and `*.mov` to `.gitignore`.
