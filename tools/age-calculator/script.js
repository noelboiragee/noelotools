// Age Calculator — date values come from native browser date pickers.
const $ = (s) => document.querySelector(s);
const dob = $("#dob"), asof = $("#asof"), out = $("#result");
function localDate(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}
function show(message, kind = "success") { out.textContent = message; out.dataset.kind = kind; out.hidden = false; }
$("#calculate").addEventListener("click", () => {
  const birth = localDate(dob.value);
  const today = asof.value ? localDate(asof.value) : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  if (!birth || !today) return show("Choose a valid date of birth and calculation date.", "error");
  if (birth > today) return show("Date of birth cannot be after the calculation date.", "error");
  let y = today.getFullYear() - birth.getFullYear();
  let m = today.getMonth() - birth.getMonth();
  let d = today.getDate() - birth.getDate();
  if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  const days = Math.round((Date.UTC(next.getFullYear(), next.getMonth(), next.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
  show(`${y} years, ${m} months, ${d} days. ${days} days until the next birthday.`);
});
$("#reset").addEventListener("click", () => { dob.value = ""; asof.value = ""; out.hidden = true; });
