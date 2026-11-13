# Word Counter

বাংলা সারাংশ: এই টুলে লেখা টাইপ বা পেস্ট করলে শব্দ, অক্ষর, স্পেস ছাড়া অক্ষর, বাক্য, অনুচ্ছেদ এবং আনুমানিক পড়ার সময় সঙ্গে সঙ্গে গণনা হয়।

## Features

- Live word count.
- Character count, including spaces.
- Character count, excluding whitespace.
- Sentence and paragraph estimates.
- Reading-time estimate based on 200 words per minute.
- Clear-text action.
- Browser-side processing; text is not sent to a server.

## Files

- `index.html` — accessible tool interface and page metadata.
- `style.css` — responsive page-specific styles.
- `script.js` — counting and live-update logic.

## Notes

- Word detection supports Unicode letters and numbers.
- Sentence counting uses common terminal punctuation. Abbreviations and unusual punctuation may affect the estimate.
- Paragraphs are separated by one or more blank lines.
- Reading time is an estimate, not a measurement of an individual's reading speed.

## Run

Open the page through a local static server or deploy the repository to a static hosting provider. The tool has no external runtime dependencies.