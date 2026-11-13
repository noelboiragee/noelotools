// বাংলা: সম্মতি পাওয়ার আগে অপ্রয়োজনীয় কুকি বা বিজ্ঞাপন চালু করা হবে না।

const CONSENT_KEY = "noelotools-cookie-consent";
const CONSENT_VERSION = 1;

function readConsent() {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function saveConsent(preferences) {
  const record = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: Boolean(preferences.analytics),
    advertising: Boolean(preferences.advertising),
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch (error) {
    // বাংলা: স্টোরেজ অনুপলব্ধ হলে কোনো ঐচ্ছিক স্ক্রিপ্ট চালু করা হবে না।
  }

  applyConsent(record);
  return record;
}

function applyConsent(consent) {
  document.documentElement.dataset.cookieConsent = consent ? "saved" : "unset";

  document.querySelectorAll("[data-consent-category]").forEach((element) => {
    const category = element.dataset.consentCategory;
    const allowed = category === "necessary" || Boolean(consent && consent[category]);
    element.hidden = !allowed;
  });

  document.dispatchEvent(new CustomEvent("noelotools:consentchange", {
    detail: consent || { necessary: true, analytics: false, advertising: false }
  }));
}

export function initCookieConsent() {
  const banner = document.querySelector("[data-cookie-banner]");
  const settings = document.querySelector("[data-cookie-settings]");
  const currentConsent = readConsent();

  applyConsent(currentConsent);

  if (currentConsent) {
    if (banner) banner.hidden = true;
    if (settings) settings.hidden = true;
  } else if (banner) {
    banner.hidden = false;
  }

  document.querySelectorAll("[data-cookie-accept]").forEach((button) => {
    button.addEventListener("click", () => {
      saveConsent({ analytics: true, advertising: true });
      if (banner) banner.hidden = true;
      if (settings) settings.hidden = true;
    });
  });

  document.querySelectorAll("[data-cookie-reject]").forEach((button) => {
    button.addEventListener("click", () => {
      saveConsent({ analytics: false, advertising: false });
      if (banner) banner.hidden = true;
      if (settings) settings.hidden = true;
    });
  });

  document.querySelectorAll("[data-cookie-customise]").forEach((button) => {
    button.addEventListener("click", () => {
      if (settings) settings.hidden = false;
    });
  });

  document.querySelectorAll("[data-cookie-save]").forEach((button) => {
    button.addEventListener("click", () => {
      const analytics = Boolean(document.querySelector("[name='cookie-analytics']")?.checked);
      const advertising = Boolean(document.querySelector("[name='cookie-advertising']")?.checked);
      saveConsent({ analytics, advertising });
      if (banner) banner.hidden = true;
      if (settings) settings.hidden = true;
    });
  });

  document.querySelectorAll("[data-cookie-open-settings]").forEach((button) => {
    button.addEventListener("click", () => {
      if (settings) settings.hidden = false;
      if (banner) banner.hidden = false;
    });
  });
}
