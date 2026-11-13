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
  GB: { name: "United Kingdom", symbol: "£" },
  FR: { name: "France", symbol: "€" },
  NL: { name: "Netherlands", symbol: "€" },
  BE: { name: "Belgium", symbol: "€" },
  ES: { name: "Spain", symbol: "€" },
  IT: { name: "Italy", symbol: "€" },
  PL: { name: "Poland", symbol: "zł" },
  PT: { name: "Portugal", symbol: "€" },
  AT: { name: "Austria", symbol: "€" },
  IE: { name: "Ireland", symbol: "€" },
  CH: { name: "Switzerland", symbol: "CHF" }
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
  const isGermany = selected.available === true;

  germanyOptions.hidden = !isGermany;
  comingSoon.hidden = isGermany;
  countryStatus.hidden = !isGermany;

  if (isGermany) {
    countryStatus.innerHTML = "<strong>Germany model available</strong><span>2026 simplified estimate. Select the additional details below.</span>";
    calculateGermany();
  } else {
    comingTitle.textContent = selected.name + " salary model is being prepared";
    clearGermanyResults();
  }
}

function calculateGermany() {
  if (countryInput.value !== "DE") return;

  const grossMonthly = Number(grossInput.value);
  const healthExtra = Number(healthExtraInput.value);
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
  input.addEventListener("input", calculateGermany);
  input.addEventListener("change", calculateGermany);
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
