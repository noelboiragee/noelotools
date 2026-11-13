# VAT Calculator

বাংলা সারাংশ: NoeloTools-এর VAT Calculator দিয়ে Net Price থেকে VAT যোগ করে Gross Price বের করা যায়, অথবা Gross Price থেকে VAT বাদ দিয়ে Net Price হিসাব করা যায়।

## Features

- Add VAT to a net amount.
- Remove VAT from a gross amount.
- Editable VAT rate from 0% to 100%.
- Currency formatting for EUR, GBP, USD, PLN, CHF and BDT.
- Live calculation as values change.
- Responsive layout and accessible result announcements.
- Runs locally in the browser without sending entered amounts to a server.

## Files

- `index.html` — Page structure and calculator controls.
- `style.css` — Tool-specific responsive styles.
- `script.js` — VAT calculation and currency formatting.

## Calculation

When adding VAT:

`VAT = Net × Rate / 100`

`Gross = Net + VAT`

When removing VAT:

`Net = Gross / (1 + Rate / 100)`

`VAT = Gross - Net`

## Notes

VAT rates differ by jurisdiction and by product or service. Users must confirm the legally applicable rate. Results are estimates and are not tax advice.

## Run

Serve the repository root with a static web server, then open `/tools/vat-calculator/`. Root-relative asset paths may not resolve when opening this page directly as a standalone `file://` URL.
