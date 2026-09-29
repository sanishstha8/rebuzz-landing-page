# Images

## Current contents

| File | Purpose |
| --- | --- |
| `og-cover.png` | Share card for link previews, 1200×630. This is what the pages reference. |
| `og-cover.svg` | Source of the share card. Edit this, then re-export the PNG. |
| `dashboard.png` | Real screenshot — ReBuzz Backup and Restore admin page (system info + Create Backup). |
| `backup.png` | Real screenshot — backup history table (Download / Restore / Delete). |
| `restore.png` | Real screenshot — Restore Backup page (upload ZIP + existing backups). |
| `banner.png` | Product banner, 1544×500. Used as the closing call-to-action on the home page (links to the download page). |

## Share card

Facebook and LinkedIn don't render SVG share cards, so the pages point at
`og-cover.png`. After editing `og-cover.svg`, re-export it at 1200×630, for
example with headless Chrome:

```
chrome --headless=new --window-size=1200,630 --screenshot=og-cover.png og-cover.svg
```

Share-image URLs must be absolute, so the meta tags in `index.html` and
`download.html` use the full site address (also in `<link rel="canonical">` and
`og:url`).

## Real plugin screenshots

`dashboard.png`, `backup.png` and `restore.png` are in the “A look inside”
section (`#screenshots`). The page shows only real captures, with no mockups.

To add another screen (a Settings capture would be the obvious next one), drop
the PNG here and add a `.tour__item` to the `#screenshots` section, copying an
existing one. Alternate `tour__item--flip` so image and text swap sides:

```html
<figure class="tour__item">
  <a class="shot__zoom tour__shot" href="assets/images/settings.png" target="_blank" rel="noopener" aria-label="Open the settings screenshot at full size">
    <img src="assets/images/settings.png"
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
