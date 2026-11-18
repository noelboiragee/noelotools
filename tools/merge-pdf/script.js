// এই স্ক্রিপ্টে PDF ফাইল নির্বাচন, সাজানো, মার্জ এবং ডাউনলোড নিয়ন্ত্রণ করা হয়েছে।
const fileInput = document.querySelector("#pdf-files");
const dropZone = document.querySelector("#drop-zone");
const fileList = document.querySelector("#file-list");
const fileCount = document.querySelector("#file-count");
const clearButton = document.querySelector("#clear-files");
const mergeButton = document.querySelector("#merge-button");
const statusMessage = document.querySelector("#status-message");
const selectedFiles = [];

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function setStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = type ? `is-${type}` : "";
}

function addFiles(fileCollection) {
  const incoming = Array.from(fileCollection);
  let rejected = 0;
  incoming.forEach((file) => {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf || selectedFiles.some((item) => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified)) {
      rejected += 1;
      return;
    }
    selectedFiles.push(file);
  });
  renderFiles();
  if (rejected) setStatus(`${rejected} unsupported or duplicate file(s) skipped.`, "error");
  else if (selectedFiles.length >= 2) setStatus("Files are ready. Arrange the order, then merge.");
  else setStatus("Add at least one more PDF file.");
}

function moveFile(index, direction) {
  const target = index + direction;
  if (target < 0 || target >= selectedFiles.length) return;
  [selectedFiles[index], selectedFiles[target]] = [selectedFiles[target], selectedFiles[index]];
  renderFiles();
  setStatus("File order updated.");
}

function renderFiles() {
  fileCount.textContent = `${selectedFiles.length} ${selectedFiles.length === 1 ? "file added" : "files added"}`;
  clearButton.disabled = selectedFiles.length === 0;
  mergeButton.disabled = selectedFiles.length < 2;
  if (!selectedFiles.length) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    const badge = document.createElement("span");
    badge.className = "empty-file-icon";
    badge.textContent = "PDF";
    badge.setAttribute("aria-hidden", "true");
    const title = document.createElement("strong");
    title.textContent = "Your files will appear here";
    const hint = document.createElement("span");
    hint.textContent = "Add two or more PDFs to create your combined document.";
    empty.append(badge, title, hint);
    fileList.replaceChildren(empty);
    return;
  }

  fileList.replaceChildren();
  selectedFiles.forEach((file, index) => {
    const item = document.createElement("li");
    item.className = "file-item";

    const badge = document.createElement("span");
    badge.className = "file-badge";
    badge.textContent = "PDF";

    const details = document.createElement("span");
    details.className = "file-details";
    const name = document.createElement("span");
    name.className = "file-name";
    name.textContent = file.name;
    const size = document.createElement("span");
    size.className = "file-size";
    size.textContent = formatFileSize(file.size);
    details.append(name, size);

    const order = document.createElement("span");
    order.className = "file-order";
    order.textContent = `File ${index + 1}`;

    const controls = document.createElement("span");
    controls.className = "file-move-controls";
    const up = document.createElement("button");
    up.type = "button";
    up.className = "file-move";
    up.textContent = "↑";
    up.setAttribute("aria-label", `Move ${file.name} up`);
    up.disabled = index === 0;
    up.addEventListener("click", () => moveFile(index, -1));
    const down = document.createElement("button");
    down.type = "button";
    down.className = "file-move";
    down.textContent = "↓";
    down.setAttribute("aria-label", `Move ${file.name} down`);
    down.disabled = index === selectedFiles.length - 1;
    down.addEventListener("click", () => moveFile(index, 1));
    controls.append(up, down);

    item.append(badge, details, order, controls);
    fileList.append(item);
  });
}

async function mergePdfs() {
  if (selectedFiles.length < 2 || mergeButton.disabled) return;
  if (!window.PDFLib) {
    setStatus("The PDF library could not load. Check your internet connection and refresh the page.", "error");
    return;
  }

  mergeButton.disabled = true;
  clearButton.disabled = true;
  mergeButton.innerHTML = "<span aria-hidden=\"true\">…</span> Merging PDFs";
  setStatus("Combining PDF files. Please keep this page open.");
  try {
    const mergedPdf = await window.PDFLib.PDFDocument.create();
    for (const file of selectedFiles) {
      const bytes = await file.arrayBuffer();
      const sourcePdf = await window.PDFLib.PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "merged-document.pdf";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Your merged PDF is ready. The download has started.", "success");
  } catch (error) {
    console.error("PDF merge failed:", error);
    setStatus("Could not merge these files. A PDF may be damaged, encrypted or unsupported.", "error");
  } finally {
    mergeButton.disabled = selectedFiles.length < 2;
    clearButton.disabled = selectedFiles.length === 0;
    mergeButton.replaceChildren();
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "⇩";
    mergeButton.append(icon, document.createTextNode(" Merge & download PDF"));
  }
}

fileInput.addEventListener("change", (event) => {
  addFiles(event.target.files);
  fileInput.value = "";
});
clearButton.addEventListener("click", () => {
  selectedFiles.length = 0;
  renderFiles();
  setStatus("All selected files have been cleared.");
});
mergeButton.addEventListener("click", mergePdfs);

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  });
});
["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  });
});
dropZone.addEventListener("drop", (event) => addFiles(event.dataTransfer.files));

const yearElement = document.querySelector("[data-current-year]");
if (yearElement) yearElement.textContent = new Date().getFullYear().toString();
