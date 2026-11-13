// এই স্ক্রিপ্টে ২০২৬ সালের আনুমানিক জার্মান বেতন ও কর্তন হিসাব করা হয়েছে।
const grossInput = document.querySelector("#gross-salary");
const healthExtraInput = document.querySelector("#health-extra");
const childStatusInput = document.querySelector("#child-status");
const stateInput = document.querySelector("#state");
const churchTaxInput = document.querySelector("#church-tax");
const errorMessage = document.querySelector("#error-message");

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
  annualWorkExpenseAllowance: 1230,
  basicAllowance2026: 12348
};

function euro(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
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

function calculate() {
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
    Object.values(outputs).forEach((output) => output.textContent = "—");
    return;
  }

  const grossAnnual = grossMonthly * 12;
  const healthCareBase = Math.min(grossMonthly, LIMITS.healthCareMonthly);
  const pensionUnemploymentBase = Math.min(grossMonthly, LIMITS.pensionUnemploymentMonthly);

  const pensionMonthly = pensionUnemploymentBase * 0.093;
  const unemploymentMonthly = pensionUnemploymentBase * 0.013;
  const healthMonthly = healthCareBase * ((14.6 + healthExtra) / 2 / 100);

  const isChildless = childStatusInput.value === "childless";
  const careRateEmployee = stateInput.value === "saxony"
    ? (isChildless ? 0.023 : 0.013)
    : (isChildless ? 0.024 : 0.018);
  const careMonthly = healthCareBase * careRateEmployee;

  const socialMonthly = pensionMonthly + unemploymentMonthly + healthMonthly + careMonthly;

  // আয়করযোগ্য আয় এখানে সরলীকৃতভাবে অনুমান করা হয়েছে; এটি সরকারি পে-রোল সূত্র নয়।
  const estimatedTaxableAnnual = Math.max(
    0,
    grossAnnual - LIMITS.annualWorkExpenseAllowance -
    (pensionMonthly + healthMonthly + careMonthly) * 12
  );
  const annualTax = annualIncomeTax(estimatedTaxableAnnual);
  const churchRate = Number(churchTaxInput.value) / 100;
  const churchMonthly = annualTax * churchRate / 12;
  const taxMonthly = annualTax / 12;
  const netMonthly = grossMonthly - socialMonthly - taxMonthly - churchMonthly;

  outputs.net.textContent = euro(netMonthly);
  outputs.tax.textContent = euro(taxMonthly);
  outputs.social.textContent = euro(socialMonthly);
  outputs.pension.textContent = euro(pensionMonthly);
  outputs.unemployment.textContent = euro(unemploymentMonthly);
  outputs.health.textContent = euro(healthMonthly);
  outputs.care.textContent = euro(careMonthly);
  outputs.church.textContent = euro(churchMonthly);
}

[grossInput, healthExtraInput, childStatusInput, stateInput, churchTaxInput].forEach((input) => {
  input.addEventListener("input", calculate);
  input.addEventListener("change", calculate);
});

document.querySelector("#reset-button").addEventListener("click", () => {
  grossInput.value = "4000";
  healthExtraInput.value = "2.9";
  childStatusInput.value = "parent";
  stateInput.value = "other";
  churchTaxInput.value = "0";
  calculate();
  grossInput.focus();
});

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

calculate();
