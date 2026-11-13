# Adult BMI Calculator (18+)

প্রাপ্তবয়স্কদের BMI হিসাবের জন্য NoeloTools-এর একটি ছোট, ব্রাউজার-ভিত্তিক টুল।

## Overview

- Calculates Body Mass Index from height in centimetres and weight in kilograms.
- Displays a general adult BMI screening range.
- Validates measurement inputs and supports keyboard navigation.
- Runs locally in the browser; no measurement data is uploaded or stored.

## Important age limitation

This calculator is intended **only for adults aged 18 and over**. Adult BMI categories must not be applied to children or teenagers. For people under 18, BMI is assessed using age- and sex-specific growth charts by an appropriately qualified healthcare professional.

## Formula

BMI = weight (kg) / height (m)²

## Adult reference ranges

- Below 18.5: Underweight range
- 18.5–24.9: Healthy-weight range
- 25.0–29.9: Overweight range
- 30.0 and above: Obesity range

These are general screening categories, not a diagnosis. BMI does not directly measure body fat or fully account for body composition and other individual factors.

## Files

- `index.html` — calculator page and explanatory content
- `style.css` — responsive styles
- `script.js` — validation and BMI calculation

## Run locally

Serve the repository with a local static web server, then open `/tools/bmi-calculator/`. No build step or external dependency is required.