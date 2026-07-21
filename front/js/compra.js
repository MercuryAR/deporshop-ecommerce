let carritoCheckout = null;

document.addEventListener('DOMContentLoaded', () => {
    autocompletarDatosUsuario();
    cargarCheckout();
    document.getElementById('checkoutForm').addEventListener('submit', confirmarPedido);
});

function autocompletarDatosUsuario() {
    const userJson = localStorage.getItem('deporshop_user');
    if (!userJson) {
        return;
    }

    try {
        const user = JSON.parse(userJson);
        const nombreCompleto = String(user.name || user.nombre || '').trim();
        const partesNombre = nombreCompleto.split(/\s+/).filter(Boolean);
        const nombre = partesNombre.shift() || '';
        const apellido = partesNombre.join(' ');

        const datos = {
            nombre,
            apellido,
            movil: user.phone || user.telefono || user.movil || '',
            correo: user.email || user.correo || '',
            direccion: user.address || user.direccion || '',
            ciudad: user.city || user.ciudad || '',
            codigoPostal: user.postalCode || user.codigoPostal || ''
        };

        let camposCompletados = 0;
        Object.entries(datos).forEach(([id, value]) => {
            const input = document.getElementById(id);
            if (input && !input.value && String(value).trim()) {
                input.value = String(value).trim();
                camposCompletados += 1;
            }
        });

        if (camposCompletados > 0) {
            document.getElementById('checkoutAutofill').hidden = false;
        }
    } catch (error) {
        console.warn('No se pudieron recuperar los datos del perfil:', error);
    }
}

async function cargarCheckout() {
    const itemsContainer = document.getElementById('checkoutItems');
    const totalElement = document.getElementById('checkoutTotal');
    const submitButton = document.getElementById('confirmPurchase');

    try {
        carritoCheckout = await obtenerCarrito();
        const items = carritoCheckout.items || [];

        if (items.length === 0) {
            itemsContainer.innerHTML = `
                <div class="checkout-summary__empty">
                    <p>Tu carrito está vacío.</p>
                    <a href="productos.html">Ver productos</a>
                </div>
            `;
            totalElement.textContent = formatearPrecio(0);
            submitButton.disabled = true;
            return;
        }

        itemsContainer.replaceChildren(...items.map(crearItemResumen));
        totalElement.textContent = formatearPrecio(carritoCheckout.total);
        submitButton.disabled = false;
    } catch (error) {
        console.error('No se pudo cargar el checkout:', error);
        itemsContainer.textContent = 'No pudimos cargar tu carrito.';
        totalElement.textContent = formatearPrecio(0);
        submitButton.disabled = true;
        mostrarErrorCheckout('No se pudo conectar con el servidor. Vuelve al carrito e inténtalo nuevamente.');
    }
}

function crearItemResumen(item) {
    const row = document.createElement('div');
    row.className = 'checkout-summary__item';

    const details = document.createElement('div');
    const name = document.createElement('strong');
    const quantity = document.createElement('span');
    name.textContent = item.nombre;
    quantity.textContent = `Cantidad: ${item.cantidad}`;
    details.append(name, quantity);

    const subtotal = document.createElement('strong');
    subtotal.textContent = formatearPrecio(item.subtotal);

    row.append(details, subtotal);
    return row;
}

async function confirmarPedido(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = document.getElementById('confirmPurchase');
    const errorElement = document.getElementById('checkoutError');
    errorElement.hidden = true;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Procesando…';

    try {
        const datosCheckout = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            correo: document.getElementById('correo').value.trim(),
            telefono: document.getElementById('movil').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            ciudad: document.getElementById('ciudad').value.trim(),
            codigoPostal: document.getElementById('codigoPostal').value.trim(),
            metodoPago: document.getElementById('metodoPago').value
        };

        const orden = await crearOrden(datosCheckout);
        mostrarConfirmacion(datosCheckout.nombre, orden);
    } catch (error) {
        console.error('No se pudo confirmar el pedido:', error);
        mostrarErrorCheckout(error.message || 'No pudimos confirmar el pedido. Inténtalo nuevamente.');
        submitButton.disabled = false;
        submitButton.textContent = 'Confirmar pedido';
    }
}

function mostrarConfirmacion(nombre, orden) {
    const layout = document.querySelector('.checkout__layout');
    const header = document.querySelector('.checkout__header');
    const success = document.getElementById('purchaseSuccess');
    const message = document.getElementById('purchaseSuccessMessage');

    message.textContent = `${nombre}, registramos el pedido ${orden.numero} por ${formatearPrecio(orden.total)}. El pago quedó en estado ${orden.pago.estado.toLowerCase()}.`;
    layout.hidden = true;
    header.hidden = true;
    success.hidden = false;
    success.focus({ preventScroll: true });
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function mostrarErrorCheckout(mensaje) {
    const errorElement = document.getElementById('checkoutError');
    errorElement.textContent = mensaje;
    errorElement.hidden = false;
}
