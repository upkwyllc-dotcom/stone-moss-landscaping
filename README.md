# Stone & Moss — Landscape Architecture

A premium, single-page marketing site concept for a high-end landscape architecture studio. Built as a static HTML/CSS/JS site — no build step, no framework, no dependencies.

**Live site:** [stoneandmoss.netlify.app](https://stoneandmoss.netlify.app)
**Design reference:** [Artifact preview](https://claude.ai/code/artifact/2ea9985a-6deb-4657-9de4-911244d08440)

## Stack

- Plain HTML5, CSS3 (custom properties, no preprocessor), vanilla JS (no libraries)
- Zero build tooling — open `index.html` directly or serve statically

## Structure

```
.
├── index.html          # All page markup
├── css/
│   └── styles.css      # Full design system: tokens, layout, components
├── js/
│   └── main.js         # Nav state, scroll reveal, counters, carousel, filters
└── README.md
```

## Design system

| Aspect | Choice |
|---|---|
| **Palette** | Warm ivory/sand base, deep forest green for authority sections, brass/gold as a single restrained accent. All text/background pairs verified against WCAG AA (4.5:1+). |
| **Typography** | Serif display (Iowan Old Style / Palatino / Georgia stack) for headlines, system sans for body — an editorial luxury pairing with no external font requests. |
| **Visual motif** | Abstract topographic contour art + duotone gradient panels with subtle film grain, standing in for photography. |
| **Motion** | Scroll-reveal (`IntersectionObserver`), animated stat counters, subtle hero parallax, testimonial carousel, portfolio filtering — all transform/opacity-based and gated behind `prefers-reduced-motion`. |
| **Layout** | Hero → trust stats → services → philosophy → process → portfolio → testimonials → consultation CTA → footer. |

## Running locally

No build step required. Either open `index.html` directly in a browser, or serve it:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Before shipping to production

This is demonstration content — replace before real use:

- **Brand name, logo mark, and copy** — "Stone & Moss" and all body copy are placeholders.
- **Photography** — the gradient/contour panels stand in for real project photography; swap in actual images (optimized as WebP with `srcset`/lazy loading).
- **Testimonials, project names, and stats** — all illustrative, not real client data.
- **Typography** — swap the system-font stack for a licensed serif webfont (e.g. Fraunces, Canela) if you want a more distinctive display face; the current stack was chosen because it requires no external font requests.
- **Forms** — the consultation and newsletter forms are non-functional (`onsubmit="return false"`); wire them to a real form handler or backend.

## License

No license specified — treat as a private working draft unless you add one.
