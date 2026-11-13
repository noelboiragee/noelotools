// এই স্ক্রিপ্টে প্রাপ্তবয়স্কদের BMI হিসাব ও ফর্ম যাচাই করা হয়।
const form = document.querySelector("#bmi-form");
const heightInput = document.querySelector("#height");
const weightInput = document.querySelector("#weight");
const errorOutput = document.querySelector("#form-error");
const resultPanel = document.querySelector("#result-panel");
const bmiValue = document.querySelector("#bmi-value");
const bmiCategory = document.querySelector("#bmi-category");
const resetButton = document.querySelector("#reset-button");

function getAdultCategory(bmi) {
  if (bmi < 18.5) return "Underweight range";
  if (bmi < 25) return "Healthy-weight range";
  if (bmi < 30) return "Overweight range";
  return "Obesity range";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorOutput.textContent = "";
  resultPanel.hidden = true;

  const heightCm = Number(heightInput.value);
  const weightKg = Number(weightInput.value);

  if (!heightInput.value || !weightInput.value || !Number.isFinite(heightCm) || !Number.isFinite(weightKg)) {
    errorOutput.textContent = "Enter both height and weight to calculate BMI.";
    return;
  }
  if (heightCm < 100 || heightCm > 250) {
    errorOutput.textContent = "Enter a height between 100 and 250 cm.";
    heightInput.focus();
    return;
  }
  if (weightKg < 20 || weightKg > 400) {
    errorOutput.textContent = "Enter a weight between 20 and 400 kg.";
    weightInput.focus();
    return;
  }

  const heightMetres = heightCm / 100;
  const bmi = weightKg / (heightMetres * heightMetres);
  bmiValue.textContent = bmi.toFixed(1);
  bmiCategory.textContent = getAdultCategory(bmi);
  resultPanel.hidden = false;
});

resetButton.addEventListener("click", () => {
  errorOutput.textContent = "";
  resultPanel.hidden = true;
  bmiValue.textContent = "—";
  bmiCategory.textContent = "";
});