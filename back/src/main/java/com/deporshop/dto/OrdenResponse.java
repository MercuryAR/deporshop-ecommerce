package com.deporshop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrdenResponse(
    Long id,
    String numero,
    String clienteNombre,
    String clienteEmail,
    BigDecimal total,
    String moneda,
    String estado,
    LocalDateTime creadaEn,
    List<Item> items,
    Pago pago
) {
    public record Item(
        Long productoId,
        String nombre,
        int cantidad,
        BigDecimal precioUnitario,
        BigDecimal subtotal
    ) {}

    public record Pago(
        Long id,
        String proveedor,
        String metodo,
        BigDecimal importe,
        String moneda,
        String estado
    ) {}
}
