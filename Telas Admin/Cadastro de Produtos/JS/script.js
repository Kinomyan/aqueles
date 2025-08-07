// ==============================
// HEADER HEADER HEADER HEADER
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
// HEADER HEADER HEADER HEADER
// ==============================

const form = document.querySelector('.form');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const previewContainer = document.getElementById('previewContainer');
let selectedImages = [];

// Atualiza visualização de imagens
function updateImagePreview() {
  previewContainer.innerHTML = '';

  selectedImages.forEach((imgData, idx) => {
    const thumb = document.createElement('div');
    thumb.className = 'thumbnail';
    thumb.innerHTML = `
      <img src="${imgData}" alt="Imagem ${idx}">
      <button type="button" class="remove-thumb" data-idx="${idx}">&times;</button>
    `;
    previewContainer.appendChild(thumb);
  });
}

// Leitura das imagens
fileInput.addEventListener('change', e => {
  const files = Array.from(e.target.files);
  const readers = files.map(file => new Promise(res => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.readAsDataURL(file);
  }));

  Promise.all(readers).then(results => {
    selectedImages = selectedImages.concat(results);
    updateImagePreview();
  });

  fileInput.value = '';
});

// Remover imagem
previewContainer.addEventListener('click', e => {
  if (e.target.matches('.remove-thumb')) {
    const idx = parseInt(e.target.dataset.idx);
    selectedImages.splice(idx, 1);
    updateImagePreview();
  }
});

// 🎨 Cores
const colorInput = document.getElementById('colorInput');
const colorsContainer = document.getElementById('colorsContainer');
const addColorButton = document.querySelector('.add-color');

addColorButton.addEventListener('click', () => {
  const colorHex = colorInput.value.toUpperCase();
  const exists = Array.from(document.querySelectorAll('input[name="cores[]"]'))
    .some(input => input.value === colorHex);

  if (exists) {
    alert('Essa cor já foi adicionada!');
    return;
  }

  const badge = document.createElement('div');
  badge.className = 'color-badge';
  badge.innerHTML = `
    <div class="circle" style="background-color: ${colorHex};"></div>
    <span>${colorHex}</span>
    <button type="button" class="remove-color">&times;</button>
    <input type="hidden" name="cores[]" value="${colorHex}">
  `;

  colorsContainer.appendChild(badge);
  badge.querySelector('.remove-color').addEventListener('click', () => badge.remove());
});

// Reset
form.addEventListener('reset', () => {
  selectedImages = [];
  updateImagePreview();
  colorsContainer.innerHTML = '';
  colorInput.value = '#000000';
  delete form.dataset.editIndex;
  form.querySelector('.cadastrar').textContent = 'Cadastrar';
});

// Preenchimento obrigatório
form.addEventListener('submit', e => {
  e.preventDefault();

  if (selectedImages.length === 0) {
    alert('Envie ao menos uma imagem do produto.');
    return;
  }

  const addedColors = document.querySelectorAll('input[name="cores[]"]');
  if (addedColors.length === 0) {
    alert('Adicione ao menos uma cor ao produto.');
    return;
  }

  const required = ['sku','nome','descricao','tamanho','preco','categoria','subcategoria','marca','quantidade','altura','largura','comprimento','peso'];
  for (const name of required) {
    const el = form.querySelector(`[name='${name}']`);
    if (!el || !el.value.trim()) {
      alert(`Por favor, preencha o campo "${name}".`);
      el?.focus();
      return;
    }
  }

  saveFormProduto();
});

// Salva produto
function saveFormProduto() {
  const formData = new FormData(form);
  const novoProd = {
    sku: formData.get('sku').trim(),
    nome: formData.get('nome').trim(),
    descricao: formData.get('descricao').trim(),
    genero: formData.get('genero'),
    categoria: formData.get('categoria'),
    subcategoria: formData.get('subcategoria'),
    marca: formData.get('marca'),
    tamanho: formData.get('tamanho').trim(),
    preco: formData.get('preco').trim(),
    quantidade: formData.get('quantidade'),
    altura: formData.get('altura'),
    largura: formData.get('largura'),
    comprimento: formData.get('comprimento'),
    peso: formData.get('peso'),
    cores: Array.from(document.querySelectorAll('input[name="cores[]"]')).map(i => i.value),
    imagem: selectedImages[0] || '',
  };

  const produtos = getProdutos();
  const idx = form.dataset.editIndex;
  if (idx != null) {
  // Edição: permite manter o mesmo SKU
  const outroComMesmoSKU = produtos.find((p, i) => p.sku === novoProd.sku && i !== Number(idx));
  if (outroComMesmoSKU) {
    alert('Já existe um produto com este SKU. Por favor, utilize um SKU diferente.');
    return;
  }

  produtos[idx] = novoProd;
  delete form.dataset.editIndex;
} else {
  // Cadastro novo: verifica se o SKU já existe
  const skuExistente = produtos.some(p => p.sku === novoProd.sku);
  if (skuExistente) {
    alert('Já existe um produto com este SKU. Por favor, utilize um SKU diferente.');
    return;
  }

  produtos.push(novoProd);
}


  saveProdutos(produtos);
  alert('Produto salvo com sucesso!');
  form.reset();
  renderProdutos();
}

// Carregar dados do localStorage
function getProdutos() {
  return JSON.parse(localStorage.getItem('produtos') || '[]');
}

function saveProdutos(list) {
  localStorage.setItem('produtos', JSON.stringify(list));
}

// Preencher formulário para editar
function carregarFormParaEdicao(prod, idx) {
  form.dataset.editIndex = idx;

  form.sku.value = prod.sku;
  form.nome.value = prod.nome;
  form.descricao.value = prod.descricao;
  form.genero.value = prod.genero;
  form.tamanho.value = prod.tamanho;
  form.preco.value = prod.preco;
  form.quantidade.value = prod.quantidade;
  form.altura.value = prod.altura;
  form.largura.value = prod.largura;
  form.comprimento.value = prod.comprimento;
  form.peso.value = prod.peso;
  document.getElementById('categoriaSelect').value = prod.categoria;
  document.getElementById('subcategoriaSelect').value = prod.subcategoria;
  document.getElementById('marcaSelect').value = prod.marca;

  // 🔗 Recarrega subcategorias da categoria selecionada
const subcategorias = JSON.parse(localStorage.getItem('subcategorias') || '[]')
  .filter(sub => sub.categoriaPai === prod.categoria);

const subSelect = document.getElementById('subcategoriaSelect');
subSelect.innerHTML = '<option value="">Selecione a subcategoria</option>';
subcategorias.forEach(sub => {
  const opt = document.createElement('option');
  opt.value = sub.slug;
  opt.textContent = sub.nome;
  subSelect.appendChild(opt);
});
subSelect.value = prod.subcategoria;

// 🔗 Recarrega marcas da subcategoria selecionada
const marcas = JSON.parse(localStorage.getItem('marcas') || '[]')
  .filter(m => m.subcategoriaPai === prod.subcategoria);

const marcaSelect = document.getElementById('marcaSelect');
marcaSelect.innerHTML = '<option value="">Selecione a marca</option>';
marcas.forEach(m => {
  const opt = document.createElement('option');
  opt.value = m.slug;
  opt.textContent = m.nome;
  marcaSelect.appendChild(opt);
});
marcaSelect.value = prod.marca;


  colorsContainer.innerHTML = '';
  prod.cores.forEach(cor => {
    const badge = document.createElement('div');
    badge.className = 'color-badge';
    badge.innerHTML = `
      <div class="circle" style="background-color: ${cor};"></div>
      <span>${cor}</span>
      <button type="button" class="remove-color">&times;</button>
      <input type="hidden" name="cores[]" value="${cor}">
    `;
    colorsContainer.appendChild(badge);
    badge.querySelector('.remove-color').addEventListener('click', () => badge.remove());
  });

  selectedImages = [prod.imagem];
  updateImagePreview();

  form.querySelector('.cadastrar').textContent = 'Salvar Alterações';
}

// Renderiza a lista de produtos
function renderProdutos() {
  const container = document.getElementById('lista-produtos');
  if (!container) return;

  container.innerHTML = '';
  const produtos = getProdutos();

  if (produtos.length === 0) {
    container.innerHTML = '<p>Nenhum produto cadastrado.</p>';
    return;
  }

  produtos.forEach((p, idx) => {
  const box = document.createElement('div');
  box.className = 'produto-box';
  box.innerHTML = `
    <img src="${p.imagem}" alt="${p.nome}" class="produto-imagem">
    <div class="produto-detalhes">
      <p class="produto-sku"><strong>SKU:</strong> ${p.sku}</p>
      <h4 class="produto-nome">${p.nome}</h4>
      <p class="produto-descricao">${p.descricao}</p>
      <div class="grupo-infos">
        <p><strong>Categoria:</strong> ${p.categoria} / ${p.subcategoria} / ${p.marca}</p>
        <p><strong>Tamanho:</strong> ${p.tamanho} | <strong>Preço:</strong> R$ ${p.preco}</p>
        <p><strong>Cores:</strong> ${p.cores.join(', ')}</p>
      </div>
      <div class="produto-botoes">
        <button class="editar-btn" data-idx="${idx}">Editar</button>
        <button class="excluir-produto-btn" data-idx="${idx}">Excluir</button>
      </div>
    </div>
  `;
  container.appendChild(box);
});



  container.querySelectorAll('.editar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const produto = getProdutos()[btn.dataset.idx];
      carregarFormParaEdicao(produto, btn.dataset.idx);
    });
  });

  container.querySelectorAll('.excluir-produto-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      if (confirm('Tem certeza que deseja excluir este produto?')) {
        const produtos = getProdutos();
        produtos.splice(idx, 1);
        saveProdutos(produtos);
        renderProdutos();
      }
    });
  });
}

// Inicia renderização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarDoStorage('categorias', 'categoriaSelect', 'Selecione a categoria');
  carregarDependentes(); // ⬅️ aqui
  renderProdutos();
});



function carregarDoStorage(storageKey, selectId, placeholder) {
  const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const sel = document.getElementById(selectId);
  if (!sel) return;

  sel.innerHTML = `<option value="">${placeholder}</option>`;
  data.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.slug || item.id || item.valor;
    opt.textContent = item.nome;
    sel.appendChild(opt);
  });
}

function carregarDoStorage(storageKey, selectId, placeholder) {
  const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const sel = document.getElementById(selectId);
  if (!sel) return;

  sel.innerHTML = `<option value="">${placeholder}</option>`;
  data.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.slug || item.id || item.valor;
    opt.textContent = item.nome;
    sel.appendChild(opt);
  });
}

// Carrega opções dependentes
function carregarDependentes() {
  const categoriaSelect = document.getElementById('categoriaSelect');
  const subcategoriaSelect = document.getElementById('subcategoriaSelect');
  const marcaSelect = document.getElementById('marcaSelect');

  categoriaSelect.addEventListener('change', () => {
    const categoriaSlug = categoriaSelect.value;
    const subcategorias = JSON.parse(localStorage.getItem('subcategorias') || '[]')
      .filter(sub => sub.categoriaPai === categoriaSlug);

    subcategoriaSelect.innerHTML = '<option value="">Selecione a subcategoria</option>';
    marcaSelect.innerHTML = '<option value="">Selecione a marca</option>';

    subcategorias.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.slug;
      opt.textContent = sub.nome;
      subcategoriaSelect.appendChild(opt);
    });
  });

  subcategoriaSelect.addEventListener('change', () => {
    const subcategoriaSlug = subcategoriaSelect.value;
    const marcas = JSON.parse(localStorage.getItem('marcas') || '[]')
      .filter(marca => marca.subcategoriaPai === subcategoriaSlug);

    marcaSelect.innerHTML = '<option value="">Selecione a marca</option>';

    marcas.forEach(marca => {
      const opt = document.createElement('option');
      opt.value = marca.slug;
      opt.textContent = marca.nome;
      marcaSelect.appendChild(opt);
    });
  });
}

// 🔢 Controle de preço com botões + e -
const priceInput = document.getElementById('priceInput');
const plusBtn = document.querySelector('.plus');
const minusBtn = document.querySelector('.minus');

// Converte "0,00" → 0.00
function parsePreco(str) {
  return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
}

// Converte 0.00 → "0,00"
function formatPreco(num) {
  return num.toFixed(2).replace('.', ',');
}

plusBtn.addEventListener('click', () => {
  const current = parsePreco(priceInput.value);
  const novo = current + 1;
  priceInput.value = formatPreco(novo);
});

minusBtn.addEventListener('click', () => {
  const current = parsePreco(priceInput.value);
  const novo = Math.max(0, current - 1); // evita valor negativo
  priceInput.value = formatPreco(novo);
});

// 🖱️ Clique em toda a área de upload ativa o input
document.getElementById('uploadArea').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});
