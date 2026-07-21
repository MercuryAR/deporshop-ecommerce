package com.deporshop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearOrdenRequest(
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 60, message = "El nombre es demasiado largo")
    String nombre,

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 60, message = "El apellido es demasiado largo")
    String apellido,

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no es válido")
    @Size(max = 180, message = "El correo es demasiado largo")
    String correo,

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 40, message = "El teléfono es demasiado largo")
    String telefono,

    @NotBlank(message = "La dirección es obligatoria")
    @Size(max = 220, message = "La dirección es demasiado larga")
    String direccion,

    @NotBlank(message = "La ciudad es obligatoria")
    @Size(max = 120, message = "La ciudad es demasiado larga")
    String ciudad,

    @NotBlank(message = "El código postal es obligatorio")
    @Size(max = 20, message = "El código postal es demasiado largo")
    String codigoPostal,

    @NotBlank(message = "El método de pago es obligatorio")
    @Size(max = 50, message = "El método de pago es demasiado largo")
    String metodoPago
) {}
