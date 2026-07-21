package com.deporshop.service;

import com.deporshop.dto.CrearOrdenRequest;
import com.deporshop.dto.OrdenResponse;
import com.deporshop.model.*;
import com.deporshop.repository.OrdenRepository;
import com.deporshop.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class OrdenService {

    private static final List<String> METODOS_PERMITIDOS = List.of(
        "TARJETA", "TRANSFERENCIA", "EFECTIVO"
    );

    private final OrdenRepository ordenRepository;
    private final ProductoRepository productoRepository;
    private final CarritoService carritoService;

    public OrdenService(
        OrdenRepository ordenRepository,
        ProductoRepository productoRepository,
        CarritoService carritoService
    ) {
        this.ordenRepository = ordenRepository;
        this.productoRepository = productoRepository;
        this.carritoService = carritoService;
    }

    @Transactional
    public OrdenResponse crearOrden(CrearOrdenRequest request) {
        List<CarritoItem> carrito = carritoService.obtenerCarrito();
        if (carrito.isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacío");
        }

        String metodoPago = normalizarMetodoPago(request.metodoPago());
        Orden orden = construirOrden(request);
        BigDecimal total = BigDecimal.ZERO;

        for (CarritoItem carritoItem : carrito) {
            Producto producto = productoRepository.findById(carritoItem.productoId)
                .orElseThrow(() -> new IllegalArgumentException(
                    "El producto " + carritoItem.nombre + " ya no está disponible"
                ));

            if (carritoItem.cantidad > producto.stock) {
                throw new IllegalArgumentException(
                    "Stock insuficiente para " + producto.nombre + ". Disponible: " + producto.stock
                );
            }

            BigDecimal precio = dinero(carritoItem.precio);
            BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(carritoItem.cantidad))
                .setScale(2, RoundingMode.HALF_UP);

            OrdenItem item = new OrdenItem();
            item.productoId = producto.id;
            item.productoNombre = producto.nombre;
            item.cantidad = carritoItem.cantidad;
            item.precioUnitario = precio;
            item.subtotal = subtotal;
            orden.agregarItem(item);

            producto.stock -= carritoItem.cantidad;
            total = total.add(subtotal);
        }

        orden.total = total.setScale(2, RoundingMode.HALF_UP);

        Pago pago = new Pago();
        pago.proveedor = "PENDIENTE_INTEGRACION";
        pago.metodo = metodoPago;
        pago.importe = orden.total;
        pago.moneda = orden.moneda;
        pago.estado = EstadoPago.PENDIENTE;
        orden.agregarPago(pago);

        Orden guardada = ordenRepository.saveAndFlush(orden);
        OrdenResponse response = convertirRespuesta(guardada);

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                carritoService.limpiarCarrito();
            }
        });

        return response;
    }

    @Transactional(readOnly = true)
    public OrdenResponse obtenerPorNumero(String numero) {
        Orden orden = ordenRepository.findByNumero(numero)
            .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada"));
        return convertirRespuesta(orden);
    }

    @Transactional(readOnly = true)
    public List<OrdenResponse> obtenerPorEmail(String email) {
        return ordenRepository.findByClienteEmailOrderByCreadaEnDesc(email.trim().toLowerCase(Locale.ROOT))
            .stream()
            .map(this::convertirRespuesta)
            .toList();
    }

    private Orden construirOrden(CrearOrdenRequest request) {
        Orden orden = new Orden();
        orden.numero = generarNumero();
        orden.clienteNombre = limpiar(request.nombre()) + " " + limpiar(request.apellido());
        orden.clienteEmail = limpiar(request.correo()).toLowerCase(Locale.ROOT);
        orden.clienteTelefono = limpiar(request.telefono());
        orden.direccion = limpiar(request.direccion());
        orden.ciudad = limpiar(request.ciudad());
        orden.codigoPostal = limpiar(request.codigoPostal()).toUpperCase(Locale.ROOT);
        orden.moneda = "ARS";
        orden.estado = EstadoOrden.PENDIENTE_PAGO;
        return orden;
    }

    private String normalizarMetodoPago(String metodo) {
        String normalizado = limpiar(metodo).toUpperCase(Locale.ROOT);
        if (!METODOS_PERMITIDOS.contains(normalizado)) {
            throw new IllegalArgumentException("Método de pago no válido");
        }
        return normalizado;
    }

    private String generarNumero() {
        String fecha = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String aleatorio = UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
        return "DEP-" + fecha + "-" + aleatorio;
    }

    private BigDecimal dinero(double valor) {
        return BigDecimal.valueOf(valor).setScale(2, RoundingMode.HALF_UP);
    }

    private String limpiar(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private OrdenResponse convertirRespuesta(Orden orden) {
        List<OrdenResponse.Item> items = orden.items.stream()
            .map(item -> new OrdenResponse.Item(
                item.productoId,
                item.productoNombre,
                item.cantidad,
                item.precioUnitario,
                item.subtotal
            ))
            .toList();

        Pago pagoEntidad = orden.pagos.isEmpty() ? null : orden.pagos.get(0);
        OrdenResponse.Pago pago = pagoEntidad == null ? null : new OrdenResponse.Pago(
            pagoEntidad.id,
            pagoEntidad.proveedor,
            pagoEntidad.metodo,
            pagoEntidad.importe,
            pagoEntidad.moneda,
            pagoEntidad.estado.name()
        );

        return new OrdenResponse(
            orden.id,
            orden.numero,
            orden.clienteNombre,
            orden.clienteEmail,
            orden.total,
            orden.moneda,
            orden.estado.name(),
            orden.creadaEn,
            items,
            pago
        );
    }
}
