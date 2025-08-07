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


// ==============================
// MAIN MAIN MAIN MAIN
// ==============================
const form = document.querySelector('.form');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const bannersList = document.getElementById('bannersList');

let banners = JSON.parse(localStorage.getItem('banners')) || [];
let editIndex = null; // Novo: guarda o índice em edição

function renderBanners() {
    bannersList.innerHTML = '';
    banners.forEach((banner, index) => {
        const bannerDiv = document.createElement('div');
        bannerDiv.classList.add('banner-item');

        bannerDiv.innerHTML = `
            <img src="${banner.image}" alt="${banner.title}">
            <div class="banner-info">
                <strong>${banner.title}</strong><br>
                <small>${banner.description || ''}</small><br>
                <a href="${banner.link}" target="_blank">${banner.link}</a>
            </div>
            <div class="banner-actions">
                <button onclick="editBanner(${index})" class="edit-btn">Editar</button>
                <button onclick="deleteBanner(${index})">Excluir</button>
            </div>
        `;
        bannersList.appendChild(bannerDiv);
    });
}

function deleteBanner(index) {
    if(confirm('Deseja excluir este banner?')) {
        banners.splice(index, 1);
        localStorage.setItem('banners', JSON.stringify(banners));
        renderBanners();
    }
}

function editBanner(index) {
    const banner = banners[index];
    form.titulo.value = banner.title;
    form.descricao.value = banner.description;
    form.link.value = banner.link;

    // Mostrar imagem preview
    const preview = document.createElement('img');
    preview.id = 'preview';
    preview.src = banner.image;

    const oldPreview = document.getElementById('preview');
    if (oldPreview) oldPreview.remove();
    uploadArea.appendChild(preview);
    uploadArea.classList.add('hide-label');

    editIndex = index; // Guardar índice para editar no submit
}

fileInput.addEventListener('change', function() {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const oldPreview = document.getElementById('preview');
            if (oldPreview) oldPreview.remove();

            const imgPreview = document.createElement('img');
            imgPreview.src = e.target.result;
            imgPreview.id = 'preview';

            uploadArea.appendChild(imgPreview);
            uploadArea.classList.add('hide-label');
            uploadArea.classList.remove('error');
        };
        reader.readAsDataURL(file);
    }
});

// Permitir troca de imagem clicando na própria imagem de preview
uploadArea.addEventListener('click', function() {
    const preview = document.getElementById('preview');
    if (preview) {
        fileInput.click();
    }
});


form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (editIndex !== null) {
        // Editar banner existente
        const reader = new FileReader();
        reader.onload = function(e) {
            banners[editIndex] = {
                image: fileInput.files.length ? e.target.result : banners[editIndex].image,
                title: form.titulo.value,
                description: form.descricao.value,
                link: form.link.value
            };
            localStorage.setItem('banners', JSON.stringify(banners));
            renderBanners();
            form.reset();
            resetUpload();
            editIndex = null;
        };

        if(fileInput.files.length) {
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // caso não mude imagem
            reader.onload({target:{result: banners[editIndex].image}});
        }
    } else {
        // Novo banner
        if (fileInput.files.length === 0) {
            uploadArea.classList.add('error');
            alert('Por favor, envie uma imagem do banner.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const newBanner = {
                image: e.target.result,
                title: form.titulo.value,
                description: form.descricao.value,
                link: form.link.value
            };
            banners.push(newBanner);
            localStorage.setItem('banners', JSON.stringify(banners));
            renderBanners();
            form.reset();
            resetUpload();
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
});

form.addEventListener('reset', function() {
    resetUpload();
    editIndex = null;
});

function resetUpload() {
    const preview = document.getElementById('preview');
    if (preview) preview.remove();
    uploadArea.classList.remove('hide-label');
    uploadArea.classList.remove('error');
    fileInput.value = '';
}

uploadArea.addEventListener('click', () => {
  fileInput.click();
});

renderBanners();

// ==============================
// MAIN MAIN MAIN MAIN
// ==============================