package com.deporshop.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordenes")
@Getter
@Setter
@NoArgsConstructor
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true, length = 40)
    public String numero;

    @Column(name = "cliente_nombre", nullable = false, length = 120)
    public String clienteNombre;

    @Column(name = "cliente_email", nullable = false, length = 180)
    public String clienteEmail;

    @Column(name = "cliente_telefono", nullable = false, length = 40)
    public String clienteTelefono;

    @Column(nullable = false, length = 220)
    public String direccion;

    @Column(nullable = false, length = 120)
    public String ciudad;

    @Column(name = "codigo_postal", nullable = false, length = 20)
    public String codigoPostal;

    @Column(nullable = false, precision = 14, scale = 2)
    public BigDecimal total;

    @Column(nullable = false, length = 3)
    public String moneda = "ARS";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    public EstadoOrden estado = EstadoOrden.PENDIENTE_PAGO;

    @Column(name = "creada_en", nullable = false)
    public LocalDateTime creadaEn;

    @Column(name = "actualizada_en", nullable = false)
    public LocalDateTime actualizadaEn;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<OrdenItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<Pago> pagos = new ArrayList<>();

    public void agregarItem(OrdenItem item) {
        items.add(item);
        item.orden = this;
    }

    public void agregarPago(Pago pago) {
        pagos.add(pago);
        pago.orden = this;
    }

    @PrePersist
    void antesDeCrear() {
        LocalDateTime ahora = LocalDateTime.now();
        creadaEn = ahora;
        actualizadaEn = ahora;
    }

    @PreUpdate
    void antesDeActualizar() {
        actualizadaEn = LocalDateTime.now();
    }
}
