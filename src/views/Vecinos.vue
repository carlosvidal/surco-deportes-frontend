<template>
  <div class="vecinos-page">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <button @click="router.push('/')" class="btn-back">
          <ArrowLeft :size="20" />
        </button>
        <div class="logo-header">
          <Users :size="32" :stroke-width="2.5" class="logo-icon" />
          <div class="header-titles">
            <h1 class="facility-name">Gestión de Vecinos</h1>
            <p class="subtitle">Consultar y administrar vecinos registrados</p>
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

    <!-- Main Content -->
    <main class="content">
      <!-- Toolbar -->
      <div class="toolbar card">
        <div class="search-box">
          <div class="input-wrapper">
            <Search :size="20" class="input-icon" />
            <input
              v-model="busqueda"
              type="text"
              class="input input-with-icon"
              placeholder="Buscar por DNI, nombre o apellidos..."
              @input="buscarVecinos"
            />
          </div>
        </div>
        <button @click="mostrarNuevoVecino = true" class="btn btn-primary">
          <UserPlus :size="18" />
          <span>Registrar Vecino</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <Loader2 :size="48" class="spinner" />
        <p>Cargando vecinos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="vecinos.length === 0" class="empty-state card">
        <UserX :size="64" class="empty-icon" />
        <h3 v-if="busqueda">No se encontraron vecinos</h3>
        <h3 v-else>No hay vecinos registrados</h3>
        <p v-if="busqueda">Intenta con otro criterio de búsqueda</p>
        <p v-else>¡Registra el primer vecino para comenzar!</p>
        <button
          v-if="!busqueda"
          @click="mostrarNuevoVecino = true"
          class="btn btn-primary"
        >
          <UserPlus :size="18" />
          <span>Registrar Primer Vecino</span>
        </button>
      </div>

      <!-- Vecinos Grid -->
      <div v-else class="vecinos-grid">
        <div
          v-for="vecino in vecinos"
          :key="vecino.dni"
          class="vecino-card card"
          @click="verFicha(vecino.dni)"
        >
          <!-- Card Header -->
          <div class="vecino-header">
            <div class="vecino-avatar">
              <UserCircle :size="40" :stroke-width="1.5" />
            </div>
            <div class="vecino-title">
              <h3 class="vecino-nombre">
                {{ vecino.nombre }} {{ vecino.apellidos }}
              </h3>
              <div class="vecino-badges">
                <div class="badge" :class="vecino.esSurco ? 'badge-success' : 'badge-secondary'">
                  <MapPin :size="12" />
                  <span>{{ vecino.esSurco ? 'Surco' : vecino.distrito }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Body -->
          <div class="vecino-info">
            <div class="info-row">
              <div class="info-item">
                <CreditCard :size="16" />
                <span class="label">DNI:</span>
                <span class="value">{{ vecino.dni }}</span>
              </div>
            </div>
            <div class="info-row" v-if="vecino.telefono">
              <div class="info-item">
                <Phone :size="16" />
                <span class="label">Teléfono:</span>
                <span class="value">{{ vecino.telefono }}</span>
              </div>
            </div>
            <div class="info-row" v-if="vecino.email">
              <div class="info-item">
                <Mail :size="16" />
                <span class="label">Email:</span>
                <span class="value truncate">{{ vecino.email }}</span>
              </div>
            </div>
          </div>

          <!-- Saldo Section -->
          <div class="vecino-saldo">
            <div class="saldo-header">
              <Clock :size="18" />
              <span class="saldo-label">Saldo de Horas</span>
            </div>
            <div class="saldo-valor" :class="getSaldoClass(vecino.saldo)">
              <div class="saldo-number">{{ vecino.saldo }}</div>
              <div class="saldo-unit">horas</div>
            </div>
            <div class="saldo-detalle">
              <div class="detalle-item">
                <ShoppingBag :size="14" />
                <span class="detalle-label">Compradas:</span>
                <span class="detalle-valor">{{ vecino.horasCompradas }}</span>
              </div>
              <div class="detalle-separator"></div>
              <div class="detalle-item">
                <TrendingDown :size="14" />
                <span class="detalle-label">Usadas:</span>
                <span class="detalle-valor">{{ vecino.horasConsumidas }}</span>
              </div>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="vecino-actions">
            <button
              @click.stop="editarVecino(vecino)"
              class="btn btn-outline btn-sm"
            >
              <Edit2 :size="16" />
              <span>Editar</span>
            </button>
            <button
              @click.stop="verFicha(vecino.dni)"
              class="btn btn-primary btn-sm"
            >
              <Eye :size="16" />
              <span>Ver Ficha</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal: Nuevo Vecino -->
    <VecinoForm
      v-if="mostrarNuevoVecino"
      @close="cerrarFormulario"
      @saved="vecinoGuardado"
    />

    <!-- Modal: Editar Vecino -->
    <VecinoForm
      v-if="vecinoEditar"
      :vecino="vecinoEditar"
      @close="cerrarFormulario"
      @saved="vecinoGuardado"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { vecinosService } from '../services/api'
import VecinoForm from '../components/vecino/VecinoForm.vue'
import {
  Users,
  User,
  LogOut,
  ArrowLeft,
  Search,
  UserPlus,
  Loader2,
  UserX,
  UserCircle,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Clock,
  ShoppingBag,
  TrendingDown,
  Edit2,
  Eye,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const vecinos = ref<any[]>([])
const loading = ref(false)
const busqueda = ref('')
const mostrarNuevoVecino = ref(false)
const vecinoEditar = ref<any>(null)

let timeoutId: number | null = null

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const verFicha = (dni: string) => {
  router.push(`/vecino/${dni}`)
}

const editarVecino = (vecino: any) => {
  vecinoEditar.value = vecino
}

const cerrarFormulario = () => {
  mostrarNuevoVecino.value = false
  vecinoEditar.value = null
}

const vecinoGuardado = () => {
  cerrarFormulario()
  cargarVecinos()
}

const getSaldoClass = (saldo: number) => {
  if (saldo <= 0) return 'saldo-cero'
  if (saldo <= 4) return 'saldo-bajo'
  return 'saldo-ok'
}

const buscarVecinos = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = window.setTimeout(() => {
    cargarVecinos()
  }, 300)
}

const cargarVecinos = async () => {
  loading.value = true
  try {
    const response = await vecinosService.buscar(busqueda.value.trim())
    vecinos.value = response.data
  } catch (error) {
    console.error('Error al cargar vecinos:', error)
    vecinos.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  cargarVecinos()
})
</script>

<style scoped>
.vecinos-page {
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

/* Content */
.content {
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  align-items: center;
}

.search-box {
  flex: 1;
  max-width: 600px;
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

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  gap: var(--spacing-md);
}

.empty-icon {
  color: var(--color-neutral-light);
  margin-bottom: var(--spacing-md);
}

.empty-state h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--color-neutral-dark);
  margin: 0;
}

.empty-state p {
  font-size: var(--text-base);
  color: var(--color-neutral);
  margin: 0;
  margin-bottom: var(--spacing-md);
}

/* Vecinos Grid */
.vecinos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: var(--spacing-lg);
}

/* Vecino Card */
.vecino-card {
  cursor: pointer;
  transition: all var(--transition-base);
  border: 2px solid var(--color-background);
}

.vecino-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary);
}

.vecino-header {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-bottom: 2px solid var(--color-background);
}

.vecino-avatar {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
  border-radius: var(--radius-full);
}

.vecino-title {
  flex: 1;
  min-width: 0;
}

.vecino-nombre {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0;
  margin-bottom: var(--spacing-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vecino-badges {
  display: flex;
  gap: var(--spacing-xs);
}

/* Vecino Info */
.vecino-info {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-row {
  display: flex;
  align-items: center;
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-neutral);
  flex: 1;
  min-width: 0;
}

.info-item .label {
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.info-item .value {
  color: var(--color-neutral);
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Vecino Saldo */
.vecino-saldo {
  background: var(--color-background-light);
  padding: var(--spacing-lg);
  margin: 0 var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.saldo-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.saldo-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.saldo-valor {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.saldo-number {
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 1;
}

.saldo-unit {
  font-size: var(--text-base);
  font-weight: 500;
  opacity: 0.7;
}

.saldo-valor.saldo-ok {
  color: var(--color-success);
}

.saldo-valor.saldo-bajo {
  color: var(--color-warning);
}

.saldo-valor.saldo-cero {
  color: var(--color-error);
}

.saldo-detalle {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-background);
}

.detalle-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-xs);
  color: var(--color-neutral);
}

.detalle-label {
  font-weight: 600;
}

.detalle-valor {
  font-weight: 700;
  color: var(--color-neutral-dark);
}

.detalle-separator {
  width: 1px;
  height: 16px;
  background: var(--color-background);
}

/* Vecino Actions */
.vecino-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 2px solid var(--color-background);
}

.vecino-actions .btn {
  flex: 1;
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

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .vecinos-grid {
    grid-template-columns: 1fr;
  }

  .vecino-nombre {
    font-size: var(--text-base);
  }
}

@media (max-width: 640px) {
  .facility-name {
    font-size: var(--text-lg);
  }

  .subtitle {
    font-size: var(--text-xs);
  }

  .vecino-header {
    padding: var(--spacing-md);
  }

  .vecino-info {
    padding: var(--spacing-md);
  }

  .vecino-saldo {
    margin: 0 var(--spacing-md);
    padding: var(--spacing-md);
  }

  .saldo-number {
    font-size: var(--text-3xl);
  }

  .vecino-actions {
    padding: var(--spacing-md);
    flex-direction: column;
  }
}
</style>
