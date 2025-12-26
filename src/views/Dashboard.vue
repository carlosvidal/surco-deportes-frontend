<template>
  <div class="dashboard-home">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-container">
            <Waves :size="48" :stroke-width="2.5" class="logo-icon" />
          </div>
          <div class="header-titles">
            <h1 class="system-title">Sistema Deportivo Municipal</h1>
            <p class="facility-name">Charilla del Estanque</p>
          </div>
        </div>

        <div class="header-right">
          <div class="user-info">
            <User :size="20" />
            <span>{{ authStore.staff?.nombre }}</span>
          </div>
          <button @click="handleLogout" class="btn btn-ghost">
            <LogOut :size="18" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="welcome-section">
        <h2 class="welcome-title">Bienvenido al Sistema</h2>
        <p class="welcome-subtitle">Selecciona un módulo para comenzar</p>
      </div>

      <!-- Módulos Grid -->
      <div class="modules-grid">
        <!-- Control de Carriles -->
        <button @click="router.push('/carriles')" class="module-card module-primary">
          <div class="module-icon-container">
            <Waves :size="48" :stroke-width="2" />
          </div>
          <div class="module-content">
            <h3 class="module-title">Control de Carriles</h3>
            <p class="module-description">Gestión de check-in y check-out de instalaciones</p>
            <div class="module-stats">
              <div class="stat-item">
                <Activity :size="16" />
                <span>{{ consumosActivos }} activos</span>
              </div>
            </div>
          </div>
          <ChevronRight :size="24" class="module-arrow" />
        </button>

        <!-- Caja del Día -->
        <button @click="router.push('/caja')" class="module-card module-success">
          <div class="module-icon-container">
            <Wallet :size="48" :stroke-width="2" />
          </div>
          <div class="module-content">
            <h3 class="module-title">Caja del Día</h3>
            <p class="module-description">Apertura, cierre y control de ingresos diarios</p>
            <div class="module-stats">
              <div class="stat-item">
                <DollarSign :size="16" />
                <span>Gestión financiera</span>
              </div>
            </div>
          </div>
          <ChevronRight :size="24" class="module-arrow" />
        </button>

        <!-- Gestión de Vecinos -->
        <button @click="router.push('/vecinos')" class="module-card module-info">
          <div class="module-icon-container">
            <Users :size="48" :stroke-width="2" />
          </div>
          <div class="module-content">
            <h3 class="module-title">Gestión de Vecinos</h3>
            <p class="module-description">Registro, consulta y administración de vecinos</p>
            <div class="module-stats">
              <div class="stat-item">
                <UserCheck :size="16" />
                <span>Base de datos</span>
              </div>
            </div>
          </div>
          <ChevronRight :size="24" class="module-arrow" />
        </button>

        <!-- Dashboard de Métricas -->
        <button @click="router.push('/metricas')" class="module-card module-secondary">
          <div class="module-icon-container">
            <BarChart3 :size="48" :stroke-width="2" />
          </div>
          <div class="module-content">
            <h3 class="module-title">Dashboard de Métricas</h3>
            <p class="module-description">Reportes, estadísticas y análisis de datos</p>
            <div class="module-stats">
              <div class="stat-item">
                <TrendingUp :size="16" />
                <span>Análisis detallado</span>
              </div>
            </div>
          </div>
          <ChevronRight :size="24" class="module-arrow" />
        </button>
      </div>

      <!-- Alertas Section -->
      <div v-if="alertasStore.hayAlertas" class="alertas-section">
        <div class="alertas-header">
          <AlertTriangle :size="24" class="alertas-icon" />
          <div>
            <h3>Tienes {{ alertasStore.totalAlertas }} alerta{{ alertasStore.totalAlertas !== 1 ? 's' : '' }} pendiente{{ alertasStore.totalAlertas !== 1 ? 's' : '' }}</h3>
            <p>Revisa el módulo de Control de Carriles para gestionar las alertas</p>
          </div>
        </div>
        <button @click="router.push('/carriles')" class="btn btn-warning">
          <Waves :size="18" />
          <span>Ir a Control de Carriles</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDashboardStore } from '../stores/dashboard'
import { useAlertasStore } from '../stores/alertas'
import {
  Waves,
  User,
  LogOut,
  Wallet,
  Users,
  BarChart3,
  ChevronRight,
  Activity,
  DollarSign,
  UserCheck,
  TrendingUp,
  AlertTriangle,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const alertasStore = useAlertasStore()

const consumosActivos = computed(() => dashboardStore.consumosActivos.length)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  dashboardStore.cargarConsumosActivos()
  alertasStore.cargarAlertas()
})
</script>

<style scoped>
.dashboard-home {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%);
}

/* Header */
.header {
  background: white;
  padding: var(--spacing-lg) var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border-bottom: 3px solid var(--color-primary);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.logo-container {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
}

.logo-icon {
  color: white;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.system-title {
  font-size: var(--text-3xl);
  font-weight: 800;
  color: var(--color-neutral-dark);
  margin: 0;
  line-height: 1;
}

.facility-name {
  font-size: var(--text-lg);
  color: var(--color-primary);
  font-weight: 600;
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
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-background-light);
  border-radius: var(--radius-full);
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-3xl) var(--spacing-xl);
}

.welcome-section {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.welcome-title {
  font-size: var(--text-4xl);
  font-weight: 800;
  color: var(--color-neutral-dark);
  margin: 0 0 var(--spacing-sm) 0;
}

.welcome-subtitle {
  font-size: var(--text-xl);
  color: var(--color-neutral);
  margin: 0;
}

/* Modules Grid */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.module-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  background: white;
  border: 3px solid transparent;
  border-radius: var(--radius-2xl);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: left;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  opacity: 0;
  transition: opacity var(--transition-base);
}

.module-card:hover::before {
  opacity: 1;
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-2xl);
  border-color: var(--color-primary);
}

.module-primary {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
}

.module-success {
  background: linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%);
}

.module-info {
  background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
}

.module-secondary {
  background: linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%);
}

.module-icon-container {
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-md);
  transition: all var(--transition-base);
}

.module-primary .module-icon-container {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
}

.module-success .module-icon-container {
  background: linear-gradient(135deg, #1ACDAC, #14a085);
  color: white;
}

.module-info .module-icon-container {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.module-secondary .module-icon-container {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  color: white;
}

.module-card:hover .module-icon-container {
  transform: scale(1.1) rotate(5deg);
}

.module-content {
  flex: 1;
}

.module-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0 0 var(--spacing-sm) 0;
}

.module-description {
  font-size: var(--text-base);
  color: var(--color-neutral);
  margin: 0 0 var(--spacing-lg) 0;
  line-height: 1.6;
}

.module-stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-neutral);
  font-weight: 600;
}

.module-arrow {
  position: absolute;
  right: var(--spacing-lg);
  top: var(--spacing-lg);
  color: var(--color-neutral);
  opacity: 0.4;
  transition: all var(--transition-base);
}

.module-card:hover .module-arrow {
  opacity: 1;
  transform: translateX(4px);
  color: var(--color-primary);
}

/* Alertas Section */
.alertas-section {
  background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
  border: 3px solid var(--color-warning);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  animation: pulse-warning 2s ease-in-out infinite;
}

@keyframes pulse-warning {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 167, 38, 0.4);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(255, 167, 38, 0);
  }
}

.alertas-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.alertas-icon {
  color: var(--color-warning);
  flex-shrink: 0;
}

.alertas-header h3 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0 0 var(--spacing-xs) 0;
}

.alertas-header p {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  margin: 0;
}

.btn-warning {
  background: var(--color-warning);
  color: white;
  border-color: var(--color-warning);
}

.btn-warning:hover {
  background: #e68a00;
  border-color: #e68a00;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .logo-container {
    width: 64px;
    height: 64px;
  }

  .system-title {
    font-size: var(--text-2xl);
  }

  .facility-name {
    font-size: var(--text-base);
  }

  .main-content {
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .welcome-title {
    font-size: var(--text-2xl);
  }

  .welcome-subtitle {
    font-size: var(--text-base);
  }

  .modules-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .module-icon-container {
    width: 72px;
    height: 72px;
  }

  .module-title {
    font-size: var(--text-xl);
  }

  .alertas-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-info span {
    display: none;
  }
}

@media (max-width: 480px) {
  .module-card {
    padding: var(--spacing-lg);
  }

  .module-arrow {
    display: none;
  }
}
</style>
