/**
 * Sistema de Carrito de Compras - DeporShop
 * Usa localStorage para persistir datos
 */

// Clase para manejar el carrito
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartBadge();
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const cart = localStorage.getItem('deporshop_cart');
        return cart ? JSON.parse(cart) : [];
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('deporshop_cart', JSON.stringify(this.items));
        this.updateCartBadge();
    }

    // Agregar producto al carrito
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification(`${product.name} agregado al carrito`);
        return true;
    }

    // Eliminar producto del carrito
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Producto eliminado del carrito');
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Vaciar todo el carrito
    clearCart() {
        this.items = [];
        this.saveCart();
        this.showNotification('Carrito vaciado');
    }

    // Obtener total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Obtener costo de envío
    getShipping() {
        const subtotal = this.getSubtotal();
        return subtotal >= 50000 ? 0 : 3500; // Envío gratis +$50,000
    }

    // Obtener total final
    getTotal() {
        return this.getSubtotal() + this.getShipping();
    }

    // Actualizar badge del carrito en el header
    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const total = this.getTotalItems();
        badges.forEach(badge => {
            badge.textContent = total;
            badge.style.display = total > 0 ? 'flex' : 'none';
        });
    }

    // Mostrar notificación
    showNotification(message) {
        // Verificar si ya existe una notificación
        let notification = document.querySelector('.cart-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'cart-notification';
            document.body.appendChild(notification);
        }

        notification.textContent = message;
        notification.classList.add('show');

        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Inicializar carrito global
const cart = new ShoppingCart();

// Función helper para agregar al carrito desde botones
function addToCart(productData) {
    cart.addItem(productData);
}

// Función para formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    }).format(price);
}

// CSS para notificaciones (inyectado dinámicamente)
if (!document.getElementById('cart-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'cart-notification-styles';
    style.textContent = `
        .cart-notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            font-weight: var(--font-weight-medium);
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: none;
        }

        .cart-notification.show {
            opacity: 1;
            transform: translateY(0);
        }

        @media (max-width: 768px) {
            .cart-notification {
                bottom: 20px;
                right: 20px;
                left: 20px;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
}

// Exportar para uso global
window.ShoppingCart = ShoppingCart;
window.cart = cart;
window.addToCart = addToCart;
window.formatPrice = formatPrice;
