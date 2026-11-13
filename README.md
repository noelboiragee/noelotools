# NoeloTools

> **বাংলা সারাংশ:** NoeloTools হলো ইউরোপীয় ব্যবহারকারীদের জন্য একটি privacy-first, browser-based online tools platform। সব টুল ব্যবহারকারীর ব্রাউজারেই কাজ করবে।

Free, all-in-one online tools for Europe. No sign-up, no uploads, and no watermark.

## Project principles

- Plain HTML5, CSS3, and vanilla JavaScript (ES modules).
- No framework and no build step.
- Tools process files locally in the browser whenever technically possible.
- Responsive, accessible, light/dark themes.
- European defaults: EUR, metric units, DD/MM/YYYY, 24-hour time, and A4 documents.
- Code comments are written in Bengali (বাংলা); identifiers remain in English.

## Folder structure

```text
/
├── index.html
├── assets/
│   ├── css/       # Shared design system and components
│   ├── js/        # Shared browser-side functionality
│   ├── img/       # Brand assets and icons
│   └── data/      # Tool and category catalogue
├── shared/        # Reusable HTML fragments
├── tools/         # One self-contained folder per tool
├── blog/          # Static, SEO-friendly articles
├── pages/         # About, contact and legal pages
├── _template-tool/
├── sitemap.xml
├── robots.txt
├── README.md
├── CONTRIBUTING.md
└── .gitignore
```

## Run locally

Open `index.html` directly in a modern browser. For ES modules and fetch-based features, use a local static server, for example VS Code Live Server or `python -m http.server`.

## Add a new tool

1. Copy `_template-tool/` into `tools/<tool-slug>/`.
2. Keep the folder and URL slug in lowercase kebab-case.
3. Implement the tool in its own `script.js` and `style.css`.
4. Add its metadata to `assets/data/tools.json`.
5. Add internal links, related tools, SEO metadata, and tests.
6. Commit with a message such as `add: merge-pdf tool`.

## Deploy

Deploy the repository root as a static site on GitHub Pages, Netlify, or Vercel. No build command is required; use the repository root as the publish directory.

## Privacy and legal note

Browser-only processing is the intended default, but third-party APIs, analytics, advertising, and external libraries must be reviewed individually. Do not claim GDPR compliance until consent, privacy, retention, and legal requirements have been reviewed for the actual deployment.
