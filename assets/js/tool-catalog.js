// বাংলা: tools.json থেকে টুল, Orbit Card ও Category তালিকা স্বয়ংক্রিয়ভাবে তৈরি হয়।
import { createToolIconForId } from "./tool-title-icons.js";

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

  const icon = createToolIconForId(tool.id, "tool-card-icon-svg");
  if (!icon) {
    const fallbackIcon = document.createElement("span");
    fallbackIcon.className = "tool-card-icon";
    fallbackIcon.setAttribute("aria-hidden", "true");
    fallbackIcon.textContent = iconLabels[tool.icon] || "✦";
    card.append(fallbackIcon);
  }

  const title = document.createElement("span");
  title.className = "tool-card-title";
  title.textContent = tool.name;

  const description = document.createElement("span");
  description.className = "tool-card-description";
  description.textContent = tool.description;

  if (icon) card.append(icon);
  card.append(title, description);
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

function createCategoryIcon(slug) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const addPath = (d, fill = "none", stroke = "currentColor", width = "4") => {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", fill);
    path.setAttribute("stroke", stroke);
    path.setAttribute("stroke-width", width);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.append(path);
  };

  if (slug === "pdf") {
    addPath("M18 7h19l11 11v39H18z", "none", "currentColor", "4");
    addPath("M37 7v12h11M25 34h16M25 42h16M25 50h10", "none", "currentColor", "3.5");
  } else if (slug === "money-tax") {
    const symbol = document.createElementNS(ns, "text");
    symbol.setAttribute("x", "32");
    symbol.setAttribute("y", "49");
    symbol.setAttribute("text-anchor", "middle");
    symbol.setAttribute("font-size", "48");
    symbol.setAttribute("font-weight", "800");
    symbol.setAttribute("fill", "currentColor");
    symbol.textContent = "€";
    svg.append(symbol);
  } else if (slug === "media") {
    addPath("M9 13h46v38H9zM10 43l13-13 11 10 8-8 12 12", "none", "currentColor", "4");
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", "42");
    circle.setAttribute("cy", "24");
    circle.setAttribute("r", "4");
    circle.setAttribute("fill", "currentColor");
    svg.append(circle);
  } else if (slug === "developer") {
    addPath("M24 18L10 32l14 14M40 18l14 14-14 14M36 13l-8 38", "none", "currentColor", "5");
  } else if (slug === "writing") {
    addPath("M15 46l3-12L43 9a6 6 0 0 1 9 9L27 43zM18 34l9 9M15 46l-2 6 6-2", "none", "currentColor", "4");
  } else if (slug === "health") {
    addPath("M32 53S8 39 8 23a12 12 0 0 1 24-3 12 12 0 0 1 24 3c0 16-24 30-24 30z", "none", "currentColor", "3.5");
    addPath("M15 32h10l5-9 7 17 5-8h7", "none", "currentColor", "3.5");
  } else if (slug === "math") {
    const symbol = document.createElementNS(ns, "text");
    symbol.setAttribute("x", "32");
    symbol.setAttribute("y", "47");
    symbol.setAttribute("text-anchor", "middle");
    symbol.setAttribute("font-size", "48");
    symbol.setAttribute("font-weight", "700");
    symbol.setAttribute("fill", "currentColor");
    symbol.textContent = "∑";
    svg.append(symbol);
  } else {
    addPath("M32 7a25 25 0 1 0 0 50a25 25 0 1 0 0-50z", "none", "currentColor", "3.5");
    addPath("M19 32l9 9 18-19", "none", "currentColor", "5");
  }
  return svg;
}

function createCategoryCard(category) {
  const slug = categorySlug(category);
  const meta = categoryMeta[slug] || {
    title: category,
    description: `Explore ${category} tools`
  };
  const card = document.createElement("a");
  card.className = "category-card";
  card.href = "#tools";
  card.dataset.categoryFilter = slug;

  const icon = document.createElement("span");
  icon.className = `category-card-icon category-icon--${slug}`;
  icon.append(createCategoryIcon(slug));

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
