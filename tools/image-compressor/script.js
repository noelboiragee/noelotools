// Image Compressor — previews and compression are handled locally in the browser.
const $ = (s) => document.querySelector(s);
const fileInput = $("#file"), quality = $("#quality"), result = $("#result");
const before = $("#before"), after = $("#after"), download = $("#download"), format = $("#format");
let outputBlob = null, beforeUrl = null, afterUrl = null;
const size = (n) => n < 1024 ? n + " B" : (n / 1024).toFixed(1) + " KB";
function message(text, kind = "success") { result.textContent = text; result.dataset.kind = kind; result.hidden = false; }
function clearUrl(url) { if (url) URL.revokeObjectURL(url); }
function updateQuality() {
  $("#qv").value = quality.value;
  quality.disabled = format.value === "image/png";
}
quality.addEventListener("input", updateQuality);
format.addEventListener("change", updateQuality);
function loadPreview(file) {
  clearUrl(beforeUrl); beforeUrl = URL.createObjectURL(file);
  before.src = beforeUrl; before.hidden = false;
  $("#before-size").textContent = "Original: " + size(file.size);
  clearUrl(afterUrl); afterUrl = null; after.removeAttribute("src"); after.hidden = true;
  $("#after-size").textContent = "";
  outputBlob = null; download.disabled = true; result.hidden = true;
}
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 20 * 1024 * 1024) {
    message("Choose a JPG, PNG or WebP image under 20 MB.", "error"); fileInput.value = ""; return;
  }
  loadPreview(file);
});
$("#calculate").addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) return message("Choose an image first.", "error");
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) return message("Your browser could not prepare the image.", "error");
    context.drawImage(image, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return message("Could not create the compressed image.", "error");
      outputBlob = blob; clearUrl(afterUrl); afterUrl = URL.createObjectURL(blob);
      after.src = afterUrl; after.hidden = false;
      $("#after-size").textContent = "Output: " + size(blob.size);
      download.disabled = false;
      const change = ((1 - blob.size / file.size) * 100).toFixed(1);
      message(`Processed in your browser. File size change: ${change}%.`);
    }, format.value, Number(quality.value));
    clearUrl(image.src.startsWith("blob:") ? image.src : null);
  };
  image.onerror = () => message("The selected image could not be opened.", "error");
  image.src = URL.createObjectURL(file);
});
download.addEventListener("click", () => {
  if (!outputBlob) return;
  const url = URL.createObjectURL(outputBlob), link = document.createElement("a");
  link.href = url; link.download = "compressed." + (format.value === "image/jpeg" ? "jpg" : format.value === "image/png" ? "png" : "webp");
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$("#reset").addEventListener("click", () => {
  fileInput.value = ""; clearUrl(beforeUrl); clearUrl(afterUrl); beforeUrl = afterUrl = null;
  before.removeAttribute("src"); after.removeAttribute("src"); before.hidden = after.hidden = true;
  $("#before-size").textContent = $("#after-size").textContent = "";
  outputBlob = null; download.disabled = true; result.hidden = true;
});
updateQuality();

// Tap a preview to inspect it in a large, screen-fitted lightbox.
const lightbox = document.createElement("dialog");
lightbox.className = "image-lightbox";
lightbox.setAttribute("aria-label", "Image preview");
lightbox.innerHTML = '<button type="button" class="image-lightbox-close" aria-label="Close image preview">×</button><img alt="Enlarged image preview">';
document.body.append(lightbox);
const lightboxImage = lightbox.querySelector("img");
function openImagePreview(preview) {
  if (preview.hidden || !preview.src) return;
  lightboxImage.src = preview.src;
  lightboxImage.alt = preview.alt || "Enlarged image preview";
  if (!lightbox.open) lightbox.showModal();
}
[before, after].forEach((preview) => {
  preview.tabIndex = 0;
  preview.setAttribute("role", "button");
  preview.setAttribute("aria-label", "Tap to enlarge " + (preview.alt || "image"));
  preview.addEventListener("click", () => openImagePreview(preview));
  preview.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openImagePreview(preview);
    }
  });
});
lightbox.querySelector(".image-lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => { lightboxImage.removeAttribute("src"); });
