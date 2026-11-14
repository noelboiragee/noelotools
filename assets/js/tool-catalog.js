// বাংলা: tools.json থেকে টুল, Orbit Card ও Category তালিকা স্বয়ংক্রিয়ভাবে তৈরি হয়।
const iconLabels = {
  "file-plus-2": "PDF+", "file-archive": "PDF↓", calculator: "€",
  receipt: "%", globe: "EU", "arrow-left-right": "↔",
  "heart-pulse": "♡", text: "Aa", "qr-code": "▦", "key-round": "⌑", stopwatch: "◷", "dice-5": "⚄", palette: "◉"
};

const categoryMeta = {
  "pdf": { title: "PDF Tools", icon: "📄", glow: "#ff5d73", description: "Documents and file utilities" },
  "money-tax": { title: "Money & Tax", icon: "💰", glow: "#fbbf24", description: "Calculators for money and tax" },
  "media": { title: "Media", icon: "🖼️", glow: "#38bdf8", description: "Image and media tools" },
  "developer": { title: "Developer", icon: "</>", glow: "#a78bfa", description: "Utilities for developers" },
  "writing": { title: "Writing", icon: "✍️", glow: "#fb7185", description: "Text and writing helpers" },
  "health": { title: "Health", icon: "♡", glow: "#34d399", description: "Everyday health tools" },
  "math": { title: "Math", icon: "∑", glow: "#f97316", description: "Calculators and converters" },
  "everyday": { title: "Everyday", icon: "✦", glow: "#2dd4bf", description: "Small tools for daily life" }
};

function categorySlug(value) {
  return String(value || "").toLowerCase().trim()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createToolCard(tool, popular = false) {
  const card = document.createElement("a");
  card.className = popular ? "tool-card popular-tool-card" : "tool-card";
  card.href = tool.url;
  card.dataset.name = tool.name;
  card.dataset.category = tool.category;
  card.dataset.categoryLabel = categoryMeta[categorySlug(tool.category)]?.title || tool.category;
  card.dataset.description = [tool.description, card.dataset.categoryLabel, ...(tool.keywords || [])].join(" ");
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

function createOrbitCard(category, index, total, categoryTools) {
  const slug = categorySlug(category);
  const meta = categoryMeta[slug] || {
    title: category,
    icon: "✦",
    glow: "#94a3b8",
    description: `Explore ${category} tools`
  };
  const card = document.createElement("div");
  card.className = "orbit-card";
  card.dataset.categoryFilter = slug;
  card.style.setProperty("--i", String(index));
  card.style.setProperty("--glow", meta.glow);
  card.setAttribute("role", "link");
  card.tabIndex = 0;
  card.setAttribute("aria-label", `Browse ${meta.title} tools`);

  const icon = document.createElement("div");
  icon.className = "card-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = meta.icon;

  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = meta.title;

  const links = document.createElement("div");
  links.className = "orbit-tool-links";
  links.dataset.orbitTools = slug;
  categoryTools.slice(0, 3).forEach((tool) => {
    const link = document.createElement("a");
    link.className = "orbit-tool-link";
    link.href = tool.url;
    link.textContent = tool.name;
    link.title = tool.name;
    link.addEventListener("click", (event) => event.stopPropagation());
    links.append(link);
  });

  const count = document.createElement("div");
  count.className = "orbit-tool-count";
  count.dataset.orbitCount = slug;
  count.textContent = `${categoryTools.length} tools available`;
  card.style.setProperty("--orbit-link-count", String(Math.min(categoryTools.length, 3)));
  card.append(icon, title, links, count);
  return card;
}

function createCategoryCard(category) {
  const slug = categorySlug(category);
  const meta = categoryMeta[slug] || {
    title: category,
    icon: "✦",
    description: `Explore ${category} tools`
  };
  const card = document.createElement("a");
  card.className = "category-card";
  card.href = "#tools";
  card.dataset.categoryFilter = slug;

  const icon = document.createElement("span");
  icon.className = "category-card-icon";
  icon.textContent = meta.icon;

  const title = document.createElement("span");
  title.className = "category-card-title";
  title.textContent = meta.title;

  const description = document.createElement("span");
  description.className = "category-card-description";
  description.textContent = meta.description;
  card.append(icon, title, description);
  return card;
}

export async function initToolCatalog() {
  const allContainer = document.querySelector("[data-all-tools]");
  const popularContainer = document.querySelector("[data-popular-tools]");
  if (!allContainer || !popularContainer) return false;

  try {
    // import.meta.url works on both GitHub Pages project paths and a custom domain.
    const catalogUrl = new URL("../data/tools.json", import.meta.url);
    const response = await fetch(catalogUrl, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Tool catalogue request failed: ${response.status}`);
    const tools = await response.json();
    const availableTools = tools.filter((tool) => tool.status === "available");

    const categoryNames = [...new Set(availableTools.map((tool) => tool.category).filter(Boolean))];
    const preferredOrder = ["pdf", "money-tax", "media", "developer", "writing", "health", "math", "everyday"];
    categoryNames.sort((a, b) => {
      const ai = preferredOrder.indexOf(categorySlug(a));
      const bi = preferredOrder.indexOf(categorySlug(b));
      if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
      return a.localeCompare(b);
    });

    const ring = document.querySelector("[data-orbit-ring]");
    if (ring) {
      const cards = categoryNames.map((category, index) => {
        const categoryTools = availableTools.filter((tool) => categorySlug(tool.category) === categorySlug(category));
        return createOrbitCard(category, index, categoryNames.length, categoryTools);
      });
      ring.style.setProperty("--orbit-card-angle", `${360 / Math.max(categoryNames.length, 1)}deg`);
      ring.style.setProperty("--orbit-radius-desktop", `${Math.round(225 * categoryNames.length / 8)}px`);
      ring.style.setProperty("--orbit-radius-mobile", `${Math.round(180 * categoryNames.length / 8)}px`);
      ring.replaceChildren(...cards);
    }

    const categoryGrid = document.querySelector("[data-category-grid]");
    if (categoryGrid) {
      categoryGrid.replaceChildren(...categoryNames.map(createCategoryCard));
    }

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
