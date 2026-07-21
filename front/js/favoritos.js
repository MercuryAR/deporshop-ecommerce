/**
 * Sistema de Favoritos - DeporShop
 * Maneja productos marcados como favoritos usando localStorage
 */

class Favorites {
    constructor() {
        this.items = this.loadFavorites();
    }

    /**
     * Cargar favoritos desde localStorage
     */
    loadFavorites() {
        try {
            const stored = localStorage.getItem('deporshop_favorites');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error al cargar favoritos:', error);
            return [];
        }
    }

    /**
     * Guardar favoritos en localStorage
     */
    saveFavorites() {
        try {
            localStorage.setItem('deporshop_favorites', JSON.stringify(this.items));
            this.updateFavoriteBadge();
        } catch (error) {
            console.error('Error al guardar favoritos:', error);
        }
    }

    /**
     * Alternar producto como favorito
     */
    toggle(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        
        if (index > -1) {
            // Si existe, eliminar
            this.items.splice(index, 1);
            this.saveFavorites();
            this.showNotification(`${product.name} eliminado de favoritos`);
            return false;
        } else {
            // Si no existe, agregar
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                addedAt: new Date().toISOString()
            });
            this.saveFavorites();
            this.showNotification(`${product.name} agregado a favoritos ❤️`);
            return true;
        }
    }

    /**
     * Verificar si un producto es favorito
     */
    isFavorite(productId) {
        return this.items.some(item => item.id === productId);
    }

    /**
     * Obtener todos los favoritos
     */
    getAll() {
        return this.items;
    }

    /**
     * Obtener cantidad de favoritos
     */
    getCount() {
        return this.items.length;
    }

    /**
     * Eliminar un favorito
     */
    remove(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        if (index > -1) {
            const removed = this.items.splice(index, 1)[0];
            this.saveFavorites();
            this.showNotification(`${removed.name} eliminado de favoritos`);
            return true;
        }
        return false;
    }

    /**
     * Limpiar todos los favoritos
     */
    clear() {
        this.items = [];
        this.saveFavorites();
        this.showNotification('Favoritos limpiados');
    }

    /**
     * Actualizar badge de favoritos en el header
     */
    updateFavoriteBadge() {
        const badges = document.querySelectorAll('.favorite-badge');
        const count = this.getCount();
        badges.forEach(badge => {
            badge.textContent = count;
            if (count > 0) {
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    /**
     * Actualizar estados visuales de los botones de favoritos
     */
    updateFavoriteButtons() {
        document.querySelectorAll('.product-card__wishlist').forEach((button, index) => {
            const productId = index + 1; // IDs de 1 a 8
            const isFav = this.isFavorite(productId);
            
            if (isFav) {
                button.classList.add('active');
                button.setAttribute('aria-label', 'Quitar de favoritos');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-label', 'Agregar a favoritos');
            }
        });
    }

    /**
     * Mostrar notificación
     */
    showNotification(message) {
        // Verificar si ya existe un contenedor de notificaciones
        let container = document.getElementById('favorites-notification-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'favorites-notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        // Crear notificación
        const notification = document.createElement('div');
        notification.className = 'favorite-notification';
        notification.textContent = message;
        notification.style.cssText = `
            background: var(--color-primary);
            color: white;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            font-size: var(--font-size-sm);
            font-weight: 500;
            animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
            pointer-events: auto;
            min-width: 250px;
        `;

        container.appendChild(notification);

        // Eliminar después de 3 segundos
        setTimeout(() => {
            notification.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 3000);
    }
}

// Agregar animaciones CSS
const favoriteStyles = document.createElement('style');
favoriteStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    .product-card__wishlist.active {
        background: var(--color-primary) !important;
        color: white !important;
    }

    .product-card__wishlist.active svg {
        fill: white !important;
        stroke: white !important;
    }
`;
document.head.appendChild(favoriteStyles);

// Crear instancia global de Favorites
const favorites = new Favorites();

// Exportar a window para uso global
window.Favorites = Favorites;
window.favorites = favorites;

// Función helper para agregar a favoritos
window.toggleFavorite = function(product) {
    const isFavorite = favorites.toggle(product);
    // Actualizar botones después de toggle
    favorites.updateFavoriteButtons();
    return isFavorite;
};

// Inicializar estados visuales al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    favorites.updateFavoriteButtons();
    favorites.updateFavoriteBadge();
});
