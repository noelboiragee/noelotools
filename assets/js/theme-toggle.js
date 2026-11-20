// বাংলা: লাইট ও ডার্ক থিম পরিবর্তন, সংরক্ষণ এবং দৃশ্যমান আইকন নিয়ন্ত্রণ।
const THEME_KEY = "noelotools-theme";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";
const SVG_NS = "http://www.w3.org/2000/svg";

function createThemeIcon(isDark) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", isDark
    ? "M12 3v2m0 14v2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42M3 12h2m14 0h2M5.64 18.36l1.42-1.42m9.88-9.88 1.42-1.42M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
    : "M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z");
  svg.append(path);
  return svg;
}

function ensureThemeIcon(toggle, isDark) {
  let icon = toggle.querySelector(".theme-toggle-icon");
  if (!icon) {
    icon = document.createElement("span");
    icon.className = "theme-toggle-icon";
    icon.setAttribute("aria-hidden", "true");
    toggle.prepend(icon);
  }
  icon.replaceChildren(createThemeIcon(isDark));
  const label = isDark ? "Light mode" : "Dark mode";
  let text = toggle.querySelector("[data-theme-label]");
  if (!text) {
    text = document.createElement("span");
    text.setAttribute("data-theme-label", "");
    toggle.append(text);
  }
  text.textContent = label;
}

function applyTheme(theme) {
  const selectedTheme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  document.documentElement.dataset.theme = selectedTheme;
  document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
    const isDark = selectedTheme === THEME_DARK;
    toggle.classList.add("theme-toggle");
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    toggle.title = isDark ? "Switch to light theme" : "Switch to dark theme";
    ensureThemeIcon(toggle, isDark);
  });
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === THEME_DARK || savedTheme === THEME_LIGHT) return savedTheme;
  } catch (error) {
    // Storage unavailable: use the default light theme.
  }
  return THEME_LIGHT;
}

export function initThemeToggle() {
  if (typeof document === "undefined" || !document.documentElement) return;
  applyTheme(getInitialTheme());
  document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === THEME_DARK
        ? THEME_LIGHT : THEME_DARK;
      applyTheme(nextTheme);
      try {
        localStorage.setItem(THEME_KEY, nextTheme);
      } catch (error) {
        // Theme still changes for the current page session.
      }
    });
  });
}
