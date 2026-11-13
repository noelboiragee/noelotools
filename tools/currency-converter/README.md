# Currency Converter

বাংলা সারাংশ: Currency Converter অনলাইন এক্সচেঞ্জ-রেট সেবা থেকে সর্বশেষ উপলব্ধ রেট এনে ব্রাউজারেই মুদ্রা রূপান্তর করে। রেট সার্ভিসের ডেটা পর্যায়ক্রমে আপডেট হয়; এটি লাইভ ব্যাংক ট্রেডিং রেট নয়।

## Features

- Convert between 22 popular currencies.
- EUR, USD, GBP, BDT, INR, CAD, AUD, CHF, JPY, CNY, SGD, AED, SAR, NZD, SEK, NOK, DKK, PLN, CZK, HUF, TRY and ZAR.
- Swap source and target currencies.
- Refresh exchange-rate data.
- Locale-aware currency formatting.
- Conversion amount is calculated locally in the browser.

## Exchange-rate provider

Rates are requested from the public ExchangeRate-API open endpoint:

`https://open.er-api.com/v6/latest/{BASE}`

The provider updates rates periodically. The timestamp returned by the provider is displayed in the interface. Availability, supported currencies, update frequency and service terms are controlled by the provider.

Provider: https://www.exchangerate-api.com/

## Privacy

The selected base currency code is sent to the rate provider to retrieve rates. The amount typed by the user is not sent; conversion is performed locally in the browser.

## Important

Displayed rates are indicative reference rates. Banks, card networks, cash exchanges and money-transfer services may use different rates and charge fees. This tool does not guarantee a transaction quote.

## Run

Serve the repository root with a static web server and open `/tools/currency-converter/`. Root-relative asset paths may not resolve when opened directly as a `file://` URL.
