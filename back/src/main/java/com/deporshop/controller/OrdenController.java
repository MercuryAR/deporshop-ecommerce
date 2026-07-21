package com.deporshop.controller;

import com.deporshop.dto.CrearOrdenRequest;
import com.deporshop.dto.OrdenResponse;
import com.deporshop.service.OrdenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(
    originPatterns = {"http://localhost:*", "http://127.0.0.1:*"},
    allowCredentials = "true",
    maxAge = 3600
)
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    @PostMapping
    public ResponseEntity<OrdenResponse> crear(@Valid @RequestBody CrearOrdenRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ordenService.crearOrden(request));
    }

    @GetMapping("/{numero}")
    public ResponseEntity<OrdenResponse> obtenerPorNumero(@PathVariable String numero) {
        return ResponseEntity.ok(ordenService.obtenerPorNumero(numero));
    }

    @GetMapping
    public ResponseEntity<List<OrdenResponse>> obtenerPorEmail(@RequestParam String email) {
        return ResponseEntity.ok(ordenService.obtenerPorEmail(email));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidacion(MethodArgumentNotValidException error) {
        Map<String, String> campos = new LinkedHashMap<>();
        error.getBindingResult().getFieldErrors().forEach(fieldError ->
            campos.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(Map.of(
            "error", "Los datos de la orden no son válidos",
            "campos", campos
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> manejarSolicitudInvalida(IllegalArgumentException error) {
        HttpStatus estado = "Orden no encontrada".equals(error.getMessage())
            ? HttpStatus.NOT_FOUND
            : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(estado).body(Map.of("error", error.getMessage()));
    }
}
