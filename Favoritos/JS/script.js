// ==============================
// SIDEBAR MOBILE TOGGLE
// ==============================
const hamburgerBtn = document.getElementById("hamburgerBtn");
const closeSidebar = document.getElementById("closeSidebar");
const mobileSidebar = document.getElementById("mobileSidebar");

if (hamburgerBtn && closeSidebar && mobileSidebar) {
  hamburgerBtn.addEventListener("click", () => {
    mobileSidebar.classList.add("open");
  });

  closeSidebar.addEventListener("click", () => {
    mobileSidebar.classList.remove("open");
  });

  // Fechar menu ao clicar fora
  document.addEventListener("click", (e) => {
    if (
      !mobileSidebar.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      mobileSidebar.classList.remove("open");
    }
  });
}

// ==============================
// AUTOCOMPLETE DE BUSCA
// ==============================
const inputs = [
  {
    input: document.getElementById("searchInput"),
    results: document.getElementById("resultsList"),
  },
  {
    input: document.getElementById("mobileSearchInput"),
    results: document.getElementById("resultsListMobile"),
  }
];

const suggestions = [
  "Camiseta branca",
  "Calça jeans",
  "Vestido floral",
  "Jaqueta de couro",
  "Blusa feminina",
  "Camisa social",
  "Saia midi",
  "Tênis casual",
  "Moletom oversized",
  "Short jeans"
];

inputs.forEach(({ input, results }) => {
  if (!input || !results) return;

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();
    results.innerHTML = "";

    if (!query) {
      results.style.display = "none";
      return;
    }

    const filtered = suggestions.filter(item =>
      item.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      results.style.display = "none";
      return;
    }

    filtered.forEach(result => {
      const li = document.createElement("li");
      li.textContent = result;
      li.addEventListener("click", () => {
        input.value = result;
        results.style.display = "none";
        window.location.href = `/buscar?q=${encodeURIComponent(result)}`;
      });
      results.appendChild(li);
    });

    results.style.display = "block";
  });

  // Fecha a lista se clicar fora
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) {
      results.style.display = "none";
    }
  });
});
