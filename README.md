# DeporShop - E-commerce Full Stack

Un proyecto full-stack moderno de tienda de zapatos deportivos con frontend HTML/CSS/JavaScript y backend REST API con Spring Boot.

## Características Implementadas

### Frontend Mejorado

- **Paleta de colores unificada**: Azul deportivo, azul marino y naranja accesible
- **Sistema de botones completo**: Variantes (primary, accent, secondary, outline, ghost), tamaños (sm, lg, xl)
- **Componentes reutilizables**: Cards, badges, formularios, inputs mejorados
- **Tipografía unificada**: Inter (300-800) con jerarquía consistente
- **Animaciones suaves**: Transiciones y efectos de hover
- **Design system moderno**: Variables CSS organizadas, shadows, border-radius, espaciado

### Backend REST API (Spring Boot)

- **Arquitectura limpia**: Models, Services, Controllers, Repositories
- **Endpoints CRUD completos**:
  - Categorías: GET, POST, PUT, DELETE
  - Productos: GET, POST, PUT, DELETE + búsqueda y filtrado
  - Carrito: Agregar, eliminar, actualizar, obtener total
- **Base de datos**: H2 en memoria con datos de ejemplo
- **CORS habilitado**: Soporte para frontend desde localhost
- **Mapeo automático**: Conversión JSON ↔ Entidades JPA

### Integración Frontend-Backend

- **Cliente API JavaScript**: Funciones async para todas las operaciones
- **Gestión de errores**: Notificaciones de éxito/error
- **Formato de precios**: Localización a pesos argentinos
- **Verificación automática**: Comprobación de conectividad
- **Checkout persistente**: Validación, creación de la orden, detalle, pago pendiente y descuento de stock

## Estado del Checkout y los Pagos

El flujo de checkout de `front/compra.html` registra pedidos completos en el backend:

- Obtiene productos, cantidades y total desde la API del carrito.
- Valida datos de contacto y entrega.
- Permite seleccionar un método de pago.
- Guarda la orden, sus ítems y un pago con estado `PENDIENTE`.
- Descuenta el stock y vacía el carrito solo después de confirmar la transacción.
- No solicita ni transmite números de tarjeta u otros datos bancarios.

> [!IMPORTANT]
> **Pendiente:** integrar una plataforma de pago real, por ejemplo **Mercado Pago** o **Stripe**. El proyecto registra la compra, pero todavía no procesa cobros ni genera transacciones reales.

La integración futura deberá incluir credenciales mediante variables de entorno, redirección o tokenización segura, webhooks firmados y manejo de cancelaciones o reembolsos. Los datos sensibles de tarjeta nunca deben procesarse directamente en este proyecto.

## Estructura del Proyecto

```
CarritoDeComprasFullStack/
├── front/
│   ├── Index.html
│   ├── productos.html
│   ├── carrito.html
│   ├── compra.html
│   ├── contacto.html
│   ├── css/
│   │   └── style.css (MEJORADO)
│   └── js/
│       └── api.js (NUEVO)
│
└── back/
    ├── pom.xml (NUEVO)
    ├── README.md (NUEVO)
    └── src/main/java/com/deporshop/
        ├── DeporShopApplication.java
        ├── model/
        │   ├── Categoria.java
        │   ├── Producto.java
        │   └── CarritoItem.java
        ├── repository/
        │   ├── CategoriaRepository.java
        │   └── ProductoRepository.java
        ├── service/
        │   ├── CategoriaService.java
        │   ├── ProductoService.java
        │   └── CarritoService.java
        ├── controller/
        │   ├── CategoriaController.java
        │   ├── ProductoController.java
        │   └── CarritoController.java
        └── config/
            └── DataLoader.java
```

## Cómo Ejecutar

### 1. Iniciar Backend (Spring Boot)

```bash
cd back
mvn spring-boot:run
```

El API estará disponible en `http://localhost:8080`

Datos de ejemplo:

- 3 categorías (Zapatillas, Accesorios, Ropa Deportiva)
- 6 productos con precios, descuentos y ratings

### 2. Abrir Frontend

```bash
# Opción 1: Abrir directamente el archivo
open front/Index.html

# Opción 2: Usar un servidor local (recomendado)
cd front
python -m http.server 8000
# Luego acceder a http://localhost:8000
```

## API Endpoints

### Categorías

```
GET    /api/categorias          - Listar todas
GET    /api/categorias/{id}     - Obtener una
POST   /api/categorias          - Crear
PUT    /api/categorias/{id}     - Actualizar
DELETE /api/categorias/{id}     - Eliminar
```

### Productos

```
GET    /api/productos                    - Listar todas
GET    /api/productos?categoriaId=1      - Filtrar por categoría
GET    /api/productos?buscar=term        - Buscar por nombre
GET    /api/productos/{id}               - Obtener uno
POST   /api/productos                    - Crear
PUT    /api/productos/{id}               - Actualizar
DELETE /api/productos/{id}               - Eliminar
```

### Carrito

```
GET    /api/carrito                              - Obtener carrito
POST   /api/carrito/agregar?productoId=1&cantidad=2  - Agregar
DELETE /api/carrito/eliminar/{productoId}       - Eliminar
PUT    /api/carrito/actualizar/{productoId}?cantidad=3 - Actualizar
DELETE /api/carrito/limpiar                     - Vaciar
GET    /api/carrito/total                       - Total del carrito
```

### Órdenes

```
POST   /api/ordenes                    - Confirmar y guardar el carrito actual
GET    /api/ordenes/{numero}           - Consultar una orden por número
GET    /api/ordenes?email=cliente@mail - Consultar órdenes de un cliente
```

## Ejemplos de Uso

### Obtener todos los productos desde JavaScript

```javascript
const productos = await obtenerProductos();
console.log(productos);
```

### Agregar al carrito

```javascript
await agregarAlCarrito(1, 2); // Producto ID 1, cantidad 2
```

### Obtener carrito

```javascript
const carrito = await obtenerCarrito();
console.log(carrito.items);
console.log(carrito.total);
```

## Tecnologías Utilizadas

### Frontend

- HTML5
- CSS3 (Design System moderno)
- JavaScript (Vanilla, Async/Await)

### Backend

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database
- Maven

## Próximos Pasos

1. **Pagos — pendiente prioritario**
   - Integrar Mercado Pago o Stripe
   - Procesar webhooks y estados de pago de forma segura
   - Implementar confirmación, cancelación y reembolso

2. **Funcionalidades Adicionales**
   - Autenticación de usuarios
   - Persistencia de carrito en base de datos
   - Pantalla de historial de órdenes

3. **Mejoras**
   - Agregar imágenes de productos reales
   - Implement testimonios y reviews
   - Agregar filtros avanzados
   - Optimizar para móvil

4. **Deploy**
   - Configurar base de datos PostgreSQL
   - Deploy backend a Heroku/Railway
   - Deploy frontend a Vercel/Netlify

## Soporte

Para problemas o preguntas, revisar:

- `/back/README.md` - Documentación de API
- `front/js/api.js` - Funciones disponibles
- Logs de Spring Boot en consola

## Licencia

Este proyecto fue desarrollado para fusionar los trabajos finales de los cursos de Talento Tech FrontEnd JS y BackEnd JAVA.

## Agradecimientos

- TalentoTech por la formación
- Comunidad de desarrolladores
- Recursos de MDN y W3Schools
- Google Fonts por las tipografías

---

**¡Si te gustó el proyecto, no olvides darle una estrella en GitHub!**

---

© 2024 DeporShop. Proyecto educativo - Buenos Aires, Argentina.
