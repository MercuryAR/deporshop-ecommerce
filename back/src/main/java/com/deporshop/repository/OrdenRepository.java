package com.deporshop.repository;

import com.deporshop.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
    Optional<Orden> findByNumero(String numero);
    List<Orden> findByClienteEmailOrderByCreadaEnDesc(String clienteEmail);
}
