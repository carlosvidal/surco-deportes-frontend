<template>
  <div class="vecino-ficha">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <button @click="router.push('/vecinos')" class="btn-back">
          <ArrowLeft :size="20" />
        </button>
        <div class="logo-header">
          <UserCircle :size="32" :stroke-width="2.5" class="logo-icon" />
          <div class="header-titles">
            <h1 class="facility-name">Ficha de Vecino</h1>
            <p class="subtitle">Información detallada y gestión</p>
          </div>
        </div>
      </div>

      <div class="header-right">
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

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <Loader2 :size="48" class="spinner" />
      <p>Cargando información del vecino...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state card">
      <AlertCircle :size="64" class="error-icon" />
      <h3>Error al cargar datos</h3>
      <p>{{ error }}</p>
      <button @click="cargarVecino" class="btn btn-primary">
        <RefreshCw :size="18" />
        <span>Reintentar</span>
      </button>
    </div>

    <!-- Main Content -->
    <main class="content" v-else-if="vecino">
      <!-- Información Personal -->
      <div class="info-card card">
        <div class="card-header">
          <div class="card-title">
            <User :size="24" class="title-icon" />
            <h2>Información Personal</h2>
          </div>
          <button @click="mostrarEditarModal = true" class="btn btn-outline btn-sm">
            <Edit2 :size="16" />
            <span>Editar</span>
          </button>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">
              <CreditCard :size="18" />
              <span>DNI</span>
            </div>
            <div class="info-value">{{ vecino.dni }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <User :size="18" />
              <span>Nombre Completo</span>
            </div>
            <div class="info-value">{{ vecino.nombre }} {{ vecino.apellidos }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <MapPin :size="18" />
              <span>Distrito</span>
            </div>
            <div class="info-value">
              {{ vecino.distrito }}
              <span v-if="vecino.esSurco" class="badge badge-success badge-sm">
                <Check :size="12" />
                Surco
              </span>
            </div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <Phone :size="18" />
              <span>Teléfono</span>
            </div>
            <div class="info-value">{{ vecino.telefono || 'No registrado' }}</div>
          </div>

          <div class="info-item" v-if="vecino.email">
            <div class="info-label">
              <Mail :size="18" />
              <span>Email</span>
            </div>
            <div class="info-value">{{ vecino.email }}</div>
          </div>

          <div class="info-item" v-if="vecino.contactoEmergencia">
            <div class="info-label">
              <AlertCircle :size="18" />
              <span>Contacto de Emergencia</span>
            </div>
            <div class="info-value">{{ vecino.contactoEmergencia }}</div>
          </div>
        </div>
      </div>

      <!-- Saldo -->
      <div class="saldo-card card">
        <div class="saldo-header">
          <Clock :size="32" :stroke-width="2" class="saldo-icon" />
          <div class="saldo-title">
            <h2>Saldo de Horas</h2>
            <p>Disponibles para usar en instalaciones</p>
          </div>
        </div>

        <div class="saldo-display" :class="getSaldoClass(vecino.saldo)">
          <div class="saldo-numero">{{ vecino.saldo }}</div>
          <div class="saldo-texto">horas</div>
        </div>

        <div class="saldo-stats">
          <div class="stat-item">
            <div class="stat-icon stat-success">
              <ShoppingBag :size="20" />
            </div>
            <div class="stat-content">
              <div class="stat-label">Compradas</div>
              <div class="stat-value">{{ vecino.horasCompradas }} hrs</div>
            </div>
          </div>

          <div class="stat-separator"></div>

          <div class="stat-item">
            <div class="stat-icon stat-info">
              <TrendingDown :size="20" />
            </div>
            <div class="stat-content">
              <div class="stat-label">Usadas</div>
              <div class="stat-value">{{ vecino.horasConsumidas }} hrs</div>
            </div>
          </div>
        </div>

        <button @click="mostrarVentaModal = true" class="btn btn-primary btn-lg btn-block">
          <Plus :size="20" />
          <span>Vender Horas</span>
        </button>
      </div>

      <!-- Historial -->
      <div class="historial-card card">
        <div class="card-header">
          <div class="card-title">
            <History :size="24" class="title-icon" />
            <h2>Historial Reciente</h2>
          </div>
          <span class="badge badge-secondary">{{ getHistorialMezclado().length }} registros</span>
        </div>

        <div v-if="getHistorialMezclado().length === 0" class="empty-historial">
          <FileText :size="48" class="empty-icon" />
          <p>No hay registros en el historial</p>
        </div>

        <div v-else class="historial-list">
          <div
            v-for="item in getHistorialMezclado()"
            :key="item.id"
            class="historial-item"
          >
            <div class="historial-icon" :class="item.tipo">
              <ShoppingCart v-if="item.tipo === 'compra'" :size="20" />
              <Activity v-else :size="20" />
            </div>

            <div class="historial-content">
              <div class="historial-descripcion">{{ item.descripcion }}</div>
              <div class="historial-fecha">
                <Calendar :size="14" />
                <span>{{ formatearFecha(item.fecha) }}</span>
              </div>
            </div>

            <div class="historial-badge" :class="item.tipo">
              {{ item.tipo === 'compra' ? 'Compra' : 'Consumo' }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal: Venta -->
    <VentaModal
      v-if="mostrarVentaModal && vecino"
      :vecino="vecino"
      @close="mostrarVentaModal = false"
      @venta-registrada="handleVentaRegistrada"
    />

    <!-- Modal: Editar -->
    <VecinoForm
      v-if="mostrarEditarModal && vecino"
      :vecino="vecino"
      @close="mostrarEditarModal = false"
      @saved="handleVecinoEditado"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { vecinosService } from '../services/api'
import VentaModal from '../components/compra/VentaModal.vue'
import VecinoForm from '../components/vecino/VecinoForm.vue'
import {
  ArrowLeft,
  UserCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  User,
  LogOut,
  Edit2,
  CreditCard,
  MapPin,
  Check,
  Phone,
  Mail,
  Clock,
  ShoppingBag,
  TrendingDown,
  Plus,
  History,
  FileText,
  ShoppingCart,
  Activity,
  Calendar,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const vecino = ref<any>(null)
const historial = ref<any>(null)
const loading = ref(true)
const error = ref('')
const mostrarVentaModal = ref(false)
const mostrarEditarModal = ref(false)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const handleVentaRegistrada = () => {
  mostrarVentaModal.value = false
  cargarVecino()
}

const handleVecinoEditado = () => {
  mostrarEditarModal.value = false
  cargarVecino()
}

const getSaldoClass = (saldo: number) => {
  if (saldo <= 0) return 'saldo-cero'
  if (saldo <= 4) return 'saldo-bajo'
  return 'saldo-ok'
}

const cargarVecino = async () => {
  try {
    loading.value = true
    error.value = ''
    const dni = route.params.dni as string

    const [vecinoRes, historialRes] = await Promise.all([
      vecinosService.buscarPorDni(dni),
      vecinosService.historial(dni),
    ])

    vecino.value = vecinoRes.data
    historial.value = historialRes.data
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Error al cargar datos del vecino'
  } finally {
    loading.value = false
  }
}

const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getHistorialMezclado = () => {
  if (!historial.value) return []

  const items = [
    ...historial.value.compras.map((c: any) => ({
      id: `compra-${c.id}`,
      fecha: c.createdAt,
      descripcion: `+${c.horas} horas - S/ ${c.monto} (${c.metodoPago})`,
      tipo: 'compra',
    })),
    ...historial.value.consumos.map((c: any) => ({
      id: `consumo-${c.id}`,
      fecha: c.entradaAt,
      descripcion: `${formatearInstalacion(c.instalacion)} ${c.carril ? `Carril ${c.carril}` : ''}`,
      tipo: 'consumo',
    })),
  ]

  return items.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  ).slice(0, 15)
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

onMounted(() => {
  cargarVecino()
})
</script>

<style scoped>
.vecino-ficha {
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

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  gap: var(--spacing-md);
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

.loading-state p {
  font-size: var(--text-lg);
  color: var(--color-neutral);
  font-weight: 500;
}

/* Error State */
.error-state {
  max-width: 600px;
  margin: var(--spacing-3xl) auto;
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.error-icon {
  color: var(--color-error);
  margin-bottom: var(--spacing-md);
}

.error-state h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-neutral-dark);
  margin: 0;
}

.error-state p {
  font-size: var(--text-base);
  color: var(--color-error);
  margin: 0;
  margin-bottom: var(--spacing-md);
}

/* Content */
.content {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: var(--spacing-xl);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--color-background);
}

.card-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.title-icon {
  color: var(--color-primary);
}

.card-title h2 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0;
}

/* Info Card */
.info-card {
  padding: var(--spacing-xl);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral);
}

.info-value {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-neutral-dark);
}

.badge-sm {
  padding: 2px var(--spacing-xs);
  font-size: var(--text-xs);
}

/* Saldo Card */
.saldo-card {
  padding: var(--spacing-xl);
  text-align: center;
  background: linear-gradient(to bottom, white, var(--color-background-light));
}

.saldo-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.saldo-icon {
  color: var(--color-primary);
}

.saldo-title {
  text-align: left;
}

.saldo-title h2 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0;
}

.saldo-title p {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  margin: 0;
  margin-top: var(--spacing-xs);
}

.saldo-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.saldo-numero {
  font-size: 5rem;
  font-weight: 700;
  line-height: 1;
}

.saldo-texto {
  font-size: var(--text-2xl);
  font-weight: 500;
  opacity: 0.7;
}

.saldo-display.saldo-ok {
  color: var(--color-success);
}

.saldo-display.saldo-bajo {
  color: var(--color-warning);
}

.saldo-display.saldo-cero {
  color: var(--color-error);
}

.saldo-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--radius-lg);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
}

.stat-icon.stat-success {
  background: rgba(26, 205, 172, 0.1);
  color: var(--color-success);
}

.stat-icon.stat-info {
  background: rgba(18, 96, 165, 0.1);
  color: var(--color-info);
}

.stat-content {
  text-align: left;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  font-weight: 500;
}

.stat-value {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
}

.stat-separator {
  width: 1px;
  height: 48px;
  background: var(--color-background);
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--text-lg);
}

.btn-block {
  width: 100%;
}

/* Historial Card */
.historial-card {
  padding: var(--spacing-xl);
}

.empty-historial {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
}

.empty-icon {
  color: var(--color-neutral-light);
  margin-bottom: var(--spacing-md);
}

.empty-historial p {
  font-size: var(--text-base);
  color: var(--color-neutral);
}

.historial-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.historial-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-background-light);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.historial-item:hover {
  background: var(--color-background);
  transform: translateX(4px);
}

.historial-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
}

.historial-icon.compra {
  background: rgba(26, 205, 172, 0.1);
  color: var(--color-success);
}

.historial-icon.consumo {
  background: rgba(18, 96, 165, 0.1);
  color: var(--color-info);
}

.historial-content {
  flex: 1;
  min-width: 0;
}

.historial-descripcion {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-neutral-dark);
  margin-bottom: var(--spacing-xs);
}

.historial-fecha {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-neutral);
}

.historial-badge {
  flex-shrink: 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 700;
}

.historial-badge.compra {
  background: rgba(26, 205, 172, 0.1);
  color: var(--color-success);
}

.historial-badge.consumo {
  background: rgba(18, 96, 165, 0.1);
  color: var(--color-info);
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

  .user-info span {
    display: none;
  }

  .content {
    padding: var(--spacing-md);
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .saldo-numero {
    font-size: 4rem;
  }

  .saldo-stats {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .stat-separator {
    display: none;
  }

  .stat-item {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .facility-name {
    font-size: var(--text-lg);
  }

  .subtitle {
    font-size: var(--text-xs);
  }

  .saldo-numero {
    font-size: 3rem;
  }

  .saldo-texto {
    font-size: var(--text-xl);
  }
}
</style>
