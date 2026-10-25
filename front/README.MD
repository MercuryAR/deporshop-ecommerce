# DeporShop Frontend

SPA de la tienda DeporShop, construida con React + TypeScript. Consume la API REST del [backend](../back/README.md).

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Zustand (estado global)
- React Router v7
- Axios

## Requisitos

- Node 18+
- El backend corriendo en `http://localhost:8080` (ver [back/README.md](../back/README.md)) — la app hace fetch de datos reales, no tiene mocks.

## Instalación y ejecución

```bash
cd front
npm install
npm run dev
```

App en `http://localhost:5173`.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Type-check (`tsc -b`) + build de producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Lint con oxlint |

## Estructura

```
src/
├── pages/          # Una por ruta: Home, Products, ProductDetail, Cart, Checkout, Login, User, Contact
├── components/     # Reutilizables: Header, Footer, Layout, ProductCard, ProductList, CartItem, LoginForm, Carousel, ProtectedRoute
│                   # + UI kit del design system: Logo, Icons, Badge, Rating, QuantityStepper, SearchBar,
│                   #   BenefitCard, CategoryCard, PromoBanner, LineItem, OrderCard
├── assets/         # Íconos y gráficos exportados del design system de Figma
├── store/          # Zustand: productStore, cartStore, authStore
├── services/       # api.ts — instancia de axios + funciones tipadas por endpoint
└── types/          # Interfaces TS que reflejan los DTOs del backend
```

## Rutas

| Ruta | Página | Protegida |
|---|---|---|
| `/` | Home | No |
| `/productos` | Products | No |
| `/producto/:id` | ProductDetail | No |
| `/carrito` | Cart | No |
| `/checkout` | Checkout | Sí |
| `/login` | Login (toggle login/registro) | No |
| `/perfil` | User | Sí |
| `/contacto` | Contact | No |

Las rutas protegidas usan `components/ProtectedRoute.tsx`, que redirige a `/login` si `authStore` no tiene sesión activa.

## Estado global (Zustand)

- **`productStore`** — catálogo, categorías, filtros (categoría/búsqueda) y orden (precio, nombre, rating).
- **`cartStore`** — ítems del carrito, actualizado a partir de la respuesta de cada mutación (`agregar`/`actualizar`/`eliminar`/`limpiar` contra `/api/carrito`) y persistido en `localStorage`. A propósito **no** se re-sincroniza automáticamente contra el backend en cada carga de página: el carrito vive en la sesión HTTP del servidor, que no persiste de forma confiable entre recargas en una SPA cross-origin, así que el estado local (localStorage) es la fuente de verdad.
- **`authStore`** — usuario, token JWT y `isAuthenticated`, persistido en `localStorage`. El token se inyecta automáticamente en cada request saliente vía interceptor de axios (`services/api.ts`).

`services/api.ts` también expone `formatearPrecio` (formato ARS), `crearPedido(items)` y `getMisPedidos()` — el checkout arma el pedido con los items del `cartStore` local (no del carrito de sesión), y el backend recalcula los precios reales.

## Estilos

La interfaz implementa el design system de Figma [DeporShop · Design System & UI Kit](https://www.figma.com/design/Ibv9Mpnu3sfmkWkLti7Lvr/Deporshop?node-id=14-2). Más detalle en el [README raíz](../README.md#diseño-uxui).

- **Tokens** en `tailwind.config.js`, con los nombres de las variables de Figma:
  - Colores: `bosque`, `esmeralda`, `lima`, `musgo`, `borde`, `menta`, `aire`, `error` y `aviso`.
  - Escala tipográfica: `text-display-xl` … `text-caption`, `text-price` y otras.
  - Radios (`sm` a `xl` y `pill`) y sombras (`shadow-card`, `shadow-floating`).
- **Tipografías:** Archivo Black (títulos), Archivo (precios) y Manrope (interfaz), cargadas desde Google Fonts en `src/index.css`.
- **Clases de componentes** en `src/index.css`:
  - Botones `btn-primary`, `btn-lima`, `btn-dark`, `btn-secondary` y `btn-text`, con tamaños `btn-sm` y `btn-lg`.
  - Campos `form-input`, `form-select` y `form-textarea`, más `chip`, `checkbox` e `icon-btn`.
- **Íconos:** `components/Icons.tsx` usa los SVG de `src/assets/icons/` como máscara CSS, así toman el color del texto (`<Icon name="bag" size={18} />`).
- **Breakpoints:** mobile por defecto. `sm` (640px), `md` (768px, buscador en el header), `lg` (1024px) y `xl` (1280px, navegación completa).

## Notas

- Las imágenes de producto viven en `public/img/`.
- No hay tests todavía (ver [README raíz](../README.md#próximos-pasos)).
