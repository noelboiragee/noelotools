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
  FR: { name: "France", symbol: "€", currency: "EUR", available: true }, IT: { name: "Italy", symbol: "€", currency: "EUR", available: true }, ES: { name: "Spain", symbol: "€", currency: "EUR", available: true },
  NL: { name: "Netherlands", symbol: "€", currency: "EUR", available: true }, BE: { name: "Belgium", symbol: "€", currency: "EUR", available: true }, IE: { name: "Ireland", symbol: "€", currency: "EUR", available: true },
  PT: { name: "Portugal", symbol: "€", currency: "EUR", available: true }, AT: { name: "Austria", symbol: "€", currency: "EUR", available: true }, GB: { name: "United Kingdom", symbol: "£", currency: "GBP", available: true },
  CH: { name: "Switzerland", symbol: "CHF" }, NO: { name: "Norway", symbol: "kr", currency: "NOK", available: true }, SE: { name: "Sweden", symbol: "kr" },
  DK: { name: "Denmark", symbol: "kr", currency: "DKK", available: true },
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
  const locale = currency === "EUR" ? "de-DE" : currency === "NOK" ? "nb-NO" : currency === "DKK" ? "da-DK" : "en";
  return new Intl.NumberFormat(locale, {
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
  const isFrance = countryInput.value === "FR";
  const isBrazil = countryInput.value === "BR";
  const isUK = countryInput.value === "GB";
  const isItaly = countryInput.value === "IT";
  const isSpain = countryInput.value === "ES";
  const isNetherlands = countryInput.value === "NL";
  const isBelgium = countryInput.value === "BE";
  const isIreland = countryInput.value === "IE";
  const isPortugal = countryInput.value === "PT";
  const isAustria = countryInput.value === "AT";
  const isNorway = countryInput.value === "NO";
  const isDenmark = countryInput.value === "DK";
  const isSupported = isGermany || isFrance || isBrazil || isUK || isItaly || isSpain || isNetherlands || isBelgium || isIreland || isPortugal || isAustria || isNorway || isDenmark;

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
  } else if (isFrance) {
    countryStatus.innerHTML = "<strong>France model available</strong><span>Indicative 2026 estimate. Single employee, one tax share, standard private-sector non-managerial payroll.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deductions";
    const labels = ["Basic pension", "Supplementary pension", "CSG", "CRDS", "Other deductions"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = i === 4; });
    resultLabels[1].textContent = "Estimated income tax per month";
    resultLabels[2].textContent = "Employee social contributions";
    document.querySelector(".model-link").textContent = "France is an indicative estimate using published employee contribution rates and the 2026 published tax scale. Actual payroll withholding may differ.";
    calculateFrance();
  } else if (isBrazil) {
    countryStatus.innerHTML = "<strong>Brazil model available</strong><span>2026 estimate. Single employee, no dependants, simplified monthly deduction.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly deduction breakdown";
    const labels = ["INSS social security", "Income tax (IRPF)", "—", "—", "—"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = i > 1; });
    resultLabels[1].textContent = "Monthly income tax (IRPF)";
    resultLabels[2].textContent = "INSS contribution";
    document.querySelector(".model-link").textContent = "The Brazil 2026 estimate is available. Germany, Italy and UK models are also available.";
    calculateBrazil();
  } else if (isSpain) {
    countryStatus.innerHTML = "<strong>Spain model available</strong><span>2026 AEAT payroll withholding estimate. Single employee, no children or dependants, standard indefinite contract, no other income.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deductions";
    const labels = ["Social Security (employee)", "Income tax withholding (IRPF)", "Solidarity contribution", "—", "—"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = i > 2; });
    resultLabels[1].textContent = "Income tax withholding per month";
    resultLabels[2].textContent = "Employee Social Security per month";
    document.querySelector(".model-link").textContent = "Spain uses the AEAT 2026 withholding method and 2026 General Regime employee contribution rates. Regional differences and personal circumstances can change the final tax return.";
    calculateSpain();
  } else if (isDenmark) {
    countryStatus.innerHTML = "<strong>Denmark model available</strong><span>2026 estimate for a full-time employee, single, no church tax or personal pension deduction.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Labour market contribution (AM)", "State income taxes", "Average municipal tax", "Employment and job allowances", "ATP employee contribution"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Income tax per month";
    resultLabels[2].textContent = "AM contribution + ATP per month";
    document.querySelector(".model-link").textContent = "The estimate uses the 2026 national tax reform and average municipal tax of 25.049%. Municipality, church membership, pension contributions and individual deductions can change the result.";
    calculateDenmark();
  } else if (isNorway) {
    countryStatus.innerHTML = "<strong>Norway model available</strong><span>2026 estimate for a single resident employee outside the northern Action Zone, no dependants.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Ordinary income tax", "Bracket tax", "National Insurance contribution", "Minimum standard deduction", "Personal allowance"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Income tax per month";
    resultLabels[2].textContent = "National Insurance per month";
    document.querySelector(".model-link").textContent = "Norway's 22% ordinary-income tax includes central, county and municipal tax. The northern Action Zone has a reduced rate and is excluded. The estimate uses standard employee deductions and no additional personal deductions.";
    calculateNorway();
  } else if (isAustria) {
    countryStatus.innerHTML = "<strong>Austria model available</strong><span>2026 estimate for a standard employee outside Vienna, no children, no 13th/14th salary payments.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Employee social insurance", "Income tax after employee credits", "Taxable income after deductions", "Standard employee tax credit", "Low-income tax-credit supplement"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Income tax per month";
    resultLabels[2].textContent = "Employee social insurance per month";
    document.querySelector(".model-link").textContent = "Austria has special tax treatment for 13th and 14th salary payments. They are excluded here; the estimate uses 12 equal salary payments and the standard non-Vienna housing-promotion contribution.";
    calculateAustria();
  } else if (isPortugal) {
    countryStatus.innerHTML = "<strong>Portugal model available</strong><span>2026 estimate for a single mainland resident employee, no dependants, no additional personal expense credits.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Employee Social Security", "IRS income tax", "Employment-income specific deduction", "Additional solidarity tax", "Other personal tax credits"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "IRS income tax per month";
    resultLabels[2].textContent = "Employee Social Security per month";
    document.querySelector(".model-link").textContent = "Portugal uses a specific employment-income deduction equal to the higher of €4,587.09 or mandatory employee social contributions. This estimate excludes household expense credits and assumes 12 equal monthly salary payments; holiday and Christmas payments are not included.";
    calculatePortugal();
  } else if (isIreland) {
    countryStatus.innerHTML = "<strong>Ireland model available</strong><span>2026 estimate for a single PAYE employee, standard-rate band €44,000, standard tax credits and Class A PRSI.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Income tax after PAYE credits", "Universal Social Charge (USC)", "Employee PRSI", "Single Person Tax Credit", "PAYE Employee Tax Credit"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Income tax per month";
    resultLabels[2].textContent = "USC + employee PRSI per month";
    document.querySelector(".model-link").textContent = "Ireland combines income tax, USC and employee PRSI. This estimate assumes one PAYE job, single tax status, no pension deduction and no additional credits or reliefs.";
    calculateIreland();
  } else if (isBelgium) {
    countryStatus.innerHTML = "<strong>Belgium model available</strong><span>2026 estimate for a single white-collar employee with no dependants; municipal tax and special social-security contribution excluded.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Employee social security (ONSS)", "Flat-rate professional expenses", "Personal tax allowance benefit", "Work bonus (if applicable)", "Municipal and special social charges (excluded)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Federal income tax per month";
    resultLabels[2].textContent = "Employee social security per month";
    document.querySelector(".model-link").textContent = "Belgium excludes municipal tax and the special social-security contribution because these depend on municipality and household circumstances. Holiday pay and year-end bonus are not included in the monthly salary input.";
    calculateBelgium();
  } else if (isNetherlands) {
    countryStatus.innerHTML = "<strong>Netherlands model available</strong><span>2026 estimate for an employee below AOW age, one job, resident in the Netherlands, with general and labour tax credits applied.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly payroll tax and credit breakdown";
    const labels = ["Box 1 tax before credits", "General tax credit", "Labour tax credit", "Employer Zvw contribution (not deducted)", "Private health insurance (excluded)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Payroll tax & national insurance per month";
    resultLabels[2].textContent = "National insurance premiums";
    document.querySelector(".model-link").textContent = "Dutch national insurance premiums are included in the first Box 1 tax bracket. The employer normally pays the income-related Zvw contribution; private basic health insurance is paid separately and is not deducted here.";
    calculateNetherlands();
  } else if (isItaly) {
    countryStatus.innerHTML = "<strong>Italy model available</strong><span>2026 estimate. Standard private-sector employee, one employment income, no dependants; regional and municipal surcharges excluded.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly deduction breakdown";
    const labels = ["INPS employee contribution", "Gross IRPEF", "Employee tax credit", "2026 tax-wedge relief", "Local tax surcharges (excluded)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Income tax after credits per month";
    resultLabels[2].textContent = "Employee INPS contribution";
    document.querySelector(".model-link").textContent = "Italy uses a standard 9.19% employee INPS baseline. Actual contribution rates and take-home pay vary by sector, contract and local tax surcharges.";
    calculateItaly();
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
  else if (countryInput.value === "FR") calculateFrance();
  else if (countryInput.value === "DE") calculateGermany();
  else if (countryInput.value === "GB") calculateUK();
  else if (countryInput.value === "IT") calculateItaly();
  else if (countryInput.value === "ES") calculateSpain();
  else if (countryInput.value === "NL") calculateNetherlands();
  else if (countryInput.value === "BE") calculateBelgium();
  else if (countryInput.value === "IE") calculateIreland();
  else if (countryInput.value === "PT") calculatePortugal();
  else if (countryInput.value === "AT") calculateAustria();
  else if (countryInput.value === "NO") calculateNorway();
  else if (countryInput.value === "DK") calculateDenmark();
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

function calculateDenmark() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  const annualATP = Math.min(annualGross, 1188);
  const amBase = Math.max(0, annualGross - annualATP);
  const annualAM = amBase * 0.08;
  const personalIncomeAfterAM = Math.max(0, amBase - annualAM);
  const employmentAllowance = Math.min(annualGross * 0.1275, 63300);
  const jobAllowance = Math.min(Math.max(0, annualGross - 235200) * 0.045, 3100);
  const personalAllowance = Math.min(personalIncomeAfterAM, 54100);

  const municipalTaxableIncome = Math.max(0, personalIncomeAfterAM - personalAllowance - employmentAllowance - jobAllowance);
  const municipalTax = municipalTaxableIncome * 0.25049;
  const bottomTax = Math.max(0, personalIncomeAfterAM - personalAllowance) * 0.1201;
  const middleTax = Math.max(0, personalIncomeAfterAM - 641200) * 0.075;
  const topTax = Math.max(0, personalIncomeAfterAM - 777900) * 0.075;
  const topTopTax = Math.max(0, personalIncomeAfterAM - 2592700) * 0.05;
  const taxBeforeCeiling = municipalTax + bottomTax + middleTax + topTax;
  const taxCeiling = Math.max(0, personalIncomeAfterAM - personalAllowance) * 0.4457;
  const ordinaryTax = Math.min(taxBeforeCeiling, taxCeiling);
  const annualTax = ordinaryTax + topTopTax;

  const monthlyAM = annualAM / 12;
  const monthlyTax = annualTax / 12;
  const monthlyATP = annualATP / 12;
  const netMonthly = grossMonthly - monthlyAM - monthlyTax - monthlyATP;

  outputs.net.textContent = formatCurrency(netMonthly, "DKK");
  outputs.tax.textContent = formatCurrency(monthlyTax, "DKK");
  outputs.social.textContent = formatCurrency(monthlyAM + monthlyATP, "DKK");
  outputs.pension.textContent = formatCurrency(monthlyAM, "DKK");
  outputs.unemployment.textContent = formatCurrency((bottomTax + middleTax + topTax + topTopTax) / 12, "DKK");
  outputs.health.textContent = formatCurrency(municipalTax / 12, "DKK");
  outputs.care.textContent = formatCurrency((employmentAllowance + jobAllowance) / 12, "DKK");
  outputs.church.textContent = formatCurrency(monthlyATP, "DKK");
}

function calculateNorway() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  const minimumStandardDeduction = Math.min(annualGross * 0.46, 95700);
  const personalAllowance = Math.min(annualGross, 114540);
  const ordinaryTaxableIncome = Math.max(0, annualGross - minimumStandardDeduction - personalAllowance);
  const ordinaryIncomeTax = ordinaryTaxableIncome * 0.22;

  const bracketTax =
    Math.max(0, Math.min(annualGross, 318300) - 226100) * 0.017 +
    Math.max(0, Math.min(annualGross, 725050) - 318300) * 0.04 +
    Math.max(0, Math.min(annualGross, 980100) - 725050) * 0.137 +
    Math.max(0, Math.min(annualGross, 1467200) - 980100) * 0.168 +
    Math.max(0, annualGross - 1467200) * 0.178;

  // Employee national insurance: 7.6%, with the statutory lower-limit and 25% step-up cap.
  const nationalInsurance = Math.min(annualGross * 0.076, Math.max(0, annualGross - 99650) * 0.25);
  const annualTax = ordinaryIncomeTax + bracketTax;
  const monthlyTax = annualTax / 12;
  const monthlyNI = nationalInsurance / 12;
  const netMonthly = grossMonthly - monthlyTax - monthlyNI;

  outputs.net.textContent = formatCurrency(netMonthly, "NOK");
  outputs.tax.textContent = formatCurrency(monthlyTax, "NOK");
  outputs.social.textContent = formatCurrency(monthlyNI, "NOK");
  outputs.pension.textContent = formatCurrency(ordinaryIncomeTax / 12, "NOK");
  outputs.unemployment.textContent = formatCurrency(bracketTax / 12, "NOK");
  outputs.health.textContent = formatCurrency(minimumStandardDeduction / 12, "NOK");
  outputs.care.textContent = formatCurrency(personalAllowance / 12, "NOK");
  outputs.church.textContent = "Excluded";
}

function calculateAustria() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  const monthlyContributionBase = Math.min(grossMonthly, 6930);
  const unemploymentRate = grossMonthly <= 2225 ? 0 : grossMonthly <= 2427 ? 0.01 : grossMonthly <= 2630 ? 0.02 : 0.0295;
  const employeeSocialRate = 0.0387 + 0.1025 + 0.005 + 0.005 + unemploymentRate;
  const monthlySocial = grossMonthly <= 551.10 ? 0 : monthlyContributionBase * employeeSocialRate;
  const annualSocial = monthlySocial * 12;

  // Standard annual employee expense allowance and taxable income.
  const taxableIncome = Math.max(0, annualGross - annualSocial - 132);
  const annualTaxBeforeCredits =
    Math.min(taxableIncome, 13539) * 0 +
    Math.max(0, Math.min(taxableIncome, 21992) - 13539) * 0.20 +
    Math.max(0, Math.min(taxableIncome, 36458) - 21992) * 0.30 +
    Math.max(0, Math.min(taxableIncome, 70365) - 36458) * 0.40 +
    Math.max(0, Math.min(taxableIncome, 104859) - 70365) * 0.48 +
    Math.max(0, Math.min(taxableIncome, 1000000) - 104859) * 0.50 +
    Math.max(0, taxableIncome - 1000000) * 0.55;

  const standardEmployeeCredit = Math.min(annualTaxBeforeCredits, 496);
  const taxAfterStandardCredit = Math.max(0, annualTaxBeforeCredits - standardEmployeeCredit);
  const potentialLowIncomeCredit = taxableIncome <= 19761 ? 804 : taxableIncome < 30259
    ? 804 * (30259 - taxableIncome) / (30259 - 19761) : 0;
  const lowIncomeCredit = Math.min(taxAfterStandardCredit, potentialLowIncomeCredit);
  const annualTax = Math.max(0, taxAfterStandardCredit - lowIncomeCredit);
  const monthlyTax = annualTax / 12;
  const netMonthly = grossMonthly - monthlySocial - monthlyTax;

  outputs.net.textContent = formatCurrency(netMonthly, "EUR");
  outputs.tax.textContent = formatCurrency(monthlyTax, "EUR");
  outputs.social.textContent = formatCurrency(monthlySocial, "EUR");
  outputs.pension.textContent = formatCurrency(monthlySocial, "EUR");
  outputs.unemployment.textContent = formatCurrency(taxableIncome / 12, "EUR");
  outputs.health.textContent = formatCurrency(standardEmployeeCredit / 12, "EUR");
  outputs.care.textContent = formatCurrency(lowIncomeCredit / 12, "EUR");
  outputs.church.textContent = "Excluded";
}

function calculatePortugal() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  const annualSocial = annualGross * 0.11;
  const specificDeduction = Math.min(annualGross, Math.max(4587.09, annualSocial));
  const taxableIncome = Math.max(0, annualGross - specificDeduction);

  // Portugal 2026 IRS rates as amended by Decree-Law 212/2026, effective 5 November 2026.
  const brackets = [
    { limit: 8342, rate: 0.122 },
    { limit: 12587, rate: 0.152 },
    { limit: 17838, rate: 0.207 },
    { limit: 23089, rate: 0.236 },
    { limit: 29397, rate: 0.306 },
    { limit: 43090, rate: 0.346 },
    { limit: 46566, rate: 0.431 },
    { limit: 86634, rate: 0.446 },
    { limit: Infinity, rate: 0.48 }
  ];
  let previous = 0;
  let annualIRS = 0;
  for (const bracket of brackets) {
    const slice = Math.max(0, Math.min(taxableIncome, bracket.limit) - previous);
    annualIRS += slice * bracket.rate;
    previous = bracket.limit;
    if (taxableIncome <= bracket.limit) break;
  }
  const solidarityTax =
    Math.max(0, Math.min(taxableIncome, 250000) - 80000) * 0.025 +
    Math.max(0, taxableIncome - 250000) * 0.05;
  annualIRS += solidarityTax;

  const monthlySocial = annualSocial / 12;
  const monthlyTax = annualIRS / 12;
  const netMonthly = grossMonthly - monthlySocial - monthlyTax;
  outputs.net.textContent = formatCurrency(netMonthly, "EUR");
  outputs.tax.textContent = formatCurrency(monthlyTax, "EUR");
  outputs.social.textContent = formatCurrency(monthlySocial, "EUR");
  outputs.pension.textContent = formatCurrency(monthlySocial, "EUR");
  outputs.unemployment.textContent = formatCurrency(monthlyTax, "EUR");
  outputs.health.textContent = formatCurrency(specificDeduction / 12, "EUR");
  outputs.care.textContent = formatCurrency(solidarityTax / 12, "EUR");
  outputs.church.textContent = "Excluded";
}

function calculateIreland() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  // 2026 single PAYE employee: €44,000 standard-rate band and €2,000 + €2,000 tax credits.
  const grossIncomeTax = Math.min(annualGross, 44000) * 0.20 + Math.max(0, annualGross - 44000) * 0.40;
  const singleTaxCredit = 2000;
  const payeTaxCredit = 2000;
  const annualIncomeTax = Math.max(0, grossIncomeTax - singleTaxCredit - payeTaxCredit);

  // 2026 USC: if annual income exceeds €13,000, USC applies to the full income.
  let annualUSC = 0;
  if (annualGross > 13000) {
    annualUSC = Math.min(annualGross, 12012) * 0.005 +
      Math.max(0, Math.min(annualGross, 28700) - 12012) * 0.02 +
      Math.max(0, Math.min(annualGross, 70044) - 28700) * 0.03 +
      Math.max(0, annualGross - 70044) * 0.08;
  }

  // Class A PRSI: 4.20% through 30 Sep 2026, then 4.35% from 1 Oct 2026.
  // Convert monthly pay to an equivalent weekly amount for the PRSI threshold and credit.
  const weeklyGross = annualGross / 52;
  const prsiCredit = weeklyGross <= 352 ? 0 : weeklyGross <= 424
    ? Math.max(0, 12 - (weeklyGross - 352.01) / 6) : 0;
  const weeklyPrsiBeforeOct = weeklyGross <= 352 ? 0 : weeklyGross * 0.042 - prsiCredit;
  const weeklyPrsiFromOct = weeklyGross <= 352 ? 0 : weeklyGross * 0.0435 - prsiCredit;
  const annualPRSI = Math.max(0, weeklyPrsiBeforeOct) * 39 + Math.max(0, weeklyPrsiFromOct) * 13;

  const monthlyTax = annualIncomeTax / 12;
  const monthlyUSC = annualUSC / 12;
  const monthlyPRSI = annualPRSI / 12;
  const netMonthly = grossMonthly - monthlyTax - monthlyUSC - monthlyPRSI;

  outputs.net.textContent = formatCurrency(netMonthly, "EUR");
  outputs.tax.textContent = formatCurrency(monthlyTax, "EUR");
  outputs.social.textContent = formatCurrency(monthlyUSC + monthlyPRSI, "EUR");
  outputs.pension.textContent = formatCurrency(monthlyTax, "EUR");
  outputs.unemployment.textContent = formatCurrency(monthlyUSC, "EUR");
  outputs.health.textContent = formatCurrency(monthlyPRSI, "EUR");
  outputs.care.textContent = formatCurrency(singleTaxCredit / 12, "EUR");
  outputs.church.textContent = formatCurrency(payeTaxCredit / 12, "EUR");
}

function calculateBelgium() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  // Standard white-collar employee social-security contribution; work-bonus reductions are applied where due.
  const ordinaryMonthlyContribution = grossMonthly * 0.1307;
  const partA = grossMonthly <= 2937.93 ? 127.54 : grossMonthly <= 3403.62
    ? Math.max(0, 127.54 - 0.2739 * (grossMonthly - 2937.93)) : 0;
  const partB = grossMonthly <= 2300.62 ? 171.99 : grossMonthly <= 2937.93
    ? Math.max(0, 171.99 - 0.2699 * (grossMonthly - 2300.62)) : 0;
  const workBonus = Math.min(ordinaryMonthlyContribution, partA + partB);
  const monthlySocial = Math.max(0, ordinaryMonthlyContribution - workBonus);
  const annualSocial = monthlySocial * 12;

  // Flat-rate employee professional expenses: 30% of net professional income, capped at €6,070 for income year 2026.
  const professionalExpenses = Math.min(6070, Math.max(0, annualGross - annualSocial) * 0.30);
  const taxableIncome = Math.max(0, annualGross - annualSocial - professionalExpenses);
  const federalTaxBeforeAllowance =
    Math.min(taxableIncome, 16720) * 0.25 +
    Math.max(0, Math.min(taxableIncome, 29510) - 16720) * 0.40 +
    Math.max(0, Math.min(taxableIncome, 51070) - 29510) * 0.45 +
    Math.max(0, taxableIncome - 51070) * 0.50;
  // Basic personal tax allowance for income tax year 2026; tax benefit at the first-bracket rate.
  const personalAllowanceBenefit = Math.min(federalTaxBeforeAllowance, 11550 * 0.25);
  const annualFederalTax = Math.max(0, federalTaxBeforeAllowance - personalAllowanceBenefit);
  const monthlyTax = annualFederalTax / 12;
  const netMonthly = grossMonthly - monthlySocial - monthlyTax;

  outputs.net.textContent = formatCurrency(netMonthly, "EUR");
  outputs.tax.textContent = formatCurrency(monthlyTax, "EUR");
  outputs.social.textContent = formatCurrency(monthlySocial, "EUR");
  outputs.pension.textContent = formatCurrency(monthlySocial, "EUR");
  outputs.unemployment.textContent = formatCurrency(professionalExpenses / 12, "EUR");
  outputs.health.textContent = formatCurrency(personalAllowanceBenefit / 12, "EUR");
  outputs.care.textContent = formatCurrency(workBonus, "EUR");
  outputs.church.textContent = "Excluded";
}

function calculateNetherlands() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualIncome = grossMonthly * 12;
  // 2026 Box 1 rates for a person below AOW age: income tax plus national insurance.
  const box1Tax =
    Math.min(annualIncome, 38883) * 0.3575 +
    Math.max(0, Math.min(annualIncome, 78426) - 38883) * 0.3756 +
    Math.max(0, annualIncome - 78426) * 0.495;

  const generalCredit = annualIncome <= 29736 ? 3115 : annualIncome < 78426
    ? Math.max(0, 3115 - 0.06398 * (annualIncome - 29736)) : 0;

  let labourCredit = 0;
  if (annualIncome <= 11965) labourCredit = annualIncome * 0.08324;
  else if (annualIncome <= 25845) labourCredit = 996 + (annualIncome - 11965) * 0.31009;
  else if (annualIncome <= 45592) labourCredit = 5300 + (annualIncome - 25845) * 0.01950;
  else if (annualIncome <= 132920) labourCredit = 5685 - (annualIncome - 45592) * 0.06510;
  labourCredit = Math.max(0, labourCredit);

  const annualPayrollTax = Math.max(0, box1Tax - generalCredit - labourCredit);
  const monthlyPayrollTax = annualPayrollTax / 12;
  outputs.net.textContent = formatCurrency(grossMonthly - monthlyPayrollTax, "EUR");
  outputs.tax.textContent = formatCurrency(monthlyPayrollTax, "EUR");
  outputs.social.textContent = "Included in payroll tax";
  outputs.pension.textContent = formatCurrency(box1Tax / 12, "EUR");
  outputs.unemployment.textContent = formatCurrency(generalCredit / 12, "EUR");
  outputs.health.textContent = formatCurrency(labourCredit / 12, "EUR");
  outputs.care.textContent = "Not deducted";
  outputs.church.textContent = "Excluded";
}

function calculateSpain() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  const contributionBase = Math.min(grossMonthly, 5101.20);
  const ordinarySocial = contributionBase * (0.047 + 0.0155 + 0.001 + 0.0015);
  const solidarity =
    Math.max(0, Math.min(grossMonthly, 5611.32) - 5101.20) * 0.0019 +
    Math.max(0, Math.min(grossMonthly, 7651.80) - 5611.32) * 0.0021 +
    Math.max(0, grossMonthly - 7651.80) * 0.0024;
  const monthlySocial = ordinarySocial + solidarity;
  const annualSocial = monthlySocial * 12;

  // AEAT 2026 withholding algorithm: work income net of deductible employee contributions.
  const netWorkIncome = Math.max(0, annualGross - annualSocial);
  let workIncomeReduction = 0;
  if (netWorkIncome <= 14852) workIncomeReduction = 7302;
  else if (netWorkIncome <= 17673.52) workIncomeReduction = 7302 - 1.75 * (netWorkIncome - 14852);
  else if (netWorkIncome < 19747.50) workIncomeReduction = 2364.34 - 1.14 * (netWorkIncome - 17673.52);
  workIncomeReduction = Math.max(0, workIncomeReduction);

  const generalEmploymentExpense = Math.min(2000, netWorkIncome);
  const withholdingBase = Math.max(0, netWorkIncome - generalEmploymentExpense - workIncomeReduction);
  const withholdingScale = (income) => {
    const x = Math.max(0, income);
    return Math.min(x, 12450) * 0.19 +
      Math.max(0, Math.min(x, 20200) - 12450) * 0.24 +
      Math.max(0, Math.min(x, 35200) - 20200) * 0.30 +
      Math.max(0, Math.min(x, 60000) - 35200) * 0.37 +
      Math.max(0, Math.min(x, 300000) - 60000) * 0.45 +
      Math.max(0, x - 300000) * 0.47;
  };
  const annualWithholding = Math.max(0, withholdingScale(withholdingBase) - withholdingScale(5550));
  const monthlyTax = annualWithholding / 12;
  const net = grossMonthly - monthlySocial - monthlyTax;

  outputs.net.textContent = formatCurrency(net, "EUR");
  outputs.tax.textContent = formatCurrency(monthlyTax, "EUR");
  outputs.social.textContent = formatCurrency(monthlySocial, "EUR");
  outputs.pension.textContent = formatCurrency(contributionBase * 0.047, "EUR");
  outputs.unemployment.textContent = formatCurrency(contributionBase * 0.0155, "EUR");
  outputs.health.textContent = formatCurrency(contributionBase * 0.001, "EUR");
  outputs.care.textContent = formatCurrency(contributionBase * 0.0015, "EUR");
  outputs.church.textContent = formatCurrency(solidarity, "EUR");
}

function calculateItaly() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  // Standard baseline for an ordinary private-sector employee; contract-specific rates may differ.
  const annualInps = annualGross * 0.0919;
  const taxableAnnual = Math.max(0, annualGross - annualInps);

  const grossIrpef =
    Math.min(taxableAnnual, 28000) * 0.23 +
    Math.max(0, Math.min(taxableAnnual, 50000) - 28000) * 0.33 +
    Math.max(0, taxableAnnual - 50000) * 0.43;

  let employmentCredit = 0;
  if (taxableAnnual <= 15000) employmentCredit = Math.max(690, 1955);
  else if (taxableAnnual <= 28000) employmentCredit = 1910 + 1190 * (28000 - taxableAnnual) / 13000;
  else if (taxableAnnual <= 50000) employmentCredit = 1910 * (50000 - taxableAnnual) / 22000;
  if (taxableAnnual >= 25000 && taxableAnnual <= 35000) employmentCredit += 65;

  let taxWedgeRelief = 0;
  let nonTaxableBonus = 0;
  if (annualGross <= 20000) {
    const rate = annualGross <= 8500 ? 0.071 : annualGross <= 15000 ? 0.053 : 0.048;
    nonTaxableBonus = annualGross * rate;
  } else if (taxableAnnual <= 32000) {
    taxWedgeRelief = 1000;
  } else if (taxableAnnual <= 40000) {
    taxWedgeRelief = 1000 * (40000 - taxableAnnual) / 8000;
  }

  const annualIncomeTax = Math.max(0, grossIrpef - employmentCredit - taxWedgeRelief);
  const monthlyInps = annualInps / 12;
  const monthlyGrossIrpef = grossIrpef / 12;
  const monthlyCredit = employmentCredit / 12;
  const monthlyRelief = taxWedgeRelief / 12;
  const monthlyTax = annualIncomeTax / 12;
  const monthlyBonus = nonTaxableBonus / 12;
  const net = grossMonthly - monthlyInps - monthlyTax + monthlyBonus;

  outputs.net.textContent = formatCurrency(net, "EUR");
  outputs.tax.textContent = formatCurrency(monthlyTax, "EUR");
  outputs.social.textContent = formatCurrency(monthlyInps, "EUR");
  outputs.pension.textContent = formatCurrency(monthlyInps, "EUR");
  outputs.unemployment.textContent = formatCurrency(monthlyGrossIrpef, "EUR");
  outputs.health.textContent = formatCurrency(monthlyCredit, "EUR");
  outputs.care.textContent = formatCurrency(monthlyRelief + monthlyBonus, "EUR");
  outputs.church.textContent = formatCurrency(0, "EUR");
}

function calculateFrance() {
  const gross = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" &&
    Number.isFinite(gross) && gross >= 0 && gross <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  // 2026 employee contribution rates from CLEISS; standard non-managerial assumption.
  const cappedBase = Math.min(gross, 4005);
  const supplementaryUpperBase = Math.max(0, Math.min(gross, 32040) - 4005);
  const basicPension = cappedBase * 0.069 + gross * 0.004;
  const supplementaryPension =
    cappedBase * (0.0315 + 0.0086) +
    supplementaryUpperBase * (0.0864 + 0.0108);

  const csgBase = Math.min(gross, 4005 * 4) * 0.9825 + Math.max(0, gross - 4005 * 4);
  const csg = csgBase * 0.092;
  const crds = csgBase * 0.005;
  const employeeSocial = basicPension + supplementaryPension + csg + crds;

  // Deductible CSG is 6.8%; CRDS and the remaining CSG are not deductible.
  const deductibleCsg = csgBase * 0.068;
  const annualNetTaxableBeforeAllowance =
    Math.max(0, (gross - basicPension - supplementaryPension - deductibleCsg) * 12);
  const professionalAllowance = Math.min(14555, Math.max(509, annualNetTaxableBeforeAllowance * 0.10));
  const taxableAnnual = Math.max(0, annualNetTaxableBeforeAllowance - professionalAllowance);

  // Published 2026 progressive scale (one tax share).
  const taxAnnual =
    Math.max(0, Math.min(taxableAnnual, 29579) - 11600) * 0.11 +
    Math.max(0, Math.min(taxableAnnual, 84577) - 29579) * 0.30 +
    Math.max(0, Math.min(taxableAnnual, 181917) - 84577) * 0.41 +
    Math.max(0, taxableAnnual - 181917) * 0.45;
  const monthlyIncomeTax = taxAnnual / 12;
  const net = gross - employeeSocial - monthlyIncomeTax;

  outputs.net.textContent = formatCurrency(net, "EUR");
  outputs.tax.textContent = formatCurrency(monthlyIncomeTax, "EUR");
  outputs.social.textContent = formatCurrency(employeeSocial, "EUR");
  outputs.pension.textContent = formatCurrency(basicPension, "EUR");
  outputs.unemployment.textContent = formatCurrency(supplementaryPension, "EUR");
  outputs.health.textContent = formatCurrency(csg, "EUR");
  outputs.care.textContent = formatCurrency(crds, "EUR");
  outputs.church.textContent = formatCurrency(0, "EUR");
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
