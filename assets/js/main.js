// বাংলা: প্রতিটি সাধারণ ফিচার আলাদাভাবে চালু হবে, যাতে একটি ত্রুটি অন্য ফিচার বন্ধ না করে।
import { initThemeToggle } from "./theme-toggle.js";
import { initToolSearch } from "./search.js";
import { initCookieConsent } from "./cookie-consent.js";
import { initToolCatalog } from "./tool-catalog.js";

function initCategoryTheme() {
  const categoryLink = document.querySelector('.breadcrumbs a[href*="#categories"]');
  if (!categoryLink) return;
  const categoryName = categoryLink.textContent.trim().toLowerCase();
  const categoryMap = {
    "pdf": "pdf",
    "money tax": "money-tax",
    "media": "media",
    "developer": "developer",
    "writing": "writing",
    "health": "health",
    "math": "math",
    "everyday": "everyday"
  };
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

function initMobileNavigation() {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-primary-nav]");
  if (!menuButton || !navigation) return;
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });
  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }));
  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
      menuButton.setAttribute("aria-expanded", "false");
      navigation.classList.remove("is-open");
    }
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
  safelyInit("category theme", initCategoryTheme);\n  safelyInit("theme toggle", initThemeToggle);
  initToolCatalog().finally(() => safelyInit("tool search", initToolSearch));
  safelyInit("cookie consent", initCookieConsent);
  safelyInit("mobile navigation", initMobileNavigation);
  safelyInit("sticky header", initStickyHeader);
  safelyInit("current year", initCurrentYear);
});
