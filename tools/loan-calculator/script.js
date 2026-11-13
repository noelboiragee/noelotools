// এই ফাইলে মাসিক কিস্তি, সুদ এবং পরিশোধ সূচির হিসাব রাখা হয়েছে।
const form = document.querySelector("#loan-form");
const amountInput = document.querySelector("#loan-amount");
const rateInput = document.querySelector("#interest-rate");
const termInput = document.querySelector("#loan-term");
const currencyInput = document.querySelector("#currency");
const startDateInput = document.querySelector("#start-date");
const errorOutput = document.querySelector("#form-error");
const resultsSection = document.querySelector("#loan-results");
const scheduleBody = document.querySelector("#schedule-body");

const outputs = {
  monthly: document.querySelector("#monthly-payment"),
  interest: document.querySelector("#total-interest"),
  total: document.querySelector("#total-payment"),
  principal: document.querySelector("#principal-output")
};

let latestSchedule = [];
let latestCurrency = "EUR";

function moneyFormatter(currency) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  });
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function addMonths(date, months) {
  const nextDate = new Date(date);
  const originalDay = nextDate.getDate();
  nextDate.setDate(1);
  nextDate.setMonth(nextDate.getMonth() + months);
  const lastDay = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
  nextDate.setDate(Math.min(originalDay, lastDay));
  return nextDate;
}

function calculateLoan(principal, annualRate, years, firstPaymentDate) {
  const numberOfPayments = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = monthlyRate === 0
    ? principal / numberOfPayments
    : principal * monthlyRate / (1 - ((1 + monthlyRate) ** -numberOfPayments));

  let balance = principal;
  let totalInterest = 0;
  const schedule = [];

  for (let paymentNumber = 1; paymentNumber <= numberOfPayments; paymentNumber += 1) {
    const interest = balance * monthlyRate;
    let principalPaid = monthlyPayment - interest;

    if (paymentNumber === numberOfPayments || principalPaid > balance) {
      principalPaid = balance;
    }

    const paymentAmount = principalPaid + interest;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;

    schedule.push({
      number: paymentNumber,
      date: addMonths(firstPaymentDate, paymentNumber - 1),
      payment: paymentAmount,
      principal: principalPaid,
      interest,
      balance
    });
  }

  return {
    monthlyPayment,
    totalInterest,
    totalPayment: principal + totalInterest,
    schedule
  };
}

function renderSchedule(schedule, formatter) {
  const fragment = document.createDocumentFragment();

  schedule.forEach((row) => {
    const tr = document.createElement("tr");
    const values = [
      row.number,
      formatDate(row.date),
      formatter.format(row.payment),
      formatter.format(row.principal),
      formatter.format(row.interest),
      formatter.format(row.balance)
    ];

    values.forEach((value) => {
      const td = document.createElement("td");
      td.textContent = String(value);
      tr.append(td);
    });

    fragment.append(tr);
  });

  scheduleBody.replaceChildren(fragment);
}

function showError(message) {
  errorOutput.textContent = message;
  errorOutput.hidden = false;
}

function hideError() {
  errorOutput.textContent = "";
  errorOutput.hidden = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideError();

  const principal = Number(amountInput.value);
  const annualRate = Number(rateInput.value);
  const years = Number(termInput.value);
  const currency = currencyInput.value;

  if (!Number.isFinite(principal) || principal <= 0) {
    showError("Enter a loan amount greater than zero.");
    return;
  }

  if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100) {
    showError("Enter an annual interest rate between 0% and 100%.");
    return;
  }

  if (!Number.isInteger(years) || years < 1 || years > 50) {
    showError("Choose a loan term between 1 and 50 whole years.");
    return;
  }

  const firstPaymentDate = startDateInput.value
    ? new Date(`${startDateInput.value}T12:00:00`)
    : new Date();

  const calculation = calculateLoan(principal, annualRate, years, firstPaymentDate);
  const formatter = moneyFormatter(currency);

  latestSchedule = calculation.schedule;
  latestCurrency = currency;

  outputs.monthly.textContent = formatter.format(calculation.monthlyPayment);
  outputs.interest.textContent = formatter.format(calculation.totalInterest);
  outputs.total.textContent = formatter.format(calculation.totalPayment);
  outputs.principal.textContent = formatter.format(principal);

  renderSchedule(latestSchedule, formatter);
  resultsSection.hidden = false;
});

document.querySelector("#print-button").addEventListener("click", () => {
  window.print();
});

document.querySelector("#download-csv").addEventListener("click", () => {
  if (latestSchedule.length === 0) return;

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const rows = [
    ["Payment", "Date", `Payment (${latestCurrency})`, `Principal (${latestCurrency})`, `Interest (${latestCurrency})`, `Balance (${latestCurrency})`],
    ...latestSchedule.map((row) => [
      row.number,
      row.date.toISOString().slice(0, 10),
      formatter.format(row.payment),
      formatter.format(row.principal),
      formatter.format(row.interest),
      formatter.format(row.balance)
    ])
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/gu, '""')}"`).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "loan-repayment-schedule.csv";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});