document.addEventListener('DOMContentLoaded', () => {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const closeSearchBtn = document.getElementById('closeSearch');
    const searchForm = document.getElementById('searchForm');

    // Expose toggle function globally if needed, or attach event listeners directly
    window.toggleSearch = function() {
        const isHidden = searchOverlay.getAttribute('aria-hidden') === 'true';
        searchOverlay.setAttribute('aria-hidden', !isHidden);
        searchOverlay.classList.toggle('active');
        
        if (isHidden) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            setTimeout(() => searchInput.focus(), 100);
        } else {
            document.body.style.overflow = '';
        }
    };

    closeSearchBtn.addEventListener('click', toggleSearch);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            toggleSearch();
        }
    });

    // Handle form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (query) {
            sessionStorage.setItem('searchQuery', query);
            window.location.href = 'productos.html';
        }
    });
    
    // Close when clicking outside the content
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            toggleSearch();
        }
    });
});
