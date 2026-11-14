// বাংলা: টুলের নাম, বিবরণ ও ক্যাটাগরি দিয়ে তাৎক্ষণিক সার্চ।

function normalizeText(value) {
  return String(value || "")
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function initToolSearch() {
  if (typeof document === "undefined") return;

  const searchInputs = Array.from(document.querySelectorAll("[data-tool-search]"));
  const toolCards = Array.from(document.querySelectorAll("[data-tool-card]"));
  const emptyStates = document.querySelectorAll("[data-search-empty]");
  const countTargets = document.querySelectorAll("[data-search-count]");
  const categoryFilters = document.querySelectorAll("[data-category-filter]");
  const toolsSection = document.getElementById("tools");
  let activeCategory = "";

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
      const category = normalizeText(card.dataset.category).replace(/\s+/g, "-");
      const matches = (!activeCategory || category === activeCategory)
        && (!normalizedQuery || searchableText.includes(normalizedQuery));

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
      filterTools(searchInputs[0]?.value || "");
      if (filter.classList.contains("orbit-card")) {
        toolsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.location.hash !== "#tools") {
          history.replaceState(null, "", "#tools");
        }
      }
    });
  });

  searchInputs.forEach((input) => {
    input.addEventListener("input", () => {
      // Typing filters results in place. Never scroll the page while the user is typing.
      activeCategory = "";
      filterTools(input.value);

      searchInputs.forEach((otherInput) => {
        if (otherInput !== input && otherInput.value !== input.value) {
          otherInput.value = input.value;
        }
      });
    });

    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        activeCategory = "";
        filterTools("");
        searchInputs.forEach((otherInput) => {
          if (otherInput !== input) otherInput.value = "";
        });
      }
    });
  });

  filterTools(searchInputs[0]?.value || "");
}
