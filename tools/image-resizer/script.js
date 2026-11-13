// Image Resizer — original and resized previews, matching the Image Compressor workflow.
const $ = (s) => document.querySelector(s);
const fileInput = $("#file"), widthInput = $("#width"), heightInput = $("#height");
const mode = $("#mode"), lock = $("#lock"), before = $("#before"), after = $("#after");
const download = $("#download"), result = $("#result");
let image = null, outputBlob = null, originalWidth = 0, originalHeight = 0;
let originalUrl = null, previewUrl = null, syncing = false;
const size = (n) => n < 1024 ? n + " B" : (n / 1024).toFixed(1) + " KB";
function message(text, kind = "success") { result.textContent = text; result.dataset.kind = kind; result.hidden = false; }
function clearUrl(url) { if (url) URL.revokeObjectURL(url); }
function updateDimensions() { $("#dimensions").textContent = image ? `Original: ${originalWidth} × ${originalHeight} px` : "Choose an image to see dimensions."; }
function clearOutput() {
  clearUrl(previewUrl); previewUrl = null; after.removeAttribute("src"); after.hidden = true;
  $("#after-size").textContent = ""; outputBlob = null; download.disabled = true;
}
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 20 * 1024 * 1024) {
    message("Choose a JPG, PNG or WebP image under 20 MB.", "error"); fileInput.value = ""; return;
  }
  const nextUrl = URL.createObjectURL(file), nextImage = new Image();
  nextImage.onload = () => {
    clearUrl(originalUrl); originalUrl = nextUrl; image = nextImage;
    originalWidth = image.naturalWidth; originalHeight = image.naturalHeight;
    before.src = originalUrl; before.hidden = false;
    $("#before-size").textContent = `Original: ${size(file.size)} · ${originalWidth} × ${originalHeight} px`;
    mode.value = "pixels"; widthInput.value = originalWidth; heightInput.value = originalHeight;
    updateDimensions(); clearOutput(); result.hidden = true;
  };
  nextImage.onerror = () => { clearUrl(nextUrl); message("The selected image could not be opened.", "error"); };
  nextImage.src = nextUrl;
});
function sync(changed) {
  if (!image || !lock.checked || syncing || mode.value !== "pixels") return;
  syncing = true;
  const ratio = originalWidth / originalHeight;
  if (changed === "width" && Number(widthInput.value) > 0) heightInput.value = Math.max(1, Math.round(Number(widthInput.value) / ratio));
  if (changed === "height" && Number(heightInput.value) > 0) widthInput.value = Math.max(1, Math.round(Number(heightInput.value) * ratio));
  syncing = false;
}
widthInput.addEventListener("input", () => sync("width"));
heightInput.addEventListener("input", () => sync("height"));
mode.addEventListener("change", () => {
  if (!image) return;
  if (mode.value === "percent") { widthInput.value = 100; heightInput.value = 100; }
  else { widthInput.value = originalWidth; heightInput.value = originalHeight; }
  clearOutput();
});
$("#calculate").addEventListener("click", () => {
  if (!image) return message("Choose an image first.", "error");
  let w = Number(widthInput.value), h = Number(heightInput.value);
  if (mode.value === "percent") {
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1 || w > 1000 || h > 1000) return message("Enter percentages between 1 and 1000.", "error");
    w = Math.round(originalWidth * w / 100); h = Math.round(originalHeight * h / 100);
  }
  if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1 || w > 12000 || h > 12000) return message("Dimensions must be 1–12,000 pixels.", "error");
  const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
  const context = canvas.getContext("2d");
  if (!context) return message("Your browser could not prepare the image.", "error");
  context.drawImage(image, 0, 0, w, h);
  const mime = fileInput.files[0].type === "image/png" ? "image/png" : "image/jpeg";
  canvas.toBlob((blob) => {
    if (!blob) return message("Could not resize this image.", "error");
    outputBlob = blob; clearUrl(previewUrl); previewUrl = URL.createObjectURL(blob);
    after.src = previewUrl; after.hidden = false;
    $("#after-size").textContent = `Output: ${size(blob.size)} · ${w} × ${h} px`;
    download.disabled = false;
    message(`Resized to ${w} × ${h} px. Output format: ${mime === "image/png" ? "PNG" : "JPG"}.`);
  }, mime, .92);
});
download.addEventListener("click", () => {
  if (!outputBlob) return;
  const url = URL.createObjectURL(outputBlob), link = document.createElement("a");
  link.href = url; link.download = "resized." + (outputBlob.type === "image/png" ? "png" : "jpg");
  link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$("#reset").addEventListener("click", () => {
  fileInput.value = ""; clearUrl(originalUrl); originalUrl = null; clearOutput();
  before.removeAttribute("src"); before.hidden = true; $("#before-size").textContent = "";
  image = null; widthInput.value = 800; heightInput.value = 600; mode.value = "pixels"; lock.checked = true;
  updateDimensions(); result.hidden = true;
});
