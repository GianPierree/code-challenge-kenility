# Code Challenge Kenility

Una aplicación de NestJS con una base de datos MongoDB para la gestión de productos, órdenes y usuarios.

## 🚀 Tecnologías

### Backend
- **NestJS** - Framework de Node.js para aplicaciones escalables
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **Multer** - Manejo de archivos
- **TypeScript** - Tipado estático

## 📋 Características

### Gestión de Productos
- ✅ Crear y leer productos
- ✅ Subida de imágenes para productos
- ✅ Generación automática de códigos de producto
- ✅ Cálculo de subtotales

### Gestión de Órdenes
- ✅ Crear y gestionar órdenes
- ✅ Validación de productos en órdenes
- ✅ Cálculo automático de totales
- ✅ Reportes de órdenes (último mes, mayor cantidad)

### Gestión de Usuarios
- ✅ Registro y autenticación de usuarios
- ✅ Encriptación de contraseñas
- ✅ Generación automática de códigos de usuario
- ✅ Protección de rutas con JWT

## 🛠️ Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB (local o remoto)
- npm o yarn

### Configuración del Backend

1. **Clonar el repositorio**
```bash
git clone https://github.com/GianPierree/code-challenge-kenility
cd code-challenge-kenility
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar MongoDB**
```bash
# Usando Docker Compose (recomendado)
docker-compose up -d

# O instalar MongoDB localmente
# La aplicación se conecta a: mongodb://localhost:27017/code-challenge-kenility
```

4. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📚 API Endpoints

### Autenticación
```
POST  /api/users       - Registrar usuario
POST  /api/users/login - Iniciar sesión
GET   /api/users       - Listar usuarios
GET   /api/users/:id   - Obtener usuario
```

### Imágenes
```
POST   /api/files/products/       - Subir imagen
GET    /api/files/products/:id    - Obtener imagen
```

### Productos (Requiere autenticación)
```
POST   /api/products        - Crear producto
GET    /api/products        - Listar productos
GET    /api/products/:id    - Obtener producto
```

### Órdenes (Requiere autenticación)
```
POST   /api/orders                          - Crear orden
GET    /api/orders/:id                      - Obtener orden
PATCH  /api/orders/:id                      - Actualizar orden
GET    /api/orders/reports/total-last-month - Reporte mensual
GET    /api/orders/reports/highest-amount   - Orden de mayor valor
```

## 🗄️ Modelos de Datos

### Producto
```typescript
{
  name: string;
  price: number;
  sku: string;
  code: string;
  image?: string;
  status: boolean;
}
```

### Orden
```typescript
{
  client: string;
  products: Array<{
    product: ObjectId;
    quantity: number;
    subtotal: number;
  }>;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
}
```

### Usuario
```typescript
{
  name: string;
  last_name: string;
  email: string;
  password: string;
  code: string;
}
```

## 🔐 Autenticación

La aplicación utiliza JWT para la autenticación. Las rutas de productos y órdenes están protegidas y requieren un token válido en el header:

```
Authorization: Bearer <jwt-token>
```

## 📁 Estructura del Proyecto

```bash
src/
├── app.module.ts         # Módulo principal
├── main.ts               # Punto de entrada
├── common/               # Servicios compartidos
├── files/                # Manejo de archivos
├── login/                # Middleware de autenticación
├── products/             # Módulo de productos
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.module.ts
│   └── schemas/
├── orders/               # Módulo de órdenes
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   ├── orders.module.ts
│   └── schemas/
└── users/                # Módulo de usuarios
    ├── users.controller.ts
    ├── users.service.ts
    ├── users.module.ts
    └── schemas/
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autor

Desarrollado como parte del Code Challenge de Kenility.
