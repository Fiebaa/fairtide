# GitHub Pages Landing Page - Plan

## Architecture

Simple static site structure in `docs/`:

```
docs/
├── index.html       # Single-page landing site
├── styles.css       # All styles
└── favicon.svg      # Simple favicon
```

## Design Approach

- **Single page**: Everything on one scrollable page (hero → how it works → API example → footer)
- **Color palette**: Clean, professional — dark navy (#1a1a2e) + accent green (#4ade80) + white
- **Typography**: System font stack (no external font loading = faster)
- **Responsive**: Mobile-first CSS with breakpoints at 768px and 1024px
- **Code blocks**: Styled with CSS only using `<pre><code>` with custom colors

## Sections

1. **Hero**: Tagline + one-liner description + CTA button (link to docs)
2. **How It Works**: 3-column grid with icons (emoji or SVG) — Set Price → Customer Income → Fair Price
3. **Revenue-Neutral**: Short explanation with a visual showing balance convergence
4. **API Example**: Request/response code block with syntax-highlighted JSON
5. **Footer**: Links to GitHub repo, API docs, license

## Deployment

- GitHub Pages serves from `docs/` folder on `main` branch
- No build step required — push and it's live
- Configure via repository Settings → Pages → Source: main / docs
