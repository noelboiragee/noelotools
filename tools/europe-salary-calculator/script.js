// এই স্ক্রিপ্টে দেশ নির্বাচন এবং বর্তমানে চালু জার্মান স্যালারি মডেল পরিচালনা করা হয়েছে।
const countryInput = document.querySelector("#country");
const grossInput = document.querySelector("#gross-salary");
const currencySymbol = document.querySelector("#currency-symbol");
const germanyOptions = document.querySelector("#germany-options");
const comingSoon = document.querySelector("#coming-soon");
const countryStatus = document.querySelector("#country-status");
const comingTitle = document.querySelector("#coming-title");
const errorMessage = document.querySelector("#error-message");
const healthExtraInput = document.querySelector("#health-extra");
const childStatusInput = document.querySelector("#child-status");
const stateInput = document.querySelector("#state");
const churchTaxInput = document.querySelector("#church-tax");

const countryInfo = {
  DE: { name: "Germany", symbol: "€", available: true },
  FR: { name: "France", symbol: "€" }, IT: { name: "Italy", symbol: "€" }, ES: { name: "Spain", symbol: "€" },
  NL: { name: "Netherlands", symbol: "€" }, BE: { name: "Belgium", symbol: "€" }, IE: { name: "Ireland", symbol: "€" },
  PT: { name: "Portugal", symbol: "€" }, AT: { name: "Austria", symbol: "€" }, GB: { name: "United Kingdom", symbol: "£", currency: "GBP", available: true },
  CH: { name: "Switzerland", symbol: "CHF" }, NO: { name: "Norway", symbol: "kr" }, SE: { name: "Sweden", symbol: "kr" },
  DK: { name: "Denmark", symbol: "kr" },
  BR: { name: "Brazil", symbol: "R$", currency: "BRL", available: true }, AR: { name: "Argentina", symbol: "$" }, CO: { name: "Colombia", symbol: "$" },
  CL: { name: "Chile", symbol: "$" }, PE: { name: "Peru", symbol: "S/" }, EC: { name: "Ecuador", symbol: "$" },
  UY: { name: "Uruguay", symbol: "$" }, US: { name: "United States", symbol: "$" }, CA: { name: "Canada", symbol: "C$" },
  MX: { name: "Mexico", symbol: "$" }, JP: { name: "Japan", symbol: "¥" }, KR: { name: "South Korea", symbol: "₩" },
  IN: { name: "India", symbol: "₹" }, CN: { name: "China", symbol: "¥" }, AU: { name: "Australia", symbol: "A$" },
  NZ: { name: "New Zealand", symbol: "NZ$" }
};

const outputs = {
  net: document.querySelector("#net-result"),
  tax: document.querySelector("#tax-result"),
  social: document.querySelector("#social-result"),
  pension: document.querySelector("#pension-result"),
  unemployment: document.querySelector("#unemployment-result"),
  health: document.querySelector("#health-result"),
  care: document.querySelector("#care-result"),
  church: document.querySelector("#church-result")
};

const LIMITS = {
  healthCareMonthly: 5812.5,
  pensionUnemploymentMonthly: 8450,
  annualWorkExpenseAllowance: 1230
};

function parseDecimal(value) { const normalized = String(value).trim().replace(/,/g, "."); return /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(normalized) ? Number(normalized) : NaN; }

function formatCurrency(value, currency = "EUR") {
  return new Intl.NumberFormat(currency === "EUR" ? "de-DE" : "en", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.max(0, value));
}

function annualIncomeTax(taxableIncome) {
  const x = Math.max(0, Math.floor(taxableIncome));
  if (x <= 12348) return 0;
  if (x <= 17799) {
    const y = (x - 12348) / 10000;
    return (914.51 * y + 1400) * y;
  }
  if (x <= 69878) {
    const z = (x - 17799) / 10000;
    return (173.10 * z + 2397) * z + 1034.87;
  }
  if (x <= 277825) return 0.42 * x - 11135.63;
  return 0.45 * x - 19470.38;
}

function clearGermanyResults() {
  Object.values(outputs).forEach((output) => output.textContent = "—");
}

function updateCountry() {
  const selected = countryInfo[countryInput.value];
  currencySymbol.textContent = selected.symbol;
  const isGermany = countryInput.value === "DE";
  const isBrazil = countryInput.value === "BR";
  const isUK = countryInput.value === "GB";
  const isSupported = isGermany || isBrazil || isUK;

  germanyOptions.hidden = !isSupported;
  document.querySelector("#germany-fields").hidden = !isGermany;
  comingSoon.hidden = isSupported;
  countryStatus.hidden = !isSupported;

  const breakdownRows = [...document.querySelectorAll(".breakdown > div")];
  const resultLabels = document.querySelectorAll(".results .result-item span");

  if (isGermany) {
    countryStatus.innerHTML = "<strong>Germany model available</strong><span>2026 simplified estimate. Single employee, no children, default region.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly contribution breakdown";
    const labels = ["Pension insurance", "Unemployment insurance", "Health insurance", "Long-term care insurance", "Church tax"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Income tax per month";
    resultLabels[2].textContent = "Employee social contributions";
    document.querySelector(".model-link").textContent = "The Germany 2026 estimate is available in this International Salary Calculator. Brazil and UK models are also available.";
    calculateGermany();
  } else if (isBrazil) {
    countryStatus.innerHTML = "<strong>Brazil model available</strong><span>2026 estimate. Single employee, no dependants, simplified monthly deduction.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly deduction breakdown";
    const labels = ["INSS social security", "Income tax (IRPF)", "—", "—", "—"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = i > 1; });
    resultLabels[1].textContent = "Monthly income tax (IRPF)";
    resultLabels[2].textContent = "INSS contribution";
    document.querySelector(".model-link").textContent = "The Brazil 2026 estimate is available. Germany and UK models are also available.";
    calculateBrazil();
  } else if (isUK) {
    countryStatus.innerHTML = "<strong>United Kingdom model available</strong><span>2026–27 annualised estimate for a standard employee in England, Wales or Northern Ireland. Scottish tax bands are excluded.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly deduction breakdown";
    const labels = ["Income tax (PAYE)", "National Insurance (employee)", "—", "—", "—"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = i > 1; });
    resultLabels[1].textContent = "Income tax (PAYE) per month";
    resultLabels[2].textContent = "National Insurance per month";
    document.querySelector(".model-link").textContent = "The UK 2026–27 estimate uses standard employee tax and National Insurance rates. Scotland has different income-tax bands and is not included.";
    calculateUK();
  } else {
    comingTitle.textContent = selected.name + " salary model is being prepared";
    clearGermanyResults();
  }
}

function calculateSelectedCountry() {
  if (countryInput.value === "BR") calculateBrazil();
  else if (countryInput.value === "DE") calculateGermany();
  else if (countryInput.value === "GB") calculateUK();
}

function progressiveContribution(income, bands) {
  let remaining = Math.max(0, income);
  let previous = 0;
  let total = 0;
  for (const band of bands) {
    const taxable = Math.max(0, Math.min(remaining, band.limit - previous));
    total += taxable * band.rate;
    remaining -= taxable;
    previous = band.limit;
    if (remaining <= 0) break;
  }
  return total;
}

function calculateBrazil() {
  const gross = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(gross) && gross >= 0 && gross <= 100000000;
  errorMessage.textContent = "Enter a valid gross salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const inssBase = Math.min(gross, 8475.55);
  const inss = progressiveContribution(inssBase, [
    { limit: 1621.00, rate: 0.075 },
    { limit: 2902.84, rate: 0.09 },
    { limit: 4354.27, rate: 0.12 },
    { limit: 8475.55, rate: 0.14 }
  ]);

  const simplifiedDeduction = Math.min(607.20, gross * 0.25);
  const taxDeduction = Math.max(inss, simplifiedDeduction);
  const taxBase = Math.max(0, gross - taxDeduction);
  let irpf = 0;
  if (taxBase > 2428.80 && taxBase <= 2826.65) irpf = taxBase * 0.075 - 182.16;
  else if (taxBase <= 3751.05 && taxBase > 2826.65) irpf = taxBase * 0.15 - 394.16;
  else if (taxBase <= 4664.68 && taxBase > 3751.05) irpf = taxBase * 0.225 - 675.49;
  else if (taxBase > 4664.68) irpf = taxBase * 0.275 - 908.73;
  irpf = Math.max(0, irpf);

  let taxReduction = 0;
  if (gross <= 5000) taxReduction = Math.min(irpf, 312.89);
  else if (gross <= 7350) taxReduction = Math.min(irpf, Math.max(0, 978.62 - 0.133145 * gross));
  irpf = Math.max(0, irpf - taxReduction);

  outputs.net.textContent = formatCurrency(gross - inss - irpf, "BRL");
  outputs.tax.textContent = formatCurrency(irpf, "BRL");
  outputs.social.textContent = formatCurrency(inss, "BRL");
  outputs.pension.textContent = formatCurrency(inss, "BRL");
  outputs.unemployment.textContent = formatCurrency(0, "BRL");
  outputs.health.textContent = formatCurrency(0, "BRL");
  outputs.care.textContent = formatCurrency(0, "BRL");
  outputs.church.textContent = formatCurrency(0, "BRL");
  document.querySelector(".results .result-item:nth-child(2) span").textContent = "Monthly income tax (IRPF)";
  document.querySelector(".results .result-item:nth-child(3) span").textContent = "INSS contribution";
}

function calculateUK() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" &&
    Number.isFinite(grossMonthly) &&
    grossMonthly >= 0 &&
    grossMonthly <= 10000000;

  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) {
    clearGermanyResults();
    return;
  }

  const grossAnnual = grossMonthly * 12;
  const personalAllowance = Math.max(0, 12570 - Math.max(0, grossAnnual - 100000) / 2);
  const taxableIncome = Math.max(0, grossAnnual - personalAllowance);
  const basicBand = 37700;
  const higherBand = Math.max(0, 125140 - personalAllowance - basicBand);

  const basicTax = Math.min(taxableIncome, basicBand) * 0.20;
  const higherTax = Math.min(Math.max(0, taxableIncome - basicBand), higherBand) * 0.40;
  const additionalTax = Math.max(0, taxableIncome - basicBand - higherBand) * 0.45;
  const annualIncomeTax = basicTax + higherTax + additionalTax;
  const monthlyIncomeTax = annualIncomeTax / 12;

  // Standard employee category A, monthly payroll thresholds for 2026–27.
  const niMainBand = Math.max(0, Math.min(grossMonthly, 4189) - 1048);
  const niUpperBand = Math.max(0, grossMonthly - 4189);
  const nationalInsurance = niMainBand * 0.08 + niUpperBand * 0.02;
  const net = grossMonthly - monthlyIncomeTax - nationalInsurance;

  outputs.net.textContent = formatCurrency(net, "GBP");
  outputs.tax.textContent = formatCurrency(monthlyIncomeTax, "GBP");
  outputs.social.textContent = formatCurrency(nationalInsurance, "GBP");
  outputs.pension.textContent = formatCurrency(monthlyIncomeTax, "GBP");
  outputs.unemployment.textContent = formatCurrency(nationalInsurance, "GBP");
  outputs.health.textContent = formatCurrency(0, "GBP");
  outputs.care.textContent = formatCurrency(0, "GBP");
  outputs.church.textContent = formatCurrency(0, "GBP");
}

function calculateGermany() {
  if (countryInput.value !== "DE") return;

  const grossMonthly = parseDecimal(grossInput.value);
  const healthExtra = parseDecimal(healthExtraInput.value);
  const valid = grossInput.value.trim() !== "" &&
    healthExtraInput.value.trim() !== "" &&
    Number.isFinite(grossMonthly) &&
    Number.isFinite(healthExtra) &&
    grossMonthly >= 0 &&
    grossMonthly <= 1000000 &&
    healthExtra >= 0 &&
    healthExtra <= 10;

  errorMessage.hidden = valid;
  if (!valid) {
    clearGermanyResults();
    return;
  }

  const grossAnnual = grossMonthly * 12;
  const healthBase = Math.min(grossMonthly, LIMITS.healthCareMonthly);
  const pensionBase = Math.min(grossMonthly, LIMITS.pensionUnemploymentMonthly);
  const pension = pensionBase * 0.093;
  const unemployment = pensionBase * 0.013;
  const health = healthBase * ((14.6 + healthExtra) / 2 / 100);

  const childless = childStatusInput.value === "childless";
  const careRate = stateInput.value === "saxony"
    ? (childless ? 0.023 : 0.013)
    : (childless ? 0.024 : 0.018);
  const care = healthBase * careRate;
  const social = pension + unemployment + health + care;

  const taxableAnnual = Math.max(
    0,
    grossAnnual - LIMITS.annualWorkExpenseAllowance -
    (pension + health + care) * 12
  );
  const annualTax = annualIncomeTax(taxableAnnual);
  const church = annualTax * Number(churchTaxInput.value) / 100 / 12;
  const tax = annualTax / 12;
  const net = grossMonthly - social - tax - church;

  outputs.net.textContent = formatCurrency(net);
  outputs.tax.textContent = formatCurrency(tax);
  outputs.social.textContent = formatCurrency(social);
  outputs.pension.textContent = formatCurrency(pension);
  outputs.unemployment.textContent = formatCurrency(unemployment);
  outputs.health.textContent = formatCurrency(health);
  outputs.care.textContent = formatCurrency(care);
  outputs.church.textContent = formatCurrency(church);
}

countryInput.addEventListener("change", updateCountry);
[grossInput, healthExtraInput, childStatusInput, stateInput, churchTaxInput].forEach((input) => {
  input.addEventListener("input", calculateSelectedCountry);
  input.addEventListener("change", calculateSelectedCountry);
});

document.querySelector("#reset-button").addEventListener("click", () => {
  countryInput.value = "DE";
  grossInput.value = "4000";
  healthExtraInput.value = "2.9";
  childStatusInput.value = "parent";
  stateInput.value = "other";
  churchTaxInput.value = "0";
  updateCountry();
  grossInput.focus();
});

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

updateCountry();
