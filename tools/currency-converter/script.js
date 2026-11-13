// এই স্ক্রিপ্টে অনলাইন এক্সচেঞ্জ রেট এনে স্থানীয়ভাবে মুদ্রা রূপান্তর করা হয়েছে।
const amountInput = document.querySelector("#amount");
const fromInput = document.querySelector("#from-currency");
const toInput = document.querySelector("#to-currency");
const resultLabel = document.querySelector("#result-label");
const convertedOutput = document.querySelector("#converted-amount");
const rateLine = document.querySelector("#rate-line");
const updatedLabel = document.querySelector("#rate-updated");
const errorMessage = document.querySelector("#error-message");
const convertButton = document.querySelector("#convert-button");
const refreshButton = document.querySelector("#refresh-button");
const swapButton = document.querySelector("#swap-button");

let currentRates = null;
let currentBase = null;
let lastUpdated = null;
let loading = false;
let latestRequestId = 0;

function formatCurrency(value, currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 4
    }).format(value);
  } catch {
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 }) + " " + currency;
  }
}

function setLoading(isLoading) {
  loading = isLoading;
  convertButton.disabled = isLoading;
  refreshButton.disabled = isLoading;
  convertButton.textContent = isLoading ? "Loading rates…" : "Convert";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  convertedOutput.textContent = "—";
  rateLine.textContent = "";
}

async function fetchRates(base, forceRefresh = false) {
  if (!forceRefresh && currentBase === base && currentRates) {
    calculate();
    return;
  }

  const requestId = ++latestRequestId;
  setLoading(true);
  errorMessage.hidden = true;
  updatedLabel.textContent = "Fetching latest available rates…";

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/" + encodeURIComponent(base), {
      headers: { "Accept": "application/json" }
    });
    if (!response.ok) throw new Error("The exchange-rate service could not be reached.");
    const data = await response.json();
    if (data.result !== "success" || !data.rates || typeof data.rates !== "object") {
      throw new Error("The exchange-rate service returned an invalid response.");
    }

    // সর্বশেষ নির্বাচিত মুদ্রার অনুরোধের ফলই শুধু গ্রহণ করা হবে।
    if (requestId !== latestRequestId) return;

    currentBase = base;
    currentRates = data.rates;
    lastUpdated = data.time_last_update_utc || null;
    calculate();
    updatedLabel.textContent = lastUpdated
      ? "Rates last updated by provider: " + lastUpdated
      : "Rate data loaded from provider.";
  } catch (error) {
    if (requestId !== latestRequestId) return;
    showError(error.message || "Unable to load exchange rates. Check your connection and try again.");
    updatedLabel.textContent = "Exchange rates unavailable.";
  } finally {
    if (requestId === latestRequestId) setLoading(false);
  }
}

function calculate() {
  if (!currentRates || currentBase !== fromInput.value) return;

  const amount = Number(amountInput.value);
  if (amountInput.value.trim() === "" || !Number.isFinite(amount) || amount < 0) {
    showError("Enter an amount greater than or equal to zero.");
    return;
  }

  const from = fromInput.value;
  const to = toInput.value;
  const rate = from === to ? 1 : currentRates[to];

  if (typeof rate !== "number" || !Number.isFinite(rate)) {
    showError("This currency pair is not available from the rate provider.");
    return;
  }

  const converted = amount * rate;
  resultLabel.textContent = formatCurrency(amount, from) + " equals";
  convertedOutput.textContent = formatCurrency(converted, to);
  rateLine.textContent = "1 " + from + " = " + rate.toLocaleString(undefined, {
    maximumFractionDigits: 6
  }) + " " + to;
  errorMessage.hidden = true;
}

fromInput.addEventListener("change", () => fetchRates(fromInput.value));
toInput.addEventListener("change", calculate);
amountInput.addEventListener("input", calculate);

convertButton.addEventListener("click", () => {
  if (currentBase !== fromInput.value || !currentRates) {
    fetchRates(fromInput.value, true);
  } else {
    calculate();
  }
});

refreshButton.addEventListener("click", () => fetchRates(fromInput.value, true));

swapButton.addEventListener("click", () => {
  const previousFrom = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = previousFrom;
  fetchRates(fromInput.value);
});

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

fetchRates(fromInput.value);
