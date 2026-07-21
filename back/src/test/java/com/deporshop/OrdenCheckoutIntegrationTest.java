package com.deporshop;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.deporshop.repository.OrdenRepository;
import com.deporshop.repository.ProductoRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OrdenCheckoutIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void confirmaOrdenPersisteDetallePagoDescuentaStockYVaciaCarrito() throws Exception {
        MockHttpSession session = new MockHttpSession();
        int stockInicial = productoRepository.findById(1L).orElseThrow().stock;

        mockMvc.perform(post("/api/carrito/agregar")
                .session(session)
                .param("productoId", "1")
                .param("cantidad", "2"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.cantidad").value(2));

        String checkout = """
            {
              "nombre": "Cliente",
              "apellido": "Prueba",
              "correo": "cliente@example.com",
              "telefono": "1112345678",
              "direccion": "Avenida Siempre Viva 123",
              "ciudad": "Buenos Aires",
              "codigoPostal": "C1000",
              "metodoPago": "transferencia"
            }
            """;

        MvcResult resultado = mockMvc.perform(post("/api/ordenes")
                .session(session)
                .contentType("application/json")
                .content(checkout))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.numero").isNotEmpty())
            .andExpect(jsonPath("$.estado").value("PENDIENTE_PAGO"))
            .andExpect(jsonPath("$.total").value(233.98))
            .andExpect(jsonPath("$.items[0].cantidad").value(2))
            .andExpect(jsonPath("$.pago.estado").value("PENDIENTE"))
            .andExpect(jsonPath("$.pago.metodo").value("TRANSFERENCIA"))
            .andReturn();

        String numero = objectMapper.readTree(resultado.getResponse().getContentAsString())
            .get("numero")
            .asText();

        mockMvc.perform(get("/api/ordenes/{numero}", numero))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.items[0].productoId").value(1));

        mockMvc.perform(get("/api/carrito").session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.cantidad").value(0));

        assertThat(ordenRepository.count()).isEqualTo(1);
        assertThat(productoRepository.findById(1L).orElseThrow().stock)
            .isEqualTo(stockInicial - 2);
    }
}
