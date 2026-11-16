// বাংলা: প্রতিটি Tool Page-এর Header থেকে সব টুল খোঁজার সুবিধা তৈরি করে।
function normalize(value) {
  return String(value || "")
    .toLocaleLowerCase()
    .normalize("NFKC")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function initToolPageSearch() {
  if (!window.location.pathname.includes("/tools/")) return;
  const header = document.querySelector("[data-site-header]");
  const actions = header?.querySelector(".header-actions");
  if (!header || !actions || header.querySelector("[data-tool-page-search]")) return;

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = new URL("../css/tool-page-search.css", import.meta.url).href;
  document.head.append(stylesheet);

  const toggle = document.createElement("button");
  toggle.className = "tool-search-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-label", "Search tools");
  toggle.setAttribute("aria-expanded", "false");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "10.8");
  circle.setAttribute("cy", "10.8");
  circle.setAttribute("r", "6.8");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "m16 16 5 5");
  svg.append(circle, path);
  const toggleText = document.createElement("span");
  toggleText.textContent = "Search";
  toggle.append(svg, toggleText);

  const panel = document.createElement("section");
  panel.className = "tool-page-search";
  panel.dataset.toolPageSearch = "";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Search all tools");

  const label = document.createElement("label");
  label.className = "sr-only";
  label.htmlFor = "tool-page-search-input";
  label.textContent = "Search all tools";

  const input = document.createElement("input");
  input.id = "tool-page-search-input";
  input.type = "search";
  input.placeholder = "Search any tool…";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");
  input.setAttribute("aria-controls", "tool-page-search-results");

  const results = document.createElement("div");
  results.className = "tool-page-search-results";
  results.id = "tool-page-search-results";
  results.setAttribute("role", "listbox");
  results.setAttribute("aria-label", "Tool search results");

  const hint = document.createElement("p");
  hint.className = "tool-page-search-hint";
  hint.textContent = "Search by tool name or keyword";
  panel.append(label, input, results, hint);
  actions.prepend(toggle);
  header.append(panel);

  let tools = [];
  try {
    const response = await fetch(new URL("../data/tools.json", import.meta.url), { cache: "no-cache" });
    if (!response.ok) throw new Error("Tool catalogue could not be loaded.");
    tools = (await response.json()).filter((tool) => tool.status === "available" && tool.url);
  } catch (error) {
    const message = document.createElement("p");
    message.className = "tool-page-search-empty";
    message.textContent = "Search is temporarily unavailable. Please try again.";
    results.replaceChildren(message);
    console.error("NoeloTools: tool page search could not load.", error);
  }

  function render(query) {
    const term = normalize(query);
    results.replaceChildren();
    if (!term) {
      input.setAttribute("aria-expanded", "false");
      return;
    }
    const matches = tools.filter((tool) =>
      normalize([tool.name, tool.description, tool.category, ...(tool.keywords || [])].join(" ")).includes(term)
    ).slice(0, 8);

    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "tool-page-search-empty";
      empty.textContent = "No matching tools found. Try another keyword.";
      results.append(empty);
    } else {
      matches.forEach((tool, index) => {
        const link = document.createElement("a");
        link.className = "tool-page-search-result";
        link.href = tool.url;
        link.setAttribute("role", "option");
        link.setAttribute("aria-selected", "false");
        const icon = document.createElement("span");
        icon.className = "tool-page-search-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = tool.icon || "✦";
        const copy = document.createElement("span");
        copy.className = "tool-page-search-copy";
        const name = document.createElement("strong");
        name.textContent = tool.name;
        const category = document.createElement("small");
        category.textContent = tool.category || "Tool";
        copy.append(name, category);
        const arrow = document.createElement("span");
        arrow.className = "tool-page-search-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        link.append(icon, copy, arrow);
        link.dataset.resultIndex = String(index);
        results.append(link);
      });
    }
    input.setAttribute("aria-expanded", "true");
  }

  function close() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const open = !panel.hidden;
    panel.hidden = open;
    toggle.setAttribute("aria-expanded", String(!open));
    if (!open) input.focus();
  });
  input.addEventListener("input", () => render(input.value));
  input.addEventListener("keydown", (event) => {
    const links = [...results.querySelectorAll("a")];
    const current = links.findIndex((link) => link.getAttribute("aria-selected") === "true");
    if (event.key === "ArrowDown" && links.length) {
      event.preventDefault();
      const next = (current + 1) % links.length;
      links.forEach((link, index) => link.setAttribute("aria-selected", String(index === next)));
    } else if (event.key === "ArrowUp" && links.length) {
      event.preventDefault();
      const next = current <= 0 ? links.length - 1 : current - 1;
      links.forEach((link, index) => link.setAttribute("aria-selected", String(index === next)));
    } else if (event.key === "Enter" && links.length) {
      event.preventDefault();
      links[current >= 0 ? current : 0].click();
    } else if (event.key === "Escape") {
      input.value = "";
      results.replaceChildren();
      close();
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!panel.contains(event.target) && !toggle.contains(event.target)) close();
  });
}
