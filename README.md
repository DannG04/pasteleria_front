# 🧁 Pastelería - Frontend

Aplicación web frontend para una pastelería, desarrollada con React y Vite. Permite a los clientes explorar el catálogo de productos y a los administradores gestionar el inventario y visualizar el historial de ventas.

## 📋 Descripción

Este proyecto es el frontend de un sistema de gestión para una pastelería que incluye:

- **Catálogo de productos**: Visualización de postres, panes, bebidas y extras disponibles
- **Carrito de compras**: Funcionalidad completa de carrito con tickets de compra
- **Panel de administración**: Gestión de inventario y visualización del historial de ventas
- **Autenticación**: Sistema de login para acceso al panel administrativo
- **Tema claro/oscuro**: Soporte para cambiar entre modo claro y oscuro

## 🛠️ Tecnologías

- **[React 19](https://react.dev/)** - Biblioteca de JavaScript para construir interfaces de usuario
- **[Vite](https://vite.dev/)** - Herramienta de desarrollo rápida para proyectos web modernos
- **[Material UI (MUI)](https://mui.com/)** - Biblioteca de componentes de React con Material Design
- **[React Router DOM](https://reactrouter.com/)** - Enrutamiento declarativo para aplicaciones React
- **[Styled Components](https://styled-components.com/)** - CSS-in-JS para estilizado de componentes
- **[Emotion](https://emotion.sh/)** - Biblioteca para estilos CSS con JavaScript

## 📁 Estructura del Proyecto

```
src/
├── assets/           # Recursos estáticos (imágenes, logos)
├── components/       # Componentes reutilizables
│   ├── CartDrawer.jsx
│   ├── InventoryManager.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── ProductManager.jsx
│   ├── ProtectedRoute.jsx
│   ├── SalesHistory.jsx
│   └── Ticket.jsx
├── context/          # Contextos de React
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ThemeContext.jsx
├── data/             # Datos estáticos
│   └── products.js
├── services/         # Servicios de API
│   └── apiService.js
├── views/            # Vistas principales
│   ├── AdminDashboard.jsx
│   ├── Dashboard.jsx
│   └── Login.jsx
├── App.jsx           # Componente principal
└── main.jsx          # Punto de entrada
```

## 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/DannG04/pasteleria_front.git
   cd pasteleria_front
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173`

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Previsualiza la versión de producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |

## 🔗 API Backend

La aplicación se conecta a un backend en `http://localhost:8000` que proporciona los siguientes endpoints:

- `/postres/` - Gestión de postres
- `/pan/` - Gestión de panes
- `/bebidas/` - Gestión de bebidas
- `/extras/` - Gestión de extras
- `/productos/` - Productos generales
- `/ventas/` - Registro de ventas

## ✨ Características Principales

- **Diseño Responsivo**: Adaptado para dispositivos móviles y de escritorio
- **Interfaz Moderna**: Construida con Material UI para una experiencia de usuario fluida
- **Gestión de Estado**: Uso de Context API de React para carrito, autenticación y tema
- **Rutas Protegidas**: El panel de administración requiere autenticación

## 👤 Autor

Danny G.
