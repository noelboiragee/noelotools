# Merge PDF

বাংলা সারাংশ: একাধিক PDF ফাইল নির্বাচন করে একটি PDF ডকুমেন্টে যুক্ত করুন। ফাইলগুলো আপনার ব্রাউজারেই প্রসেস হয়; NoeloTools সার্ভারে আপলোড করা হয় না।

## Features

- Merge two or more PDF files into one document.
- Select multiple files or drag and drop them into the page.
- Preserve the selected file order in the merged document.
- Download the result as `merged-document.pdf`.
- Browser-side processing using PDF-Lib.
- Responsive interface with status announcements.

## Files

- `index.html` — tool interface and page metadata.
- `style.css` — responsive page-specific styles.
- `script.js` — file selection, PDF merging and download logic.

## Privacy and requirements

- PDF contents are processed locally in the browser and are not uploaded to NoeloTools.
- The PDF-Lib library is loaded from cdnjs, so an internet connection is required when opening the tool.
- Very large documents may require substantial browser memory.
- Password-protected, damaged or unsupported PDFs may fail to merge.
- Review the selected file order before merging.

## Run

Open the page through a local static server or deploy the repository to a static hosting provider.