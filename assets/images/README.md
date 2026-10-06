# Images

## Current contents

| File | Purpose |
| --- | --- |
| `og-cover.png` | Share card for link previews, 1200×630. This is what the pages reference. |
| `og-cover.svg` | Source of the share card. Edit this, then re-export the PNG. |
| `create-backup-v180.png` | Real screenshot (v1.8.0) — Backups tab while a backup runs (progress bar at 30%), list cropped after three rows. |
| `your-backups-v180.png` | Real screenshot (v1.8.0) — Backups tab: stats cards (incl. next backup), Create Backup, backup list with Scheduled / S3 / Dropbox tags, cropped after three rows. |
| `restore-choose-v180.png` | Real screenshot (v1.8.0) — Restore tab: pick a saved backup (cropped after four rows) or upload a ZIP. |
| `restore-confirm-v180.png` | Real screenshot (v1.8.0) — "Restore this backup" screen before confirming: contents table, warning, remove-files option, Restore Backup button. |
| `settings-v180.png` | Real screenshot (v1.8.0) — Settings tab: include WordPress core option and system information. |
| `schedule-v180.png` | Real screenshot (v1.8.0) — Schedule tab: next / last scheduled backup, frequency, time, keep-N, email notices, Run now. |
| `storage-v180.png` | Real screenshot (v1.8.0) — Storage tab, the S3 and Dropbox cards only. Captured from a test site; the form fields were filled with example values in the browser (not saved) and the Dropbox account name reads "Demo User". |
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

The seven plugin screenshots are in the “A look inside” section
(`#screenshots`). The page shows only real captures, with no mockups, and each
caption only describes what its screen shows, so check the copy whenever you
swap an image. Retaking one: keep a new file name (not the old one) so browsers
and the CDN don't keep showing the cached image.

The section is a set of tabs named after the plugin's own tabs (Backups,
Restore, Schedule, Storage, Settings). Each `.tour__panel` holds one or two
`.tour__item` screens; when a panel has two, `script.js` adds a small switch
above the caption, labelled from each screen's `data-view`. Without JS every
screen shows, stacked. The arrow buttons on the sides of the screenshot (added
by `script.js`), or a left/right swipe on touch screens, step through every
screen in page order, across tabs. Every screenshot sits in the same 16:10 frame, so a
taller capture shows its top part and "Full size" opens the rest: put what
matters near the top.

To add a screen to an existing tab, drop the PNG here and add a `.tour__item`
to that tab's panel (two per panel at most):

```html
<figure class="tour__item" data-view="Short label">
  <a class="shot__zoom tour__shot" href="assets/images/new-screen.png" target="_blank" rel="noopener" aria-label="Open the new screen screenshot at full size">
    <img src="assets/images/new-screen.png"
         alt="Describe exactly what this screen shows."
         width="1700" height="860" loading="lazy" decoding="async">
    <span class="shot__zoom-hint" aria-hidden="true"><svg class="ico"><use href="#i-maximize"></use></svg>Full size</span>
  </a>
  <figcaption class="tour__text">
    <h3 class="tour__title">A short, plain heading</h3>
    <p>Two or three sentences: what the reader is looking at, and why it matters.</p>
  </figcaption>
</figure>
```

For a new plugin tab, add a `<button role="tab">` to `.tour__tabs` and a
matching `<div class="tour__panel" role="tabpanel">`, copying an existing pair
and keeping `id`, `aria-controls` and `aria-labelledby` in step.

The `shot__zoom` link is what makes it open in the full-size viewer. Keep the
`alt` text descriptive: it is the only description a screen-reader user gets.
Use the image's real pixel dimensions for `width`/`height` (prevents layout
shift); don't reuse the numbers above.

Capture at 2× (around 1600–2000px wide), export as PNG for UI, and compress
with something like `oxipng` or Squoosh before committing.
