# Compress PDF

বাংলা সারাংশ: এই টুলে দুটি পদ্ধতিতে PDF কমপ্রেস করা যায়—Text Preservation এবং Maximum Compression। ফাইল ব্যবহারকারীর ব্রাউজারেই প্রসেস হয়।

## Features

- Text Preservation mode uses pdf-lib to re-save and optimise the PDF structure with object streams.
- Maximum Compression mode renders each page with PDF.js and rebuilds an image-based PDF with jsPDF.
- Drag-and-drop and file picker support.
- Original and output file-size comparison.
- Download the processed PDF.
- No PDF file is uploaded to the NoeloTools server.

## Files

- `index.html` — accessible tool interface and library loading.
- `style.css` — responsive page-specific styles.
- `script.js` — local PDF processing and download logic.

## Important limitations

- Text Preservation mode does not re-encode embedded images. A PDF that is already optimised may not become smaller and can occasionally become larger.
- Maximum Compression converts pages to JPEG-backed images. Text is no longer selectable/searchable, and links, forms, tags, bookmarks and other interactive features may not be retained.
- Image quality can decrease. The original PDF should be kept.
- Very large or complex PDFs may require substantial device memory.
- The processing libraries are loaded from public CDNs, so an internet connection is required. The PDF content itself is processed locally in the browser.

## Third-party libraries

- PDF-LIB 1.17.1 — https://pdf-lib.js.org/
- Mozilla PDF.js 3.11.174 — https://mozilla.github.io/pdf.js/
- jsPDF 2.5.2 — https://github.com/parallax/jsPDF

Review each library's licence and notices before production distribution.

## Run

Open through a local static server or deploy to a static host. PDF.js worker loading may not work from a `file://` URL.