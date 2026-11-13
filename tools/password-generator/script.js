// এই স্ক্রিপ্টে Web Crypto API ব্যবহার করে নিরাপদ র‍্যান্ডম পাসওয়ার্ড তৈরি করা হয়।
const form = document.querySelector("#password-form");
const lengthInput = document.querySelector("#password-length");
const lengthValue = document.querySelector("#length-value");
const output = document.querySelector("#password-output");
const errorOutput = document.querySelector("#form-error");
const copyButton = document.querySelector("#copy-button");
const copyStatus = document.querySelector("#copy-status");

const characterOptions = [
  { id: "include-uppercase", characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  { id: "include-lowercase", characters: "abcdefghijklmnopqrstuvwxyz" },
  { id: "include-numbers", characters: "0123456789" },
  { id: "include-symbols", characters: "!@#$%^&*()-_=+[]{}:,.?" }
];

function secureRandomIndex(max) {
  if (!window.crypto?.getRandomValues || max < 1) {
    throw new Error("Secure random number generation is unavailable.");
  }
  const range = 0x100000000;
  const limit = range - (range % max);
  const randomValues = new Uint32Array(1);
  let value;
  do {
    window.crypto.getRandomValues(randomValues);
    value = randomValues[0];
  } while (value >= limit);
  return value % max;
}

function secureShuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomIndex(index + 1);
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function createPassword(length, selectedOptions) {
  const pools = selectedOptions.map((option) => option.characters);
  const allCharacters = pools.join("");
  const passwordCharacters = pools.map((pool) => pool[secureRandomIndex(pool.length)]);

  while (passwordCharacters.length < length) {
    passwordCharacters.push(allCharacters[secureRandomIndex(allCharacters.length)]);
  }
  return secureShuffle(passwordCharacters).join("");
}

lengthInput.addEventListener("input", () => {
  lengthValue.value = lengthInput.value;
  lengthValue.textContent = lengthInput.value;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorOutput.textContent = "";
  copyStatus.textContent = "";

  const selectedOptions = characterOptions.filter((option) =>
    document.querySelector("#" + option.id).checked
  );
  const length = Number(lengthInput.value);

  if (selectedOptions.length === 0) {
    errorOutput.textContent = "Select at least one character type.";
    return;
  }
  if (!Number.isInteger(length) || length < 8 || length > 64) {
    errorOutput.textContent = "Choose a password length from 8 to 64.";
    return;
  }

  try {
    output.value = createPassword(length, selectedOptions);
    copyButton.disabled = false;
    copyStatus.textContent = "Password generated locally in your browser.";
  } catch (error) {
    output.value = "";
    copyButton.disabled = true;
    errorOutput.textContent = "Secure generation is unavailable in this browser. Use a supported, up-to-date browser.";
  }
});

copyButton.addEventListener("click", async () => {
  if (!output.value) return;
  try {
    await navigator.clipboard.writeText(output.value);
    copyStatus.textContent = "Password copied to clipboard.";
  } catch (error) {
    output.focus();
    output.select();
    copyStatus.textContent = "Automatic copy is unavailable. The password is selected; copy it manually.";
  }
});