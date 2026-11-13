// বাংলা: টুলের নাম, বিবরণ ও ক্যাটাগরি দিয়ে তাৎক্ষণিক সার্চ।

function normalizeText(value) {
  return String(value || "")
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function initToolSearch() {
  if (!document) return;
  const searchInputs = document.querySelectorAll("[data-tool-search]");
  const toolCards = Array.from(document.querySelectorAll("[data-tool-card]"));
  const emptyStates = document.querySelectorAll("[data-search-empty]");
  const countTargets = document.querySelectorAll("[data-search-count]");
  const categoryFilters = document.querySelectorAll("[data-category-filter]");
  let activeCategory = "";

  if (!toolCards.length) return;

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
    filter.addEventListener("click", () => {
      activeCategory = filter.dataset.categoryFilter || "";
      filterTools(document.querySelector("[data-tool-search]")?.value || "");
    });
  });

  searchInputs.forEach((input) => {
    input.addEventListener("input", () => {
      filterTools(input.value);
      searchInputs.forEach((otherInput) => {
        if (otherInput !== input) otherInput.value = input.value;
      });
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        filterTools("");
      }
    });
  });
}
