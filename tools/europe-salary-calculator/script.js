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
  CH: { name: "Switzerland", symbol: "CHF", currency: "CHF", available: true }, NO: { name: "Norway", symbol: "kr", currency: "NOK", available: true }, SE: { name: "Sweden", symbol: "kr", currency: "SEK", available: true },
  DK: { name: "Denmark", symbol: "kr", currency: "DKK", available: true },
  BR: { name: "Brazil", symbol: "R$", currency: "BRL", available: true }, AR: { name: "Argentina", symbol: "$", currency: "ARS", available: true }, CO: { name: "Colombia", symbol: "COP$", currency: "COP", available: true },
  CL: { name: "Chile", symbol: "CLP$", currency: "CLP", available: true }, PE: { name: "Peru", symbol: "S/", currency: "PEN", available: true }, EC: { name: "Ecuador", symbol: "US$", currency: "USD", available: true },
  UY: { name: "Uruguay", symbol: "UYU$", currency: "UYU", available: true }, US: { name: "United States", symbol: "$", currency: "USD", available: true }, CA: { name: "Canada", symbol: "C$", currency: "CAD", available: true },
  MX: { name: "Mexico", symbol: "MX$", currency: "MXN", available: true }, JP: { name: "Japan", symbol: "¥", currency: "JPY", available: true }, KR: { name: "South Korea", symbol: "₩", currency: "KRW", available: true },
  IN: { name: "India", symbol: "₹", currency: "INR", available: true }, CN: { name: "China", symbol: "¥", currency: "CNY", available: true }, AU: { name: "Australia", symbol: "A$", currency: "AUD", available: true },
  NZ: { name: "New Zealand", symbol: "NZ$", currency: "NZD", available: true }
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
  const locale = currency === "EUR" ? "de-DE" : currency === "NOK" ? "nb-NO" : currency === "DKK" ? "da-DK" : currency === "SEK" ? "sv-SE" : currency === "CHF" ? "de-CH" : currency === "ARS" ? "es-AR" : "en";
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
  const isSweden = countryInput.value === "SE";
  const isSwitzerland = countryInput.value === "CH";
  const isArgentina = countryInput.value === "AR";
  const isSupported = isGermany || isFrance || isBrazil || isUK || isItaly || isSpain || isNetherlands || isBelgium || isIreland || isPortugal || isAustria || isNorway || isDenmark || isSweden || isSwitzerland || isArgentina || countryInput.value === "NZ" || countryInput.value === "AU" || countryInput.value === "IN" || countryInput.value === "US" || countryInput.value === "CA" || countryInput.value === "MX" || countryInput.value === "CL" || countryInput.value === "PE" || countryInput.value === "EC" || countryInput.value === "CO" || countryInput.value === "KR" || countryInput.value === "UY" || countryInput.value === "JP" || countryInput.value === "CN";

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
    resultLabels[2].textContent = "Employee payroll contributions (excluded)";
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
  } else if (isArgentina) {
    countryStatus.innerHTML = "<strong>Argentina model available</strong><span>2026 annual Ganancias estimate for a resident single employee, no dependants; employee social-security cap uses November 2026 values.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Employee social-security contributions", "Basic personal allowance", "Special employee deduction", "Annual taxable income", "13th salary and other deductions (excluded)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Ganancias income tax per month";
    resultLabels[2].textContent = "Employee social contributions per month";
    document.querySelector(".model-link").textContent = "The estimate uses 12 equal monthly salary payments and excludes the 13th salary (SAC), dependants, personal expense deductions and employer contributions. The social-security cap is the November 2026 maximum and is held constant across the annual estimate.";
    calculateArgentina();
  } else if (isSwitzerland) {
    countryStatus.innerHTML = "<strong>Switzerland model available — Zurich benchmark</strong><span>2026 estimate for a single employee in Zurich city, no church tax, using standard payroll deductions.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["AHV/IV/EO + ALV + accident + pension", "Federal income tax", "Zurich cantonal and city tax", "Work-expense deductions", "Insurance-premium tax deductions"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Federal + Zurich income tax per month";
    resultLabels[2].textContent = "Employee social contributions per month";
    document.querySelector(".model-link").textContent = "Swiss tax varies substantially by canton and municipality. This model uses Zurich city (2026 cantonal multiplier 95%, municipal multiplier 119%) and is not a nationwide average. Occupational pension and accident premiums vary by employer and plan.";
    calculateSwitzerland();
  } else if (isSweden) {
    countryStatus.innerHTML = "<strong>Sweden model available</strong><span>2026 estimate for a working-age resident employee using the national-average municipal tax rate.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee tax breakdown";
    const labels = ["Municipal income tax after credits", "National income tax", "Funeral fee", "Basic allowance", "Earned-income tax credit"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Income tax per month";
    resultLabels[2].textContent = "Separate employee social contributions";
    document.querySelector(".model-link").textContent = "Sweden has no separate employee payroll social contribution in this estimate: the 7% public pension fee is fully offset by an equal tax reduction in ordinary cases. The 32.38% municipal tax is the national average; your municipality and church membership can change the final result.";
    calculateSweden();
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
  } else if (countryInput.value === "MX") {
    countryStatus.innerHTML = "<strong>Mexico model available</strong><span>2026 monthly ISR withholding and estimated employee IMSS; standard integrated salary factor.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["ISR income tax after employment subsidy", "IMSS employee contributions", "Employment subsidy (if eligible)", "Integrated salary base for IMSS", "Employer-only contributions (excluded)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "ISR income tax per month";
    resultLabels[2].textContent = "Employee IMSS per month";
    document.querySelector(".model-link").textContent = "Mexico 2026 estimate uses the monthly SAT ISR withholding tariff and the 2026 employment subsidy. IMSS assumes first-year integrated salary (15-day year-end bonus, 12 vacation days and 25% vacation premium), 2026 UMA and 25-UMA contribution cap. Employer-only IMSS and INFONAVIT contributions, state payroll tax, other benefits and personal circumstances are excluded.";
    calculateMexico();
  } else if (countryInput.value === "CA") {
    countryStatus.innerHTML = "<strong>Canada model available</strong><span>2026 Ontario resident employee estimate; single filer, standard basic personal credits.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Federal + Ontario income tax", "Canada Pension Plan (CPP / CPP2)", "Employment Insurance (EI)", "Ontario Health Premium", "Other province tax rules (not applicable)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Federal + Ontario income tax per month";
    resultLabels[2].textContent = "CPP + EI per month";
    document.querySelector(".model-link").textContent = "Canada 2026 estimate assumes Ontario residence, single employee, basic personal credits and employment income only. CPP/CPP2 and EI are capped at their 2026 annual limits. Other provinces and Quebec have different tax and payroll rules.";
    calculateCanada();
  } else if (countryInput.value === "US") {
    countryStatus.innerHTML = "<strong>United States model available</strong><span>2026 federal estimate for a single filer; state and local income taxes are not included.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Federal income tax", "Social Security tax", "Medicare tax (including Additional Medicare)", "Federal standard deduction", "State and local income taxes (excluded)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Federal income tax per month";
    resultLabels[2].textContent = "Employee FICA per month";
    document.querySelector(".model-link").textContent = "US 2026 federal estimate assumes a single filer eligible for the $16,100 standard deduction. Includes Social Security at 6.2% up to $184,500, Medicare at 1.45%, and Additional Medicare at 0.9% above $200,000. State/local income tax, credits, health insurance and retirement plan deductions are excluded.";
    calculateUnitedStates();
  } else if (countryInput.value === "IN") {
    countryStatus.innerHTML = "<strong>India model available</strong><span>Tax Year 2026–27, resident salaried individual, default new tax regime, ₹75,000 standard deduction.</span>";
    document.querySelector(".breakdown h3").textContent = "Annualised monthly deduction breakdown";
    const labels = ["Income tax after Section 87A rebate", "Health and Education Cess", "Standard deduction", "Section 87A rebate / marginal relief", "Surcharge (where applicable)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Income tax + cess per month";
    resultLabels[2].textContent = "Employee social contributions";
    document.querySelector(".model-link").textContent = "India Tax Year 2026–27. Uses the default new tax regime, ₹75,000 salary standard deduction, Section 87A rebate and marginal relief, surcharge where applicable and 4% Health and Education Cess. Employee provident fund, state professional tax, allowances, deductions and other income are excluded.";
    calculateIndia();
  } else if (countryInput.value === "AU") {
    countryStatus.innerHTML = "<strong>Australia model available</strong><span>2026/27 resident employee estimate, single taxpayer, full tax-free threshold, no Medicare levy surcharge.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["Resident income tax", "Medicare levy", "Tax-free threshold", "Medicare levy low-income reduction", "Superannuation (employer-paid, excluded)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "Income tax per month";
    resultLabels[2].textContent = "Medicare levy per month";
    document.querySelector(".model-link").textContent = "Australia financial year 1 July 2026 to 30 June 2027. Assumes an Australian tax resident with the full $18,200 tax-free threshold. Includes the 2% Medicare levy with the single low-income phase-in. Medicare levy surcharge, deductions, offsets and employer superannuation are excluded.";
    calculateAustralia();
  } else if (countryInput.value === "NZ") {
    countryStatus.innerHTML = "<strong>New Zealand model available</strong><span>2026/27 PAYE estimate for a resident employee with one main job, no student loan, KiwiSaver or personal tax credits.</span>";
    document.querySelector(".breakdown h3").textContent = "Monthly employee deduction breakdown";
    const labels = ["PAYE income tax", "ACC earners’ levy", "Annual income tax calculation", "ACC maximum liable earnings", "Student loan and KiwiSaver (excluded)"];
    breakdownRows.forEach((row, i) => { row.querySelector("span").textContent = labels[i]; row.hidden = false; });
    resultLabels[1].textContent = "PAYE income tax per month";
    resultLabels[2].textContent = "ACC levy per month";
    document.querySelector(".model-link").textContent = "New Zealand tax year 1 April 2026 to 31 March 2027. PAYE income tax uses the current progressive individual rates; the ACC earners’ levy is 1.75% on liable earnings up to NZ$156,641. Independent Earner Tax Credit, student loan, KiwiSaver and other personal adjustments are excluded.";
    calculateNewZealand();
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
  else if (countryInput.value === "SE") calculateSweden();
  else if (countryInput.value === "CH") calculateSwitzerland();
  else if (countryInput.value === "AR") calculateArgentina();
  else if (countryInput.value === "NZ") calculateNewZealand();
  else if (countryInput.value === "AU") calculateAustralia();
  else if (countryInput.value === "IN") calculateIndia();
  else if (countryInput.value === "US") calculateUnitedStates();
  else if (countryInput.value === "CA") calculateCanada();
  else if (countryInput.value === "MX") calculateMexico();
  else if (countryInput.value === "CL") calculateChile();
  else if (countryInput.value === "PE") calculatePeru();
  else if (countryInput.value === "EC") calculateEcuador();
  else if (countryInput.value === "CO") calculateColombia();
  else if (countryInput.value === "KR") calculateSouthKorea();
  else if (countryInput.value === "UY") calculateUruguay();
  else if (countryInput.value === "JP") calculateJapan();
  else if (countryInput.value === "CN") calculateChina();
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

function calculateChina() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 1000000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  // Shanghai 2026/27 social-insurance base: CNY 7,546–37,731 (July 2026 to June 2027).
  const contributionBase=Math.min(Math.max(grossMonthly,7546),37731);
  const pension=contributionBase*0.08;
  const medical=contributionBase*0.02+3;
  const unemployment=contributionBase*0.005;
  const housingFund=contributionBase*0.07;
  const annualGross=grossMonthly*12;
  const annualSpecialDeductions=(pension+medical+unemployment+housingFund)*12;
  const taxable=Math.max(0,annualGross-60000-annualSpecialDeductions);
  const bands=[
    {limit:36000,rate:0.03,quick:0},{limit:144000,rate:0.10,quick:2520},
    {limit:300000,rate:0.20,quick:16920},{limit:420000,rate:0.25,quick:31920},
    {limit:660000,rate:0.30,quick:52920},{limit:960000,rate:0.35,quick:85920},
    {limit:Infinity,rate:0.45,quick:181920}
  ];
  let annualTax=0;
  for(const band of bands){if(taxable<=band.limit){annualTax=Math.max(0,taxable*band.rate-band.quick);break;}}
  const monthlyTax=annualTax/12;
  const monthlySocial=pension+medical+unemployment+housingFund;
  const netMonthly=grossMonthly-monthlySocial-monthlyTax;
  outputs.net.textContent=formatCurrency(netMonthly,"CNY");
  outputs.tax.textContent=formatCurrency(monthlyTax,"CNY");
  outputs.social.textContent=formatCurrency(monthlySocial,"CNY");
  outputs.pension.textContent=formatCurrency(pension,"CNY");
  outputs.unemployment.textContent=formatCurrency(unemployment,"CNY");
  outputs.health.textContent=formatCurrency(medical,"CNY");
  outputs.care.textContent=formatCurrency(housingFund,"CNY");
  outputs.church.textContent="Shanghai, 7% housing fund";
}

function calculateJapan() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 1000000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const annualGross=grossMonthly*12;
  let employmentIncome;
  if(annualGross<=740999) employmentIncome=0;
  else if(annualGross<=2190999) employmentIncome=annualGross-740000;
  else if(annualGross<=2192999) employmentIncome=1451000;
  else if(annualGross<=2195999) employmentIncome=1453000;
  else if(annualGross<=2199999) employmentIncome=1456000;
  else if(annualGross<=3599999){const b=Math.floor(annualGross/4/1000)*1000;employmentIncome=b*2.8-80000;}
  else if(annualGross<=6599999){const b=Math.floor(annualGross/4/1000)*1000;employmentIncome=b*3.2-440000;}
  else if(annualGross<=8499999) employmentIncome=annualGross*0.9-1100000;
  else employmentIncome=annualGross-1950000;
  const pension=Math.min(grossMonthly,650000)*0.0915;
  const health=Math.min(grossMonthly,1390000)*0.04925;
  const childSupport=Math.min(grossMonthly,1390000)*0.00115;
  const employmentInsurance=grossMonthly*0.005;
  const monthlySocial=pension+health+childSupport+employmentInsurance;
  const annualSocial=monthlySocial*12;
  let basicDeduction=620000;
  if(employmentIncome<=4890000)basicDeduction=1040000;
  else if(employmentIncome<=6550000)basicDeduction=670000;
  else if(employmentIncome<=23500000)basicDeduction=620000;
  else if(employmentIncome<=24000000)basicDeduction=480000;
  else if(employmentIncome<=24500000)basicDeduction=320000;
  else if(employmentIncome<=25000000)basicDeduction=160000;
  else basicDeduction=0;
  const taxableNational=Math.max(0,employmentIncome-annualSocial-basicDeduction);
  const bands=[
    {limit:1950000,base:0,rate:0.05},{limit:3300000,base:97500,rate:0.10},
    {limit:6950000,base:427500,rate:0.20},{limit:9000000,base:636000,rate:0.23},
    {limit:18000000,base:1536000,rate:0.33},{limit:40000000,base:2796000,rate:0.40},
    {limit:Infinity,base:4796000,rate:0.45}
  ];
  let nationalTax=0,previous=0;
  for(const band of bands){if(taxableNational<=band.limit){nationalTax=band.base+Math.max(0,taxableNational-previous)*band.rate;break;}previous=band.limit;}
  nationalTax*=1.021; // 2.1% reconstruction special income tax
  const taxableLocal=Math.max(0,employmentIncome-annualSocial-430000);
  const localTax=taxableLocal*0.10;
  const monthlyTax=(nationalTax+localTax)/12;
  const netMonthly=grossMonthly-monthlySocial-monthlyTax;
  outputs.net.textContent=formatCurrency(netMonthly,"JPY");
  outputs.tax.textContent=formatCurrency(monthlyTax,"JPY");
  outputs.social.textContent=formatCurrency(monthlySocial,"JPY");
  outputs.pension.textContent=formatCurrency(pension,"JPY");
  outputs.unemployment.textContent=formatCurrency(employmentInsurance,"JPY");
  outputs.health.textContent=formatCurrency(health+childSupport,"JPY");
  outputs.care.textContent=formatCurrency(annualSocial/12,"JPY");
  outputs.church.textContent="Tokyo, under age 40";
}

function calculateUruguay() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 100000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const bpc=6864;
  const annualGross=grossMonthly*13; // 12 salaries plus statutory aguinaldo
  const pensionMonthly=Math.min(grossMonthly,288826)*0.15;
  const healthRate=grossMonthly<=2.5*bpc?0.03:0.045; // single employee, no dependants
  const healthMonthly=grossMonthly*healthRate;
  const frlMonthly=grossMonthly*0.001;
  const annualSocial=(pensionMonthly+healthMonthly+frlMonthly)*13;
  const bands=[
    {limit:84,rate:0},{limit:120,rate:0.10},{limit:180,rate:0.15},
    {limit:360,rate:0.24},{limit:600,rate:0.25},{limit:900,rate:0.27},
    {limit:1380,rate:0.31},{limit:Infinity,rate:0.36}
  ];
  let previous=0,annualTax=0;
  for(const band of bands){annualTax+=Math.max(0,Math.min(annualGross/bpc,band.limit)-previous)*band.rate*bpc;previous=band.limit;if(annualGross/bpc<=band.limit)break;}
  const deductionCredit=annualSocial*(annualGross<=180*bpc?0.14:0.08);
  annualTax=Math.max(0,annualTax-deductionCredit);
  const monthlyTax=annualTax/12;
  const monthlySocial=pensionMonthly+healthMonthly+frlMonthly;
  const netMonthly=grossMonthly-monthlySocial-monthlyTax;
  outputs.net.textContent=formatCurrency(netMonthly,"UYU");
  outputs.tax.textContent=formatCurrency(monthlyTax,"UYU");
  outputs.social.textContent=formatCurrency(monthlySocial,"UYU");
  outputs.pension.textContent=formatCurrency(pensionMonthly,"UYU");
  outputs.unemployment.textContent=formatCurrency(frlMonthly,"UYU");
  outputs.health.textContent=formatCurrency(healthMonthly,"UYU");
  outputs.care.textContent="13 salaries annualised";
  outputs.church.textContent="FONASA: single, no dependants";
}

function calculateSouthKorea() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 1000000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const annualGross=grossMonthly*12;
  const pensionBase=Math.min(grossMonthly,6590000);
  const pension=pensionBase*0.0475;
  const health=grossMonthly*0.03595;
  const longTermCare=grossMonthly*0.004724;
  const employment=grossMonthly*0.009;
  let earnedDeduction=0;
  if(annualGross<=5000000) earnedDeduction=annualGross*0.70;
  else if(annualGross<=15000000) earnedDeduction=3500000+(annualGross-5000000)*0.40;
  else if(annualGross<=45000000) earnedDeduction=7500000+(annualGross-15000000)*0.15;
  else if(annualGross<=100000000) earnedDeduction=12000000+(annualGross-45000000)*0.05;
  else earnedDeduction=14750000+(annualGross-100000000)*0.02;
  earnedDeduction=Math.min(earnedDeduction,20000000,annualGross);
  const taxable=Math.max(0,annualGross-earnedDeduction-1500000-pension*12);
  const bands=[
    {limit:14000000,base:0,rate:0.06},{limit:50000000,base:840000,rate:0.15},
    {limit:88000000,base:6240000,rate:0.24},{limit:150000000,base:15360000,rate:0.35},
    {limit:300000000,base:37060000,rate:0.38},{limit:500000000,base:94060000,rate:0.40},
    {limit:1000000000,base:174060000,rate:0.42},{limit:Infinity,base:384060000,rate:0.45}
  ];
  let annualIncomeTax=0,previous=0;
  for(const band of bands){if(taxable<=band.limit){annualIncomeTax=band.base+Math.max(0,taxable-previous)*band.rate;break;}previous=band.limit;}
  const localTax=annualIncomeTax*0.10;
  const monthlyTax=(annualIncomeTax+localTax)/12;
  const monthlySocial=pension+health+longTermCare+employment;
  const netMonthly=grossMonthly-monthlySocial-monthlyTax;
  outputs.net.textContent=formatCurrency(netMonthly,"KRW");
  outputs.tax.textContent=formatCurrency(monthlyTax,"KRW");
  outputs.social.textContent=formatCurrency(monthlySocial,"KRW");
  outputs.pension.textContent=formatCurrency(pension,"KRW");
  outputs.unemployment.textContent=formatCurrency(employment,"KRW");
  outputs.health.textContent=formatCurrency(health+longTermCare,"KRW");
  outputs.care.textContent=formatCurrency(earnedDeduction/12,"KRW");
  outputs.church.textContent="Basic personal deduction included";
}

function calculateColombia() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 1000000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const uvt=52374, smlmv=1750905;
  const annualGross=grossMonthly*12;
  const employeeBase=grossMonthly;
  const health=employeeBase*0.04;
  const pension=employeeBase*0.04;
  let solidarityRate=0;
  const multiples=employeeBase/smlmv;
  if(multiples>4) solidarityRate=multiples<16?0.01:multiples<17?0.012:multiples<18?0.014:multiples<19?0.016:multiples<20?0.018:0.02;
  const solidarity=employeeBase*solidarityRate;
  const annualSocial=(health+pension+solidarity)*12;
  const netEmployment=Math.max(0,annualGross-annualSocial);
  const exemptLabor=Math.min(netEmployment*0.25,790*uvt);
  const taxable=Math.max(0,netEmployment-exemptLabor);
  const uvti=taxable/uvt;
  const bands=[
    {limit:1090,base:0,rate:0},{limit:1700,base:0,rate:0.19},
    {limit:4100,base:115.9,rate:0.28},{limit:8670,base:787.9,rate:0.33},
    {limit:18970,base:2296,rate:0.35},{limit:31000,base:5901,rate:0.37},
    {limit:Infinity,base:10352.1,rate:0.39}
  ];
  let annualTax=0, previous=0;
  for(const band of bands){if(uvti<=band.limit){annualTax=(band.base+Math.max(0,uvti-previous)*band.rate)*uvt;break;}previous=band.limit;}
  const monthlyTax=annualTax/12;
  const monthlySocial=health+pension+solidarity;
  const netMonthly=grossMonthly-monthlySocial-monthlyTax;
  outputs.net.textContent=formatCurrency(netMonthly,"COP");
  outputs.tax.textContent=formatCurrency(monthlyTax,"COP");
  outputs.social.textContent=formatCurrency(monthlySocial,"COP");
  outputs.pension.textContent=formatCurrency(pension,"COP");
  outputs.unemployment.textContent=formatCurrency(health,"COP");
  outputs.health.textContent=formatCurrency(solidarity,"COP");
  outputs.care.textContent=formatCurrency(exemptLabor/12,"COP");
  outputs.church.textContent="12 salaries annualised";
}

function calculateEcuador() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const monthlyIESS = grossMonthly * 0.0945;
  const annualTaxable = Math.max(0,(grossMonthly-monthlyIESS)*12);
  const bands = [
    {limit:12208,base:0,rate:0},{limit:15549,base:0,rate:0.05},
    {limit:20188,base:167,rate:0.10},{limit:26700,base:631,rate:0.12},
    {limit:35136,base:1412,rate:0.15},{limit:46575,base:2678,rate:0.20},
    {limit:62005,base:4965,rate:0.25},{limit:82679,base:8823,rate:0.30},
    {limit:109956,base:15025,rate:0.35},{limit:Infinity,base:24572,rate:0.37}
  ];
  let annualTax=0, previous=0;
  for(const band of bands){if(annualTaxable<=band.limit){annualTax=band.base+Math.max(0,annualTaxable-previous)*band.rate;break;}previous=band.limit;}
  const monthlyTax=annualTax/12;
  const netMonthly=grossMonthly-monthlyIESS-monthlyTax;
  outputs.net.textContent=formatCurrency(netMonthly,"USD");
  outputs.tax.textContent=formatCurrency(monthlyTax,"USD");
  outputs.social.textContent=formatCurrency(monthlyIESS,"USD");
  outputs.pension.textContent=formatCurrency(monthlyIESS,"USD");
  outputs.unemployment.textContent=formatCurrency(annualTax/12,"USD");
  outputs.health.textContent=formatCurrency(annualTaxable/12,"USD");
  outputs.care.textContent="Personal-expense deduction excluded";
  outputs.church.textContent="Employer IESS share excluded";
}

function calculatePeru() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const uit = 5500;
  // Standard private-sector employee: 12 salaries plus two statutory gratificaciones per year.
  const annualGross = grossMonthly * 14;
  const taxableIncome = Math.max(0, annualGross - 7 * uit);
  const brackets = [{limit:5*uit,rate:0.08},{limit:20*uit,rate:0.14},{limit:35*uit,rate:0.17},{limit:45*uit,rate:0.20},{limit:Infinity,rate:0.30}];
  let previous=0, annualTax=0;
  for(const bracket of brackets){annualTax+=Math.max(0,Math.min(taxableIncome,bracket.limit)-previous)*bracket.rate;previous=bracket.limit;if(taxableIncome<=bracket.limit)break;}
  const monthlyTax=annualTax/12;
  // Default public pension system (ONP): 13% of the ordinary monthly remuneration.
  const onp=grossMonthly*0.13;
  const netMonthly=grossMonthly-monthlyTax-onp;
  outputs.net.textContent=formatCurrency(netMonthly,"PEN");
  outputs.tax.textContent=formatCurrency(monthlyTax,"PEN");
  outputs.social.textContent=formatCurrency(onp,"PEN");
  outputs.pension.textContent=formatCurrency(onp,"PEN");
  outputs.unemployment.textContent=formatCurrency(annualTax/12,"PEN");
  outputs.health.textContent=formatCurrency(7*uit/12,"PEN");
  outputs.care.textContent="14 salaries annualised";
  outputs.church.textContent="EsSalud employer-paid";
}

function calculateChile() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 1000000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  // November 2026: UF CLP 41,371.05; pension/health cap 90 UF; unemployment cap 135.2 UF.
  const uf = 41371.05;
  const pensionHealthCap = 90 * uf;
  const unemploymentCap = 135.2 * uf;
  const pensionBase = Math.min(grossMonthly, pensionHealthCap);
  const unemploymentBase = Math.min(grossMonthly, unemploymentCap);
  // AFP Uno lowest published employee commission: 0.46%, plus mandatory 10% pension contribution.
  const pension = pensionBase * 0.1046;
  const health = pensionBase * 0.07;
  const unemployment = unemploymentBase * 0.006; // employee share for an indefinite-term contract
  const taxableIncome = Math.max(0, grossMonthly - pension - health - unemployment);
  const utm = 72440;
  const bands = [
    {limit:13.5,rate:0,rebate:0},{limit:30,rate:0.04,rebate:0.54},
    {limit:50,rate:0.08,rebate:1.74},{limit:70,rate:0.135,rebate:4.49},
    {limit:90,rate:0.23,rebate:11.14},{limit:120,rate:0.304,rebate:17.80},
    {limit:310,rate:0.35,rebate:23.32},{limit:Infinity,rate:0.40,rebate:38.82}
  ];
  const utmIncome = taxableIncome / utm;
  let incomeTax = 0;
  for (const band of bands) { if (utmIncome <= band.limit) { incomeTax = Math.max(0, taxableIncome * band.rate - band.rebate * utm); break; } }
  const social = pension + health + unemployment;
  const netMonthly = grossMonthly - social - incomeTax;
  outputs.net.textContent = formatCurrency(netMonthly, "CLP");
  outputs.tax.textContent = formatCurrency(incomeTax, "CLP");
  outputs.social.textContent = formatCurrency(social, "CLP");
  outputs.pension.textContent = formatCurrency(pension, "CLP");
  outputs.unemployment.textContent = formatCurrency(unemployment, "CLP");
  outputs.health.textContent = formatCurrency(health, "CLP");
  outputs.care.textContent = formatCurrency(taxableIncome, "CLP");
  outputs.church.textContent = "AFP Uno assumption";
}

function calculateMexico() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const monthlyBands = [
    {limit:844.59,fixed:0,rate:0.0192},{limit:7168.51,fixed:16.22,rate:0.0640},
    {limit:12598.02,fixed:420.95,rate:0.1088},{limit:14644.64,fixed:1011.68,rate:0.16},
    {limit:17533.64,fixed:1339.14,rate:0.1792},{limit:35362.83,fixed:1856.84,rate:0.2136},
    {limit:55736.68,fixed:5665.16,rate:0.2352},{limit:106410.50,fixed:10457.09,rate:0.30},
    {limit:141880.66,fixed:25659.23,rate:0.32},{limit:425641.99,fixed:37009.69,rate:0.34},
    {limit:Infinity,fixed:133488.54,rate:0.35}
  ];
  const lower=[0.01,844.60,7168.52,12598.03,14644.65,17533.65,35362.84,55736.69,106410.51,141880.67,425642.00];
  let isr=0;
  for(let i=0;i<monthlyBands.length;i++){
    if(grossMonthly<=monthlyBands[i].limit){isr=monthlyBands[i].fixed+Math.max(0,grossMonthly-lower[i])*monthlyBands[i].rate;break;}
  }
  const employmentSubsidy = grossMonthly <= 11492.66 ? 535.65 : 0;
  isr=Math.max(0,isr-employmentSubsidy);
  const integratedFactor=(365+15+12*0.25)/365;
  const dailyIntegrated=Math.min((grossMonthly/30)*integratedFactor,117.31*25);
  const excessDaily=Math.max(0,dailyIntegrated-3*117.31);
  const imss=(dailyIntegrated*0.02375+excessDaily*0.004)*30.4;
  const netMonthly=grossMonthly-isr-imss;
  outputs.net.textContent=formatCurrency(netMonthly,"MXN");
  outputs.tax.textContent=formatCurrency(isr,"MXN");
  outputs.social.textContent=formatCurrency(imss,"MXN");
  outputs.pension.textContent=formatCurrency(imss,"MXN");
  outputs.unemployment.textContent=formatCurrency(employmentSubsidy,"MXN");
  outputs.health.textContent=formatCurrency(dailyIntegrated*30.4,"MXN");
  outputs.care.textContent=formatCurrency(117.31*25*30.4,"MXN");
  outputs.church.textContent="Employer costs excluded";
}

function calculateCanada() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const gross = grossMonthly * 12;
  const cppBaseEarnings = Math.max(0, Math.min(gross, 74600) - 3500);
  const cppBase = cppBaseEarnings * 0.0495;
  const cppFirstAdditional = cppBaseEarnings * 0.01;
  const cppSecondAdditional = Math.max(0, Math.min(gross, 85000) - 74600) * 0.04;
  const cpp = cppBase + cppFirstAdditional + cppSecondAdditional;
  const ei = Math.min(gross, 68900) * 0.0163;
  const taxable = Math.max(0, gross - cppFirstAdditional - cppSecondAdditional);
  const federalBands = [{limit:58523,rate:0.14},{limit:117045,rate:0.205},{limit:181440,rate:0.26},{limit:258482,rate:0.29},{limit:Infinity,rate:0.33}];
  const ontarioBands = [{limit:53891,rate:0.0505},{limit:107785,rate:0.0915},{limit:150000,rate:0.1116},{limit:220000,rate:0.1216},{limit:Infinity,rate:0.1316}];
  const progressive = (income,bands) => { let prev=0,total=0; for(const band of bands){total+=Math.max(0,Math.min(income,band.limit)-prev)*band.rate;prev=band.limit;if(income<=band.limit)break;} return total; };
  const federalBPA = taxable <= 181440 ? 16452 : taxable >= 258482 ? 14829 : 16452 - (16452-14829)*(taxable-181440)/(258482-181440);
  const federalTax = Math.max(0,progressive(taxable,federalBands)-federalBPA*0.14-Math.min(gross,1501)*0.14-cppBase*0.14-ei*0.14);
  const ontarioBasicTax = progressive(taxable,ontarioBands);
  let ontarioTax = Math.max(0,ontarioBasicTax-12989*0.0505);
  const ontarioSurtax = Math.max(0,ontarioTax-5818)*0.20 + Math.max(0,ontarioTax-7446)*0.36;
  ontarioTax += ontarioSurtax;
  const reduction = ontarioTax < 600 ? Math.min(ontarioTax,Math.max(0,600-ontarioTax)) : 0;
  ontarioTax = Math.max(0,ontarioTax-reduction);
  let healthPremium = 0;
  if(taxable>20000) healthPremium=Math.min(300,(taxable-20000)*0.06);
  if(taxable>36000) healthPremium=Math.max(healthPremium,Math.min(450,300+(taxable-36000)*0.06));
  if(taxable>48000) healthPremium=Math.max(healthPremium,Math.min(600,450+(taxable-48000)*0.25));
  if(taxable>72000) healthPremium=Math.max(healthPremium,Math.min(750,600+(taxable-72000)*0.25));
  if(taxable>200000) healthPremium=Math.max(healthPremium,Math.min(900,750+(taxable-200000)*0.25));
  const annualTax = federalTax + ontarioTax + healthPremium;
  const monthlyTax=annualTax/12, monthlyCPP=cpp/12, monthlyEI=ei/12;
  const netMonthly=grossMonthly-monthlyTax-monthlyCPP-monthlyEI;
  outputs.net.textContent=formatCurrency(netMonthly,"CAD");
  outputs.tax.textContent=formatCurrency(monthlyTax,"CAD");
  outputs.social.textContent=formatCurrency(monthlyCPP+monthlyEI,"CAD");
  outputs.pension.textContent=formatCurrency(monthlyCPP,"CAD");
  outputs.unemployment.textContent=formatCurrency(monthlyEI,"CAD");
  outputs.health.textContent=formatCurrency(healthPremium/12,"CAD");
  outputs.care.textContent=formatCurrency(ontarioSurtax/12,"CAD");
  outputs.church.textContent="Ontario estimate";
}

function calculateUnitedStates() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const annualGross = grossMonthly * 12;
  const standardDeduction = Math.min(annualGross, 16100);
  const taxableIncome = Math.max(0, annualGross - standardDeduction);
  const brackets = [
    {limit:12400,rate:0.10},{limit:50400,rate:0.12},{limit:105700,rate:0.22},
    {limit:201775,rate:0.24},{limit:256225,rate:0.32},{limit:640600,rate:0.35},{limit:Infinity,rate:0.37}
  ];
  let previous = 0, annualFederalTax = 0;
  for (const bracket of brackets) { annualFederalTax += Math.max(0, Math.min(taxableIncome, bracket.limit) - previous) * bracket.rate; previous = bracket.limit; if (taxableIncome <= bracket.limit) break; }
  const socialSecurity = Math.min(annualGross, 184500) * 0.062;
  const medicare = annualGross * 0.0145;
  const additionalMedicare = Math.max(0, annualGross - 200000) * 0.009;
  const annualFICA = socialSecurity + medicare + additionalMedicare;
  const monthlyTax = annualFederalTax / 12;
  const monthlyFICA = annualFICA / 12;
  const netMonthly = grossMonthly - monthlyTax - monthlyFICA;
  outputs.net.textContent = formatCurrency(netMonthly, "USD");
  outputs.tax.textContent = formatCurrency(monthlyTax, "USD");
  outputs.social.textContent = formatCurrency(monthlyFICA, "USD");
  outputs.pension.textContent = formatCurrency(socialSecurity / 12, "USD");
  outputs.unemployment.textContent = formatCurrency(medicare / 12, "USD");
  outputs.health.textContent = formatCurrency(additionalMedicare / 12, "USD");
  outputs.care.textContent = formatCurrency(standardDeduction / 12, "USD");
  outputs.church.textContent = "State tax excluded";
}

function calculateIndia() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const annualGross = grossMonthly * 12;
  const standardDeduction = Math.min(annualGross, 75000);
  const taxableIncome = Math.max(0, annualGross - standardDeduction);
  const slabs = [{limit:400000,rate:0},{limit:800000,rate:0.05},{limit:1200000,rate:0.10},{limit:1600000,rate:0.15},{limit:2000000,rate:0.20},{limit:2400000,rate:0.25},{limit:Infinity,rate:0.30}];
  let previous = 0, taxBeforeRebate = 0;
  for (const slab of slabs) { taxBeforeRebate += Math.max(0, Math.min(taxableIncome, slab.limit) - previous) * slab.rate; previous = slab.limit; if (taxableIncome <= slab.limit) break; }
  let rebate = 0;
  if (taxableIncome <= 1200000) rebate = Math.min(taxBeforeRebate, 60000);
  else rebate = Math.min(60000, Math.max(0, taxBeforeRebate - (taxableIncome - 1200000)));
  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);
  let surchargeRate = taxableIncome > 20000000 ? 0.25 : taxableIncome > 10000000 ? 0.15 : taxableIncome > 5000000 ? 0.10 : 0;
  let surcharge = taxAfterRebate * surchargeRate;
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
    const cap = Math.max(0, slabsTax(5000000) + (taxableIncome - 5000000) - taxAfterRebate);
    surcharge = Math.min(surcharge, cap);
  } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
    const cap = Math.max(0, slabsTax(10000000) * 1.10 + (taxableIncome - 10000000) - taxAfterRebate);
    surcharge = Math.min(surcharge, cap);
  } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
    const cap = Math.max(0, slabsTax(20000000) * 1.15 + (taxableIncome - 20000000) - taxAfterRebate);
    surcharge = Math.min(surcharge, cap);
  }
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const annualTotalTax = taxAfterRebate + surcharge + cess;
  const monthlyTax = annualTotalTax / 12;
  const monthlySurcharge = surcharge / 12;
  const monthlyRebate = rebate / 12;
  const netMonthly = grossMonthly - monthlyTax;
  outputs.net.textContent = formatCurrency(netMonthly, "INR");
  outputs.tax.textContent = formatCurrency(monthlyTax, "INR");
  outputs.social.textContent = "Excluded";
  outputs.pension.textContent = formatCurrency(standardDeduction / 12, "INR");
  outputs.unemployment.textContent = formatCurrency(monthlyRebate, "INR");
  outputs.health.textContent = formatCurrency(cess / 12, "INR");
  outputs.care.textContent = formatCurrency(monthlySurcharge, "INR");
  outputs.church.textContent = "Excluded";

  function slabsTax(income) {
    let prev = 0, total = 0;
    for (const slab of slabs) { total += Math.max(0, Math.min(income, slab.limit) - prev) * slab.rate; prev = slab.limit; if (income <= slab.limit) break; }
    return total;
  }
}

function calculateAustralia() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const annualGross = grossMonthly * 12;
  const annualIncomeTax =
    Math.max(0, Math.min(annualGross, 45000) - 18200) * 0.15 +
    Math.max(0, Math.min(annualGross, 135000) - 45000) * 0.30 +
    Math.max(0, Math.min(annualGross, 190000) - 135000) * 0.37 +
    Math.max(0, annualGross - 190000) * 0.45;
  let annualMedicare = 0;
  if (annualGross >= 35013) annualMedicare = annualGross * 0.02;
  else if (annualGross > 28011) annualMedicare = (annualGross - 28011) * 0.10;
  const monthlyTax = annualIncomeTax / 12;
  const monthlyMedicare = annualMedicare / 12;
  const netMonthly = grossMonthly - monthlyTax - monthlyMedicare;
  outputs.net.textContent = formatCurrency(netMonthly, "AUD");
  outputs.tax.textContent = formatCurrency(monthlyTax, "AUD");
  outputs.social.textContent = formatCurrency(monthlyMedicare, "AUD");
  outputs.pension.textContent = formatCurrency(annualIncomeTax / 12, "AUD");
  outputs.unemployment.textContent = formatCurrency(monthlyMedicare, "AUD");
  outputs.health.textContent = formatCurrency(18200 / 12, "AUD");
  outputs.care.textContent = formatCurrency(28011 / 12, "AUD");
  outputs.church.textContent = "Employer-paid";
}

function calculateNewZealand() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }
  const annualGross = grossMonthly * 12;
  const brackets = [{limit:15600,rate:0.105},{limit:53500,rate:0.175},{limit:78100,rate:0.30},{limit:180000,rate:0.33},{limit:Infinity,rate:0.39}];
  let previous = 0, annualTax = 0;
  for (const bracket of brackets) { annualTax += Math.max(0, Math.min(annualGross, bracket.limit) - previous) * bracket.rate; previous = bracket.limit; if (annualGross <= bracket.limit) break; }
  const accLevy = Math.min(annualGross, 156641) * 0.0175;
  const monthlyTax = annualTax / 12, monthlyACC = accLevy / 12;
  const netMonthly = grossMonthly - monthlyTax - monthlyACC;
  outputs.net.textContent = formatCurrency(netMonthly, "NZD");
  outputs.tax.textContent = formatCurrency(monthlyTax, "NZD");
  outputs.social.textContent = formatCurrency(monthlyACC, "NZD");
  outputs.pension.textContent = formatCurrency(monthlyTax, "NZD");
  outputs.unemployment.textContent = formatCurrency(monthlyACC, "NZD");
  outputs.health.textContent = formatCurrency(annualGross / 12, "NZD");
  outputs.care.textContent = formatCurrency(156641 / 12, "NZD");
  outputs.church.textContent = "Excluded";
}

function calculateArgentina() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  const monthlySocialBase = grossMonthly === 0 ? 0 : Math.min(Math.max(grossMonthly, 149592.45), 4861685.38);
  const monthlySocial = monthlySocialBase * 0.17;
  const annualSocial = monthlySocial * 12;
  const basicDeduction = 5151802.50;
  const employeeSpecialDeduction = 24728652.02;
  const taxableIncome = Math.max(0, annualGross - annualSocial - basicDeduction - employeeSpecialDeduction);

  const taxBrackets = [
    { limit: 2336953.69, rate: 0.05 }, { limit: 4673907.36, rate: 0.09 },
    { limit: 7010861.05, rate: 0.12 }, { limit: 10516291.59, rate: 0.15 },
    { limit: 21032583.18, rate: 0.19 }, { limit: 31548874.77, rate: 0.23 },
    { limit: 47323312.16, rate: 0.27 }, { limit: 70984968.25, rate: 0.31 },
    { limit: Infinity, rate: 0.35 }
  ];
  let annualTax = 0, previous = 0;
  for (const bracket of taxBrackets) {
    annualTax += Math.max(0, Math.min(taxableIncome, bracket.limit) - previous) * bracket.rate;
    previous = bracket.limit;
    if (taxableIncome <= bracket.limit) break;
  }
  const monthlyTax = annualTax / 12;
  const netMonthly = grossMonthly - monthlySocial - monthlyTax;
  outputs.net.textContent = formatCurrency(netMonthly, "ARS");
  outputs.tax.textContent = formatCurrency(monthlyTax, "ARS");
  outputs.social.textContent = formatCurrency(monthlySocial, "ARS");
  outputs.pension.textContent = formatCurrency(monthlySocial, "ARS");
  outputs.unemployment.textContent = formatCurrency(basicDeduction / 12, "ARS");
  outputs.health.textContent = formatCurrency(employeeSpecialDeduction / 12, "ARS");
  outputs.care.textContent = formatCurrency(taxableIncome / 12, "ARS");
  outputs.church.textContent = "SAC excluded";
}

function calculateSwitzerland() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  const ahvIvEo = annualGross * 0.053;
  const alv = Math.min(annualGross, 148200) * 0.011;
  const accidentInsurance = Math.min(annualGross, 148200) * 0.01;
  const coordinatedSalary = Math.min(Math.max(0, annualGross - 26460), 90720 - 26460);
  const pensionFund = coordinatedSalary * 0.065;
  const annualSocial = ahvIvEo + alv + accidentInsurance + pensionFund;

  const federalWorkExpenses = Math.min(4000, Math.max(2000, Math.max(0, annualGross - ahvIvEo - alv - pensionFund) * 0.03));
  const cantonalWorkExpenses = Math.min(12400, Math.max(6600, annualGross * 0.10));
  const federalTaxableIncome = Math.max(0, annualGross - annualSocial - federalWorkExpenses - 1800);
  const cantonalTaxableIncome = Math.max(0, annualGross - annualSocial - cantonalWorkExpenses - 2900);

  const federalBrackets = [
    { limit: 15200, rate: 0 }, { limit: 33200, rate: 0.0077 },
    { limit: 43500, rate: 0.0088 }, { limit: 58000, rate: 0.0264 },
    { limit: 76200, rate: 0.0297 }, { limit: 82100, rate: 0.0594 },
    { limit: 108900, rate: 0.066 }, { limit: 141500, rate: 0.088 },
    { limit: 185100, rate: 0.11 }, { limit: 793900, rate: 0.132 },
    { limit: Infinity, rate: 0.115 }
  ];
  let federalTax = 0;
  let previous = 0;
  for (const bracket of federalBrackets) {
    federalTax += Math.max(0, Math.min(federalTaxableIncome, bracket.limit) - previous) * bracket.rate;
    previous = bracket.limit;
    if (federalTaxableIncome <= bracket.limit) break;
  }

  // Zurich 2026 single-person tariff after the official 1.3% inflation adjustment.
  const zurichBrackets = [
    [6900, 0], [11800, 0.02], [16600, 0.03], [24500, 0.04],
    [34100, 0.05], [45100, 0.06], [58000, 0.07], [75400, 0.08],
    [109000, 0.09], [142200, 0.10], [194900, 0.11], [263300, 0.12],
    [Infinity, 0.13]
  ];
  let zurichBasicTax = 0;
  previous = 0;
  for (const [limit, rate] of zurichBrackets) {
    zurichBasicTax += Math.max(0, Math.min(cantonalTaxableIncome, limit) - previous) * rate;
    previous = limit;
    if (cantonalTaxableIncome <= limit) break;
  }
  const zurichCantonalAndMunicipalTax = zurichBasicTax * 2.14;
  const annualTax = federalTax + zurichCantonalAndMunicipalTax;
  const monthlySocial = annualSocial / 12;
  const monthlyTax = annualTax / 12;
  const netMonthly = grossMonthly - monthlySocial - monthlyTax;

  outputs.net.textContent = formatCurrency(netMonthly, "CHF");
  outputs.tax.textContent = formatCurrency(monthlyTax, "CHF");
  outputs.social.textContent = formatCurrency(monthlySocial, "CHF");
  outputs.pension.textContent = formatCurrency(federalTax / 12, "CHF");
  outputs.unemployment.textContent = formatCurrency(zurichCantonalAndMunicipalTax / 12, "CHF");
  outputs.health.textContent = formatCurrency((federalWorkExpenses + cantonalWorkExpenses) / 12, "CHF");
  outputs.care.textContent = formatCurrency((1800 + 2900) / 12, "CHF");
  outputs.church.textContent = "Excluded";
}

function calculateSweden() {
  const grossMonthly = parseDecimal(grossInput.value);
  const valid = grossInput.value.trim() !== "" && Number.isFinite(grossMonthly) && grossMonthly >= 0 && grossMonthly <= 10000000;
  errorMessage.textContent = "Enter a valid gross monthly salary.";
  errorMessage.hidden = valid;
  if (!valid) { clearGermanyResults(); return; }

  const annualGross = grossMonthly * 12;
  // 2026 basic allowance table for a working-age employee.
  let basicAllowance;
  if (annualGross <= 25000) basicAllowance = annualGross;
  else if (annualGross <= 58900) basicAllowance = 25100;
  else if (annualGross <= 160900) basicAllowance = 25200 + Math.floor((annualGross - 59000) / 500) * 100;
  else if (annualGross <= 184900) basicAllowance = 45600;
  else if (annualGross <= 466000) basicAllowance = 45500 - Math.floor((annualGross - 185000) / 1000) * 100;
  else basicAllowance = 17400;
  basicAllowance = Math.max(0, basicAllowance);

  const taxableIncome = Math.max(0, annualGross - basicAllowance);
  const municipalRate = 0.3238;
  const municipalTax = taxableIncome * municipalRate;
  const funeralFee = taxableIncome * 0.00292;
  const stateTax = Math.max(0, taxableIncome - 643000) * 0.20;

  // 2026 earned-income tax credit, using the 2026 price base amount (SEK 59,200).
  const baseAmount = 59200;
  let earnedIncomeCredit;
  if (annualGross <= 0.91 * baseAmount) {
    earnedIncomeCredit = Math.max(0, annualGross - basicAllowance) * municipalRate;
  } else if (annualGross <= 3.24 * baseAmount) {
    earnedIncomeCredit = Math.max(0, 0.91 * baseAmount + 0.3874 * (annualGross - 0.91 * baseAmount) - basicAllowance) * municipalRate;
  } else if (annualGross <= 8.08 * baseAmount) {
    earnedIncomeCredit = Math.max(0, 1.813 * baseAmount + 0.199 * (annualGross - 3.24 * baseAmount) - basicAllowance) * municipalRate;
  } else {
    earnedIncomeCredit = Math.max(0, 2.776 * baseAmount - basicAllowance) * municipalRate;
  }
  const generalTaxReduction = Math.min(1500, Math.max(0, taxableIncome - 40000) * 0.0075);
  const totalTaxCredits = Math.min(municipalTax, earnedIncomeCredit + generalTaxReduction);
  const netMunicipalTax = Math.max(0, municipalTax - totalTaxCredits);
  const annualTax = netMunicipalTax + stateTax + funeralFee;
  const monthlyTax = annualTax / 12;
  const netMonthly = grossMonthly - monthlyTax;

  outputs.net.textContent = formatCurrency(netMonthly, "SEK");
  outputs.tax.textContent = formatCurrency(monthlyTax, "SEK");
  outputs.social.textContent = "Offset by tax credit";
  outputs.pension.textContent = formatCurrency(netMunicipalTax / 12, "SEK");
  outputs.unemployment.textContent = formatCurrency(stateTax / 12, "SEK");
  outputs.health.textContent = formatCurrency(funeralFee / 12, "SEK");
  outputs.care.textContent = formatCurrency(basicAllowance / 12, "SEK");
  outputs.church.textContent = formatCurrency(totalTaxCredits / 12, "SEK");
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
