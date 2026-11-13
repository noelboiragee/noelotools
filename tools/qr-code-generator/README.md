# QR Code Generator

বাংলা সারাংশ: লেখা বা ওয়েবসাইটের লিংক দিয়ে QR কোড তৈরি করে PNG ছবি হিসেবে ডাউনলোড করার টুল।

## Features

- Generate QR codes from plain text or URLs
- Select 160, 220, 300, or 400 pixel output size
- Download the generated code as a PNG image
- Responsive interface with input validation
- QR generation runs in the browser; entered content is not sent to a QR service

## Dependency

The page loads QRCode.js 1.0.0 from jsDelivr. An internet connection is required to load this library. The QR content is processed locally after the library loads.

## Privacy and safety

The entered text is not uploaded by this tool. Avoid putting private or sensitive information into a QR code if you plan to share the resulting image. Scan and verify a generated code before distributing it; QR codes can contain links to unsafe websites.

## Files

- `index.html` — tool interface and library reference
- `style.css` — responsive styling
- `script.js` — QR generation and PNG download

## Run locally

Serve the repository with a local static web server, then open `/tools/qr-code-generator/`. No build step is required.