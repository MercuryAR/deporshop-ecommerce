// Estado global de productos
let productosGlobal = [];
let categoriasGlobal = [];

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarProductos();
    configurarFiltros();
    actualizarCartBadge();
});

/**
 * Cargar categorías y populat el filtro
 */
async function cargarCategorias() {
    try {
        const categorias = await obtenerCategorias();
        categoriasGlobal = categorias;

        const filterContainer = document.getElementById('categoriesFilter');
        const radioBtns = filterContainer.querySelectorAll('input[type="radio"]');

        categorias.forEach(cat => {
            const label = document.createElement('label');
            label.style.cssText = `
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                cursor: pointer;
            `;
            label.innerHTML = `
                <input type="radio" name="categoria" value="${cat.id}">
                <span>${cat.nombre}</span>
            `;
            filterContainer.appendChild(label);
        });

    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

/**
 * Cargar productos desde la API
 */
async function cargarProductos() {
    try {
        const productos = await obtenerProductos();
        productosGlobal = productos;
        aplicarFiltrosYMostrar();
    } catch (error) {
        console.error('Error cargando productos:', error);
        mostrarError('No se pudieron cargar los productos');
    }
}

/**
 * Aplicar filtros y mostrar productos
 */
function aplicarFiltrosYMostrar() {
    let productosFiltrados = [...productosGlobal];

    // Filtro de categoría
    const categoriaSeleccionada = document.querySelector('input[name="categoria"]:checked').value;
    if (categoriaSeleccionada !== 'all') {
        productosFiltrados = productosFiltrados.filter(p => p.categoria?.id == categoriaSeleccionada);
    }

    // Filtro de stock
    if (document.getElementById('soloEnStock').checked) {
        productosFiltrados = productosFiltrados.filter(p => p.stock > 0);
    }

    // Filtro de descuento
    if (document.getElementById('soloConDescuento').checked) {
        productosFiltrados = productosFiltrados.filter(p => p.descuento > 0);
    }

    // Ordenar
    const ordenar = document.getElementById('ordenar').value;
    productosFiltrados = ordenarProductos(productosFiltrados, ordenar);

    // Mostrar resultados
    mostrarProductos(productosFiltrados);
    actualizarConteo(productosFiltrados.length);
}

/**
 * Ordenar productos según criterio
 */
function ordenarProductos(productos, criterio) {
    const sorted = [...productos];

    switch(criterio) {
        case 'precio-asc':
            return sorted.sort((a, b) => (a.precio * (1 - a.descuento/100)) - (b.precio * (1 - b.descuento/100)));
        case 'precio-desc':
            return sorted.sort((a, b) => (b.precio * (1 - b.descuento/100)) - (a.precio * (1 - a.descuento/100)));
        case 'nombre':
            return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        default:
            return sorted;
    }
}

/**
 * Mostrar productos en el grid
 */
function mostrarProductos(productos) {
    const container = document.getElementById('productosContainer');

    if (productos.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <p style="font-size: var(--font-size-lg); color: var(--color-text-secondary);">
                    No hay productos que coincidan con tus filtros
                </p>
                <button class="btn btn-primary" onclick="limpiarFiltros()" style="margin-top: var(--space-lg);">
                    Limpiar filtros
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = productos.map(producto => `
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
                        <span class="product-card__reviews">(${producto.resenas})</span>
                    </div>
                ` : ''}

                <div class="product-card__footer">
                    <div class="product-card__price">
                        ${producto.descuento > 0 ? `
                            <span class="product-card__original-price">
                                ${formatearPrecio(producto.precio)}
                            </span>
                            <span class="product-card__sale-price">
                                ${formatearPrecio(producto.precio * (1 - producto.descuento / 100))}
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
                    <div style="position: relative; color: var(--color-error); font-weight: var(--font-weight-bold); text-align: center; margin-top: var(--space-md);">
                        Agotado
                    </div>
                ` : producto.stock < 5 ? `
                    <p style="color: var(--color-warning); font-size: 0.85em; font-weight: var(--font-weight-semibold); text-align: center; padding-top: var(--space-sm);">
                        Quedan ${producto.stock} unidades
                    </p>
                ` : ''}
            </div>
        </article>
    `).join('');
}

/**
 * Configurar listeners de filtros
 */
function configurarFiltros() {
    // Cambio de categoría
    document.addEventListener('change', (e) => {
        if (e.target.name === 'categoria' ||
            e.target.id === 'soloEnStock' ||
            e.target.id === 'soloConDescuento') {
            aplicarFiltrosYMostrar();
        }
    });

    // Cambio de ordenamiento
    document.getElementById('ordenar').addEventListener('change', aplicarFiltrosYMostrar);
}

/**
 * Actualizar conteo de productos
 */
function actualizarConteo(cantidad) {
    document.getElementById('productCount').textContent = cantidad;
}

/**
 * Limpiar todos los filtros
 */
function limpiarFiltros() {
    document.querySelector('input[name="categoria"][value="all"]').checked = true;
    document.getElementById('soloEnStock').checked = false;
    document.getElementById('soloConDescuento').checked = false;
    document.getElementById('ordenar').value = 'relevancia';
    aplicarFiltrosYMostrar();
}

/**
 * Agregar producto al carrito con feedback
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
 * Actualizar badge del carrito
 */
async function actualizarCartBadge() {
    try {
        const carrito = await obtenerCarrito();
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = carrito.cantidad || 0;
        }
    } catch (error) {
        console.error('Error actualizando badge:', error);
    }
}

/**
 * Toggle wishlist
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
 * Mostrar error
 */
function mostrarError(mensaje) {
    const container = document.getElementById('productosContainer');
    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
            <p style="color: var(--color-error); font-weight: var(--font-weight-semibold);">
                ${mensaje}
            </p>
            <p style="color: var(--color-text-secondary); margin-top: var(--space-md);">
                Asegúrate de que el servidor está ejecutándose en http://localhost:8080
            </p>
        </div>
    `;
}
