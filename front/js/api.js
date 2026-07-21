// DeporShop API Client
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Realizar petición GET
 */
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error (GET):', error);
        throw error;
    }
}

/**
 * Realizar petición POST
 */
async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || `Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error (POST):', error);
        throw error;
    }
}

/**
 * Realizar petición PUT
 */
async function apiPut(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error (PUT):', error);
        throw error;
    }
}

/**
 * Realizar petición DELETE
 */
async function apiDelete(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.status === 204 ? null : await response.json();
    } catch (error) {
        console.error('API Error (DELETE):', error);
        throw error;
    }
}

// ============================================
// CATEGORÍAS
// ============================================

async function obtenerCategorias() {
    return apiGet('/categorias');
}

async function obtenerCategoria(id) {
    return apiGet(`/categorias/${id}`);
}

async function crearCategoria(nombre) {
    return apiPost('/categorias', { nombre });
}

async function actualizarCategoria(id, nombre) {
    return apiPut(`/categorias/${id}`, { nombre });
}

async function eliminarCategoria(id) {
    return apiDelete(`/categorias/${id}`);
}

// ============================================
// PRODUCTOS
// ============================================

async function obtenerProductos(filtros = {}) {
    let url = '/productos';
    const params = new URLSearchParams();

    if (filtros.categoriaId) {
        params.append('categoriaId', filtros.categoriaId);
    }
    if (filtros.buscar) {
        params.append('buscar', filtros.buscar);
    }

    if (params.toString()) {
        url += '?' + params.toString();
    }

    return apiGet(url);
}

async function obtenerProducto(id) {
    return apiGet(`/productos/${id}`);
}

async function obtenerProductosPorCategoria(categoriaId) {
    return apiGet(`/productos/categoria/${categoriaId}`);
}

async function buscarProductos(termino) {
    return apiGet(`/productos/buscar/${termino}`);
}

async function crearProducto(producto) {
    return apiPost('/productos', producto);
}

async function actualizarProducto(id, producto) {
    return apiPut(`/productos/${id}`, producto);
}

async function eliminarProducto(id) {
    return apiDelete(`/productos/${id}`);
}

// ============================================
// CARRITO
// ============================================

async function obtenerCarrito() {
    return apiGet('/carrito');
}

async function agregarAlCarrito(productoId, cantidad = 1) {
    return apiPost(`/carrito/agregar?productoId=${productoId}&cantidad=${cantidad}`, {});
}

async function eliminarDelCarrito(productoId) {
    return apiDelete(`/carrito/eliminar/${productoId}`);
}

async function actualizarCantidadCarrito(productoId, cantidad) {
    return apiPut(`/carrito/actualizar/${productoId}?cantidad=${cantidad}`, {});
}

async function limpiarCarrito() {
    return apiDelete('/carrito/limpiar');
}

async function obtenerTotalCarrito() {
    return apiGet('/carrito/total');
}

// ============================================
// ÓRDENES
// ============================================

async function crearOrden(datosCheckout) {
    return apiPost('/ordenes', datosCheckout);
}

async function obtenerOrden(numero) {
    return apiGet(`/ordenes/${encodeURIComponent(numero)}`);
}

async function obtenerOrdenesPorEmail(email) {
    return apiGet(`/ordenes?email=${encodeURIComponent(email)}`);
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Formatear precio a moneda local
 */
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(precio);
}

/**
 * Mostrar notificación
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;

    const colors = {
        success: '#10B981',
        error: '#EF4444',
        info: '#3B82F6',
        warning: '#F59E0B'
    };

    notificacion.style.backgroundColor = colors[tipo] || colors.info;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

/**
 * Validar conexión con API
 */
async function verificarAPI() {
    try {
        await obtenerCategorias();
        console.log('✓ API conectada');
        return true;
    } catch (error) {
        console.error('✗ API no disponible:', error);
        mostrarNotificacion('Error: No se pudo conectar con el servidor', 'error');
        return false;
    }
}

// Verificar API al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verificarAPI);
} else {
    verificarAPI();
}
