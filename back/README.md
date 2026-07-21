# DeporShop API - Backend REST

API REST para la tienda de zapatos deportivos DeporShop.

## Requisitos

- Java 17 o superior
- Maven 3.6+

## Instalación y Ejecución

### Opción 1: Desde la línea de comandos

```bash
cd back
mvn spring-boot:run
```

### Opción 2: Compilar y ejecutar JAR

```bash
cd back
mvn clean package
java -jar target/deporshop-api-1.0.0.jar
```

## Acceso a la API

- **URL Base**: `http://localhost:8080`
- **H2 Console**: `http://localhost:8080/h2-console`

## Endpoints

### Categorías

- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/{id}` - Obtener categoría por ID
- `POST /api/categorias` - Crear nueva categoría
- `PUT /api/categorias/{id}` - Actualizar categoría
- `DELETE /api/categorias/{id}` - Eliminar categoría

### Productos

- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos?categoriaId={id}` - Obtener productos por categoría
- `GET /api/productos?buscar={termino}` - Buscar productos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/categoria/{categoriaId}` - Obtener productos de una categoría
- `GET /api/productos/buscar/{termino}` - Buscar productos
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto

### Carrito

- `GET /api/carrito` - Obtener carrito actual
- `POST /api/carrito/agregar?productoId={id}&cantidad={n}` - Agregar producto al carrito
- `DELETE /api/carrito/eliminar/{productoId}` - Eliminar producto del carrito
- `PUT /api/carrito/actualizar/{productoId}?cantidad={n}` - Actualizar cantidad
- `DELETE /api/carrito/limpiar` - Limpiar carrito
- `GET /api/carrito/total` - Obtener total del carrito

### Órdenes

- `POST /api/ordenes` - Confirmar el carrito y guardar orden, ítems y pago pendiente
- `GET /api/ordenes/{numero}` - Consultar una orden por número
- `GET /api/ordenes?email={email}` - Consultar las órdenes de un cliente

Las compras se guardan en las tablas `ORDENES`, `ORDEN_ITEMS` y `PAGOS`. Al crear
una orden se valida y descuenta el stock; el carrito se vacía después de confirmar
la transacción.

## Ejemplo de Uso

### Obtener todos los productos

```bash
curl http://localhost:8080/api/productos
```

### Agregar producto al carrito

```bash
curl -X POST "http://localhost:8080/api/carrito/agregar?productoId=1&cantidad=2"
```

### Obtener carrito

```bash
curl http://localhost:8080/api/carrito
```

## Base de Datos

Por defecto, la API utiliza H2 en memoria. Los datos se cargan automáticamente al iniciar.

Para abrirla, ingresar en `http://localhost:8080/h2-console` y usar:

- JDBC URL: `jdbc:h2:mem:deporshop`
- User Name: `sa`
- Password: vacío

Para cambiar a otra base de datos, editar `src/main/resources/application.properties`.

## Notas

- CORS habilitado para todos los orígenes
- Los datos en memoria se pierden al reiniciar la aplicación
- Las órdenes se registran, pero falta integrar una pasarela para cobrar realmente
- Para producción, usar una base de datos persistente (MySQL, PostgreSQL, etc.)
