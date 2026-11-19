// Central site URL configuration for canonical and structured metadata.
// When the custom domain is live, update SITE_BASE_URL here only.
(() => {
  "use strict";

  const SITE_BASE_URL = "https://noelboiragee.github.io/noelotools";
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) return;

  const currentCanonical = new URL(canonicalLink.href);
  const toolPath = currentCanonical.pathname.match(/\/tools\/[^?#]+/)?.[0];
  if (!toolPath) return;

  const previousBase = currentCanonical.origin + currentCanonical.pathname.slice(0, currentCanonical.pathname.indexOf(toolPath));
  const canonicalUrl = SITE_BASE_URL.replace(/\/$/, "") + toolPath;

  canonicalLink.href = canonicalUrl;
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);

  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    script.textContent = script.textContent.replaceAll(previousBase, SITE_BASE_URL.replace(/\/$/, ""));
  });
})();