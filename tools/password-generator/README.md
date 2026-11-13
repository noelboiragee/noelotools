# Password Generator

বাংলা সারাংশ: Web Crypto API ব্যবহার করে ব্রাউজারের ভেতরে র‍্যান্ডম পাসওয়ার্ড তৈরি ও কপি করার টুল।

## Features

- Password length from 8 to 64 characters
- Uppercase, lowercase, numbers and symbols can be selected independently
- At least one character from every selected type is included
- Uses the browser Web Crypto API for cryptographically secure random values
- Secure Fisher–Yates shuffle
- Copy generated password to clipboard when browser permissions allow
- No password is uploaded, stored, or logged by this tool

## Security notes

- The tool does not fall back to Math.random() if secure randomness is unavailable.
- Use a unique password for each account and store it in a reputable password manager.
- Clipboard contents may be accessible to other apps or users of a shared device. Copy passwords only on a device you trust.
- A generated password does not replace multi-factor authentication.

## Files

- index.html — tool interface
- style.css — responsive styling
- script.js — secure password generation and copy action

## Run locally

Serve the repository with a local static web server, then open /tools/password-generator/. No build step or external dependency is required.