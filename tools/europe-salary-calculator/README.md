# Europe Salary Calculator

বাংলা সারাংশ: ইউরোপের ১২টি দেশের জন্য Gross-to-Net Salary Calculator-এর কেন্দ্রীয় টুল। দেশভিত্তিক কর ও সামাজিক বীমার নিয়ম যাচাই করে পর্যায়ক্রমে মডেল চালু করা হবে। প্রথম প্রকাশে Germany-এর ২০২৬ সালের সরলীকৃত মডেল সক্রিয়।

## Countries in the selector

Germany, United Kingdom, France, Netherlands, Belgium, Spain, Italy, Poland, Portugal, Austria, Ireland and Switzerland.

## Current availability

- Germany: available as a simplified 2026 estimate.
- Other listed countries: selector and country information are present; calculation models are not enabled yet.

A country must not be marked available until its tax brackets, employee social contributions, thresholds, allowances, tax year and representative test cases have been checked against country-specific authoritative sources.

## Germany model

The first model reuses the simplified 2026 Germany assumptions documented in [Net Salary Germany](../net-salary-germany/README.md). It is not an official payroll engine and does not model every tax class, family situation, allowance, surcharge or insurance arrangement.

## Design and privacy

- Plain HTML, CSS and vanilla JavaScript.
- No salary input is submitted to a server.
- Responsive layout and keyboard-accessible native controls.
- Country-specific currency symbols are displayed for the selected country.

## Reference methodology

The OECD Taxing Wages publication provides comparable cross-country tax-wedge methodology, but average tax-wedge figures are not a substitute for an individual's country-specific payroll calculation.

https://www.oecd.org/en/publications/taxing-wages-2026_3a5169ef-en/full-report/overview_d93131c3.html

## Run

Serve the repository root with a static web server and open `/tools/europe-salary-calculator/`. Root-relative asset paths may not resolve when opened directly as a `file://` URL.
