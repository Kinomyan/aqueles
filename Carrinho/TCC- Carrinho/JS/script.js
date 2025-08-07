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


let quantity = 4;
const pricePerItem = 399.92;
let discountValue = 0;

function updateQuantity(change) {
  quantity = Math.max(1, quantity + change);
  document.getElementById("quantity").innerText = quantity;

  const newTotal = (pricePerItem * quantity);
  document.getElementById("total-price").innerText = newTotal.toFixed(2).replace('.', ',');

  updateSummary(newTotal);
}

function updateSummary(subtotal) {
  const discount = discountValue;
  const frete = 0;
  const total = subtotal - discount + frete;

  document.getElementById("subtotal").innerText = `R$${subtotal.toFixed(2).replace('.', ',')}`;
  document.getElementById("discount").innerText = `-R$${discount.toFixed(2).replace('.', ',')}`;
  document.getElementById("frete").innerText = `R$${frete.toFixed(2).replace('.', ',')}`;
  document.getElementById("total").innerText = `R$${total.toFixed(2).replace('.', ',')}`;
}

function applyDiscount() {
  const coupon = document.getElementById("coupon").value.trim().toLowerCase();
  if (coupon === "desconto10") {
    discountValue = 100.00;
    alert("Cupom válido: R$100 de desconto!");
  } else {
    discountValue = 0;
    alert("Cupom inválido!");
  }
  updateSummary(quantity * pricePerItem);
}

function removeItem() {
  alert("Produto removido! (simulação)");
}
