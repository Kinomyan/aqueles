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

// 🔥 Utils
function generateSlug(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Local Storage Helpers
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// 🔷 Atualizar Selects
function updateCategoriaSelect() {
    const categorias = getFromStorage('categorias');
    const select = document.querySelector('select[name="categoria-pai"]');
    select.innerHTML = `<option value="">Selecione a Categoria</option>` +
        categorias.map(cat => `<option value="${cat.slug}">${cat.nome}</option>`).join('');
}

function updateSubcategoriaSelect() {
    const subcategorias = getFromStorage('subcategorias');
    const select = document.querySelector('select[name="subcategoria-pai"]');
    select.innerHTML = `<option value="">Selecione a Subcategoria</option>` +
        subcategorias.map(sub => `<option value="${sub.slug}">${sub.nome}</option>`).join('');
}

// 🔥 Slug automático
function setupSlug(inputName, slugName) {
    const input = document.querySelector(`input[name="${inputName}"]`);
    const slug = document.querySelector(`input[name="${slugName}"]`);
    if (input && slug) {
        input.addEventListener('input', () => {
            slug.value = generateSlug(input.value);
        });
    }
}
setupSlug('categoria', 'slug-categoria');
setupSlug('subcategoria', 'slug-subcategoria');
setupSlug('marca', 'slug-marca');

// Estado de edição
let editState = {
    type: null,
    slug: null,
};

// 🔹 Cadastro/Editar Categoria
const formCategoria = document.getElementById('form-categoria');
formCategoria.addEventListener('submit', e => {
    e.preventDefault();
    const nome = e.target.categoria.value.trim();
    const slug = e.target['slug-categoria'].value.trim();
    const metaTitle = e.target['meta-title-categoria'].value.trim();
    const metaDescription = e.target['meta-description-categoria'].value.trim();

    let categorias = getFromStorage('categorias');

    if (editState.type === 'categorias') {
        categorias = categorias.map(cat => 
            cat.slug === editState.slug ? { nome, slug, metaTitle, metaDescription } : cat
        );
        alert('Categoria alterada com sucesso!');
    } else {
        categorias.push({ nome, slug, metaTitle, metaDescription });
        alert('Categoria cadastrada com sucesso!');
    }

    saveToStorage('categorias', categorias);
    e.target.reset();
    resetEdit();
    updateCategoriaSelect();
    renderLists();
});

// 🔸 Cadastro/Editar Subcategoria
const formSubcategoria = document.getElementById('form-subcategoria');
formSubcategoria.addEventListener('submit', e => {
    e.preventDefault();
    const categoriaPai = e.target['categoria-pai'].value;
    const nome = e.target.subcategoria.value.trim();
    const slug = e.target['slug-subcategoria'].value.trim();
    const metaTitle = e.target['meta-title-subcategoria'].value.trim();
    const metaDescription = e.target['meta-description-subcategoria'].value.trim();

    if (!categoriaPai) {
        alert('Selecione uma Categoria para a Subcategoria.');
        return;
    }

    let subcategorias = getFromStorage('subcategorias');

    if (editState.type === 'subcategorias') {
        subcategorias = subcategorias.map(sub => 
            sub.slug === editState.slug ? { nome, slug, metaTitle, metaDescription, categoriaPai } : sub
        );
        alert('Subcategoria alterada com sucesso!');
    } else {
        subcategorias.push({ nome, slug, metaTitle, metaDescription, categoriaPai });
        alert('Subcategoria cadastrada com sucesso!');
    }

    saveToStorage('subcategorias', subcategorias);
    e.target.reset();
    resetEdit();
    updateSubcategoriaSelect();
    renderLists();
});

// 🔻 Cadastro/Editar Marca
const formMarca = document.getElementById('form-marca');
formMarca.addEventListener('submit', e => {
    e.preventDefault();
    const subcategoriaPai = e.target['subcategoria-pai'].value;
    const nome = e.target.marca.value.trim();
    const slug = e.target['slug-marca'].value.trim();
    const metaTitle = e.target['meta-title-marca'].value.trim();
    const metaDescription = e.target['meta-description-marca'].value.trim();

    if (!subcategoriaPai) {
        alert('Selecione uma Subcategoria para a Marca.');
        return;
    }

    let marcas = getFromStorage('marcas');

    if (editState.type === 'marcas') {
        marcas = marcas.map(m => 
            m.slug === editState.slug ? { nome, slug, metaTitle, metaDescription, subcategoriaPai } : m
        );
        alert('Marca alterada com sucesso!');
    } else {
        marcas.push({ nome, slug, metaTitle, metaDescription, subcategoriaPai });
        alert('Marca cadastrada com sucesso!');
    }

    saveToStorage('marcas', marcas);
    e.target.reset();
    resetEdit();
    renderLists();
});

// 🔥 Renderização de listas com Editar + Excluir
function renderLists() {
    renderList('categorias');
    renderList('subcategorias');
    renderList('marcas');
}

function renderList(type) {
    let container = document.getElementById(`list-${type}`);
    if (!container) {
        container = document.createElement('div');
        container.id = `list-${type}`;
        container.innerHTML = `<h4>${capitalize(type)} Cadastradas:</h4><ul></ul>`;
        document.querySelector('main').appendChild(container);
    }

    const data = getFromStorage(type);
    const ul = container.querySelector('ul');
    ul.innerHTML = '';

    if (data.length === 0) {
        ul.innerHTML = '<li>Vazio</li>';
        return;
    }

    data.forEach(item => {
        let path = item.nome;

        if (type === 'subcategorias') {
            const categorias = getFromStorage('categorias');
            const categoria = categorias.find(c => c.slug === item.categoriaPai);
            if (categoria) {
                path = `${categoria.nome} > ${item.nome}`;
            }
        }

        if (type === 'marcas') {
            const subcategorias = getFromStorage('subcategorias');
            const subcategoria = subcategorias.find(s => s.slug === item.subcategoriaPai);
            let categoriaNome = '';

            if (subcategoria) {
                const categorias = getFromStorage('categorias');
                const categoria = categorias.find(c => c.slug === subcategoria.categoriaPai);
                categoriaNome = categoria ? categoria.nome + ' > ' : '';
                path = `${categoriaNome}${subcategoria.nome} > ${item.nome}`;
            }
        }

        const li = document.createElement('li');
        li.innerHTML = `
        <span class="folder-icon">📁</span>
    <div>
        <div class="categoria-titulo">${path}</div>
        <div class="categoria-botoes">
            <button onclick="editItem('${type}', '${item.slug}')">Editar</button>
            <button onclick="deleteItem('${type}', '${item.slug}')">Excluir</button>
        </div>
    </div>
    `;
        ul.appendChild(li);
    });
}




function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// 🗑️ Deletar
function deleteItem(type, slug) {
    let data = getFromStorage(type);
    data = data.filter(item => item.slug !== slug);
    saveToStorage(type, data);
    alert(`${capitalize(type)} excluído(a) com sucesso!`);

    if (type === 'categorias') updateCategoriaSelect();
    if (type === 'subcategorias') updateSubcategoriaSelect();
    renderLists();
}

// ✍️ Editar
function editItem(type, slug) {
    const data = getFromStorage(type);
    const item = data.find(i => i.slug === slug);
    if (!item) return;

    editState = { type, slug };

    if (type === 'categorias') {
        formCategoria.categoria.value = item.nome;
        formCategoria['slug-categoria'].value = item.slug;
        formCategoria['meta-title-categoria'].value = item.metaTitle;
        formCategoria['meta-description-categoria'].value = item.metaDescription;
        formCategoria.querySelector('.cadastrar').textContent = 'Salvar Alterações';
    }

    if (type === 'subcategorias') {
        formSubcategoria['categoria-pai'].value = item.categoriaPai;
        formSubcategoria.subcategoria.value = item.nome;
        formSubcategoria['slug-subcategoria'].value = item.slug;
        formSubcategoria['meta-title-subcategoria'].value = item.metaTitle;
        formSubcategoria['meta-description-subcategoria'].value = item.metaDescription;
        formSubcategoria.querySelector('.cadastrar').textContent = 'Salvar Alterações';
    }

    if (type === 'marcas') {
        formMarca['subcategoria-pai'].value = item.subcategoriaPai;
        formMarca.marca.value = item.nome;
        formMarca['slug-marca'].value = item.slug;
        formMarca['meta-title-marca'].value = item.metaTitle;
        formMarca['meta-description-marca'].value = item.metaDescription;
        formMarca.querySelector('.cadastrar').textContent = 'Salvar Alterações';
    }
}

// 🔄 Resetar estado de edição
function resetEdit() {
    editState = { type: null, slug: null };
    document.querySelectorAll('.cadastrar').forEach(btn => {
        btn.textContent = btn.getAttribute('type') === 'submit' ? 'Cadastrar' : btn.textContent;
    });
}

// 🔄 Reset Slugs
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('reset', () => {
        form.querySelectorAll('input[name^="slug"]').forEach(slug => slug.value = '');
        resetEdit();
    });
});

// 🚀 Inicialização
updateCategoriaSelect();
updateSubcategoriaSelect();
renderLists();