package com.deporshop.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "orden_items")
@Getter
@Setter
@NoArgsConstructor
public class OrdenItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "orden_id", nullable = false)
    public Orden orden;

    @Column(name = "producto_id")
    public Long productoId;

    @Column(name = "producto_nombre", nullable = false, length = 180)
    public String productoNombre;

    @Column(nullable = false)
    public int cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 14, scale = 2)
    public BigDecimal precioUnitario;

    @Column(nullable = false, precision = 14, scale = 2)
    public BigDecimal subtotal;
}
