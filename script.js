// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname;

    // We only need specific setup for the index page since career pages are static
    if (!currentPage.includes('carreras/')) {
        setupSearch();
        setupClearButton();
        hideLoading(); // Ensure loading is hidden on static load
    }
});

// Setup search functionality for static HTML cards
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.career-card-container');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('resultCount');
    const divisionHeaders = document.querySelectorAll('.division-header');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        // Reset visibility for headers first
        const headerCounts = new Map();
        divisionHeaders.forEach(header => {
            const divisionContainer = header.closest('.col-12');
            divisionContainer.style.display = searchTerm === '' ? 'block' : 'none';
        });

        cards.forEach(card => {
            const nombre = card.getAttribute('data-nombre').toLowerCase();
            const category = card.getAttribute('data-category').toLowerCase();
            const content = card.textContent.toLowerCase();

            if (nombre.includes(searchTerm) || category.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
                visibleCount++;

                // Show the corresponding division header if searching
                const prevDivisionHeader = findPreviousDivisionHeader(card);
                if (prevDivisionHeader) {
                    prevDivisionHeader.style.display = 'block';
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Update counts and no results message
        if (resultCount) resultCount.textContent = visibleCount;

        if (visibleCount === 0) {
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
        }
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
