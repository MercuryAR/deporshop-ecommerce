let productos = []
let total = 0

function agregarProducto(producto, precio) {
    // Agrega el producto al array
    productos.push({nombre: producto, precio: precio})

    // Actualizar el total
    total += precio
    document.getElementById("precioTotal").textContent = `Total: \$${total}`
}
function finalizarCompra() {
    localStorage.setItem('productos', JSON.stringify(productos))
    localStorage.setItem('total', total)

    alert("Total a pagar: $ " + total)
    window.location.href = "compra.html"
}
