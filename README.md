# NoeloTools

> **বাংলা সারাংশ:** NoeloTools হলো একটি free, all-in-one online tools website। লক্ষ্য হলো সহজ, দ্রুত, responsive এবং privacy-conscious browser-based tools দেওয়া।

Free online tools for everyday tasks. No sign-up, no watermark. File processing is performed in the browser where technically possible; any third-party service or external request must be disclosed and reviewed.

## Project overview

NoeloTools is a static website built with HTML, CSS, and vanilla JavaScript. The project is designed to run without a framework or build step and is deployed as a static site.

## Main features

- Collection of browser-based online tools.
- Responsive layouts for mobile, tablet, and desktop.
- Shared site navigation, header, footer, and reusable page components.
- Tool-specific interfaces and scripts.
- Search, categories, related tools, and SEO-friendly content.
- Light and dark theme support where implemented.
- Local browser processing where technically possible.

## Technology stack

- **HTML5** — page structure and semantic content.
- **CSS3** — layouts, responsive styling, themes, and components.
- **Vanilla JavaScript (ES modules)** — browser-side interactions and tool logic.
- **JSON** — tool and category catalogue data.
- **GitHub Pages** — static website hosting.

There is currently no framework, package-based build pipeline, or mandatory compilation step.

## Repository structure

```text
/
├── index.html              # Homepage
├── 404.html                # Not-found page
├── assets/
│   ├── css/                # Shared styles and design system
│   ├── js/                 # Shared browser-side scripts
│   ├── img/                # Brand images, icons, and other assets
│   └── data/               # Tool and category data
├── shared/                 # Reusable site fragments
├── tools/                  # Individual tool pages and their assets
├── blog/                   # Blog articles
├── pages/                  # About, contact, and legal pages
├── _template-tool/         # Starting template for a new tool
├── sitemap.xml
├── robots.txt
├── README.md
├── CONTRIBUTING.md
└── .gitignore
```

A typical tool folder contains its own `index.html`, `style.css`, and `script.js`. Check the existing tool structure before adding or changing files; not every tool necessarily needs identical assets.

## Website structure and components

Keep the website's major areas logically separate:

1. **Head** — page title, description, canonical URL, social metadata, icons, and stylesheet/script references.
2. **Header** — site branding and top-level header content.
3. **Navigation** — primary links and mobile navigation behavior.
4. **Main content** — the page-specific content, kept separate from shared site chrome.
5. **Tool interface** — tool-specific controls, results, instructions, and supporting content.
6. **Footer** — shared footer navigation and site information.
7. **Cookie/consent interface** — consent UI where applicable.

The homepage may contain additional sections inside its main content, such as the hero, category areas, and tool listings. Tool pages can have a different content structure while reusing the shared site components.

## Project coding and change rules

These rules apply to all maintenance and feature work:

1. Check the latest `main` branch before starting.
2. Inspect the relevant HTML, CSS, JavaScript, and dependencies before editing.
3. Do not make guess-based changes or delete code merely because it appears unused.
4. Change only what the task requires. Avoid unrelated refactoring.
5. Verify the relevant behavior before and after the change.
6. Verify the GitHub repository and the deployed website separately. A successful commit does not prove that deployment works.
7. Report changed files, fixes, tests, remaining issues, and the commit link.
8. If a change could break another part of the website, stop and explain the risk before proceeding.

### Component and shared-code rules

- Keep Header, Navigation, Main Content, and Footer responsibilities distinct.
- Follow the existing repository structure before introducing new files or patterns.
- Before changing shared CSS or JavaScript, identify the pages that depend on it.
- Check that a change to one tool does not affect other tools.
- Check the site-wide impact before changing shared components.
- Avoid unnecessary duplicate code; reuse shared code when it is appropriate and safe.
- Prefer the smallest change that preserves the existing architecture.

## Adding a new tool

1. Inspect `_template-tool/` and at least one comparable existing tool.
2. Create `tools/<tool-slug>/` using lowercase kebab-case.
3. Keep tool-specific markup, styles, and logic in the appropriate files.
4. Reuse shared site components and utilities where appropriate.
5. Add the tool's entry to the relevant catalogue in `assets/data/`.
6. Add accurate title, description, canonical URL, Open Graph, and Twitter metadata.
7. Check internal links, related tools, and sitemap inclusion where applicable.
8. Test the tool on mobile and desktop, including empty, invalid, and normal inputs.
9. Check the browser console and verify that existing pages remain unaffected.

## SEO, accessibility, and performance

- Give every indexable page a unique, accurate title and meta description.
- Use the correct canonical URL and relevant Open Graph/Twitter metadata.
- Keep sitemap and robots directives consistent with the pages intended for indexing.
- Use semantic HTML, meaningful link text, labels, and keyboard-accessible controls.
- Provide responsive layouts and avoid unnecessary layout shifts.
- Load shared and tool-specific assets only where needed.
- Avoid unnecessary third-party scripts and dependencies.
- Do not claim that a page is private, fully local, or compliant with a law unless its actual implementation has been checked.

## Local development

Open `index.html` in a modern browser for basic inspection. Because ES modules and fetch-based features may require an HTTP origin, use a local static server for reliable testing.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

No dependency installation or build command is currently required.

## Testing checklist

Before considering a change complete:

- [ ] Confirm the edited files match the requested scope.
- [ ] Check for broken asset paths, links, and console errors.
- [ ] Test the changed feature with normal and edge-case inputs.
- [ ] Check responsive behavior on mobile and desktop.
- [ ] Check shared header, navigation, and footer if they were affected.
- [ ] Check at least one other relevant page/tool for regressions.
- [ ] Re-fetch the changed file from GitHub and verify the committed content.
- [ ] Check the live GitHub Pages deployment separately.

Record any test that could not be performed; do not report it as passed.

## Deployment

The site is intended to be deployed as a static website through GitHub Pages from the repository's configured branch and publishing source. No build command is required by the current project setup.

After a commit, verify both:
- the updated file and commit on GitHub; and
- the deployed page after GitHub Pages has finished publishing.

## Privacy note

Browser-local processing is preferred when technically possible, but behavior can differ by tool. Review third-party APIs, analytics, advertising, external libraries, and network requests individually. Describe data handling accurately for each tool and do not make blanket privacy or legal-compliance claims without verification.
