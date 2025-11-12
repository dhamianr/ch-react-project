# 🎮 Pokémon E-Commerce

E-commerce de Pokémon desarrollado con React, donde puedes explorar, filtrar y comprar los 151 Pokémon de la región de Kanto. Todos los Pokémon se almacenan en Firestore con su stock y precios correspondientes.

## ✨ Características

- 🛍️ **Catálogo completo**: Explora los 151 Pokémon de Kanto
- 🔍 **Filtrado por tipo**: Busca Pokémon por su tipo (agua, fuego, planta, etc.)
- 🛒 **Carrito de compras**: Agrega Pokémon al carrito y gestiona tu compra
- 💰 **Sistema de precios**: Precios basados en rareza (común, poco común, raro, legendario, mítico)
- 📱 **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- 🎲 **Pokémon aleatorio**: Descubre un Pokémon al azar

## 🚀 Tecnologías Utilizadas

- **React 19.1.1** - Biblioteca de UI
- **Vite 7.1.6** - Build tool y dev server
- **React Router 7.9.4** - Navegación y routing
- **Firebase/Firestore 12.5.0** - Base de datos en la nube
- **SweetAlert2 11.26.3** - Alertas y notificaciones
- **PokeAPI** - API pública para datos de Pokémon

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Firebase (para Firestore)

## 🔧 Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd ch-react-ecommerce
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con tus credenciales de Firebase:

```env
VITE_API_KEY=tu_api_key
VITE_AUTH_DOMAIN=tu_auth_domain
VITE_PROJECT_ID=tu_project_id
VITE_STORAGE_BUCKET=tu_storage_bucket
VITE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_APP_ID=tu_app_id
```

4. Carga los Pokémon a Firestore:

```bash
npm run load-premium
```

Este comando cargará los 151 Pokémon de Kanto a tu base de datos Firestore con sus precios y stock correspondientes.

## 🎯 Uso

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build para producción

```bash
npm run build
```

### Preview del build

```bash
npm run preview
```

### Linter

```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
ch-react-ecommerce/
├── src/
│   ├── components/          # Componentes React
│   │   ├── NavBar.jsx       # Barra de navegación
│   │   ├── ItemListContainer.jsx
│   │   ├── ItemDetailContainer.jsx
│   │   ├── CartContainer.jsx
│   │   └── ...
│   ├── context/             # Context API
│   │   └── cartContext.jsx  # Context del carrito
│   ├── services/            # Servicios y lógica de negocio
│   │   ├── pokeApi.js       # Integración con PokeAPI
│   │   └── pokemonStockService.js  # Gestión de stock desde Firestore
│   ├── data/                # Configuración de Firebase
│   │   └── FirestoreServices.js
│   └── App.jsx              # Componente principal
├── scripts/                 # Scripts de utilidad
│   └── loadKanto151.js      # Script para cargar los 151 Pokémon
└── package.json
```

## 🎮 Funcionalidades Principales

### Navegación

- **Home**: Lista de todos los Pokémon disponibles
- **Categorías**: Filtra por tipo de Pokémon
- **Detalle**: Vista detallada de cada Pokémon
- **Carrito**: Gestiona tus compras

### Sistema de Stock

Todos los 151 Pokémon de Kanto están almacenados en Firestore con:

- Stock limitado según su rareza
- Precios basados en rareza (común, poco común, raro, legendario, mítico)
- Actualización en tiempo real del stock al realizar compras

### Carrito de Compras

- Agrega múltiples Pokémon
- Ajusta cantidades
- Elimina items
- Finaliza compra con formulario de checkout
- El stock se descuenta al confirmar la compra
- Las órdenes se guardan en Firestore

## 🔐 Variables de Entorno

Asegúrate de configurar todas las variables de entorno necesarias en tu archivo `.env`. Puedes obtener estas credenciales desde la consola de Firebase.

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea el build de producción
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter
- `npm run load-premium` - Carga los 151 Pokémon de Kanto a Firestore

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un curso de React. Todos los derechos reservados.

## 👨‍💻 Autor

Desarrollado como parte del curso de React de Coderhouse.

---

⭐ Si te gustó el proyecto, no olvides darle una estrella!
