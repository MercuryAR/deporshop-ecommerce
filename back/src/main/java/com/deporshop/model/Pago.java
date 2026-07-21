package com.deporshop.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
@Getter
@Setter
@NoArgsConstructor
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "orden_id", nullable = false)
    public Orden orden;

    @Column(nullable = false, length = 40)
    public String proveedor;

    @Column(nullable = false, length = 50)
    public String metodo;

    @Column(name = "referencia_proveedor", unique = true, length = 160)
    public String referenciaProveedor;

    @Column(nullable = false, precision = 14, scale = 2)
    public BigDecimal importe;

    @Column(nullable = false, length = 3)
    public String moneda = "ARS";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    public EstadoPago estado = EstadoPago.PENDIENTE;

    @Column(length = 2000)
    public String metadata;

    @Column(name = "creado_en", nullable = false)
    public LocalDateTime creadoEn;

    @Column(name = "actualizado_en", nullable = false)
    public LocalDateTime actualizadoEn;

    @PrePersist
    void antesDeCrear() {
        LocalDateTime ahora = LocalDateTime.now();
        creadoEn = ahora;
        actualizadoEn = ahora;
    }

    @PreUpdate
    void antesDeActualizar() {
        actualizadoEn = LocalDateTime.now();
    }
}
