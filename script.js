// Global variable to store careers data
let careersData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;

    if (currentPage.includes('career.html')) {
        loadCareerDetail();
    } else {
        loadCareers();
        setupSearch();
        setupClearButton();
    }
});

// Load and parse CSV data
function loadCareers() {
    Papa.parse('carreras_mallas.csv', {
        download: true,
        header: true,
        encoding: 'UTF-8',
        skipEmptyLines: true,
        complete: function (results) {
            // Filter valid careers and remove duplicates
            const seen = new Set();
            careersData = results.data.filter(career => {
                // Handle BOM in field names
                const nombre = career.Nombre || career['\ufeffNombre'] || '';

                if (!nombre || nombre.trim() === '') {
                    return false;
                }

                // Check for duplicates
                if (seen.has(nombre)) {
                    return false;
                }

                seen.add(nombre);

                // Normalize the career object to use 'Nombre' without BOM
                if (career['\ufeffNombre'] && !career.Nombre) {
                    career.Nombre = career['\ufeffNombre'];
                }

                return true;
            });

            displayCareers(careersData);
            updateCareerCount(careersData.length);
            hideLoading();
        },
        error: function (error) {
            console.error('Error loading CSV:', error);
            hideLoading();
            showError('Error al cargar las carreras. Por favor, recarga la página.');
        }
    });
}

// Display careers in grid organized by divisions
function displayCareers(careers) {
    const grid = document.getElementById('careersGrid');
    const noResults = document.getElementById('noResults');

    grid.innerHTML = '';

    if (careers.length === 0) {
        noResults.classList.remove('d-none');
        return;
    }

    noResults.classList.add('d-none');

    // Define divisions and their careers
    const divisions = [
        {
            name: 'División de Ciencias Básicas',
            icon: 'bi-atom',
            logo: 'images/logos/GB Black.png',
            careers: [
                'Física',
                'Matemáticas',
                'Química',
                'Químico Farmacéutico Biólogo',
                'Ingeniería en Ciencia de Materiales'
            ]
        },
        {
            name: 'División de Ingenierías',
            icon: 'bi-gear-fill',
            logo: 'images/logos/GI Black.png',
            careers: [
                'Ingeniería Civil',
                'Ingeniería en Alimentos y Biotecnología',
                'Ingeniería en Topografía Geomática',
                'Ingeniería Industrial',
                'Ingeniería Mecánica Eléctrica',
                'Ingeniería Química',
                'Ingeniería en Logística y Transporte'
            ]
        },
        {
            name: 'División de Tecnologías para la Integración Ciber-Humana',
            icon: 'bi-cpu-fill',
            logo: 'images/logos/GD Black.png',
            careers: [
                'Ingeniería Informática',
                'Ingeniería Biomédica',
                'Ingeniería en Computación',
                'Ingeniería en Electromovilidad y Autotrónica',
                'Ingeniería en Electrónica y Sistemas Inteligentes',
                'Ingeniería Fotónica',
                'Ingeniería en Mecatrónica Inteligente',
                'Ingeniería Robótica'
            ]
        }
    ];

    let totalDisplayed = 0;

    // Create sections for each division
    divisions.forEach(division => {
        // Filter careers for this division
        const divisionCareers = careers.filter(career =>
            division.careers.includes(career.Nombre)
        );

        if (divisionCareers.length === 0) return;

        // Create division header
        const divisionHeader = document.createElement('div');
        divisionHeader.className = 'col-12 mt-5 mb-4';
        divisionHeader.innerHTML = `
            <div class="division-header">
                <img src="${division.logo}" alt="${division.name}" class="division-logo">
                <h2 class="division-title">${division.name}</h2>
                <div class="division-line"></div>
            </div>
        `;
        grid.appendChild(divisionHeader);

        // Add careers for this division
        divisionCareers.forEach((career, index) => {
            const card = createCareerCard(career, totalDisplayed + index);
            grid.appendChild(card);
        });

        totalDisplayed += divisionCareers.length;
    });

    updateResultCount(totalDisplayed);
}

// Create a career card element using Bootstrap
function createCareerCard(career, index) {
    const col = document.createElement('div');
    col.className = 'col-lg-6 col-xl-4';

    // Determine cover image based on career category
    const coverImage = getCoverImage(career.Nombre);
    const coordinatorImg = career.FotoLocal || 'images/liston_oferta.jpg';

    // Get category/area from career name
    const category = getCareerCategory(career.Nombre);

    col.innerHTML = `
        <div class="card career-card h-100" style="animation-delay: ${index * 0.1}s;" onclick="navigateToCareer('${escapeHtml(career.Nombre)}')">
            <div class="card-body d-flex flex-column p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <h5 class="card-title mb-0">${career.Nombre}</h5>
                    <span class="badge bg-warning text-dark ms-2 flex-shrink-0">
                        <i class="bi bi-bookmark-fill me-1"></i>${category}
                    </span>
                </div>
                <p class="card-text flex-grow-1 mb-4">${truncateText(career.Descripcion || career.Objetivo, 140)}</p>
                
                <div class="coordinator-section-card mt-auto">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${coordinatorImg}" alt="${career.Coordinador}" class="coordinator-img" onerror="this.src='images/liston_oferta.jpg'">
                        <div class="flex-grow-1">
                            <div class="coordinator-name">${career.Coordinador || 'Coordinador'}</div>
                            <div class="coordinator-title">
                                <i class="bi bi-person-badge text-warning me-1"></i>Coordinador
                            </div>
                        </div>
                        <i class="bi bi-arrow-right-circle-fill text-warning fs-3"></i>
                    </div>
                </div>
            </div>
        </div>
    `;

    return col;
}

// Get cover image based on career name
function getCoverImage(careerName) {
    const name = careerName.toLowerCase();

    if (name.includes('física')) return 'images/covers/fisica_cover_1768264055057.png';
    if (name.includes('matemáticas')) return 'images/covers/matematicas_cover_1768264068958.png';
    if (name.includes('química') && !name.includes('ingeniería')) return 'images/covers/quimica_cover_1768264082508.png';
    if (name.includes('computación') || name.includes('informática')) return 'images/covers/computacion_cover_1768264110350.png';
    if (name.includes('robótica') || name.includes('mecatrónica')) return 'images/covers/robotica_cover_1768264124159.png';
    if (name.includes('ingeniería')) return 'images/covers/ingenieria_cover_1768264095934.png';

    // Default to engineering cover for other programs
    return 'images/covers/ingenieria_cover_1768264095934.png';
}


// Get career category based on name
function getCareerCategory(name) {
    if (name.includes('Ingeniería')) return 'Ingeniería';
    if (name.includes('Física') || name.includes('Química') || name.includes('Matemáticas')) return 'Ciencias';
    return 'Licenciatura';
}

// Navigate to career detail page
function navigateToCareer(careerName) {
    // Convert career name to filename format
    const filename = careerName.toLowerCase()
        .replace(/ /g, '_')
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
        .replace(/ñ/g, 'n');

    window.location.href = `carreras/${filename}.html`;
}

// Truncate text to specified length
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCareers = careersData.filter(career =>
            career.Nombre.toLowerCase().includes(searchTerm) ||
            (career.Descripcion && career.Descripcion.toLowerCase().includes(searchTerm)) ||
            (career.Coordinador && career.Coordinador.toLowerCase().includes(searchTerm)) ||
            (career.Objetivo && career.Objetivo.toLowerCase().includes(searchTerm))
        );
        displayCareers(filteredCareers);
    });
}

// Setup clear search button
function setupClearButton() {
    const clearBtn = document.getElementById('clearSearch');
    const searchInput = document.getElementById('searchInput');

    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            displayCareers(careersData);
        });
    }
}

// Update career count in hero section
function updateCareerCount(count) {
    const countElement = document.getElementById('careerCount');
    if (countElement) {
        countElement.textContent = '21+';
    }
}

// Update result count
function updateResultCount(count) {
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = count;
    }
}

// Load career detail page
function loadCareerDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const careerName = urlParams.get('id');

    if (!careerName) {
        window.location.href = 'index.html';
        return;
    }

    Papa.parse('carreras_mallas.csv', {
        download: true,
        header: true,
        encoding: 'UTF-8',
        complete: function (results) {
            const career = results.data.find(c => c.Nombre === careerName);
            if (career) {
                displayCareerDetail(career);
            } else {
                showError('Carrera no encontrada');
            }
            hideLoading();
        },
        error: function (error) {
            console.error('Error loading career:', error);
            hideLoading();
            showError('Error al cargar la información de la carrera.');
        }
    });
}

// Display career detail with Bootstrap components
function displayCareerDetail(career) {
    const detailContainer = document.getElementById('careerDetail');

    // Update page title
    document.title = `${career.Nombre} - CUCEI`;

    // Use cover image instead of coordinator photo
    const coverImage = getCoverImage(career.Nombre);
    const coordinatorImg = career.FotoLocal || 'images/liston_oferta.jpg';

    detailContainer.innerHTML = `
        <!-- Header Section -->
        <div class="career-header-section">
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 mx-auto text-center">
                        <div class="mb-3">
                            <span class="badge bg-warning text-dark px-4 py-2 rounded-pill fs-6">
                                <i class="bi bi-mortarboard-fill me-2"></i>${getCareerCategory(career.Nombre)}
                            </span>
                        </div>
                        <h1 class="career-title-main">${career.Nombre}</h1>
                        <p class="lead text-light">${truncateText(career.Descripcion || '', 200)}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="container py-5">
            <div class="row">
                <!-- Main Image -->
                <div class="col-lg-10 mx-auto mb-5">
                    <img src="${coverImage}" alt="${career.Nombre}" class="career-main-img" onerror="this.src='images/liston_oferta.jpg'">
                </div>

                <!-- Coordinator Card -->
                <div class="col-lg-10 mx-auto">
                    <div class="coordinator-card-detail">
                        <div class="row align-items-center">
                            <div class="col-md-auto text-center mb-3 mb-md-0">
                                <img src="${coordinatorImg}" alt="${career.Coordinador}" class="coordinator-photo-large" onerror="this.src='images/liston_oferta.jpg'">
                            </div>
                            <div class="col-md">
                                <div class="coordinator-info-detail">
                                    <h3>
                                        <i class="bi bi-person-circle text-warning me-2"></i>
                                        ${career.Coordinador || 'Coordinador'}
                                    </h3>
                                    <p class="mb-2">
                                        <i class="bi bi-telephone-fill text-warning me-2"></i>
                                        <strong>Teléfono:</strong> ${career.Telefono || 'No disponible'}
                                        ${career.Extension ? ` <span class="badge bg-secondary">Ext. ${career.Extension}</span>` : ''}
                                    </p>
                                    ${career.Correo ? `
                                        <p class="mb-2">
                                            <i class="bi bi-envelope-fill text-warning me-2"></i>
                                            <strong>Correo:</strong> <a href="mailto:${career.Correo}">${career.Correo}</a>
                                        </p>
                                    ` : ''}
                                    ${career.SitioWeb ? `
                                        <p class="mb-0">
                                            <i class="bi bi-globe text-warning me-2"></i>
                                            <strong>Sitio Web:</strong> <a href="${career.SitioWeb}" target="_blank">${career.SitioWeb}</a>
                                        </p>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Information Sections -->
                <div class="col-lg-10 mx-auto mt-4">
                    ${createInfoSection('Objetivo', career.Objetivo, 'bi-bullseye')}
                    ${createInfoSection('Perfil de Ingreso', career.PerfilIngreso, 'bi-door-open-fill')}
                    ${createInfoSection('Perfil del Egresado', career.PerfilEgresado, 'bi-award-fill')}
                    ${createInfoSection('Campo Laboral', career.CampoLaboral, 'bi-briefcase-fill')}
                </div>

                <!-- Curriculum Button -->
                ${career.MallaValor ? `
                    <div class="col-lg-10 mx-auto text-center mt-5">
                        <a href="${career.MallaValor}" target="_blank" class="curriculum-btn">
                            <i class="bi bi-file-earmark-pdf-fill me-2"></i>
                            Descargar Malla Curricular
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Create an information section
function createInfoSection(title, content, icon) {
    if (!content || content.trim() === '') return '';

    return `
        <div class="info-section">
            <h2 class="info-section-title">
                <i class="bi ${icon} text-warning"></i>
                ${title}
            </h2>
            <div class="info-section-content">${formatContent(content)}</div>
        </div>
    `;
}

// Format content to preserve structure
function formatContent(content) {
    if (!content) return '';

    // Clean up the content
    let formatted = content
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    // Convert to paragraphs
    const paragraphs = formatted.split('\n\n');
    formatted = paragraphs.map(p => {
        p = p.trim();
        if (p.startsWith('•') || p.startsWith('-') || p.startsWith('*')) {
            return `<li>${p.substring(1).trim()}</li>`;
        }
        return `<p>${p}</p>`;
    }).join('');

    // Wrap list items in ul
    formatted = formatted.replace(/(<li>.*<\/li>)+/g, match => `<ul class="list-unstyled">${match}</ul>`);

    return formatted;
}

// Hide loading spinner
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Show error message
function showError(message) {
    const container = document.getElementById('careersGrid') || document.getElementById('careerDetail');
    if (container) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center py-5" role="alert">
                    <i class="bi bi-exclamation-triangle-fill fs-1 text-warning mb-3 d-block"></i>
                    <h4 class="alert-heading">${message}</h4>
                    <hr>
                    <p class="mb-0">
                        <a href="index.html" class="btn btn-warning">
                            <i class="bi bi-house-fill me-2"></i>Volver al inicio
                        </a>
                    </p>
                </div>
            </div>
        `;
    }
}

// Smooth scroll
document.documentElement.style.scrollBehavior = 'smooth';

// Add scroll to top button
window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        if (!document.getElementById('scrollTopBtn')) {
            const btn = document.createElement('button');
            btn.id = 'scrollTopBtn';
            btn.className = 'btn btn-warning position-fixed bottom-0 end-0 m-4 rounded-circle';
            btn.style.width = '50px';
            btn.style.height = '50px';
            btn.style.zIndex = '1000';
            btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
            btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.appendChild(btn);
        }
    } else {
        const btn = document.getElementById('scrollTopBtn');
        if (btn) btn.remove();
    }
});
