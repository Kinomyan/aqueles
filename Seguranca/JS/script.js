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

// Simulação de dados do usuário já cadastrados
const usuarioCadastrado = {
  email: 'usuario@exemplo.com',
  senha: 'senhaSegura123' // Simulado, obviamente em real não guardaria assim
};

// Pegando os formulários
const formEmail = document.getElementById('formSegurancaEmail');
const formSenha = document.getElementById('formSegurancaSenha');

// Inputs de email
const inputEmailAtual = formEmail.emailAtual;
const inputNovoEmail = formEmail.novoEmail;
const inputConfirmarNovoEmail = formEmail.confirmarNovoEmail;

// Inputs de senha
const inputSenhaAtual = formSenha.senhaAtual;
const inputNovaSenha = formSenha.novaSenha;
const inputConfirmarNovaSenha = formSenha.confirmarNovaSenha;

// Preenche o campo de email atual com o email real
inputEmailAtual.value = usuarioCadastrado.email;
inputEmailAtual.disabled = true; // Desabilita edição do email atual

// Preenche o campo de senha atual com asteriscos (não mostra a senha real)
inputSenhaAtual.value = '********';
inputSenhaAtual.disabled = true;

// Controle de mudança de email
formEmail.addEventListener('submit', function(e) {
  e.preventDefault();
  const novoEmail = inputNovoEmail.value.trim();
  const confirmarNovoEmail = inputConfirmarNovoEmail.value.trim();

  if (!novoEmail || !confirmarNovoEmail) {
    alert('Por favor, preencha os dois campos de novo email.');
    return;
  }

  if (novoEmail !== confirmarNovoEmail) {
    alert('Os emails não coincidem!');
    return;
  }

  usuarioCadastrado.email = novoEmail; // Atualiza "no sistema"
  inputEmailAtual.value = usuarioCadastrado.email; // Atualiza campo exibido
  inputNovoEmail.value = '';
  inputConfirmarNovoEmail.value = '';

  alert('Email alterado com sucesso!');
});

// Controle de mudança de senha
formSenha.addEventListener('submit', function(e) {
  e.preventDefault();
  const novaSenha = inputNovaSenha.value.trim();
  const confirmarNovaSenha = inputConfirmarNovaSenha.value.trim();

  if (!novaSenha || !confirmarNovaSenha) {
    alert('Por favor, preencha os dois campos de nova senha.');
    return;
  }

  if (novaSenha !== confirmarNovaSenha) {
    alert('As senhas não coincidem!');
    return;
  }

  usuarioCadastrado.senha = novaSenha; // Atualiza "no sistema"
  inputNovaSenha.value = '';
  inputConfirmarNovaSenha.value = '';
  alert('Senha alterada com sucesso!');
});

// MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN MAIN