// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarCartBadge();
});

/**
 * Cargar productos desde la API y mostrarlos
 */
async function cargarProductos() {
    const container = document.getElementById('productosContainer');

    try {
        const productos = await obtenerProductos();

        if (productos.length === 0) {
            container.innerHTML = '<p>No hay productos disponibles</p>';
            return;
        }

        // Mostrar solo los primeros 6 productos en la página de inicio
        const productosDestacados = productos.slice(0, 6);

        container.innerHTML = productosDestacados.map(producto => `
            <article class="product-card">
                <div class="product-card__image-container">
                    <img src="${producto.imagenUrl || 'img/placeholder.svg'}"
                         alt="${producto.nombre}"
                         class="product-card__image"
                         onerror="this.onerror=null; this.src='img/placeholder.svg'">
                    <button class="product-card__wishlist"
                            aria-label="Agregar a favoritos"
                            onclick="toggleWishlist(this)">
                        ♡
                    </button>
                    ${producto.descuento > 0 ? `
                        <div class="product-card__badge">
                            -${Math.round(producto.descuento)}%
                        </div>
                    ` : ''}
                </div>

                <div class="product-card__content">
                    <p class="product-card__brand">${producto.categoria?.nombre || 'Producto'}</p>
                    <h3 class="product-card__title">${producto.nombre}</h3>

                    ${producto.rating > 0 ? `
                        <div class="product-card__rating">
                            <span class="product-card__stars">${'★'.repeat(Math.round(producto.rating))}${'☆'.repeat(5 - Math.round(producto.rating))}</span>
                            <span class="product-card__reviews">(${producto.resenas} reseñas)</span>
                        </div>
                    ` : ''}

                    <div class="product-card__footer">
                        <div class="product-card__price">
                            ${producto.descuento > 0 ? `
                                <span class="product-card__original-price">
                                    ${formatearPrecio(producto.precio)}
                                </span>
                                <span class="product-card__sale-price">
                                    ${formatearPrecio(producto.getPrecioConDescuento ? producto.getPrecioConDescuento() : producto.precio * (1 - producto.descuento / 100))}
                                </span>
                            ` : `
                                <span class="product-card__price-value">
                                    ${formatearPrecio(producto.precio)}
                                </span>
                            `}
                        </div>
                        <button class="btn btn-accent btn-sm"
                                onclick="agregarAlCarritoConUI(${producto.id}, '${producto.nombre}')">
                            Agregar
                        </button>
                    </div>

                    ${producto.stock === 0 ? `
                        <div class="product-card__out-of-stock">Agotado</div>
                    ` : producto.stock < 5 ? `
                        <p class="product-card__stock-warning">Quedan ${producto.stock} unidades</p>
                    ` : ''}
                </div>
            </article>
        `).join('');

    } catch (error) {
        console.error('Error al cargar productos:', error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p style="color: var(--color-error);">
                    Error al cargar productos. Asegúrate de que el servidor está ejecutándose en http://localhost:8080
                </p>
            </div>
        `;
    }
}

/**
 * Agregar producto al carrito con feedback de UI
 */
async function agregarAlCarritoConUI(productoId, nombreProducto) {
    try {
        await agregarAlCarrito(productoId, 1);
        mostrarNotificacion(`${nombreProducto} agregado al carrito`, 'success');
        actualizarCartBadge();
    } catch (error) {
        mostrarNotificacion('Error al agregar al carrito', 'error');
        console.error(error);
    }
}

/**
 * Actualizar el badge del carrito en el header
 */
async function actualizarCartBadge() {
    try {
        const carrito = await obtenerCarrito();
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = carrito.cantidad || 0;
        }
    } catch (error) {
        console.error('Error al actualizar badge:', error);
    }
}

/**
 * Toggle wishlist (agregar/quitar de favoritos)
 */
function toggleWishlist(button) {
    button.classList.toggle('liked');
    if (button.classList.contains('liked')) {
        button.textContent = '❤';
        mostrarNotificacion('Agregado a favoritos', 'success');
    } else {
        button.textContent = '♡';
        mostrarNotificacion('Removido de favoritos', 'info');
    }
}

/**
 * Agregar estilos CSS dinámicos para el estado "liked"
 */
const style = document.createElement('style');
style.textContent = `
    .product-card__wishlist.liked {
        background: var(--color-accent);
        color: white;
    }

    .product-card__original-price {
        text-decoration: line-through;
        color: var(--color-text-secondary);
        font-size: 0.9em;
        margin-right: var(--space-sm);
    }

    .product-card__sale-price {
        color: var(--color-error);
        font-weight: var(--font-weight-bold);
    }

    .product-card__out-of-stock {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: var(--font-weight-bold);
        border-radius: var(--radius-lg);
    }

    .product-card__stock-warning {
        color: var(--color-warning);
        font-size: 0.85em;
        font-weight: var(--font-weight-semibold);
        text-align: center;
        padding-top: var(--space-sm);
    }
`;
document.head.appendChild(style);
