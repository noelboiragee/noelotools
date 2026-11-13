# Loan Calculator

বাংলা সারাংশ: ঋণের পরিমাণ, বার্ষিক সুদের হার এবং মেয়াদ দিয়ে মাসিক কিস্তি (EMI), মোট সুদ, মোট পরিশোধ এবং মাসভিত্তিক repayment schedule হিসাব করা যায়।

## Features

- Monthly payment estimate for fixed-rate loans.
- Total interest and total repayment.
- Monthly principal, interest and remaining-balance schedule.
- EUR, GBP, USD and BDT currency display.
- Optional first-payment date.
- Print summary and download the schedule as CSV.
- All calculations run locally in the browser.

## Files

- `index.html` — calculator interface and metadata.
- `style.css` — responsive page styles and print layout.
- `script.js` — amortisation calculation and schedule export.

## Calculation

For monthly interest rate `r`, principal `P`, and total monthly payments `n`:

`M = P × r × (1 + r)^n / ((1 + r)^n − 1)`

For a zero-interest loan, the principal is divided equally by the number of monthly payments.

## Limitations

This is an estimate for a fixed annual interest rate and monthly repayments. It does not include lender fees, taxes, insurance, balloon payments, variable interest, or lender-specific rounding rules. The actual repayment schedule may differ.

## Run

Open through a local static server or deploy to a static host. No external runtime libraries are required.