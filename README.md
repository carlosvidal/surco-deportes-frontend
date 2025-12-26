# Sistema Deportivo Municipal - Frontend

Frontend del Sistema de Gestión Deportiva para la Municipalidad de Surco - Charilla del Estanque.

## Tecnologías

- **Vue 3** - Framework JavaScript progresivo
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server ultra rápido
- **Pinia** - State management oficial de Vue
- **Vue Router** - Enrutamiento SPA
- **Axios** - Cliente HTTP
- **Chart.js** - Gráficos y visualizaciones
- **Lucide Icons** - Iconografía moderna

## Características

- **Diseño Modular** con 4 módulos principales
- **Dashboard Principal** como menú de navegación
- **Control de Carriles** para check-in/check-out con alertas en tiempo real
- **Caja del Día** con apertura, cierre y resumen de movimientos
- **Gestión de Vecinos** con CRUD completo y relaciones familiares
- **Dashboard de Métricas** con gráficos y análisis de tendencias
- **Responsive Design** optimizado para desktop y mobile
- **Alertas Visuales** para saldos bajos y consumos próximos a vencer
- **Sistema de Autenticación** con roles y permisos

## Paleta de Colores

El diseño sigue los colores oficiales de la Municipalidad de Surco:

- **Primary**: `#1260A5` (Azul institucional)
- **Secondary**: `#1ACDAC` (Verde agua)
- **Neutral**: `#666666` (Gris)
- **Background**: `#F5F5F5` (Fondo claro)
- **Warning**: `#FFA726` (Naranja para alertas)
- **Success**: `#1ACDAC` (Verde para éxitos)
- **Danger**: `#EF4444` (Rojo para errores)

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── assets/           # Recursos estáticos
│   ├── components/       # Componentes reutilizables
│   ├── router/           # Configuración de rutas
│   ├── stores/           # Stores de Pinia
│   │   ├── auth.ts       # Autenticación
│   │   ├── dashboard.ts  # Dashboard
│   │   ├── alertas.ts    # Alertas
│   │   └── caja.ts       # Caja
│   ├── types/            # Definiciones de tipos TypeScript
│   ├── utils/            # Utilidades
│   ├── views/            # Vistas/Páginas
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── ControlCarriles.vue
│   │   ├── Caja.vue
│   │   ├── Vecinos.vue
│   │   ├── VecinoFicha.vue
│   │   └── DashboardMetricas.vue
│   ├── App.vue           # Componente raíz
│   └── main.ts           # Punto de entrada
├── .env.example          # Variables de entorno de ejemplo
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Instalación

### Requisitos Previos

- Node.js 18+ y npm
- Backend ejecutándose en `http://localhost:3000`

### Configuración

1. Clonar el repositorio:
```bash
git clone https://github.com/carlosvidal/surco-deportes-frontend.git
cd surco-deportes-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

## Uso

### Desarrollo

```bash
npm run dev
```

La aplicación se ejecutará en `http://localhost:5173`

### Producción

```bash
# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## Módulos del Sistema

### 1. Dashboard Principal
Menú central con acceso a todos los módulos y visualización de alertas pendientes.

**Ruta:** `/`

### 2. Control de Carriles
Gestión de check-in y check-out de instalaciones deportivas.

**Ruta:** `/carriles`

**Funcionalidades:**
- Check-in con selección de instalación y carril
- Check-out manual
- Visualización de consumos activos en tiempo real
- Alertas de saldo bajo y tiempo próximo a vencer
- Búsqueda de vecinos por DNI/nombre

### 3. Caja del Día
Control financiero diario con apertura y cierre de caja.

**Ruta:** `/caja`

**Funcionalidades:**
- Apertura de caja con saldo inicial
- Registro de ventas de horas (Efectivo, Yape, Plin, Transferencia)
- Resumen de movimientos por método de pago
- Cierre de caja con validación de diferencias
- Historial de cajas cerradas

### 4. Gestión de Vecinos
CRUD completo de vecinos con gestión de relaciones familiares.

**Ruta:** `/vecinos`

**Funcionalidades:**
- Búsqueda y filtrado de vecinos
- Registro de nuevos vecinos
- Edición de datos personales
- Gestión de grupo familiar
- Visualización de saldo de horas
- Historial de compras y consumos

### 5. Dashboard de Métricas
Análisis y reportes con gráficos interactivos.

**Ruta:** `/metricas`

**Funcionalidades:**
- Resumen de KPIs (ingresos, horas vendidas, consumos)
- Gráfico de tendencias de uso
- Análisis de horas pico
- Distribución de métodos de pago
- Top vecinos más activos
- Filtros por período (7, 30, 90 días)

## Diseño y UX

### Patrones de Diseño

- **Header Consistente**: Todos los módulos comparten el mismo patrón de header con botón "Volver", información del usuario y botón "Salir"
- **Cards Glassmorphism**: Tarjetas con efecto de cristal esmerilado
- **Gradientes Suaves**: Fondos con gradientes sutiles en tonos institucionales
- **Micro-interacciones**: Hover effects, transiciones suaves y feedback visual
- **Mobile-First**: Diseño responsive con breakpoints optimizados

### Sistema de Tokens CSS

```css
/* Colores */
--color-primary: #1260A5
--color-secondary: #1ACDAC
--color-neutral: #666666
--color-background: #F5F5F5

/* Espaciado */
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem

/* Bordes */
--radius-sm: 0.375rem
--radius-md: 0.5rem
--radius-lg: 0.75rem
--radius-xl: 1rem

/* Sombras */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
```

## Gestión de Estado (Pinia)

### Auth Store
Manejo de autenticación, usuario actual y permisos.

### Dashboard Store
Estado de consumos activos y datos del dashboard principal.

### Alertas Store
Gestión centralizada de alertas (saldos bajos, tiempos próximos a vencer).

### Caja Store
Estado de la caja actual, movimientos y resúmenes.

## Autenticación

El sistema utiliza JWT almacenado en localStorage:

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Componentes Reutilizables

- **Modal** - Modal genérico con overlay
- **Alert** - Alertas de estado (success, error, warning, info)
- **Badge** - Insignias para estados y contadores
- **Card** - Tarjetas con estilos consistentes
- **Button** - Botones con variantes (primary, secondary, ghost, danger)

## Navegación

El sistema usa Vue Router con guardias de autenticación:

- Rutas públicas: `/login`
- Rutas protegidas: Todas las demás requieren autenticación
- Redirección automática a `/login` si no hay sesión activa
- Redirección a `/` si usuario autenticado intenta acceder a `/login`

## Licencia

MIT

## Autor

Municipalidad de Surco - Sistema Deportivo Municipal
