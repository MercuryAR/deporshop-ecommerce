// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    configurarBotones();
});

/**
 * Cargar carrito desde la API
 */
async function cargarCarrito() {
    try {
        const carrito = await obtenerCarrito();

        if (!carrito.items || carrito.items.length === 0) {
            mostrarCarritoVacio();
            actualizarResumen(0, 0);
            return;
        }

        mostrarCarritoLleno();
        renderizarItems(carrito.items);
        actualizarResumen(carrito.total, carrito.cantidad);

    } catch (error) {
        console.error('Error cargando carrito:', error);
        mostrarCarritoVacio();
    }
}

/**
 * Mostrar carrito vacío
 */
function mostrarCarritoVacio() {
    document.getElementById('carritoVacio').style.display = 'block';
    document.getElementById('carritoLleno').style.display = 'none';
    document.getElementById('btnProceder').disabled = true;
}

/**
 * Mostrar carrito lleno
 */
function mostrarCarritoLleno() {
    document.getElementById('carritoVacio').style.display = 'none';
    document.getElementById('carritoLleno').style.display = 'block';
    document.getElementById('btnProceder').disabled = false;
}

/**
 * Renderizar items del carrito
 */
function renderizarItems(items) {
    const container = document.getElementById('cartItems');

    container.innerHTML = items.map(item => `
        <div class="cart-item" style="
            display: grid;
            grid-template-columns: 100px 1fr auto;
            gap: var(--space-lg);
            padding: var(--space-lg);
            background: var(--color-bg);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            margin-bottom: var(--space-lg);
            align-items: center;
        ">
            <!-- Imagen placeholder -->
            <div style="
                width: 100px;
                height: 100px;
                background: var(--color-bg-tertiary);
                border-radius: var(--radius-lg);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--color-text-secondary);
                font-size: 2em;
            ">
                👟
            </div>

            <!-- Detalles -->
            <div>
                <h4 style="
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    margin-bottom: var(--space-sm);
                ">
                    ${item.nombre}
                </h4>
                <p style="
                    color: var(--color-text-secondary);
                    margin-bottom: var(--space-md);
                ">
                    ${formatearPrecio(item.precio)} c/u
                </p>

                <!-- Selector de cantidad -->
                <div style="display: flex; align-items: center; gap: var(--space-sm); width: fit-content;">
                    <button class="btn btn-sm" onclick="cambiarCantidad(${item.productoId}, ${item.cantidad - 1})">−</button>
                    <input type="number" value="${item.cantidad}" min="1" max="99"
                           onchange="cambiarCantidad(${item.productoId}, this.value)"
                           style="
                               width: 60px;
                               padding: var(--space-sm);
                               text-align: center;
                               border: 1px solid var(--color-border);
                               border-radius: var(--radius-md);
                           ">
                    <button class="btn btn-sm" onclick="cambiarCantidad(${item.productoId}, ${item.cantidad + 1})">+</button>
                </div>
            </div>

            <!-- Subtotal y eliminar -->
            <div style="text-align: right;">
                <div style="
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    color: var(--color-accent);
                    margin-bottom: var(--space-md);
                ">
                    ${formatearPrecio(item.subtotal)}
                </div>
                <button class="btn btn-error btn-sm"
                        onclick="eliminarItemDelCarrito(${item.productoId})">
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Actualizar resumen de carrito
 */
function actualizarResumen(total, cantidad) {
    document.getElementById('subtotal').textContent = formatearPrecio(total);
    document.getElementById('total').textContent = formatearPrecio(total);
    document.querySelector('.cart-badge').textContent = cantidad;
}

/**
 * Cambiar cantidad de producto
 */
async function cambiarCantidad(productoId, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);

    if (cantidad < 1) {
        await eliminarItemDelCarrito(productoId);
        return;
    }

    if (cantidad > 99) {
        mostrarNotificacion('Máximo 99 unidades por producto', 'warning');
        return;
    }

    try {
        await actualizarCantidadCarrito(productoId, cantidad);
        mostrarNotificacion('Cantidad actualizada', 'success');
        cargarCarrito();
    } catch (error) {
        console.error('Error actualizando cantidad:', error);
        mostrarNotificacion('Error al actualizar cantidad', 'error');
    }
}

/**
 * Eliminar producto del carrito
 */
async function eliminarItemDelCarrito(productoId) {
    try {
        await eliminarDelCarrito(productoId);
        mostrarNotificacion('Producto removido del carrito', 'success');
        cargarCarrito();
    } catch (error) {
        console.error('Error eliminando producto:', error);
        mostrarNotificacion('Error al eliminar producto', 'error');
    }
}

/**
 * Configurar botones de acción
 */
function configurarBotones() {
    // Botón Proceder a Pagar
    document.getElementById('btnProceder').addEventListener('click', async () => {
        const carrito = await obtenerCarrito();
        if (carrito.items && carrito.items.length > 0) {
            mostrarNotificacion('Redirigiendo a pago...', 'info');
            setTimeout(() => {
                window.location.href = 'compra.html?v=2';
            }, 1500);
        } else {
            mostrarNotificacion('El carrito está vacío', 'warning');
        }
    });

    // Botón Continuar Comprando
    document.getElementById('btnContinuar').addEventListener('click', () => {
        window.location.href = 'productos.html';
    });

    // Botón Vaciar Carrito
    document.getElementById('btnLimpiar').addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            try {
                await limpiarCarrito();
                mostrarNotificacion('Carrito vaciado', 'success');
                cargarCarrito();
            } catch (error) {
                console.error('Error vaciando carrito:', error);
                mostrarNotificacion('Error al vaciar carrito', 'error');
            }
        }
    });
}

/**
 * Agregar estilos para mejor UX
 */
const style = document.createElement('style');
style.textContent = `
    .btn-error {
        background: var(--color-error);
        color: white;
    }

    .btn-error:hover:not(:disabled) {
        opacity: 0.9;
    }

    input[type="number"] {
        font-family: var(--font-primary);
    }

    @media (max-width: 768px) {
        .cart-item {
            grid-template-columns: 1fr !important;
        }
    }
`;
document.head.appendChild(style);
