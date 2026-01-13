// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;

    // We only need specific setup for the index page since career pages are static
    if (!currentPage.includes('carreras/')) {
        setupSearch();
        setupFilters();
        setupClearButton();
        applyFiltersAndSearch(); // Initial count
        hideLoading(); // Ensure loading is hidden on static load
    }
});

// Setup search functionality for static HTML cards
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        applyFiltersAndSearch();
    });
}

// New function to handle both filters and search
function applyFiltersAndSearch() {
    const searchInput = document.getElementById('searchInput');
    const activeFilter = document.querySelector('.filter-btn.active');
    const selectedCategory = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const cards = document.querySelectorAll('.career-card-container');
    const divisionHeaders = document.querySelectorAll('.col-12.division-section');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('resultCount');

    let visibleCount = 0;

    // First hide headers
    divisionHeaders.forEach(header => {
        header.style.display = 'none';
    });

    cards.forEach(card => {
        const nombre = card.getAttribute('data-nombre').toLowerCase();
        const category = card.getAttribute('data-category') || '';
        const cardContent = card.textContent.toLowerCase();

        const matchesSearch = searchTerm === '' ||
            nombre.includes(searchTerm) ||
            category.toLowerCase().includes(searchTerm) ||
            cardContent.includes(searchTerm);

        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            visibleCount++;

            // Show corresponding division header
            const prevHeader = findPreviousDivisionHeader(card);
            if (prevHeader) prevHeader.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    if (resultCount) resultCount.textContent = visibleCount;
    if (noResults) {
        if (visibleCount === 0) noResults.classList.remove('d-none');
        else noResults.classList.add('d-none');
    }
}

// Setup category filters
function setupFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            applyFiltersAndSearch();
        });
    });
}

function findPreviousDivisionHeader(card) {
    let prev = card.previousElementSibling;
    while (prev) {
        if (prev.classList.contains('col-12') && prev.querySelector('.division-header')) {
            return prev;
        }
        prev = prev.previousElementSibling;
    }
    return null;
}

// Setup clear search button
function setupClearButton() {
    const clearBtn = document.getElementById('clearSearch');
    const searchInput = document.getElementById('searchInput');

    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            // Trigger input event to reset visibility
            searchInput.dispatchEvent(new Event('input'));
        });
    }
}

// Hide loading spinner
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
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
