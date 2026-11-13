// এই স্ক্রিপ্টে VAT হিসাব এবং ইনপুট নিয়ন্ত্রণ করা হয়েছে।
const modeInput = document.querySelector("#calculation-mode");
const currencyInput = document.querySelector("#currency");
const amountInput = document.querySelector("#amount");
const rateInput = document.querySelector("#vat-rate");
const amountLabel = document.querySelector("#amount-label");
const netOutput = document.querySelector("#net-result");
const vatOutput = document.querySelector("#vat-result");
const grossOutput = document.querySelector("#gross-result");
const errorMessage = document.querySelector("#error-message");
const resetButton = document.querySelector("#reset-button");

const currencyLocales = {
  EUR: "en-IE",
  GBP: "en-GB",
  USD: "en-US",
  PLN: "pl-PL",
  CHF: "de-CH",
  BDT: "en-BD"
};

function formatMoney(value) {
  const currency = currencyInput.value;
  try {
    return new Intl.NumberFormat(currencyLocales[currency] || "en", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  } catch {
    return value.toFixed(2) + " " + currency;
  }
}

function updateAmountLabel() {
  amountLabel.textContent = modeInput.value === "add" ? "Net price" : "Gross price";
}

function calculateVat() {
  updateAmountLabel();

  const amount = Number(amountInput.value);
  const rate = Number(rateInput.value);
  const valid = amountInput.value.trim() !== "" &&
    rateInput.value.trim() !== "" &&
    Number.isFinite(amount) &&
    Number.isFinite(rate) &&
    amount >= 0 &&
    rate >= 0 &&
    rate <= 100;

  errorMessage.hidden = valid;
  if (!valid) {
    netOutput.textContent = "—";
    vatOutput.textContent = "—";
    grossOutput.textContent = "—";
    return;
  }

  let net;
  let vat;
  let gross;
  const multiplier = 1 + rate / 100;

  if (modeInput.value === "add") {
    net = amount;
    vat = net * rate / 100;
    gross = net + vat;
  } else {
    gross = amount;
    net = gross / multiplier;
    vat = gross - net;
  }

  netOutput.textContent = formatMoney(net);
  vatOutput.textContent = formatMoney(vat);
  grossOutput.textContent = formatMoney(gross);
}

[modeInput, currencyInput, amountInput, rateInput].forEach((input) => {
  input.addEventListener("input", calculateVat);
  input.addEventListener("change", calculateVat);
});

resetButton.addEventListener("click", () => {
  modeInput.value = "add";
  currencyInput.value = "EUR";
  amountInput.value = "100";
  rateInput.value = "20";
  calculateVat();
  amountInput.focus();
});

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

calculateVat();
