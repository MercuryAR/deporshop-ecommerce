package com.deporshop.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "productos")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String nombre;

    @Column(nullable = false)
    public String descripcion;

    @Column(nullable = false)
    public double precio;

    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    public double descuento;

    @Column(name = "imagen_url")
    public String imagenUrl;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    public int stock;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    public Categoria categoria;

    @Column(columnDefinition = "DOUBLE DEFAULT 0")
    public double rating;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    public int resenas;

    public Producto() {
    }

    public Producto(String nombre, String descripcion, double precio, Categoria categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.descuento = 0;
        this.stock = 10;
        this.rating = 0;
        this.resenas = 0;
    }

    public double calcularDescuento() {
        return precio * 0.90;
    }

    public double getPrecioConDescuento() {
        return precio - (precio * descuento / 100);
    }
}
