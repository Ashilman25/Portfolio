# Futuristic Portfolio (Dark Neon)

A dark, futuristic, animated portfolio site showcasing projects, skills, and a contact form. Built with vanilla **HTML/CSS/JS** and split into professional modules.

## Structure

```
futuristic-portfolio/
├── index.html
├── assets/
│   ├── css/
│   │   ├── base.css          # Theme variables, layout primitives, global styles
│   │   ├── components.css    # Components: cards, grid, projects, skills, forms
│   │   └── pages.css         # Page/section overrides (extend as needed)
│   ├── js/
│   │   ├── particles.js      # Canvas background particles
│   │   ├── typewriter.js     # Hero headline typewriter
│   │   ├── reveal.js         # Scroll‑reveal animations
│   │   ├── filters.js        # Project filter toolbar
│   │   ├── rings.js          # Conic‑gradient skill rings
│   │   ├── parallax.js       # Parallax backgrounds
│   │   └── main.js           # Boot glue (year, misc)
│   └── img/
│       ├── profile-placeholder.jpg
│       ├── project-1.jpg … project-6.jpg
└── README.md
```

## Local Use

1. Download the ZIP and extract it.
2. Open `index.html` in your browser. (No build step required.)
3. Replace `assets/img/*` with your images, update copy/links in HTML.

## Customization

- Colors & tokens live in `assets/css/base.css` under `:root`.
- Add/rename skills by duplicating `.ring` blocks in the **Skills** section.
- Add projects by duplicating a `.proj` card in the **Projects** grid.
- If you move JS/CSS, keep the `<script>` order at the bottom of `index.html`.

## Accessibility & Performance Notes

- Focus outlines are neon and visible (`:focus-visible`). 
- Images use placeholders—replace with optimized assets (consider WebP).
- Animations are lightweight (no frameworks).

---

© Your Name
