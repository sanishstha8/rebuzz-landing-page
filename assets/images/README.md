# Images

## Current contents

| File | Purpose |
| --- | --- |
| `og-cover.png` | Share card for link previews, 1200×630. This is what the pages reference. |
| `og-cover.svg` | Source of the share card. Edit this, then re-export the PNG. |
| `create-backup.png` | Real screenshot (v1.6.0) — Backups tab while a backup runs (progress bar, empty list). |
| `your-backups.png` | Real screenshot — Backups tab after a backup: stats cards, Create Backup, backup list (Download / Restore / Delete). |
| `restore-choose.png` | Real screenshot — Restore tab: pick a saved backup or upload a ZIP. |
| `restore-confirm.png` | Real screenshot — "Restore this backup" screen: contents table, warning, remove-files option and the finished-restore summary. |
| `settings.png` | Real screenshot — Settings tab: include WordPress core option and system information. |
| `banner.png` | Product banner, 1544×500. Used as the closing call-to-action on the home page (links to the WordPress.org plugin page). |

## Share card

Facebook and LinkedIn don't render SVG share cards, so the pages point at
`og-cover.png`. After editing `og-cover.svg`, re-export it at 1200×630, for
example with headless Chrome:

```
chrome --headless=new --window-size=1200,630 --screenshot=og-cover.png og-cover.svg
```

Share-image URLs must be absolute, so the meta tags in `index.html`
use the full site address (also in `<link rel="canonical">` and
`og:url`).

## Real plugin screenshots

The five plugin screenshots are in the “A look inside” section
(`#screenshots`). The page shows only real captures, with no mockups, and each
caption only describes what its screen shows, so check the copy whenever you
swap an image. Retaking one: keep a new file name (not the old one) so browsers
and the CDN don't keep showing the cached image.

To add another screen, drop the PNG here and add a `.tour__item` to the
`#screenshots` section, copying an existing one. Alternate `tour__item--flip` so
image and text swap sides:

```html
<figure class="tour__item">
  <a class="shot__zoom tour__shot" href="assets/images/new-screen.png" target="_blank" rel="noopener" aria-label="Open the new screen screenshot at full size">
    <img src="assets/images/new-screen.png"
         alt="Describe exactly what this screen shows."
         width="1700" height="860" loading="lazy" decoding="async">
    <span class="shot__zoom-hint" aria-hidden="true"><svg class="ico"><use href="#i-maximize"></use></svg>Full size</span>
  </a>
  <figcaption class="tour__text">
    <h3 class="tour__title">A short, plain heading</h3>
    <p>What the reader is looking at, and why it matters to them.</p>
  </figcaption>
</figure>
```

The `shot__zoom` link is what makes it open in the full-size viewer. Keep the
`alt` text descriptive: it is the only description a screen-reader user gets.
Use the image's real pixel dimensions for `width`/`height` (prevents layout
shift); don't reuse the numbers above.

Capture at 2× (around 1600–2000px wide), export as PNG for UI, and compress
with something like `oxipng` or Squoosh before committing.
