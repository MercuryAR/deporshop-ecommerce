document.addEventListener('DOMContentLoaded', () => {
    // Enhanced Product Data
    const products = [
        { id: 1, name: 'Nike Air Max 270 React', price: 15999, image: 'img/zapatillahombre1.jpeg', brand: 'nike', category: 'casual' },
        { id: 2, name: 'Adidas Ultraboost 22', price: 17499, image: 'img/zapatillahombre2.jpeg', brand: 'adidas', category: 'running' },
        { id: 3, name: 'Puma RS-X³ Puzzle', price: 12999, image: 'img/zapatillahombre3.jpeg', brand: 'puma', category: 'casual' },
        { id: 4, name: 'New Balance 574 Core', price: 10999, image: 'img/zapatillahombre4.jpeg', brand: 'nb', category: 'casual' },
        { id: 5, name: 'Reebok Classic Leather', price: 8999, image: 'img/zapatillahombre5.jpeg', brand: 'reebok', category: 'casual' },
        { id: 6, name: 'Converse Chuck Taylor All Star', price: 6999, image: 'img/zapatillahombre6.jpeg', brand: 'converse', category: 'casual' },
        { id: 7, name: 'Vans Old Skool Platform', price: 9499, image: 'img/zapatillahombre7.jpeg', brand: 'vans', category: 'casual' },
        { id: 8, name: 'Asics Gel-Kayano 29', price: 18999, image: 'img/zapatillahombre8.jpeg', brand: 'asics', category: 'running' }
    ];

    const productsGrid = document.querySelector('.products-grid');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const brandSelect = document.getElementById('brand');
    const sortSelect = document.getElementById('sort');

    // Render Products
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';

        if (productsToRender.length === 0) {
            productsGrid.innerHTML = '<div class="no-results"><p>No se encontraron productos.</p></div>';
            return;
        }

        productsToRender.forEach(product => {
            const article = document.createElement('article');
            article.className = 'product-card';
            article.innerHTML = `
                <div class="product-card__image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-card__image">
                    <button class="product-card__wishlist" aria-label="Agregar a favoritos" onclick="toggleFavorite(${product.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                <div class="product-card__content">
                    <span class="product-card__brand">${product.brand.toUpperCase()}</span>
                    <h3 class="product-card__title">${product.name}</h3>
                    <div class="product-card__rating">
                        <span class="product-card__stars">★★★★★</span>
                    </div>
                    <div class="product-card__footer">
                        <span class="product-card__price">$${product.price.toLocaleString()}</span>
                        <button class="product-card__add-to-cart" onclick="addToCart(${product.id})">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Agregar
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(article);
        });
    }

    // Filter Function
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryValue = categorySelect.value.toLowerCase();
        const brandValue = brandSelect.value.toLowerCase();
        const sortValue = sortSelect.value;

        let filtered = products.filter(product => {
            const matchSearch = product.name.toLowerCase().includes(searchTerm) || product.brand.toLowerCase().includes(searchTerm);
            const matchCategory = categoryValue === '' || product.category === categoryValue;
            const matchBrand = brandValue === '' || product.brand === brandValue;
            return matchSearch && matchCategory && matchBrand;
        });

        // Sort
        if (sortValue === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortValue === 'newest') {
            filtered.sort((a, b) => b.id - a.id); // Assuming higher ID is newer
        }

        renderProducts(filtered);
    }

    // Event Listeners
    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
    brandSelect.addEventListener('change', filterProducts);
    sortSelect.addEventListener('change', filterProducts);

    // Check Session Storage for Search Query from Home Page
    const sessionQuery = sessionStorage.getItem('searchQuery');
    if (sessionQuery) {
        searchInput.value = sessionQuery;
        sessionStorage.removeItem('searchQuery');
        filterProducts();
    } else {
        renderProducts(products); // Initial render
    }

    // Mock functions for cart/favorite if they don't exist globally
    window.addToCart = window.addToCart || function (id) {
        console.log('Added to cart:', id);
        // You might want to call the actual cart logic here if available
    };

    window.toggleFavorite = window.toggleFavorite || function (id) {
        console.log('Toggled favorite:', id);
    };
});
