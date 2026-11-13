// এই ফাইলে ব্রাউজারে পিডিএফ অপ্টিমাইজ ও কমপ্রেস করার লজিক রাখা হয়েছে।
const fileInput = document.querySelector("#pdf-file");
const dropzone = document.querySelector("#dropzone");
const selectedFilePanel = document.querySelector("#selected-file");
const fileName = document.querySelector("#file-name");
const fileSize = document.querySelector("#file-size");
const removeButton = document.querySelector("#remove-file");
const compressButton = document.querySelector("#compress-button");
const statusMessage = document.querySelector("#status-message");
const progressBar = document.querySelector("#progress-bar");
const resultPanel = document.querySelector("#result-panel");
const resultSummary = document.querySelector("#result-summary");
const originalSizeOutput = document.querySelector("#original-size");
const newSizeOutput = document.querySelector("#new-size");
const sizeChangeOutput = document.querySelector("#size-change");
const downloadLink = document.querySelector("#download-link");

let selectedFile = null;
let outputUrl = null;

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** unitIndex)).toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
};

function setStatus(message, progress = null) {
  statusMessage.textContent = message;
  if (progress === null) {
    progressBar.hidden = true;
  } else {
    progressBar.hidden = false;
    progressBar.value = progress;
  }
}

function clearResult() {
  resultPanel.hidden = true;
  if (outputUrl) {
    URL.revokeObjectURL(outputUrl);
    outputUrl = null;
  }
  downloadLink.removeAttribute("href");
}

function acceptFile(file) {
  if (!file) return;
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    setStatus("Please choose a PDF file.");
    return;
  }

  selectedFile = file;
  fileName.textContent = file.name;
  fileSize.textContent = formatBytes(file.size);
  selectedFilePanel.hidden = false;
  dropzone.hidden = true;
  compressButton.disabled = false;
  clearResult();
  setStatus("PDF ready. Choose a compression mode and start.");
}

function resetFile() {
  selectedFile = null;
  fileInput.value = "";
  selectedFilePanel.hidden = true;
  dropzone.hidden = false;
  compressButton.disabled = true;
  clearResult();
  setStatus("Choose a PDF to get started.");
}

function getSelectedMode() {
  return document.querySelector('input[name="compression-mode"]:checked').value;
}

function showResult(blob, mode) {
  outputUrl = URL.createObjectURL(blob);
  downloadLink.href = outputUrl;
  const safeName = selectedFile.name.replace(/\.pdf$/i, "");
  downloadLink.download = `${safeName}-compressed.pdf`;

  const before = selectedFile.size;
  const after = blob.size;
  const difference = before - after;
  const percent = before > 0 ? Math.round((Math.abs(difference) / before) * 100) : 0;

  originalSizeOutput.textContent = formatBytes(before);
  newSizeOutput.textContent = formatBytes(after);

  if (difference > 0) {
    sizeChangeOutput.textContent = `${percent}% smaller`;
    resultSummary.textContent = mode === "maximum"
      ? "Image-based compression finished. Check the output quality before sharing."
      : "Text-preserving optimisation finished.";
  } else if (difference < 0) {
    sizeChangeOutput.textContent = `${percent}% larger`;
    resultSummary.textContent = "This PDF was already well optimised. The new file is larger, so keep the original if it is smaller.";
  } else {
    sizeChangeOutput.textContent = "No size change";
    resultSummary.textContent = "The output is the same size as the original.";
  }

  resultPanel.hidden = false;
  setStatus("Your compressed PDF is ready to download.", 100);
}

async function preserveText(file) {
  if (!window.PDFLib?.PDFDocument) {
    throw new Error("The PDF optimisation library did not load. Check your internet connection and reload the page.");
  }

  const bytes = await file.arrayBuffer();
  const pdfDocument = await window.PDFLib.PDFDocument.load(bytes);
  const savedBytes = await pdfDocument.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50
  });

  return new Blob([savedBytes], { type: "application/pdf" });
}

async function maximumCompress(file) {
  if (!window.pdfjsLib || !window.jspdf?.jsPDF) {
    throw new Error("The PDF rendering libraries did not load. Check your internet connection and reload the page.");
  }

  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const sourceBytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await window.pdfjsLib.getDocument({ data: sourceBytes }).promise;
  let outputPdf = null;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) {
    throw new Error("Your browser could not create a canvas for PDF processing.");
  }

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      setStatus(`Compressing page ${pageNumber} of ${pdf.numPages}…`, Math.round(((pageNumber - 1) / pdf.numPages) * 100));

      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.45 });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: context, viewport }).promise;
      const imageData = canvas.toDataURL("image/jpeg", 0.66);
      const pageWidth = viewport.width * 72 / 96;
      const pageHeight = viewport.height * 72 / 96;

      if (!outputPdf) {
        outputPdf = new window.jspdf.jsPDF({
          orientation: pageWidth > pageHeight ? "landscape" : "portrait",
          unit: "pt",
          format: [pageWidth, pageHeight],
          compress: true
        });
      } else {
        outputPdf.addPage([pageWidth, pageHeight], pageWidth > pageHeight ? "landscape" : "portrait");
      }

      outputPdf.addImage(imageData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "MEDIUM");
      page.cleanup();
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (!outputPdf) throw new Error("No pages were found in this PDF.");
    const outputBlob = outputPdf.output("blob");
    await pdf.destroy();
    return outputBlob;
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

fileInput.addEventListener("change", (event) => {
  acceptFile(event.target.files?.[0]);
});

removeButton.addEventListener("click", resetFile);

for (const eventName of ["dragenter", "dragover"]) {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("is-dragging");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragging");
  });
}

dropzone.addEventListener("drop", (event) => {
  const file = event.dataTransfer?.files?.[0];
  acceptFile(file);
});

compressButton.addEventListener("click", async () => {
  if (!selectedFile || compressButton.disabled) return;

  compressButton.disabled = true;
  clearResult();
  setStatus("Preparing your PDF…", 5);

  try {
    const mode = getSelectedMode();
    const outputBlob = mode === "maximum"
      ? await maximumCompress(selectedFile)
      : await preserveText(selectedFile);

    showResult(outputBlob, mode);
  } catch (error) {
    console.error("PDF compression failed:", error);
    setStatus(error instanceof Error ? error.message : "Could not compress this PDF. Try another file.");
  } finally {
    compressButton.disabled = !selectedFile;
  }
});

window.addEventListener("beforeunload", () => {
  if (outputUrl) URL.revokeObjectURL(outputUrl);
});