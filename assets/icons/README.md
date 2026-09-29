# Icons

## Where the icons actually live

The icon set is an **inline SVG sprite at the top of `index.html`** — a single
`<svg class="sprite">` holding one `<symbol>` per icon. Markup references them
with:

```html
<svg class="ico" aria-hidden="true"><use href="#i-check-circle"></use></svg>
```

They are inlined rather than kept in an external `icons.svg` on purpose:
browsers block cross-document `<use href="file.svg#id">` when the page is opened
over `file://`, so an external sprite would silently render nothing when you
double-click `index.html`. Inlining also removes a network request and any
icon-flash on first paint.

If you later serve the site over HTTP and prefer an external sprite, move the
`<defs>` block into `icons.svg` here and change the references to
`href="assets/icons/icons.svg#i-check-circle"`.

## Style

Lucide-style geometry: 24×24 viewBox, no fill, `currentColor` stroke,
1.7px stroke width, round caps and joins. Icons inherit colour and size from
their parent — `.ico`, `.ico--lg` in `assets/css/style.css`.

To add one, drop a new `<symbol id="i-name" viewBox="0 0 24 24" …>` into the
sprite and keep the same stroke attributes so it sits consistently with the rest.

## Files

| File | Purpose |
| --- | --- |
| `favicon.svg` | Browser tab icon, referenced from `<head>`. A green rounded square (`#0B7A52`) with a white R. The site logo itself is text only (bold "ReBuzz"), but a tab needs an icon. |

Some platforms still want a raster fallback. If you need one:

```
favicon.svg → export favicon-32.png, favicon-180.png (apple-touch-icon)
```
