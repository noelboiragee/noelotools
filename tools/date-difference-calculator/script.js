// Date Difference Calculator — calendar-day duration with minute and second totals.
const $ = (s) => document.querySelector(s);
const start = $("#start"), end = $("#end"), include = $("#include"), out = $("#result");
function localDate(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}
function show(message, kind = "success") { out.textContent = message; out.dataset.kind = kind; out.hidden = false; }
$("#calculate").addEventListener("click", () => {
  let a = localDate(start.value), b = localDate(end.value);
  if (!a || !b) return show("Choose both dates from the calendar.", "error");
  if (a > b) [a, b] = [b, a];
  const startUtc = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const endUtc = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const days = Math.round((endUtc - startUtc) / 86400000) + (include.checked ? 1 : 0);
  let months = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
  if (b.getDate() < a.getDate()) months--;
  const totalHours = days * 24, totalMinutes = days * 1440, totalSeconds = days * 86400;
  const weeks = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 }).format(days / 7);
  show(`${days} days · ${weeks} weeks · ${months} complete calendar months · ${totalHours} total hours · ${totalMinutes} total minutes · ${totalSeconds} total seconds. ${include.checked ? "End date included." : "End date excluded."}`);
});
$("#reset").addEventListener("click", () => { start.value = ""; end.value = ""; include.checked = false; out.hidden = true; });
