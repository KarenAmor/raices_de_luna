# Sistema de Ventas - Frontend React.js

## Descripción del Proyecto

Este es el frontend del sistema administrativo para la venta de productos para el cabello. Desarrollado en React.js con una interfaz moderna y responsiva, permite gestionar ventas, inventario y créditos de manera eficiente.

## Características Principales

### 🔐 Autenticación
- Login seguro con número de teléfono y contraseña
- Manejo de tokens JWT
- Persistencia de sesión en localStorage
- Logout seguro

### 📊 Dashboard Principal
- Estadísticas en tiempo real del negocio
- Resumen de inventario disponible
- Total en efectivo y por cobrar
- Ganancia bruta calculada
- Ventas por vendedora
- Información detallada del lote actual
- Progreso visual de ventas

### 🛒 Registro de Ventas
- Registro de ventas en efectivo o a crédito
- Opciones de crédito a 8 o 15 días
- Captura opcional de datos del cliente
- Opción para ventas sin datos del cliente
- Resumen de venta antes de confirmar
- Actualización automática del inventario

### 📦 Gestión de Inventario
- Creación de nuevos lotes de productos
- Registro detallado de ingredientes con:
  - Nombre del ingrediente
  - Costo unitario
  - Cantidad comprada
  - Cálculo automático del costo total por ingrediente
- Cálculo automático de costos totales
- Resumen financiero del lote:
  - Costo por unidad
  - Ganancia por unidad
  - Ingresos totales proyectados
  - Ganancia total proyectada

### 💳 Gestión de Créditos
- Visualización de todas las ventas a crédito
- Separación entre ventas pendientes y pagadas
- Identificación de ventas vencidas
- Contador de días restantes para el pago
- Función para marcar ventas como pagadas
- Resumen financiero de créditos

## Tecnologías Utilizadas

- **React.js 18** - Framework principal
- **Vite** - Herramienta de construcción y desarrollo
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes de interfaz de usuario
- **Lucide React** - Iconos
- **JavaScript (JSX)** - Lenguaje de programación

## Estructura del Proyecto

```
ventas-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/              # Componentes de shadcn/ui
│   │   ├── Login.jsx        # Componente de autenticación
│   │   ├── Dashboard.jsx    # Panel principal
│   │   ├── RegistrarVenta.jsx    # Registro de ventas
│   │   ├── GestionInventario.jsx # Gestión de inventario
│   │   └── GestionCreditos.jsx   # Gestión de créditos
│   ├── hooks/
│   ├── lib/
│   ├── App.css             # Estilos principales
│   ├── App.jsx             # Componente principal
│   ├── index.css           # Estilos globales
│   └── main.jsx            # Punto de entrada
├── components.json         # Configuración de shadcn/ui
├── package.json
├── vite.config.js
└── README.md
```

## Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- npm o pnpm
- Backend del sistema funcionando en `http://localhost:3000`

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   # Si tienes el código fuente
   cd ventas-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno (opcional)**
   - El frontend está configurado para conectarse al backend en `http://localhost:3000`
   - Si tu backend está en otra URL, modifica las URLs en los componentes

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   pnpm run dev
   ```

5. **Abrir en el navegador**
   - La aplicación estará disponible en `http://localhost:5173`

## Uso del Sistema

### 1. Inicio de Sesión
- Ingresa tu número de teléfono (ejemplo: `3012609225`)
- Ingresa tu contraseña (ejemplo: `1028005811`)
- Haz clic en "Iniciar Sesión"

### 2. Dashboard Principal
- Visualiza las estadísticas principales del negocio
- Usa los botones de acción rápida para navegar a diferentes secciones:
  - **Registrar Venta**: Para registrar nuevas ventas
  - **Gestionar Inventario**: Para crear nuevos lotes
  - **Gestionar Créditos**: Para administrar ventas a crédito

### 3. Registrar Nueva Venta
- Selecciona el tipo de pago (Efectivo o Crédito)
- Si es crédito, elige los días para pagar (8 o 15 días)
- Opcionalmente, ingresa los datos del cliente
- Marca la casilla si el cliente no quiere dar sus datos
- Revisa el resumen y confirma la venta

### 4. Gestionar Inventario
- Agrega todos los ingredientes utilizados
- Para cada ingrediente, especifica:
  - Nombre del ingrediente
  - Costo unitario
  - Cantidad comprada
- Completa la información del lote:
  - Costo total de producción
  - Unidades producidas
  - Precio de venta por unidad
- Revisa el resumen financiero antes de crear el lote

### 5. Gestionar Créditos
- Visualiza todas las ventas a crédito pendientes
- Identifica ventas vencidas (marcadas en rojo)
- Marca las ventas como pagadas cuando recibas el pago
- Consulta el historial de ventas ya pagadas

## Integración con el Backend

El frontend se comunica con el backend a través de las siguientes APIs:

### Autenticación
- `POST /auth/login` - Inicio de sesión

### Ventas
- `POST /ventas` - Registrar nueva venta
- `GET /ventas` - Obtener todas las ventas
- `PATCH /ventas/:id/pagar` - Marcar venta como pagada

### Inventario
- `GET /inventario/stats` - Obtener estadísticas generales
- `POST /inventario/lote` - Crear nuevo lote
- `GET /inventario/lote-actual` - Obtener lote actual

## Características de la Interfaz

### Diseño Responsivo
- Adaptable a dispositivos móviles, tablets y desktop
- Navegación intuitiva en todos los tamaños de pantalla

### Experiencia de Usuario
- Interfaz moderna con gradientes y colores atractivos
- Iconos descriptivos para mejor comprensión
- Mensajes de éxito y error claros
- Indicadores de carga durante las operaciones
- Validación de formularios en tiempo real

### Accesibilidad
- Etiquetas descriptivas en todos los campos
- Contraste adecuado de colores
- Navegación por teclado
- Mensajes de estado para lectores de pantalla

## Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm run dev -- --host  # Inicia el servidor accesible desde la red

# Construcción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la construcción de producción

# Linting
npm run lint         # Ejecuta ESLint para verificar el código
```

## Personalización

### Colores y Temas
Los colores principales se pueden modificar en `src/App.css`:
- Variables CSS personalizadas para temas claro y oscuro
- Paleta de colores basada en Tailwind CSS

### Componentes
Todos los componentes están en `src/components/` y pueden ser personalizados:
- Modifica los estilos usando clases de Tailwind CSS
- Agrega nuevas funcionalidades según las necesidades del negocio

## Solución de Problemas

### Error de Conexión
Si aparece "Error de conexión", verifica que:
1. El backend esté funcionando en `http://localhost:3000`
2. No haya problemas de CORS en el backend
3. Las URLs de las APIs sean correctas

### Problemas de Autenticación
Si el login no funciona:
1. Verifica las credenciales en el backend
2. Revisa que el token JWT se esté generando correctamente
3. Confirma que el localStorage esté habilitado en el navegador

### Problemas de Renderizado
Si los componentes no se muestran correctamente:
1. Verifica que todas las dependencias estén instaladas
2. Revisa la consola del navegador para errores
3. Confirma que los componentes de shadcn/ui estén correctamente importados

## Próximas Mejoras

### Funcionalidades Sugeridas
- Reportes en PDF de ventas y estadísticas
- Gráficos interactivos con Recharts
- Notificaciones push para recordatorios de cobro
- Modo oscuro/claro
- Exportación de datos a Excel
- Búsqueda y filtros avanzados
- Backup automático de datos

### Optimizaciones Técnicas
- Implementación de React Query para mejor manejo de estado
- Lazy loading de componentes
- Service Workers para funcionamiento offline
- Optimización de imágenes y assets
- Tests unitarios y de integración

## Soporte

Para soporte técnico o consultas sobre el sistema:
1. Revisa esta documentación
2. Consulta los logs del navegador (F12 > Console)
3. Verifica el estado del backend
4. Contacta al desarrollador con detalles específicos del problema

---

**Desarrollado con ❤️ para tu emprendimiento de productos para el cabello**

