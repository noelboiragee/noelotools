// বাংলা: লাইট ও ডার্ক থিম পরিবর্তন এবং পছন্দ সংরক্ষণের নিয়ন্ত্রণ।

const THEME_KEY = "noelotools-theme";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";

function applyTheme(theme) {
  const selectedTheme = theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
  document.documentElement.dataset.theme = selectedTheme;

  const toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    const isDark = selectedTheme === THEME_DARK;
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    toggle.title = isDark ? "Switch to light theme" : "Switch to dark theme";
  }
}

function getInitialTheme() {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === THEME_DARK || savedTheme === THEME_LIGHT) return savedTheme;
  } catch (error) {
    // বাংলা: ব্রাউজার স্টোরেজ বন্ধ থাকলেও থিম চালু থাকবে।
  }

  return THEME_LIGHT;
}

export function initThemeToggle() {
  if (typeof document === "undefined" || !document.documentElement) return;
  applyTheme(getInitialTheme());

  document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === THEME_DARK
          ? THEME_LIGHT
          : THEME_DARK;

      applyTheme(nextTheme);
      try {
        localStorage.setItem(THEME_KEY, nextTheme);
      } catch (error) {
        // বাংলা: স্টোরেজে সংরক্ষণ সম্ভব না হলেও বর্তমান সেশনে থিম বদলাবে।
      }
    });
  });
}
