// বাংলা: সার্চ বক্সের নিচে তাৎক্ষণিক ফলাফল দেখায় এবং All Tools তালিকাও ফিল্টার করে।
function normalizeText(value) {
  return String(value || "")
    .toLocaleLowerCase()
    .normalize("NFKC")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function categorySlug(value) {
  return String(value || "").toLowerCase().trim()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function initToolSearch() {
  if (typeof document === "undefined") return;

  const searchInputs = Array.from(document.querySelectorAll("[data-tool-search]"));
  const toolCards = Array.from(document.querySelectorAll("[data-tool-card]"));
  const emptyStates = document.querySelectorAll("[data-search-empty]");
  const countTargets = document.querySelectorAll("[data-search-count]");
  const categoryFilters = document.querySelectorAll("[data-category-filter]");
  const resultPanels = document.querySelectorAll("[data-search-results]");
  let activeCategory = "";

  if (!toolCards.length) {
    console.warn("NoeloTools: search initialised without tool cards.");
    return;
  }

  const getMatches = (query) => {
    const normalizedQuery = normalizeText(query);
    return toolCards.filter((card) => {
      const searchableText = normalizeText([
        card.dataset.name,
        card.dataset.category,
        card.dataset.categoryLabel,
        card.dataset.description,
        card.textContent
      ].join(" "));
      const category = categorySlug(card.dataset.category);
      return (!activeCategory || category === activeCategory)
        && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  };

  const renderSuggestions = (query, matches) => {
    const normalizedQuery = normalizeText(query);
    resultPanels.forEach((panel) => {
      panel.replaceChildren();
      if (!normalizedQuery) {
        panel.hidden = true;
        return;
      }

      const suggestions = matches.slice(0, 7);
      if (!suggestions.length) {
        const empty = document.createElement("p");
        empty.className = "search-result-empty";
        empty.textContent = "No matching tools found. Try another word.";
        panel.append(empty);
      } else {
        suggestions.forEach((card) => {
          const link = document.createElement("a");
          link.className = "search-result";
          link.href = card.href;

          const title = document.createElement("span");
          title.className = "search-result-title";
          title.textContent = card.dataset.name || card.textContent.trim();

          const meta = document.createElement("span");
          meta.className = "search-result-meta";
          meta.textContent = card.dataset.category || "Tool";

          link.append(title, meta);
          panel.append(link);
        });

        if (matches.length > suggestions.length) {
          const more = document.createElement("p");
          more.className = "search-result-more";
          more.textContent = `+${matches.length - suggestions.length} more results shown in All Tools below`;
          panel.append(more);
        }
      }
      panel.hidden = false;
    });
  };

  const filterTools = (query) => {
    const matches = getMatches(query);
    const matchedCards = new Set(matches);

    toolCards.forEach((card) => {
      card.hidden = !matchedCards.has(card);
    });

    emptyStates.forEach((emptyState) => {
      emptyState.hidden = matches.length !== 0;
    });
    countTargets.forEach((target) => {
      target.textContent = String(matches.length);
    });
    renderSuggestions(query, matches);
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
        document.getElementById("tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.location.hash !== "#tools") history.replaceState(null, "", "#tools");
      }
    });
  });

  searchInputs.forEach((input) => {
    const handleSearch = () => {
      activeCategory = "";
      filterTools(input.value);
      searchInputs.forEach((otherInput) => {
        if (otherInput !== input && otherInput.value !== input.value) otherInput.value = input.value;
      });
      searchInputs.forEach((otherInput) => otherInput.setAttribute("aria-expanded", String(Boolean(normalizeText(input.value)))));
    };

    input.addEventListener("input", handleSearch);
    input.addEventListener("search", handleSearch);
    input.addEventListener("compositionend", handleSearch);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        activeCategory = "";
        filterTools("");
        searchInputs.forEach((otherInput) => {
          if (otherInput !== input) otherInput.value = "";
          otherInput.setAttribute("aria-expanded", "false");
        });
      }
    });
  });

  filterTools(searchInputs[0]?.value || "");
}
