# NoeloTools Tool Page Template

বাংলা সারাংশ: এই টেমপ্লেট কপি করে প্রতিটি নতুন টুলের জন্য আলাদা HTML, CSS, JavaScript এবং README ফাইল তৈরি করুন।

## Files

- `index.html` — page structure, metadata, accessible tool workspace.
- `style.css` — styles specific to this tool.
- `script.js` — tool validation, processing and result handling.
- `README.md` — implementation notes and testing checklist.

## Create a new tool

1. Copy the complete `_template-tool` directory into `tools/<tool-slug>/`.
2. Keep the four filenames unchanged.
3. Replace every `[placeholder]` in `index.html`.
4. Add only tool-specific styles to `style.css`.
5. Implement and validate the tool logic in `script.js`.
6. Add the tool metadata to `assets/data/tools.json`.
7. Test keyboard access, mobile layout, empty input, invalid input and output accuracy.

## Development rules

- Use plain HTML5, CSS3 and vanilla JavaScript ES modules.
- Do not add a framework, build step or unnecessary dependency.
- Prefer browser-side processing. Do not upload or store user files unless the tool's documented purpose requires it and the privacy design is reviewed.
- Validate all inputs and handle errors with clear messages.
- Never claim a tool is complete until its functionality has been implemented and tested.
- Keep comments in source code in Bangla script; keep identifiers in English.

## Checklist

- [ ] Page title, description and canonical URL updated.
- [ ] Tool inputs have associated labels.
- [ ] Keyboard and screen-reader interaction tested.
- [ ] Mobile and desktop layouts tested.
- [ ] Valid, empty and invalid input cases tested.
- [ ] Results are accurate and reset works.
- [ ] Privacy and data handling reviewed.
- [ ] Catalogue entry added.
