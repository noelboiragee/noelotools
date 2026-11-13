// এই স্ক্রিপ্টে ব্রাউজারের ভেতরে QR কোড তৈরি ও PNG ডাউনলোড করা হয়।
const form = document.querySelector("#qr-form");
const contentInput = document.querySelector("#qr-content");
const sizeInput = document.querySelector("#qr-size");
const charCount = document.querySelector("#char-count");
const errorOutput = document.querySelector("#form-error");
const qrOutput = document.querySelector("#qr-output");
const placeholder = document.querySelector("#qr-placeholder");
const resultMessage = document.querySelector("#result-message");
const downloadButton = document.querySelector("#download-button");

let currentQrCode = null;

contentInput.addEventListener("input", () => {
  charCount.textContent = `${contentInput.value.length} / 1800`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorOutput.textContent = "";

  const content = contentInput.value.trim();
  const size = Number(sizeInput.value);

  if (!content) {
    errorOutput.textContent = "Enter a link or message first.";
    contentInput.focus();
    return;
  }
  if (content.length > 1800) {
    errorOutput.textContent = "Keep the content within 1800 characters.";
    return;
  }
  if (typeof window.QRCode !== "function") {
    errorOutput.textContent = "The QR library could not load. Check your internet connection and reload the page.";
    return;
  }

  qrOutput.replaceChildren();
  currentQrCode = null;
  downloadButton.disabled = true;

  try {
    currentQrCode = new QRCode(qrOutput, {
      text: content,
      width: size,
      height: size,
      colorDark: "#111827",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });
    placeholder?.remove();
    resultMessage.textContent = "QR code generated. Scan it to verify the content.";
    downloadButton.disabled = false;
  } catch (error) {
    qrOutput.replaceChildren();
    resultMessage.textContent = "A QR code could not be generated.";
    errorOutput.textContent = "Try a shorter message or a smaller amount of text.";
  }
});

downloadButton.addEventListener("click", () => {
  const canvas = qrOutput.querySelector("canvas");
  const image = qrOutput.querySelector("img");
  let imageUrl = "";

  if (canvas) {
    imageUrl = canvas.toDataURL("image/png");
  } else if (image?.src && image.complete) {
    const downloadLink = document.createElement("a");
    downloadLink.href = image.src;
    downloadLink.download = "noelotools-qr-code.png";
    downloadLink.click();
    return;
  }

  if (!imageUrl) {
    errorOutput.textContent = "The QR image is not ready yet. Generate it again.";
    return;
  }

  const downloadLink = document.createElement("a");
  downloadLink.href = imageUrl;
  downloadLink.download = "noelotools-qr-code.png";
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
});