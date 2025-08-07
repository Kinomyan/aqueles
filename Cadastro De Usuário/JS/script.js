function Mascara(input, tipo) {
  input.addEventListener('input', () => {
    let valor = input.value.replace(/\D/g, '');

    if (tipo === 'cpf') {
      valor = valor.slice(0, 11);
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    if (tipo === 'cep') {
      valor = valor.slice(0, 8);
      valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }

    if (tipo === 'celular') {
      valor = valor.slice(0, 11);
      valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
      valor = valor.replace(/(\d{5})(\d{4})$/, '$1-$2');
    }

    input.value = valor;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const cpfInput = document.getElementById('cpf');
  const cepInput = document.getElementById('cep');
  const celularInput = document.getElementById('celular');

  Mascara(cpfInput, 'cpf');
  Mascara(cepInput, 'cep');
  Mascara(celularInput, 'celular');

  document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmarSenha').value;

    if (senha !== confirmar) {
      alert('As senhas não coincidem!');
      return;
    }

    alert('Cadastro realizado com sucesso!');
    window.location.href = '../index.html';
  });
});
