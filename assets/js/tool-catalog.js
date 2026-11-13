// বাংলা: tools.json থেকে জনপ্রিয় ও সম্পূর্ণ টুল তালিকা তৈরি করা হয়।
const iconLabels = {
  "file-plus-2": "PDF+", "file-archive": "PDF↓", calculator: "€",
  receipt: "%", globe: "EU", "arrow-left-right": "↔",
  "heart-pulse": "♡", text: "Aa", "qr-code": "▦", "key-round": "⌑", stopwatch: "◷", "dice-5": "⚄", palette: "◉"
};

function createToolCard(tool, popular = false) {
  const card = document.createElement("a");
  card.className = popular ? "tool-card popular-tool-card" : "tool-card";
  card.href = tool.url;
  card.dataset.name = tool.name;
  card.dataset.category = tool.category;
  card.dataset.description = [tool.description, ...(tool.keywords || [])].join(" ");
  if (!popular) card.dataset.toolCard = "";

  const icon = document.createElement("span");
  icon.className = "tool-card-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = iconLabels[tool.icon] || "✦";

  const title = document.createElement("span");
  title.className = "tool-card-title";
  title.textContent = tool.name;

  const description = document.createElement("span");
  description.className = "tool-card-description";
  description.textContent = tool.description;

  card.append(icon, title, description);
  return card;
}

export async function initToolCatalog() {
  const allContainer = document.querySelector("[data-all-tools]");
  const popularContainer = document.querySelector("[data-popular-tools]");
  if (!allContainer || !popularContainer) return false;

  try {
    const response = await fetch("/noelotools/assets/data/tools.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Tool catalogue request failed: ${response.status}`);
    const tools = await response.json();
    const availableTools = tools.filter((tool) => tool.status === "available");

    popularContainer.replaceChildren(...availableTools.slice(0, 6).map((tool) => createToolCard(tool, true)));
    allContainer.replaceChildren(...availableTools.map((tool) => createToolCard(tool)));

    document.querySelectorAll("[data-total-tools]").forEach((element) => {
      element.textContent = String(availableTools.length);
    });
    document.querySelectorAll("[data-popular-count]").forEach((element) => {
      element.textContent = String(Math.min(6, availableTools.length));
    });
    return true;
  } catch (error) {
    console.error("NoeloTools: could not load the tool catalogue.", error);
    allContainer.textContent = "The tool list could not be loaded. Please refresh the page.";
    popularContainer.replaceChildren();
    return false;
  }
}
