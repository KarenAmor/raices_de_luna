# Sistema de Ventas - Backend API

## Descripción

Este es un sistema backend desarrollado en **Nest.js** para gestionar las ventas de productos para el cabello. El sistema permite manejar inventario por lotes, registrar ventas (efectivo y crédito), autenticación de usuarios y recordatorios automáticos de cobro.

## Características Principales

- ✅ **Autenticación**: Login con número de teléfono y contraseña
- ✅ **Gestión de Inventario**: Manejo de lotes con ingredientes y costos
- ✅ **Registro de Ventas**: Ventas en efectivo y a crédito (8 o 15 días)
- ✅ **Estadísticas**: Ventas por vendedora, finanzas, inventario disponible
- ✅ **Recordatorios**: Notificaciones automáticas para cobros vencidos
- ✅ **Almacenamiento JSON**: Sin necesidad de base de datos compleja

## Requisitos del Sistema

- **Node.js** v16 o superior
- **npm** v7 o superior

## Instalación y Configuración

### 1. Descargar el Proyecto

Si tienes el archivo ZIP, descomprímelo. Si usas Git:

```bash
git clone <url-del-repositorio>
cd proyecto-ventas-nest
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Datos Iniciales (Opcional)

Puedes editar los archivos en `src/data/` para personalizar:

- **`usuarios.json`**: Cambiar nombres, teléfonos y contraseñas
- **`inventario.json`**: Ajustar ingredientes y costos del primer lote

### 4. Iniciar el Servidor

```bash
# Modo desarrollo (recomendado)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en: **http://localhost:3000**

## Estructura del Proyecto

```
src/
├── data/                    # Archivos JSON de almacenamiento
│   ├── usuarios.json        # Datos de las vendedoras
│   ├── inventario.json      # Lotes de productos
│   └── ventas.json          # Registro de ventas
├── auth/                    # Módulo de autenticación
├── inventario/              # Módulo de gestión de inventario
├── ventas/                  # Módulo de registro de ventas
├── schedule/                # Módulo de tareas programadas
└── main.ts                  # Punto de entrada de la aplicación
```

## API Endpoints

### Autenticación

#### POST `/auth/login`
Iniciar sesión con teléfono y contraseña.

**Request:**
```json
{
  "telefono": "3001112233",
  "password": "tusecreto"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "jwt-token-aqui",
    "usuario": {
      "id": 1,
      "nombre": "TuNombre",
      "telefono": "3001112233"
    }
  }
}
```

### Ventas

#### POST `/ventas`
Registrar una nueva venta.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "tipo_pago": "credito",
  "cliente_nombre": "Ana García",
  "cliente_telefono": "3009998888",
  "dias_credito": 8
}
```

**Response:**
```json
{
  "success": true,
  "message": "Venta registrada exitosamente",
  "data": {
    "id": 1,
    "vendedora_nombre": "TuNombre",
    "cliente_nombre": "Ana García",
    "tipo_pago": "credito",
    "fecha_venta": "2025-08-09",
    "fecha_vencimiento": "2025-08-17",
    "precio_venta": 20000
  }
}
```

#### GET `/ventas`
Obtener todas las ventas registradas.

#### GET `/ventas/vencidas`
Obtener ventas a crédito que han vencido.

#### PUT `/ventas/:id/pagar`
Marcar una venta a crédito como pagada.

### Inventario

#### GET `/inventario/stats`
Obtener estadísticas completas del negocio.

**Response:**
```json
{
  "success": true,
  "data": {
    "inventario": {
      "lote_actual": { ... },
      "unidades_disponibles": 95,
      "unidades_vendidas": 5
    },
    "ventas": {
      "total_ventas": 5,
      "ventas_por_vendedora": {
        "TuNombre": { "cantidad": 3, "total_efectivo": 40000 },
        "NombreAmiga": { "cantidad": 2, "total_credito": 40000 }
      }
    },
    "finanzas": {
      "total_efectivo": 40000,
      "total_por_cobrar": 40000,
      "ganancia_bruta": 59000
    }
  }
}
```

#### POST `/inventario/lote`
Agregar un nuevo lote de productos.

**Request:**
```json
{
  "ingredientes": [
    { "nombre": "Aceite de Argán", "costo": 150000 },
    { "nombre": "Keratina", "costo": 120000 }
  ],
  "costo_total_produccion": 270000,
  "unidades_producidas": 80,
  "precio_unitario_venta": 22000
}
```

## Sistema de Recordatorios

El sistema ejecuta automáticamente una tarea **todos los días a las 9:00 AM** que:

1. Revisa las ventas a crédito pendientes de pago
2. Identifica las que han vencido (8 o 15 días después de la venta)
3. Muestra recordatorios en la consola del servidor

### Ejemplo de Recordatorio:
```
[ScheduleService] RECORDATORIO DE COBRO: La venta al cliente 'Ana García' (Cel: 3009998888) ha vencido. Monto: $20,000
```

## Datos Iniciales

### Usuarios (Vendedoras)
- **Usuario 1**: Teléfono `3001112233`, Contraseña `tusecreto`
- **Usuario 2**: Teléfono `3004445566`, Contraseña `otro_secreto`

### Primer Lote de Inventario
- **Inversión Total**: $420,000 COP
- **Unidades Producidas**: 100
- **Precio de Venta**: $20,000 COP c/u
- **Ingredientes**: Aceite de Argán, Keratina, Vitamina E, Aceite de Coco

## Uso con Herramientas de Testing

Puedes probar la API usando **Postman**, **Insomnia** o **curl**:

### Ejemplo con curl:

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"telefono":"3001112233","password":"tusecreto"}'

# 2. Registrar venta (usar el token del login)
curl -X POST http://localhost:3000/ventas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{"tipo_pago":"efectivo","cliente_nombre":"Juan Pérez"}'

# 3. Ver estadísticas
curl -X GET http://localhost:3000/inventario/stats \
  -H "Authorization: Bearer <tu-token>"
```

## Próximos Pasos

Este backend está listo para conectarse con un frontend (React, Vue, Angular) o una aplicación móvil. También puedes:

1. **Agregar notificaciones**: Integrar WhatsApp o email para los recordatorios
2. **Mejorar seguridad**: Usar variables de entorno para el JWT secret
3. **Migrar a base de datos**: Cuando el negocio crezca, cambiar de JSON a PostgreSQL/MySQL
4. **Agregar más reportes**: Gráficos de ventas, análisis de tendencias, etc.

## Soporte

Si tienes preguntas o necesitas ayuda, revisa la documentación de [Nest.js](https://nestjs.com/) o contacta al desarrollador.

---

**¡Éxito con tu emprendimiento! 🚀**
