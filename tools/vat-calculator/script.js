// Country-aware VAT, GST and sales-tax calculator.
// Standard rates are presets only; local, reduced and product-specific rates may differ.
const modeInput = document.querySelector("#calculation-mode");
const countryInput = document.querySelector("#country");
const currencyInput = document.querySelector("#currency");
const amountInput = document.querySelector("#amount");
const rateInput = document.querySelector("#vat-rate");
const amountLabel = document.querySelector("#amount-label");
const rateLabel = document.querySelector("#tax-rate-label");
const taxAmountLabel = document.querySelector("#tax-amount-label");
const netOutput = document.querySelector("#net-result");
const taxOutput = document.querySelector("#vat-result");
const grossOutput = document.querySelector("#gross-result");
const errorMessage = document.querySelector("#error-message");
const sourceNote = document.querySelector("#tax-source-note");
const resetButton = document.querySelector("#reset-button");

const countries = {
  DE:{name:"Germany",currency:"EUR",symbol:"€",tax:"VAT",rate:19,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
  FR:{name:"France",currency:"EUR",symbol:"€",tax:"VAT",rate:20,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
  IT:{name:"Italy",currency:"EUR",symbol:"€",tax:"VAT",rate:22,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
  ES:{name:"Spain",currency:"EUR",symbol:"€",tax:"VAT",rate:21,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
  NL:{name:"Netherlands",currency:"EUR",symbol:"€",tax:"VAT",rate:21,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
  BE:{name:"Belgium",currency:"EUR",symbol:"€",tax:"VAT",rate:21,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
  IE:{name:"Ireland",currency:"EUR",symbol:"€",tax:"VAT",rate:23,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
  PT:{name:"Portugal",currency:"EUR",symbol:"€",tax:"VAT",rate:23,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
  AT:{name:"Austria",currency:"EUR",symbol:"€",tax:"VAT",rate:20,source:"https://europa.eu/youreurope/business/finance-and-tax/vat/vat-rules-rates/index_en.htm"},
  GB:{name:"United Kingdom",currency:"GBP",symbol:"£",tax:"VAT",rate:20,source:"https://www.gov.uk/vat-rates"},
  CH:{name:"Switzerland",currency:"CHF",symbol:"CHF",tax:"VAT",rate:8.1,source:"https://www.estv.admin.ch/estv/en/home/value-added-tax.html"},
  NO:{name:"Norway",currency:"NOK",symbol:"kr",tax:"VAT",rate:25,source:"https://www.skatteetaten.no/en/rates/value-added-tax/"},
  SE:{name:"Sweden",currency:"SEK",symbol:"kr",tax:"VAT",rate:25,source:"https://www.skatteverket.se/"},
  DK:{name:"Denmark",currency:"DKK",symbol:"kr",tax:"VAT",rate:25,source:"https://skat.dk/"},
  BR:{name:"Brazil",currency:"BRL",symbol:"R$",tax:"Indirect taxes (ICMS / PIS / COFINS / ISS)",rate:null,source:"https://www.gov.br/receitafederal/pt-br",note:"Brazil has multiple federal, state and municipal consumption taxes. There is no single nationwide standard rate; enter the applicable combined rate for the transaction."},
  AR:{name:"Argentina",currency:"ARS",symbol:"$",tax:"IVA",rate:21,source:"https://www.arca.gob.ar/iva/"},
  CO:{name:"Colombia",currency:"COP",symbol:"$",tax:"IVA",rate:19,source:"https://www.dian.gov.co/"},
  CL:{name:"Chile",currency:"CLP",symbol:"$",tax:"IVA",rate:19,source:"https://www.sii.cl/"},
  PE:{name:"Peru",currency:"PEN",symbol:"S/",tax:"IGV",rate:18,source:"https://www.sunat.gob.pe/"},
  EC:{name:"Ecuador",currency:"USD",symbol:"$",tax:"IVA",rate:15,source:"https://www.sri.gob.ec/"},
  UY:{name:"Uruguay",currency:"UYU",symbol:"$U",tax:"IVA",rate:22,source:"https://www.gub.uy/direccion-general-impositiva/"},
  US:{name:"United States",currency:"USD",symbol:"$",tax:"State and local sales tax",rate:null,source:"https://www.taxadmin.org/current-tax-rates",note:"The United States has no nationwide VAT or single sales-tax rate. State and local rates vary by location; enter the applicable combined rate."},
  CA:{name:"Canada",currency:"CAD",symbol:"$",tax:"GST / HST / PST",rate:null,source:"https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html",note:"Canada's total rate depends on the province or territory and may combine federal GST with HST or provincial tax. Enter the applicable combined rate."},
  MX:{name:"Mexico",currency:"MXN",symbol:"$",tax:"IVA",rate:16,source:"https://www.sat.gob.mx/"},
  JP:{name:"Japan",currency:"JPY",symbol:"¥",tax:"Consumption tax",rate:10,source:"https://www.nta.go.jp/english/taxes/consumption_tax/index.htm"},
  KR:{name:"South Korea",currency:"KRW",symbol:"₩",tax:"VAT",rate:10,source:"https://www.nts.go.kr/english/main.do"},
  IN:{name:"India",currency:"INR",symbol:"₹",tax:"GST",rate:18,source:"https://cbic-gst.gov.in/",note:"18% is a common GST rate, not a universal rate. Indian GST slabs vary by goods and services (including 5%, 12%, 18% and 28%); choose the rate applicable to the item."},
  CN:{name:"China",currency:"CNY",symbol:"¥",tax:"VAT",rate:13,source:"https://www.chinatax.gov.cn/eng/",note:"13% is the standard headline rate for many goods. Other VAT rates, including 9% and 6%, apply to specific goods and services."},
  AU:{name:"Australia",currency:"AUD",symbol:"$",tax:"GST",rate:10,source:"https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst"},
  NZ:{name:"New Zealand",currency:"NZD",symbol:"$",tax:"GST",rate:15,source:"https://www.ird.govt.nz/gst"}
};

const currencyLocales = {
  EUR:"en-IE",GBP:"en-GB",CHF:"de-CH",NOK:"nb-NO",SEK:"sv-SE",DKK:"da-DK",
  BRL:"pt-BR",ARS:"es-AR",COP:"es-CO",CLP:"es-CL",PEN:"es-PE",USD:"en-US",
  UYU:"es-UY",JPY:"ja-JP",KRW:"ko-KR",INR:"en-IN",CNY:"zh-CN",AUD:"en-AU",
  NZD:"en-NZ",CAD:"en-CA",MXN:"es-MX"
};

function parseDecimal(value) {
  const normalized = String(value).trim().replace(/,/g, ".");
  return /^[-+]?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[-+]?\\d+)?$/i.test(normalized) ? Number(normalized) : NaN;
}
function formatMoney(value) {
  const currency = currencyInput.value;
  try {
    return new Intl.NumberFormat(currencyLocales[currency] || "en", {
      style:"currency",currency,minimumFractionDigits:2,maximumFractionDigits:2
    }).format(value);
  } catch {
    return value.toFixed(2) + " " + currency;
  }
}
function updateAmountLabel() {
  amountLabel.textContent = modeInput.value === "add" ? "Net price" : "Gross price";
}
function updateCountry() {
  const country = countries[countryInput.value];
  if (!country) return;
  currencyInput.value = country.currency;
  rateLabel.textContent = country.tax + " rate (%)";
  taxAmountLabel.textContent = country.tax + " amount";
  if (country.rate === null) {
    rateInput.value = "";
    rateInput.placeholder = "Enter local rate";
  } else {
    rateInput.value = String(country.rate);
    rateInput.placeholder = "";
  }
  sourceNote.replaceChildren();
  const message = country.note || ("Standard " + country.tax + " rate preset: " + country.rate + "%. Reduced rates or exemptions may apply.");
  sourceNote.append(document.createTextNode(message + " "));
  const link = document.createElement("a");
  link.href = country.source;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Official tax authority / rate information";
  sourceNote.append(link, document.createTextNode(" · Reference checked 20 Nov 2026."));
  calculateVat();
}
function calculateVat() {
  updateAmountLabel();
  const amount = parseDecimal(amountInput.value);
  const rate = parseDecimal(rateInput.value);
  const valid = amountInput.value.trim() !== "" && rateInput.value.trim() !== "" &&
    Number.isFinite(amount) && Number.isFinite(rate) &&
    amount >= 0 && rate >= 0 && rate <= 100;
  errorMessage.hidden = valid;
  if (!valid) {
    errorMessage.textContent = "Enter a valid amount and a tax rate between 0 and 100.";
    netOutput.textContent = taxOutput.textContent = grossOutput.textContent = "—";
    return;
  }
  let net, tax, gross;
  if (modeInput.value === "add") {
    net = amount;
    tax = net * rate / 100;
    gross = net + tax;
  } else {
    gross = amount;
    net = gross / (1 + rate / 100);
    tax = gross - net;
  }
  if (![net,tax,gross].every(Number.isFinite)) {
    errorMessage.textContent = "The result is outside the supported numeric range.";
    errorMessage.hidden = false;
    netOutput.textContent = taxOutput.textContent = grossOutput.textContent = "—";
    return;
  }
  netOutput.textContent = formatMoney(net);
  taxOutput.textContent = formatMoney(tax);
  grossOutput.textContent = formatMoney(gross);
}
countryInput.addEventListener("change", updateCountry);
[modeInput,currencyInput,amountInput,rateInput].forEach(input => {
  input.addEventListener("input", calculateVat);
  input.addEventListener("change", calculateVat);
});
resetButton.addEventListener("click", () => {
  modeInput.value = "add";
  countryInput.value = "DE";
  amountInput.value = "100";
  updateCountry();
  amountInput.focus();
});
const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());
updateCountry();
