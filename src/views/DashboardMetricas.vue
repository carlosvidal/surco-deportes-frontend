<template>
  <div class="dashboard-metricas">
    <header class="header">
      <div class="header-left">
        <button @click="router.push('/')" class="btn-back">
          <ArrowLeft :size="20" />
        </button>
        <div class="logo-header">
          <BarChart3 :size="32" :stroke-width="2.5" class="logo-icon" />
          <div class="header-titles">
            <h1 class="facility-name">Dashboard de Métricas</h1>
            <p class="subtitle">Análisis y estadísticas de las instalaciones</p>
          </div>
        </div>
      </div>

      <div class="header-right">
        <!-- Selector de período -->
        <div class="select-wrapper">
          <Calendar :size="18" class="select-icon-left" />
          <select v-model="periodoSeleccionado" @change="cargarDatos" class="periodo-select">
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="90">Últimos 90 días</option>
          </select>
          <ChevronDown :size="18" class="select-icon-right" />
        </div>

        <!-- Info de usuario -->
        <div class="user-info">
          <User :size="20" />
          <span>{{ authStore.staff?.nombre }}</span>
        </div>

        <!-- Botón de logout -->
        <button @click="handleLogout" class="btn btn-ghost btn-sm">
          <LogOut :size="18" />
          <span>Salir</span>
        </button>
      </div>
    </header>

    <main class="content">
      <div v-if="loading" class="loading-state">
        <Loader2 :size="48" class="spinner" />
        <p>Cargando métricas...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <AlertCircle :size="48" class="error-icon" />
        <p>{{ error }}</p>
        <button @click="cargarDatos" class="btn btn-primary">
          <RefreshCw :size="18" />
          <span>Reintentar</span>
        </button>
      </div>

      <template v-else>
        <!-- KPIs de Hoy -->
        <section class="section">
          <div class="section-header">
            <CalendarCheck :size="24" :stroke-width="2" class="section-icon" />
            <h2 class="section-title">Métricas de Hoy</h2>
          </div>
          <div class="kpi-grid">
            <div class="kpi-card kpi-primary">
              <div class="kpi-icon-container">
                <Users :size="28" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Vecinos Activos</div>
                <div class="kpi-value">{{ metricas?.hoy?.vecinosActivosHoy || 0 }}</div>
              </div>
            </div>

            <div class="kpi-card kpi-secondary">
              <div class="kpi-icon-container">
                <Clock :size="28" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Horas Consumidas</div>
                <div class="kpi-value">{{ metricas?.hoy?.horasConsumidasHoy || 0 }}</div>
              </div>
            </div>

            <div class="kpi-card kpi-success">
              <div class="kpi-icon-container">
                <DollarSign :size="28" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Ingresos del Día</div>
                <div class="kpi-value">S/ {{ formatearMonto(metricas?.hoy?.ingresosHoy) }}</div>
              </div>
            </div>

            <div class="kpi-card kpi-info">
              <div class="kpi-icon-container">
                <Activity :size="28" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Ocupación Promedio</div>
                <div class="kpi-value">{{ metricas?.hoy?.ocupacionPromedio || 0 }}%</div>
              </div>
            </div>
          </div>
        </section>

        <!-- KPIs del Mes -->
        <section class="section">
          <div class="section-header">
            <CalendarRange :size="24" :stroke-width="2" class="section-icon" />
            <h2 class="section-title">Métricas del Período</h2>
          </div>
          <div class="kpi-grid kpi-grid-5">
            <div class="kpi-card kpi-neutral">
              <div class="kpi-icon-container">
                <UserCheck :size="24" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Vecinos Únicos</div>
                <div class="kpi-value">{{ metricas?.mes?.vecinosUnicosMes || 0 }}</div>
              </div>
            </div>

            <div class="kpi-card kpi-neutral">
              <div class="kpi-icon-container">
                <ShoppingBag :size="24" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Horas Vendidas</div>
                <div class="kpi-value">{{ metricas?.mes?.horasVendidasMes || 0 }}</div>
              </div>
            </div>

            <div class="kpi-card kpi-neutral">
              <div class="kpi-icon-container">
                <Timer :size="24" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Horas Consumidas</div>
                <div class="kpi-value">{{ metricas?.mes?.horasConsumidasMes || 0 }}</div>
              </div>
            </div>

            <div class="kpi-card kpi-neutral">
              <div class="kpi-icon-container">
                <Banknote :size="24" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Ingresos Totales</div>
                <div class="kpi-value">S/ {{ formatearMonto(metricas?.mes?.ingresosMes) }}</div>
              </div>
            </div>

            <div class="kpi-card kpi-neutral">
              <div class="kpi-icon-container">
                <TrendingUp :size="24" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">Ticket Promedio</div>
                <div class="kpi-value">S/ {{ formatearMonto(metricas?.mes?.ticketPromedio) }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Gráficos en dos columnas -->
        <div class="charts-grid">
          <!-- Columna izquierda -->
          <div class="charts-column">
            <!-- Uso por Instalación -->
            <section class="chart-card">
              <div class="chart-header">
                <Waves :size="20" />
                <h3>Uso por Instalación</h3>
              </div>
              <canvas ref="chartUsoPorInstalacion"></canvas>
            </section>

            <!-- Asistencia por Día de la Semana -->
            <section class="chart-card">
              <div class="chart-header">
                <CalendarDays :size="20" />
                <h3>Asistencia por Día de la Semana</h3>
              </div>
              <canvas ref="chartAsistenciaPorDia"></canvas>
            </section>

            <!-- Ingresos por Método de Pago -->
            <section class="chart-card">
              <div class="chart-header">
                <CreditCard :size="20" />
                <h3>Ingresos por Método de Pago</h3>
              </div>
              <canvas ref="chartIngresosPorMetodo"></canvas>
            </section>
          </div>

          <!-- Columna derecha -->
          <div class="charts-column">
            <!-- Ocupación por Franja Horaria -->
            <section class="chart-card">
              <div class="chart-header">
                <ClockIcon :size="20" />
                <h3>Ocupación por Franja Horaria</h3>
              </div>
              <canvas ref="chartOcupacionPorHora"></canvas>
            </section>

            <!-- Paquetes Más Vendidos -->
            <section class="chart-card">
              <div class="chart-header">
                <Package :size="20" />
                <h3>Paquetes Más Vendidos</h3>
              </div>
              <canvas ref="chartPaquetesMasVendidos"></canvas>
            </section>

            <!-- Vecinos Frecuentes -->
            <section class="chart-card">
              <div class="chart-header">
                <Star :size="20" />
                <h3>Top 10 Vecinos Frecuentes</h3>
              </div>
              <div class="table-container">
                <table class="vecinos-table">
                  <thead>
                    <tr>
                      <th>
                        <Hash :size="16" />
                      </th>
                      <th>
                        <UserCircle :size="16" />
                        <span>Nombre</span>
                      </th>
                      <th>
                        <MapPin :size="16" />
                        <span>Distrito</span>
                      </th>
                      <th>
                        <TrendingUp :size="16" />
                        <span>Visitas</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(vecino, index) in metricas?.vecinosFrecuentes || []"
                      :key="vecino.dni"
                    >
                      <td class="rank">{{ index + 1 }}</td>
                      <td class="nombre">{{ vecino.nombre }}</td>
                      <td>
                        <span :class="['badge', vecino.esSurco ? 'badge-surco' : 'badge-otro']">
                          <Check v-if="vecino.esSurco" :size="12" />
                          {{ vecino.esSurco ? 'Surco' : 'Otro' }}
                        </span>
                      </td>
                      <td class="visitas">{{ vecino.visitas }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { metricasService } from '../services/api'
import { Chart, registerables } from 'chart.js'
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ArrowLeft,
  User,
  LogOut,
  Loader2,
  AlertCircle,
  RefreshCw,
  CalendarCheck,
  Users,
  Clock,
  DollarSign,
  Activity,
  CalendarRange,
  UserCheck,
  ShoppingBag,
  Timer,
  Banknote,
  TrendingUp,
  Waves,
  CalendarDays,
  CreditCard,
  Clock as ClockIcon,
  Package,
  Star,
  Hash,
  UserCircle,
  MapPin,
  Check,
} from 'lucide-vue-next'

Chart.register(...registerables)

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')
const metricas = ref<any>(null)
const periodoSeleccionado = ref('30')

// Referencias a los canvas
const chartUsoPorInstalacion = ref<HTMLCanvasElement | null>(null)
const chartAsistenciaPorDia = ref<HTMLCanvasElement | null>(null)
const chartOcupacionPorHora = ref<HTMLCanvasElement | null>(null)
const chartIngresosPorMetodo = ref<HTMLCanvasElement | null>(null)
const chartPaquetesMasVendidos = ref<HTMLCanvasElement | null>(null)

// Instancias de los gráficos
let chartInstances: Chart[] = []

const formatearMonto = (monto: number | undefined) => {
  if (!monto) return '0.00'
  return monto.toFixed(2)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const cargarDatos = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await metricasService.getDashboard(parseInt(periodoSeleccionado.value))
    metricas.value = response.data

    await nextTick()
    crearGraficos()
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Error al cargar métricas'
    console.error('Error cargando métricas:', err)
  } finally {
    loading.value = false
  }
}

const crearGraficos = () => {
  // Destruir gráficos anteriores
  chartInstances.forEach((chart) => chart.destroy())
  chartInstances = []

  // Gráfico: Uso por Instalación
  if (chartUsoPorInstalacion.value && metricas.value?.usoPorInstalacion) {
    const ctx = chartUsoPorInstalacion.value.getContext('2d')
    if (ctx) {
      chartInstances.push(
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: metricas.value.usoPorInstalacion.map((item: any) =>
              item.instalacion.replace('PISCINA_', '')
            ),
            datasets: [
              {
                data: metricas.value.usoPorInstalacion.map((item: any) => item.cantidad),
                backgroundColor: ['#1260A5', '#1ACDAC', '#666666'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12,
                    weight: 600,
                  },
                },
              },
            },
          },
        })
      )
    }
  }

  // Gráfico: Asistencia por Día
  if (chartAsistenciaPorDia.value && metricas.value?.asistenciaPorDia) {
    const ctx = chartAsistenciaPorDia.value.getContext('2d')
    if (ctx) {
      chartInstances.push(
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: metricas.value.asistenciaPorDia.map((item: any) => item.dia),
            datasets: [
              {
                label: 'Visitas',
                data: metricas.value.asistenciaPorDia.map((item: any) => item.cantidad),
                backgroundColor: '#1260A5',
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#F5F5F5',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        })
      )
    }
  }

  // Gráfico: Ocupación por Hora
  if (chartOcupacionPorHora.value && metricas.value?.ocupacionPorHora) {
    const ctx = chartOcupacionPorHora.value.getContext('2d')
    if (ctx) {
      chartInstances.push(
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: metricas.value.ocupacionPorHora.map((item: any) => item.hora),
            datasets: [
              {
                label: 'Asistencias',
                data: metricas.value.ocupacionPorHora.map((item: any) => item.cantidad),
                borderColor: '#1ACDAC',
                backgroundColor: 'rgba(26, 205, 172, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: '#1ACDAC',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#F5F5F5',
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        })
      )
    }
  }

  // Gráfico: Ingresos por Método de Pago
  if (chartIngresosPorMetodo.value && metricas.value?.ingresosPorMetodoPago) {
    const ctx = chartIngresosPorMetodo.value.getContext('2d')
    if (ctx) {
      chartInstances.push(
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: metricas.value.ingresosPorMetodoPago.map((item: any) => item.metodoPago),
            datasets: [
              {
                data: metricas.value.ingresosPorMetodoPago.map((item: any) => item.monto),
                backgroundColor: ['#1ACDAC', '#1260A5', '#FFA726', '#666666'],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 15,
                  font: {
                    size: 12,
                    weight: 600,
                  },
                },
              },
            },
          },
        })
      )
    }
  }

  // Gráfico: Paquetes Más Vendidos
  if (chartPaquetesMasVendidos.value && metricas.value?.paquetesMasVendidos) {
    const ctx = chartPaquetesMasVendidos.value.getContext('2d')
    if (ctx) {
      chartInstances.push(
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: metricas.value.paquetesMasVendidos.map((item: any) => item.paquete),
            datasets: [
              {
                label: 'Cantidad Vendida',
                data: metricas.value.paquetesMasVendidos.map((item: any) => item.cantidad),
                backgroundColor: '#1ACDAC',
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  color: '#F5F5F5',
                },
              },
              y: {
                grid: {
                  display: false,
                },
              },
            },
          },
        })
      )
    }
  }
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.dashboard-metricas {
  min-height: 100vh;
  background: var(--color-background);
}

/* Header */
.header {
  background: white;
  padding: var(--spacing-lg) var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-background-light);
  border: 2px solid #E0E0E0;
  border-radius: var(--radius-md);
  color: var(--color-neutral-dark);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-back:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  transform: translateX(-2px);
}

.logo-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-icon {
  color: var(--color-primary);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.facility-name {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  line-height: 1;
  margin: 0;
}

.subtitle {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-neutral-dark);
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background-light);
  border-radius: var(--radius-md);
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-icon-left {
  position: absolute;
  left: var(--spacing-md);
  color: var(--color-neutral);
  pointer-events: none;
  z-index: 1;
}

.select-icon-right {
  position: absolute;
  right: var(--spacing-md);
  color: var(--color-neutral);
  pointer-events: none;
  z-index: 1;
}

.periodo-select {
  padding: var(--spacing-sm) var(--spacing-xl);
  padding-left: calc(var(--spacing-xl) + 20px);
  padding-right: calc(var(--spacing-xl) + 20px);
  border: 2px solid #E0E0E0;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-dark);
  cursor: pointer;
  appearance: none;
  background: white;
  transition: all var(--transition-base);
}

.periodo-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(18, 96, 165, 0.1);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--text-sm);
  font-weight: 600;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: white;
  color: var(--color-neutral-dark);
  border-color: #E0E0E0;
}

.btn-secondary:hover {
  background-color: var(--color-background);
  border-color: var(--color-neutral);
}

/* Content */
.content {
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  animation: fadeIn var(--transition-slow);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Loading and Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl);
  text-align: center;
}

.loading-state p,
.error-state p {
  font-size: var(--text-lg);
  color: var(--color-neutral);
  margin-top: var(--spacing-md);
}

.spinner {
  color: var(--color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-icon {
  color: var(--color-error);
}

/* Sections */
.section {
  margin-bottom: var(--spacing-2xl);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.section-icon {
  color: var(--color-primary);
}

.section-title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0;
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
}

.kpi-grid-5 {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.kpi-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border: 2px solid transparent;
  transition: all var(--transition-base);
  animation: slideUp var(--transition-base);
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.kpi-icon-container {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.kpi-primary .kpi-icon-container {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
}

.kpi-secondary .kpi-icon-container {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  color: white;
}

.kpi-success .kpi-icon-container {
  background: linear-gradient(135deg, #1ACDAC, #14a085);
  color: white;
}

.kpi-info .kpi-icon-container {
  background: linear-gradient(135deg, #1260A5, #0d4675);
  color: white;
}

.kpi-neutral .kpi-icon-container {
  background: linear-gradient(135deg, var(--color-neutral), var(--color-neutral-dark));
  color: white;
}

.kpi-content {
  flex: 1;
  min-width: 0;
}

.kpi-label {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.kpi-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  line-height: 1.2;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
}

.charts-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.chart-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 2px solid var(--color-background);
  transition: all var(--transition-base);
}

.chart-card:hover {
  box-shadow: var(--shadow-lg);
}

.chart-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--color-background);
}

.chart-header h3 {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-neutral-dark);
}

.chart-header svg {
  color: var(--color-primary);
}

.chart-card canvas {
  height: 300px !important;
}

/* Table */
.table-container {
  overflow-x: auto;
  border-radius: var(--radius-md);
}

.vecinos-table {
  width: 100%;
  border-collapse: collapse;
}

.vecinos-table th,
.vecinos-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 2px solid var(--color-background);
}

.vecinos-table th {
  background: var(--color-background-light);
  font-weight: 700;
  color: var(--color-neutral);
  font-size: var(--text-sm);
}

.vecinos-table th {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.vecinos-table td {
  color: var(--color-neutral-dark);
  font-size: var(--text-sm);
}

.vecinos-table .rank {
  font-weight: 700;
  color: var(--color-primary);
  font-size: var(--text-base);
}

.vecinos-table .nombre {
  font-weight: 600;
}

.vecinos-table .visitas {
  font-weight: 700;
  color: var(--color-secondary);
  font-size: var(--text-base);
}

.vecinos-table tbody tr {
  transition: background-color var(--transition-base);
}

.vecinos-table tbody tr:hover {
  background-color: rgba(18, 96, 165, 0.05);
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
}

.badge-surco {
  background: rgba(26, 205, 172, 0.1);
  color: var(--color-secondary-dark);
}

.badge-otro {
  background: rgba(18, 96, 165, 0.1);
  color: var(--color-primary-dark);
}

/* Responsive */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }

  .header-left,
  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .facility-name {
    font-size: var(--text-xl);
  }

  .user-info span {
    display: none;
  }

  .header-right {
    flex-wrap: wrap;
  }

  .select-wrapper {
    flex: 1;
    min-width: 140px;
  }

  .content {
    padding: var(--spacing-lg);
  }

  .kpi-grid,
  .kpi-grid-5 {
    grid-template-columns: 1fr;
  }

  .kpi-value {
    font-size: var(--text-xl);
  }

  .chart-card canvas {
    height: 250px !important;
  }
}

@media (max-width: 640px) {
  .facility-name {
    font-size: var(--text-lg);
  }

  .subtitle {
    font-size: var(--text-xs);
  }

  .kpi-card {
    flex-direction: column;
    text-align: center;
  }

  .kpi-icon-container {
    width: 56px;
    height: 56px;
  }

  .vecinos-table th,
  .vecinos-table td {
    padding: var(--spacing-sm);
    font-size: var(--text-xs);
  }
}
</style>
