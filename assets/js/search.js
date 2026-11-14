// বাংলা: টুলের নাম, বিবরণ ও ক্যাটাগরি দিয়ে তাৎক্ষণিক সার্চ।

function normalizeText(value) {
  return String(value || "")
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .trim();
}

export function initToolSearch() {
  if (typeof document === "undefined") return;
  const searchInputs = document.querySelectorAll("[data-tool-search]");
  const toolCards = Array.from(document.querySelectorAll("[data-tool-card]"));
  const emptyStates = document.querySelectorAll("[data-search-empty]");
  const countTargets = document.querySelectorAll("[data-search-count]");
  const categoryFilters = document.querySelectorAll("[data-category-filter]");
  const toolsSection = document.getElementById("tools");
  let activeCategory = "";
  let hasScrolledForSearch = false;

  if (!toolCards.length) {
    console.warn("NoeloTools: search initialised without tool cards.");
    return;
  }

  const filterTools = (query) => {
    const normalizedQuery = normalizeText(query);
    let visibleCount = 0;

    toolCards.forEach((card) => {
      const searchableText = normalizeText([
        card.dataset.name,
        card.dataset.category,
        card.dataset.description,
        card.textContent
      ].join(" "));

      const category = normalizeText(card.dataset.category).replace(/\\s+/g, "-");
      const matchesCategory = !activeCategory || category === activeCategory;
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matches = matchesCategory && matchesQuery;
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    emptyStates.forEach((emptyState) => {
      emptyState.hidden = visibleCount !== 0;
    });

    countTargets.forEach((target) => {
      target.textContent = String(visibleCount);
    });
  };

  categoryFilters.forEach((filter) => {
    if (filter.classList.contains("orbit-card")) {
      filter.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          if (event.target.closest(".orbit-tool-link")) return;
          event.preventDefault();
          filter.click();
        }
      });
    }
    filter.addEventListener("click", (event) => {
      if (filter.getAttribute("aria-disabled") === "true") {
        event.preventDefault();
        return;
      }
      if (event.target.closest(".orbit-tool-link")) return;
      activeCategory = filter.dataset.categoryFilter || "";
      filterTools(document.querySelector("[data-tool-search]")?.value || "");
      if (filter.classList.contains("orbit-card")) {
        toolsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.location.hash !== "#tools") history.replaceState(null, "", "#tools");
      }
    });
  });

  searchInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const query = input.value;
      // A new search always searches every category, not the previously selected one.
      activeCategory = "";
      filterTools(query);
      searchInputs.forEach((otherInput) => {
        if (otherInput !== input) otherInput.value = query;
      });

      // Results live in the All tools section, below the hero and category carousel.
      // Bring them into view once when a user starts a search.
      if (query.trim() && !hasScrolledForSearch) {
        toolsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.location.hash !== "#tools") history.replaceState(null, "", "#tools");
        hasScrolledForSearch = true;
      } else if (!query.trim()) {
        hasScrolledForSearch = false;
      }
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        activeCategory = "";
        hasScrolledForSearch = false;
        filterTools("");
        searchInputs.forEach((otherInput) => {
          if (otherInput !== input) otherInput.value = "";
        });
      }
    });
  });

  // Ensure the initial catalogue count and visibility are in sync.
  filterTools(searchInputs[0]?.value || "");
}
