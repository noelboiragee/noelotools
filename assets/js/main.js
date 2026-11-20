// বাংলা: প্রতিটি সাধারণ ফিচার আলাদাভাবে চালু হবে, যাতে একটি ত্রুটি অন্য ফিচার বন্ধ না করে।
import { initThemeToggle } from "./theme-toggle.js";
import { initToolSearch } from "./search.js";
import { initCookieConsent } from "./cookie-consent.js";
import { initToolCatalog } from "./tool-catalog.js";
import { initToolPageSearch } from "./tool-page-search.js";
import { initToolTitleIcons } from "./tool-title-icons.js";

function initCategoryTheme() {
  const categoryMap = {
    "pdf": "pdf", "money & tax": "money-tax", "money tax": "money-tax",
    "media": "media", "developer": "developer", "writing": "writing",
    "writing tool": "writing", "health": "health", "health & wellness": "health",
    "math": "math", "everyday": "everyday", "everyday tools": "everyday",
    "security tools": "developer"
  };
  const categoryLink = document.querySelector('.breadcrumbs a[href*="#categories"]');
  const eyebrow = document.querySelector(".tool-intro .eyebrow, .page-heading .eyebrow");
  const categoryName = (categoryLink?.textContent || eyebrow?.textContent || "").trim().toLowerCase();
  const category = categoryMap[categoryName];
  if (!category) return;
  document.body.dataset.category = category;
  if (!document.querySelector('link[href*="category-themes.css"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/noelotools/assets/css/category-themes.css";
    document.head.appendChild(stylesheet);
  }
}

function createMenuIcon(isOpen) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", isOpen ? "M6 6l12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16");
  svg.append(path);
  return svg;
}

function setMenuState(button, navigation, isOpen) {
  button.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  button.title = isOpen ? "Close menu" : "Open menu";
  button.replaceChildren(createMenuIcon(isOpen));
  navigation.classList.toggle("is-open", isOpen);
}

function initMobileNavigation() {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-primary-nav]");
  if (!menuButton || !navigation) return;
  menuButton.classList.add("menu-toggle");
  setMenuState(menuButton, navigation, false);
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    setMenuState(menuButton, navigation, !isOpen);
  });
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    setMenuState(menuButton, navigation, false);
  }));
  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
      setMenuState(menuButton, navigation, false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuState(menuButton, navigation, false);
  });
}

function initStickyHeader() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initCurrentYear() {
  document.querySelectorAll("[data-current-year], #current-year").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

function safelyInit(name, initializer) {
  try { initializer(); }
  catch (error) { console.error(`NoeloTools: ${name} could not initialise.`, error); }
}

document.addEventListener("DOMContentLoaded", () => {
  safelyInit("category theme", initCategoryTheme);
  safelyInit("theme toggle", initThemeToggle);
  initToolCatalog().finally(() => safelyInit("tool search", initToolSearch));
  safelyInit("tool page search", () => { void initToolPageSearch(); });
  safelyInit("tool title icons", () => { void initToolTitleIcons(); });
  safelyInit("cookie consent", initCookieConsent);
  safelyInit("mobile navigation", initMobileNavigation);
  safelyInit("sticky header", initStickyHeader);
  safelyInit("current year", initCurrentYear);
});
