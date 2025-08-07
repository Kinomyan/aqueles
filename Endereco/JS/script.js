// HEADER HEADER HEADER HEADER HEADER HEADER
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
const inputsBusca = [
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

inputsBusca.forEach(({ input, results }) => {
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


// HEADER HEADER HEADER HEADER HEADER HEADER

// MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN

const formEndereco = document.getElementById("formEndereco");
const btnEditar = document.querySelector(".btn-editar");
const btnSalvar = document.querySelector(".btn-salvar");
const inputs = formEndereco.querySelectorAll("input");

// Estado salvo (simulado)
let enderecoSalvo = {};

// Oculta botão "Salvar"
btnSalvar.style.display = "none";

// Ativa edição
btnEditar.addEventListener("click", () => {
  inputs.forEach(input => input.disabled = false);
  btnEditar.style.display = "none";
  btnSalvar.style.display = "block";
});

// Salva e bloqueia inputs
formEndereco.addEventListener("submit", e => {
  e.preventDefault();
  inputs.forEach(input => {
    enderecoSalvo[input.name] = input.value;
    input.disabled = true;
  });
  alert("Endereço salvo com sucesso!");
  btnSalvar.style.display = "none";
  btnEditar.style.display = "block";
});
