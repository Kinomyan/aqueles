function toggleSenha() {
  const senhaInput = document.getElementById('senha');
  const isPassword = senhaInput.type === 'password';
  senhaInput.type = isPassword ? 'text' : 'password';
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.login-form');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    // Simulação de validação simples (pode ser substituída por chamada à API ou validação real)
    if (email === '' || senha === '') {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Exibe feedback e redireciona
    alert('Login realizado com sucesso!');
    window.location.href = '../Home/Home.html';
  });
});
