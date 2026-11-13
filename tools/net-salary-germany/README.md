# Net Salary Germany Calculator

বাংলা সারাংশ: এই টুলটি ২০২৬ সালের জার্মান আয়কর ট্যারিফ ও কর্মচারীর সামাজিক বীমা অবদানের রেফারেন্স ব্যবহার করে মাসিক হাতে পাওয়া বেতনের একটি আনুমানিক হিসাব দেয়।

## Features

- Monthly gross salary input.
- Health insurer additional contribution rate.
- Parent / childless care-insurance selection.
- Saxony / other federal states selection.
- Optional church tax at 8% or 9%.
- Estimated monthly net salary and deduction breakdown.
- Browser-side calculation; salary input is not uploaded.

## 2026 reference parameters

- Income tax tariff and basic allowance: German Income Tax Act, §32a.
- Pension insurance: employee share 9.3%.
- Unemployment insurance: employee share 1.3%.
- Statutory health insurance: employee share of 7.3% plus half of the selected additional rate.
- Average health-insurance additional rate default: 2.9%.
- Health and care contribution ceiling: €5,812.50 per month.
- Pension and unemployment contribution ceiling: €8,450 per month.
- Long-term care insurance employee share varies by parent status and Saxony.

## Important calculation limitation

This is a simplified educational estimate, not an official German payroll engine. It approximates annual taxable income by subtracting employee pension, health and care contributions and a €1,230 work-expense allowance from annual gross pay, then applies the 2026 §32a income-tax tariff. It does not model wage-tax class withholding, spouse income, detailed child allowances, private insurance, all deductions, one-off payments or the solidarity surcharge. Actual payslip results can differ.

## Primary references

- https://www.gesetze-im-internet.de/estg/__32a.html
- https://www.bundesgesundheitsministerium.de/beitraege/seite
- https://www.deutsche-rentenversicherung.de/DRV/DE/Experten/Zahlen-und-Fakten/Werte-der-Rentenversicherung/werte-der-rentenversicherung

## Run

Serve the repository root with a static web server and open `/tools/net-salary-germany/`. Root-relative asset paths may not resolve when opening this page directly using a `file://` URL.
