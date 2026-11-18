// বাংলা: প্রতিটি টুলের শিরোনামের পাশে আলাদা, হালকা SVG আইকন দেখানো হয়।
const TOOL_ICON_PATHS = {
  "merge-pdf": '<path d="M8 3h8l5 5v13H8z"/><path d="M16 3v5h5M4 7v14h12M11 12h6M11 16h6"/>',
  "compress-pdf": '<path d="M8 3h8l5 5v13H8z"/><path d="M16 3v5h5M4 8v4m-2-2 2 2 2-2M4 20v-4m-2 2 2-2 2 2"/>',
  "loan-calculator": '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h2m4 0h2M8 15h2m4 0h2M8 18h8"/>',
  "vat-calculator": '<path d="M5 4h14v16H5z"/><path d="M8 8h2m4 0h2M8 16l8-8M8 12h.01M16 16h.01"/>',
  "europe-salary-calculator": '<circle cx="12" cy="12" r="9"/><path d="M16 8.5a5 5 0 1 0 0 7M7 10h7m-7 4h7"/>',
  "currency-converter": '<path d="M7 7h13l-3-3m3 3-3 3M17 17H4l3 3m-3-3 3-3"/><path d="M12 9v6m2-4c0-1-4-1-4 0s4 1 4 2-4 1-4 0"/>',
  "bmi-calculator": '<path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11z"/><path d="M8 12h2l1-2 2 4 1-2h2"/>',
  "word-counter": '<path d="M4 5h16M4 10h16M4 15h10M4 20h7"/><path d="m17 15 3 5 3-5"/>',
  "qr-generator": '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zm5 0h2m-7 5h3m2-2v4"/>',
  "password-generator": '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
  "percentage-calculator": '<circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="m19 5-14 14"/>',
  "unit-converter": '<path d="M4 7h16M4 17h16M7 4 4 7l3 3m10 4 3 3-3 3"/>',
  "age-calculator": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-12 4h.01M12 14h.01M16 14h.01M8 18h.01"/>',
  "date-difference-calculator": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M8 14h3m2 0h3m-8 3h3"/>',
  "json-formatter": '<path d="M8 4H6a2 2 0 0 0-2 2v3a3 3 0 0 1-2 3 3 3 0 0 1 2 3v3a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v3a3 3 0 0 0 2 3 3 3 0 0 0-2 3v3a2 2 0 0 1-2 2h-2M10 9l-2 3 2 3m4-6 2 3-2 3"/>',
  "base64-encoder-decoder": '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="11" cy="18" r="1"/>',
  "text-case-converter": '<path d="M4 19 10 5l6 14M6.5 14h7M15 19l3-7 3 7m-5-2h4"/>',
  "image-compressor": '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20m8-4 2 2"/>',
  "image-resizer": '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 4V2m6 0v2M4 9H2m0 6h2m16-6h2m-2 6h2M9 20v2m6-2v2"/>',
  "iban-validator": '<path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="m8 12 3 3 5-6"/>',
  "stopwatch": '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6m-3 0v3m6 1 2-2"/>',
  "random-number-generator": '<path d="M4 7h3c5 0 5 10 10 10h3m-3-3 3 3-3 3M4 17h3c2 0 3-2 4-4s2-4 4-4h5m-3-3 3 3-3 3"/>',
  "color-picker": '<path d="m12 3 8 8-9 9a5.5 5.5 0 0 1-8-8z"/><path d="m7 8 8 8M5 19h.01"/>',
  "typing-speed-test": '<path d="M4 7h16M4 12h16M4 17h10"/><path d="m17 15 2 2 4-5"/>',
  "unit-price-calculator": '<path d="M4 5h16v14H4z"/><path d="M8 9h8m-8 4h3m3 0h2m-8 3h8"/>',
  "sales-tax-calculator": '<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 16l8-8M8 12h.01M16 16h.01"/>',
  "time-zone-converter": '<circle cx="12" cy="12" r="9"/><path d="M12 3v18m-9-9h18M5.6 5.6c3 2 9.8 2 12.8 0M5.6 18.4c3-2 9.8-2 12.8 0"/>',
  "scientific-calculator": '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7 7h10M7 12h2m3 0h2m3 0h.01M7 16h2m3 0h2m3 0h.01"/>',
  "pdf-table-to-excel": '<path d="M4 3h11l5 5v13H4z"/><path d="M15 3v5h5M7 12h10M7 16h10M11 12v8m4-8v8"/>'
};

function createToolIcon(pathData) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "tool-title-icon");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  const template = document.createElement("template");
  template.innerHTML = "";
  // SVG path data is a fixed, developer-authored constant; no user content is parsed.
  const wrapper = document.createElementNS(svgNS, "g");
  const parser = new DOMParser();
  const parsed = parser.parseFromString("<svg xmlns=\"" + svgNS + "\">" + pathData + "</svg>", "image/svg+xml");
  for (const node of Array.from(parsed.documentElement.children)) {
    wrapper.appendChild(document.importNode(node, true));
  }
  svg.appendChild(wrapper);
  return svg;
}

async function initToolTitleIcons() {
  const heading = document.querySelector(".tool-intro h1, .page-heading h1");
  if (!heading) return;
  const path = window.location.pathname.replace(/\/$/, "");
  const toolId = path.split("/").pop();
  const icon = TOOL_ICON_PATHS[toolId];
  if (!icon || heading.querySelector(".tool-title-icon")) return;
  heading.classList.add("tool-title-with-icon");
  heading.prepend(createToolIcon(icon));
}

export { initToolTitleIcons };
