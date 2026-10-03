# ReBuzz Backup &amp; Restore — Landing Page

The official marketing site for **ReBuzz Backup &amp; Restore**, a WordPress
backup, restore and migration plugin.

A static, single-page site with a light and a dark theme. No build step, no
framework, no runtime dependencies. Open `index.html` and it works.

---

## Run it

```bash
# simplest — just open the file
start index.html          # Windows
open index.html           # macOS

# or serve it, which is closer to production
npx serve .
python -m http.server 8000
```

Nothing needs to be installed or compiled.

---

## Structure

```
rebuzz-landing/
├── index.html              # the landing page + its inline icon sprite
├── _redirects              # old /download links -> the WordPress.org listing
├── tailwind.config.js      # design tokens, for a future Tailwind build
├── README.md
└── assets/
    ├── css/style.css       # the whole design system
    ├── js/script.js        # nav, mobile menu, screenshot lightbox, FAQ, pricing toggle
    ├── icons/
    │   ├── favicon.svg
    │   └── README.md
    └── images/
        ├── og-cover.svg    # 1200×630 share card
        ├── create-backup.png   # real plugin screenshots (v1.6.0)
        ├── your-backups.png
        ├── restore-choose.png
        ├── restore-confirm.png
        ├── settings.png
        └── README.md       # how to add more screenshots
```

Structure, styling and behaviour are in three separate files. The CSS is
organised into numbered sections with a table of contents at the top; the JS
is a set of independently-guarded `init*()` modules.

---

## Design system

Warm and plain, meant to read like something a person made rather than a
template: an off-white paper background, serif headlines, readable body text,
one green accent, and real plugin screenshots instead of illustrations.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--bg` | `#FBFAF7` | `#0E1513` | page background |
| `--surface` | `#F3F1EB` | `#121B18` | alternating section bands |
| `--panel` | `#FFFFFF` | `#16211E` | cards and screenshot frames |
| `--green` | `#0E8A5F` | `#3CCB94` | large text and icons only (4.2:1) |
| `--green-1` | `#0A7150` | `#5ADBA6` | links and small green text |
| `--btn-bg` | `#0B7A52` | `#3CCB94` | primary button (white text 5.4:1) |
| `--text` / `--text-2` / `--text-3` | `#1D1C19` / `#45423B` / `#6B675E` | `#E8EFEC` / `#B3C1BC` / `#8FA09A` | headings / body / captions |

### Switching themes

Every colour on the page resolves through a variable, so a dark theme is one
attribute away and needs no other edit:

```html
<html lang="en" data-theme="dark">
```

There is no toggle UI — add one only if you want users to choose. If you do,
set the attribute on `<html>` and persist the choice; nothing else has to change.

**Contrast.** `--green` is 4.2:1 on the page background, which is fine for
headline text and icons but not for small text, so links use the darker
`--green-1` (5.8:1). Every text pair on the page clears WCAG AA.

**Type:** Source Serif 4 for section headings, Inter for everything else
(including the hero headline), IBM Plex Mono only for the hero's vault labels
and chips. All from Google Fonts with system fallbacks. Headings are sentence
case.

**Things deliberately left out**, because they read as machine-made: uppercase
monospace labels above headings, two-tone grey-and-black headlines, icons in
tinted squares, floating status chips, looping decorative animation, and
invented UI mockups. Keep them out when adding sections. (The hero is the one
deliberate exception; see "What's in the page".)

### Why not the Tailwind CDN

The brief listed Tailwind. This ships hand-written CSS instead, deliberately:

- `cdn.tailwindcss.com` is a ~380 KB JS runtime that generates styles at load,
  and it prints a "should not be used in production" warning to the console.
- Relying on a CDN for layout means the page breaks when opened offline or
  straight from the filesystem — which is exactly how you'll first open it.
- This is one bespoke page. Utility classes earn their keep across many
  components; here they mostly add indirection over a design that is already
  token-driven.

`tailwind.config.js` mirrors every token, so adopting a compiled Tailwind build
later is a mechanical change, not a redesign. That file has the commands.

---

## What's in the page

Hero (the ReBuzz Core) → problem → what it does → a look inside (real
screenshots) → how it works (three steps + moving hosts) → where your backups
live → pricing → FAQ → closing call-to-action → footer.

(Pricing is currently switched off — see below.)

**The hero is intentionally the original design**, kept by request when the
rest of the page was redesigned: Inter headline, the isometric vault with its
status chips, and the original mint-tinted palette. Section 6 of `style.css`
pins those original tokens on `.hero`, so it renders the same regardless of the
page-wide tokens. Only the vault float moves (plus a ~12px pointer parallax,
`initCoreParallax()`); the scan wedge and data threads stay hidden.

### Interactive pieces

| Feature | Notes |
| --- | --- |
| Sticky nav | Gains a hairline past 8px of scroll. |
| Active section | Nav link highlights via `IntersectionObserver` + `aria-current`. |
| Mobile menu | Full-screen overlay with focus trap, `Esc` to close, scroll lock, auto-close above 1024px. |
| Screenshot lightbox | Each screenshot links to its PNG; with JS it opens in a `<dialog>` (pannable at full size on phones). |
| Demo video | "See How It Works" (hero) plays the YouTube demo in a `<dialog>`. The video ID is the `data-video` attribute on that link; the `href` is the YouTube watch URL, which opens in a new tab when JS is off. The iframe (youtube-nocookie.com) is only created when the pop-up opens and removed when it closes, so nothing loads from YouTube until someone asks and closing stops playback. |
| FAQ accordion | Height-animated, `aria-expanded` + labelled regions, arrow-key navigation, multiple open allowed. |
| Pricing toggle | Monthly/yearly, values rendered from `CONFIG.pricing`. |

---

## Pricing is currently switched off

The pricing section is disabled by a single attribute on `<html>` in
`index.html`:

```html
<html lang="en" data-pricing="off">
```

While it is set: the pricing section and its three nav links (header, mobile
menu, footer) are hidden, and the FAQ takes the pricing band's alternating
background so the section rhythm is unbroken.

The plugin is currently free, and the visible copy says so (the first FAQ
answer, the agency and support answers, and "Free download" in the closing
section).

**To bring pricing back, delete `data-pricing="off"`.** Also fill in the real
figures (see below), rewrite those free-plugin lines, and decide what "Get
ReBuzz" should do: right now every "Get ReBuzz" button opens the plugin's
WordPress.org page.

---

## Getting the plugin

The plugin is live on WordPress.org, so the site doesn't host a download any
more. Every "Get ReBuzz" button on the home page (header, mobile menu, hero,
closing banner and button) links to
https://wordpress.org/plugins/rebuzz-backup-and-restore/. The old download page
and zip were removed on 2026-10-02; `_redirects` sends `/download` and
`/download.html` to the same listing, so old links still land somewhere useful.

Releases are made on WordPress.org, so there is nothing to update here when the
plugin version changes. The page doesn't state a version or requirements.

---

## Placeholders to replace before launch

Everything below is intentionally fake-free — no invented statistics,
testimonials, customer logos, review scores, certifications or awards. What
*does* need filling in:

1. **Pricing.** `$49 / $99 / $199` annually are placeholders. Edit
   `CONFIG.pricing` at the top of `assets/js/script.js`, and update the
   matching defaults in the `data-price` spans in `index.html` so the
   pre-JS render is correct too.
2. **Placeholder links.** Every `a[data-placeholder-link]` (Documentation,
   Support, Blog, Changelog, About, Contact, Privacy, Terms, and the plan
   checkout buttons) is intercepted by JS and does not navigate. Point them at
   real URLs and drop the attribute.
3. **Domain.** The workers.dev address appears in the canonical, `og:url`,
   image meta tags and JSON-LD block of `index.html`, and in `robots.txt` and
   `sitemap.xml`. If you add a custom domain, change all of them (see SEO).
4. **OG image.** `og-cover.png` is what the pages reference; it is rendered
   from `og-cover.svg`. Re-export it if you change the SVG — see
   `assets/images/README.md`.
5. **Screenshots.** The page uses five real captures from plugin v1.6.0
   (backup in progress, backup list, restore picker, restore confirmation,
   settings). Retake them when the plugin's screens change; see
   `assets/images/README.md`.

Security copy was written to describe process integrity (verification,
completeness checks, user-controlled storage) rather than making claims that
would need substantiating — no encryption standards, no compliance badges. If
you add hard guarantees later, add them here *and* to the documentation.

---

### One trap worth knowing about

`body` uses **`overflow-x: clip`, not `overflow-x: hidden`**. This is load-bearing.

`overflow-x: hidden` forces the other axis to compute as `auto`, which makes
`<body>` a scroll container. That silently breaks `IntersectionObserver`
against the default (viewport) root, so the active-section nav highlight
stops working, and it moves the scrollport that the sticky header resolves
against. `clip` blocks sideways scrolling without creating a scroller.

## Accessibility

- Semantic landmarks, one `h1`, ordered heading levels, skip link.
- Visible `:focus-visible` rings on every interactive element.
- The accordion follows WAI-ARIA authoring practices, keyboard included.
- Every screenshot has descriptive `alt` text; decorative icons are `aria-hidden`.
- The only autonomous motion is the hero vault's slow float. With
  `prefers-reduced-motion: reduce`, that, the pointer parallax, and the hover
  and accordion transitions are all switched off.
- Everything is visible without JavaScript; screenshots then open as plain links.

## Performance

No frameworks and no runtime CSS generation. The hero visual is inline SVG, so
there is no image on the critical path; screenshots lazy-load with fixed
`width`/`height` to prevent layout shift. Fonts are preconnected with
`display=swap`, and their stylesheet loads without blocking the first paint
(`rel="preload"` swapped to `stylesheet` on load, with a `<noscript>` copy).
That took mobile LCP in a local Lighthouse run from 3.5 s to 1.8 s. Icons are
an inline sprite.

## SEO

What is in place, all in the `<head>` of `index.html` unless noted:

- A keyword-bearing `<title>` (54 characters) and meta description (145), one
  `h1`, ordered headings, descriptive image `alt` text.
- `<link rel="canonical">`, Open Graph and Twitter card tags, and a robots meta.
- A JSON-LD block describing the site (`WebSite`) and the plugin
  (`SoftwareApplication`, free, linking to its WordPress.org listing). It has
  no `aggregateRating` or `review` on purpose: there are none to cite, and none
  may be invented. Google's Rich Results Test will therefore report the
  software result as not eligible for star snippets; that is expected.
- `robots.txt` (allows everything, points at the sitemap) and `sitemap.xml`
  (one URL), both copied into `dist/` by `scripts/build.sh`. Cloudflare adds a
  block of content-signal comments to the top of the served `robots.txt`.

Keep the title, description and the JSON-LD description in step with what the
plugin really does; don't add claims the WordPress.org listing doesn't back.

**Moving to a custom domain** is the biggest SEO gain still available, since a
workers.dev address carries little authority. When it happens, replace the old
address in the canonical, `og:url`, `og:image`, `twitter:image`, the JSON-LD
block, `robots.txt` and `sitemap.xml`, and add a redirect from the workers.dev
address to the new one.

## Browser support

Modern evergreen browsers. Uses `<dialog>`, `:has()`, `backdrop-filter`,
`:focus-visible` and `text-wrap: balance`. Without `:has()`, only the
page-scroll lock behind the lightbox is lost.

## Deploying

Live at **https://rebuzz-backup-restore-plugin.xthasanish44.workers.dev/**,
a Cloudflare Worker (static assets) connected to this GitHub repository:
every push to `main` deploys automatically.

How a deploy works:

1. Cloudflare runs the build command `sh scripts/build.sh`, which copies only
   `index.html`, `robots.txt`, `sitemap.xml`, `_redirects` and `assets/` into
   `dist/` and drops the READMEs.
2. `npx wrangler deploy` publishes `dist/`, as set in `wrangler.jsonc`.

**Keep `assets.directory` pointing at `./dist`.** Publishing the repository
root would expose `.git` and these notes; that happened on the very first
deploy. `.assetsignore` is a second guard in case the root is ever used. The
`name` in `wrangler.jsonc` must match the Worker's name in Cloudflare.

`_redirects` is read by Cloudflare, not served, and holds the two redirects
from the old download page to the WordPress.org listing (302, so they can be
changed later).

Not in git (see `.gitignore`): the pre-redesign backup folder and the local
copy of the plugin zip in the project root.

---

© 2026 ReBuzz. All rights reserved.
