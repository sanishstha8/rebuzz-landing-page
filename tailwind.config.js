/**
 * ReBuzz — Tailwind design tokens
 * ------------------------------------------------------------------
 * The site currently ships hand-written CSS (assets/css/style.css) and
 * does NOT load Tailwind at runtime — see the "Why not the Tailwind CDN"
 * section of README.md.
 *
 * This config exists so the design system can move to a compiled
 * Tailwind build without re-deriving the palette. Every value here is
 * the same value declared as a CSS custom property in :root (light theme).
 *
 * To adopt it:
 *   npm install -D tailwindcss
 *   npx tailwindcss -i ./assets/css/tailwind.css -o ./assets/css/style.css --minify
 */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg:      '#FBFAF7',
        surface: '#F3F1EB',
        panel:   '#FFFFFF',
        void:    '#ECE9E1',

        ink: {
          DEFAULT: '#1D1C19',
          muted:   '#45423B',
          faint:   '#6B675E'
        },

        rebuzz: {
          DEFAULT: '#0E8A5F',   // large text and icons only
          link:    '#0A7150',
          button:  '#0B7A52',
          hover:   '#09623F'
        },

        band: {
          DEFAULT: '#143A2E',
          text:    '#F5F2EA',
          muted:   '#C9D6CF'
        }
      },

      borderColor: {
        hairline:   'rgba(40, 34, 20, .12)',
        'hairline-2': 'rgba(40, 34, 20, .2)'
      },

      fontFamily: {
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'Times New Roman', 'serif'],
        mono:  ['ui-monospace', 'SF Mono', 'Cascadia Code', 'Menlo', 'Consolas', 'monospace']
      },

      fontSize: {
        // fluid scale, matching the clamp() values in :root
        display: ['clamp(2.6rem, 1.7rem + 3.9vw, 4.5rem)', { lineHeight: '1.04', letterSpacing: '-.022em' }],
        h2:      ['clamp(1.9rem, 1.5rem + 1.7vw, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-.015em' }],
        h3:      ['1.125rem', { lineHeight: '1.15' }],
        lead:    ['clamp(1.12rem, 1.05rem + .3vw, 1.28rem)', { lineHeight: '1.65' }]
      },

      borderRadius: { sm: '6px', DEFAULT: '10px', lg: '14px' },

      boxShadow: {
        panel: '0 1px 2px rgba(40, 34, 20, .06), 0 14px 36px -20px rgba(40, 34, 20, .3)'
      },

      maxWidth: { content: '1080px', wide: '1200px', narrow: '760px' },

      transitionTimingFunction: { rebuzz: 'cubic-bezier(.22, .68, .3, 1)' }
    }
  },
  plugins: []
};
