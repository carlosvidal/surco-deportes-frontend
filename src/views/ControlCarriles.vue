<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <button @click="router.push('/')" class="btn-back">
          <ArrowLeft :size="20" />
        </button>
        <div class="logo-header">
          <Waves :size="32" :stroke-width="2.5" class="logo-icon" />
          <div class="header-titles">
            <h1 class="facility-name">Control de Carriles</h1>
            <p class="subtitle">Gestión de check-in y check-out</p>
          </div>
        </div>
      </div>

      <div class="header-right">
        <!-- Botón de Alertas -->
        <button
          v-if="alertasStore.hayAlertas"
          @click="mostrarPanelAlertas = !mostrarPanelAlertas"
          :class="['btn-alertas', { 'alertas-criticas': alertasStore.hayAlertasCriticas }]"
        >
          <Bell :size="20" />
          <span class="badge badge-warning">{{ alertasStore.totalAlertas }}</span>
        </button>

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

    <!-- Panel de Alertas -->
    <PanelAlertas v-if="mostrarPanelAlertas" @cerrar="mostrarPanelAlertas = false" />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Buscador de vecino -->
      <div class="search-section card">
        <div class="search-header">
          <Search :size="24" class="text-primary" />
          <h2>Buscar Vecino</h2>
        </div>
        <div class="search-box">
          <div class="input-wrapper">
            <Search :size="20" class="input-icon" />
            <input
              v-model="dniBusqueda"
              type="text"
              class="input input-with-icon"
              placeholder="Ingrese DNI del vecino..."
              @keyup.enter="buscarVecino"
              maxlength="8"
            />
          </div>
          <button @click="buscarVecino" class="btn btn-primary">
            <Search :size="18" />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      <!-- Piscina Adultos -->
      <section class="instalacion-section">
        <div class="section-header">
          <div class="section-title">
            <Waves :size="28" class="text-primary" />
            <div>
              <h2>Piscina Adultos (25m)</h2>
              <p class="section-subtitle">8 carriles disponibles</p>
            </div>
          </div>
          <div class="section-stats">
            <div class="stat-chip stat-chip-success">
              <CheckCircle2 :size="16" />
              <span>{{ getCarrilesLibres('PISCINA_ADULTOS') }} Libres</span>
            </div>
            <div class="stat-chip stat-chip-info">
              <Activity :size="16" />
              <span>{{ getCarrilesOcupados('PISCINA_ADULTOS') }} Ocupados</span>
            </div>
          </div>
        </div>

        <div class="carriles-grid">
          <div
            v-for="carril in 8"
            :key="`adultos-${carril}`"
            :class="[
              'carril-card',
              getConsumoEnCarril('PISCINA_ADULTOS', carril) ? 'ocupado' : 'libre',
              getEstadoColor(getConsumoEnCarril('PISCINA_ADULTOS', carril)),
            ]"
          >
            <div class="carril-header">
              <div class="carril-numero">
                <Hash :size="16" />
                <span>{{ carril }}</span>
              </div>
              <div
                v-if="getConsumoEnCarril('PISCINA_ADULTOS', carril)"
                :class="['estado-badge', getEstadoColor(getConsumoEnCarril('PISCINA_ADULTOS', carril))]"
              >
                <Clock :size="14" />
              </div>
            </div>

            <!-- Carril Ocupado -->
            <div
              v-if="getConsumoEnCarril('PISCINA_ADULTOS', carril)"
              class="carril-content"
            >
              <div class="vecino-info">
                <UserCircle :size="20" class="vecino-icon" />
                <div class="vecino-nombre">
                  {{ getConsumoEnCarril('PISCINA_ADULTOS', carril)?.vecino.nombre }}
                  {{ getConsumoEnCarril('PISCINA_ADULTOS', carril)?.vecino.apellidos }}
                </div>
              </div>

              <div class="tiempo-restante">
                <Clock :size="18" />
                <span class="tiempo-valor">
                  {{ getTiempoRestante(getConsumoEnCarril('PISCINA_ADULTOS', carril)) }}
                </span>
              </div>

              <button
                @click="checkout(getConsumoEnCarril('PISCINA_ADULTOS', carril)!.id)"
                class="btn btn-secondary btn-sm btn-block"
              >
                <LogOut :size="16" />
                <span>Salida</span>
              </button>
            </div>

            <!-- Carril Libre -->
            <div v-else class="carril-content carril-libre-content">
              <div class="libre-indicator">
                <CheckCircle2 :size="32" class="libre-icon" />
                <span class="libre-text">Disponible</span>
              </div>
              <button
                @click="abrirCheckin('PISCINA_ADULTOS', carril)"
                class="btn btn-primary btn-sm btn-block"
              >
                <UserPlus :size="16" />
                <span>Check-in</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Piscina Niños -->
      <section class="instalacion-section">
        <div class="section-header">
          <div class="section-title">
            <Waves :size="28" class="text-secondary" />
            <div>
              <h2>Piscina Niños</h2>
              <p class="section-subtitle">5 carriles disponibles</p>
            </div>
          </div>
          <div class="section-stats">
            <div class="stat-chip stat-chip-success">
              <CheckCircle2 :size="16" />
              <span>{{ getCarrilesLibres('PISCINA_NINOS') }} Libres</span>
            </div>
            <div class="stat-chip stat-chip-info">
              <Activity :size="16" />
              <span>{{ getCarrilesOcupados('PISCINA_NINOS') }} Ocupados</span>
            </div>
          </div>
        </div>

        <div class="carriles-grid">
          <div
            v-for="carril in 5"
            :key="`ninos-${carril}`"
            :class="[
              'carril-card',
              getConsumoEnCarril('PISCINA_NINOS', carril) ? 'ocupado' : 'libre',
              getEstadoColor(getConsumoEnCarril('PISCINA_NINOS', carril)),
            ]"
          >
            <div class="carril-header">
              <div class="carril-numero">
                <Hash :size="16" />
                <span>{{ carril }}</span>
              </div>
              <div
                v-if="getConsumoEnCarril('PISCINA_NINOS', carril)"
                :class="['estado-badge', getEstadoColor(getConsumoEnCarril('PISCINA_NINOS', carril))]"
              >
                <Clock :size="14" />
              </div>
            </div>

            <!-- Carril Ocupado -->
            <div
              v-if="getConsumoEnCarril('PISCINA_NINOS', carril)"
              class="carril-content"
            >
              <div class="vecino-info">
                <UserCircle :size="20" class="vecino-icon" />
                <div class="vecino-nombre">
                  {{ getConsumoEnCarril('PISCINA_NINOS', carril)?.vecino.nombre }}
                  {{ getConsumoEnCarril('PISCINA_NINOS', carril)?.vecino.apellidos }}
                </div>
              </div>

              <div class="tiempo-restante">
                <Clock :size="18" />
                <span class="tiempo-valor">
                  {{ getTiempoRestante(getConsumoEnCarril('PISCINA_NINOS', carril)) }}
                </span>
              </div>

              <button
                @click="checkout(getConsumoEnCarril('PISCINA_NINOS', carril)!.id)"
                class="btn btn-secondary btn-sm btn-block"
              >
                <LogOut :size="16" />
                <span>Salida</span>
              </button>
            </div>

            <!-- Carril Libre -->
            <div v-else class="carril-content carril-libre-content">
              <div class="libre-indicator">
                <CheckCircle2 :size="32" class="libre-icon" />
                <span class="libre-text">Disponible</span>
              </div>
              <button
                @click="abrirCheckin('PISCINA_NINOS', carril)"
                class="btn btn-primary btn-sm btn-block"
              >
                <UserPlus :size="16" />
                <span>Check-in</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal de Check-in -->
    <div v-if="mostrarModalCheckin" class="modal-overlay" @click="cerrarModal">
      <div class="modal-content card" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <UserPlus :size="24" class="text-primary" />
            <h3>Check-in</h3>
          </div>
          <button @click="cerrarModal" class="btn-close">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-info">
            <div class="info-item">
              <Waves :size="18" />
              <span>{{ formatearInstalacion(instalacionActual) }}</span>
            </div>
            <div class="info-item">
              <Hash :size="18" />
              <span>Carril {{ carrilActual }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="checkin-dni" class="label">DNI del Vecino</label>
            <div class="input-wrapper">
              <CreditCard :size="20" class="input-icon" />
              <input
                id="checkin-dni"
                v-model="checkinDni"
                type="text"
                class="input input-with-icon"
                placeholder="Ingrese DNI (8 dígitos)"
                maxlength="8"
                @keyup.enter="realizarCheckin"
                autofocus
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="cerrarModal" class="btn btn-ghost">
            <X :size="18" />
            <span>Cancelar</span>
          </button>
          <button @click="realizarCheckin" class="btn btn-primary">
            <Check :size="18" />
            <span>Confirmar Entrada</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Registro de Vecino -->
    <VecinoForm
      v-if="mostrarRegistroVecino"
      :dni-inicial="dniParaRegistro"
      @close="cerrarRegistroVecino"
      @saved="vecinoRegistrado"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDashboardStore } from '../stores/dashboard'
import { useAlertasStore } from '../stores/alertas'
import { consumosService, vecinosService } from '../services/api'
import VecinoForm from '../components/vecino/VecinoForm.vue'
import PanelAlertas from '../components/dashboard/PanelAlertas.vue'
import {
  Waves,
  User,
  LogOut,
  Bell,
  Search,
  CheckCircle2,
  Activity,
  Hash,
  Clock,
  UserCircle,
  UserPlus,
  X,
  CreditCard,
  Check,
  ArrowLeft,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const alertasStore = useAlertasStore()

const dniBusqueda = ref('')
const mostrarModalCheckin = ref(false)
const mostrarPanelAlertas = ref(false)
const checkinDni = ref('')
const instalacionActual = ref('')
const carrilActual = ref<number | null>(null)
const mostrarRegistroVecino = ref(false)
const dniParaRegistro = ref('')

let intervalId: number | null = null

const getCarrilesLibres = (instalacion: string) => {
  const total = instalacion === 'PISCINA_ADULTOS' ? 8 : 5
  const ocupados = dashboardStore.consumosActivos.filter(
    (c) => c.instalacion === instalacion
  ).length
  return total - ocupados
}

const getCarrilesOcupados = (instalacion: string) => {
  return dashboardStore.consumosActivos.filter(
    (c) => c.instalacion === instalacion
  ).length
}

const formatearInstalacion = (instalacion: string) => {
  const instalaciones: Record<string, string> = {
    PISCINA_ADULTOS: 'Piscina Adultos',
    PISCINA_NINOS: 'Piscina Niños',
    PADDLE: 'Paddle',
    GIMNASIO: 'Gimnasio',
  }
  return instalaciones[instalacion] || instalacion
}

const buscarVecino = async () => {
  if (!dniBusqueda.value.trim()) return

  try {
    await vecinosService.buscarPorDni(dniBusqueda.value)
    router.push(`/vecino/${dniBusqueda.value}`)
  } catch (error: any) {
    if (error.response?.status === 404) {
      dniParaRegistro.value = dniBusqueda.value
      mostrarRegistroVecino.value = true
    } else {
      alert('Error al buscar vecino')
    }
  }
}

const cerrarRegistroVecino = () => {
  mostrarRegistroVecino.value = false
  dniParaRegistro.value = ''
}

const vecinoRegistrado = () => {
  router.push(`/vecino/${dniParaRegistro.value}`)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const getConsumoEnCarril = (instalacion: string, carril: number) => {
  return dashboardStore.consumosActivos.find(
    (c) => c.instalacion === instalacion && c.carril === carril
  )
}

const getEstadoColor = (consumo: any) => {
  if (!consumo) return ''
  return dashboardStore.getEstadoCarril(consumo)
}

const getTiempoRestante = (consumo: any) => {
  if (!consumo) return ''
  const minutos = consumo.tiempoRestante
  if (minutos < 0) return 'Excedido'
  return `${minutos} min`
}

const abrirCheckin = (instalacion: string, carril: number) => {
  instalacionActual.value = instalacion
  carrilActual.value = carril
  mostrarModalCheckin.value = true
}

const cerrarModal = () => {
  mostrarModalCheckin.value = false
  checkinDni.value = ''
  instalacionActual.value = ''
  carrilActual.value = null
}

const realizarCheckin = async () => {
  try {
    await consumosService.checkin({
      vecinoDni: checkinDni.value,
      instalacion: instalacionActual.value,
      carril: carrilActual.value || undefined,
    })
    cerrarModal()
    await dashboardStore.cargarConsumosActivos()
    await alertasStore.cargarAlertas()
  } catch (error: any) {
    alert(error.response?.data?.error || 'Error al realizar check-in')
  }
}

const checkout = async (consumoId: number) => {
  try {
    await consumosService.checkout(consumoId)
    await dashboardStore.cargarConsumosActivos()
    await alertasStore.cargarAlertas()
  } catch (error: any) {
    alert(error.response?.data?.error || 'Error al realizar check-out')
  }
}

onMounted(() => {
  dashboardStore.cargarConsumosActivos()
  alertasStore.cargarAlertas()
  intervalId = window.setInterval(() => {
    dashboardStore.cargarConsumosActivos()
    alertasStore.cargarAlertas()
  }, 30000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.dashboard {
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

.btn-alertas {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 167, 38, 0.1);
  color: var(--color-warning);
  border: 2px solid var(--color-warning);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-base);
  animation: pulse-warning 2s ease-in-out infinite;
}

.btn-alertas.alertas-criticas {
  background: rgba(239, 83, 80, 0.1);
  color: var(--color-error);
  border-color: var(--color-error);
  animation: pulse-error 1s ease-in-out infinite;
}

@keyframes pulse-warning {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 167, 38, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(255, 167, 38, 0);
  }
}

@keyframes pulse-error {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 83, 80, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 8px rgba(239, 83, 80, 0);
  }
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

/* Main Content */
.main-content {
  padding: var(--spacing-xl);
  max-width: 1600px;
  margin: 0 auto;
}

/* Search Section */
.search-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
}

.search-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.search-header h2 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-neutral-dark);
  margin: 0;
}

.search-box {
  display: flex;
  gap: var(--spacing-md);
}

.input-wrapper {
  flex: 1;
  max-width: 500px;
}

/* Instalación Section */
.instalacion-section {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.section-title h2 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0;
}

.section-subtitle {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  margin: 0;
}

.section-stats {
  display: flex;
  gap: var(--spacing-sm);
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
}

.stat-chip-success {
  background: rgba(26, 205, 172, 0.1);
  color: var(--color-success);
}

.stat-chip-info {
  background: rgba(18, 96, 165, 0.1);
  color: var(--color-info);
}

/* Carriles Grid */
.carriles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-md);
}

.carril-card {
  background: white;
  border: 2px solid var(--color-background);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
}

.carril-card.libre {
  border-color: rgba(26, 205, 172, 0.3);
}

.carril-card.ocupado.verde {
  border-color: var(--color-success);
  background: rgba(26, 205, 172, 0.02);
}

.carril-card.ocupado.amarillo {
  border-color: var(--color-warning);
  background: rgba(255, 167, 38, 0.02);
}

.carril-card.ocupado.rojo {
  border-color: var(--color-error);
  background: rgba(239, 83, 80, 0.02);
  animation: shake-gentle 2s ease-in-out infinite;
}

@keyframes shake-gentle {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  75% {
    transform: translateX(2px);
  }
}

.carril-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background-light);
  border-bottom: 2px solid var(--color-background);
}

.carril-numero {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 700;
  color: var(--color-neutral-dark);
  font-size: var(--text-base);
}

.estado-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
}

.estado-badge.verde {
  color: var(--color-success);
  background: rgba(26, 205, 172, 0.1);
}

.estado-badge.amarillo {
  color: var(--color-warning);
  background: rgba(255, 167, 38, 0.1);
  animation: pulse-badge 2s ease-in-out infinite;
}

.estado-badge.rojo {
  color: var(--color-error);
  background: rgba(239, 83, 80, 0.1);
  animation: pulse-badge 1s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.carril-content {
  padding: var(--spacing-md);
}

.carril-libre-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-md);
}

.libre-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.libre-icon {
  color: var(--color-success);
  opacity: 0.6;
}

.libre-text {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  font-weight: 500;
}

.vecino-info {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.vecino-icon {
  color: var(--color-neutral);
  flex-shrink: 0;
  margin-top: 2px;
}

.vecino-nombre {
  font-weight: 600;
  color: var(--color-neutral-dark);
  font-size: var(--text-sm);
  line-height: 1.4;
}

.tiempo-restante {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-background-light);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.tiempo-valor {
  font-weight: 700;
  font-size: var(--text-base);
  color: var(--color-neutral-dark);
}

.btn-block {
  width: 100%;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 100%;
  max-width: 480px;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 2px solid var(--color-background);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.modal-title h3 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
  color: var(--color-neutral);
  transition: all var(--transition-base);
}

.btn-close:hover {
  background: var(--color-background);
  color: var(--color-neutral-dark);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-info {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-background-light);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 2px solid var(--color-background);
}

/* Mobile Responsive */
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

  .main-content {
    padding: var(--spacing-md);
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .carriles-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .user-info span {
    display: none;
  }
}

@media (max-width: 640px) {
  .search-box {
    flex-direction: column;
  }

  .input-wrapper {
    max-width: 100%;
  }

  .carriles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
