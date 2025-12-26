<!-- src/views/Caja.vue -->

<template>
  <div class="caja-page">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <button @click="router.push('/')" class="btn-back">
          <ArrowLeft :size="20" />
        </button>
        <div class="logo-header">
          <Wallet :size="32" :stroke-width="2.5" class="logo-icon" />
          <div class="header-titles">
            <h1 class="facility-name">Caja del Día</h1>
            <p class="subtitle">Gestión de ingresos y cierre diario</p>
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

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <Loader2 :size="48" class="spinner" />
      <p>Cargando información de caja...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-alert">
      <AlertCircle :size="24" />
      <div>
        <h3>Error al cargar la caja</h3>
        <p>{{ error }}</p>
      </div>
      <button @click="cargarCaja" class="btn btn-sm btn-primary">
        <RefreshCw :size="16" />
        <span>Reintentar</span>
      </button>
    </div>

    <!-- Caja no abierta -->
    <div v-else-if="!cajaAbierta && !mostrarFormAbrir" class="content">
      <div class="empty-state card">
        <LockKeyhole :size="64" class="empty-icon" />
        <h2>La caja no está abierta</h2>
        <p>Antes de comenzar las operaciones del día, debes abrir la caja con el saldo inicial.</p>
        <button @click="mostrarFormAbrir = true" class="btn btn-primary btn-lg">
          <Unlock :size="20" />
          <span>Abrir Caja del Día</span>
        </button>
      </div>
    </div>

    <!-- Caja abierta - Mostrar resumen -->
    <main v-else-if="cajaAbierta && resumen" class="content">
      <!-- Scorecards -->
      <div class="scorecards">
        <div class="scorecard scorecard-neutral">
          <div class="scorecard-icon">
            <Banknote :size="28" />
          </div>
          <div class="scorecard-content">
            <div class="scorecard-label">Saldo Inicial</div>
            <div class="scorecard-value">S/ {{ formatearMonto(resumen.saldoInicial) }}</div>
          </div>
        </div>

        <div class="scorecard scorecard-success">
          <div class="scorecard-icon">
            <TrendingUp :size="28" />
          </div>
          <div class="scorecard-content">
            <div class="scorecard-label">Total Ventas</div>
            <div class="scorecard-value">S/ {{ formatearMonto(resumen.totalVentas) }}</div>
          </div>
        </div>

        <div class="scorecard scorecard-warning">
          <div class="scorecard-icon">
            <DollarSign :size="28" />
          </div>
          <div class="scorecard-content">
            <div class="scorecard-label">Efectivo Esperado</div>
            <div class="scorecard-value">S/ {{ formatearMonto(resumen.efectivoEsperado) }}</div>
          </div>
        </div>

        <div class="scorecard scorecard-primary">
          <div class="scorecard-icon">
            <Receipt :size="28" />
          </div>
          <div class="scorecard-content">
            <div class="scorecard-label">Transacciones</div>
            <div class="scorecard-value">{{ resumen.transacciones.length }}</div>
          </div>
        </div>
      </div>

      <!-- Desglose por método de pago -->
      <div class="metodos-card card">
        <div class="card-header-section">
          <div class="card-title">
            <CreditCard :size="24" class="title-icon" />
            <h2>Desglose por Método de Pago</h2>
          </div>
        </div>

        <div class="metodos-grid">
          <div class="metodo-item">
            <div class="metodo-icon metodo-efectivo">
              <Banknote :size="24" />
            </div>
            <div class="metodo-content">
              <div class="metodo-label">Efectivo</div>
              <div class="metodo-monto">S/ {{ formatearMonto(resumen.ventasEfectivo) }}</div>
            </div>
          </div>

          <div class="metodo-item">
            <div class="metodo-icon metodo-yape">
              <Smartphone :size="24" />
            </div>
            <div class="metodo-content">
              <div class="metodo-label">Yape</div>
              <div class="metodo-monto">S/ {{ formatearMonto(resumen.ventasYape) }}</div>
            </div>
          </div>

          <div class="metodo-item">
            <div class="metodo-icon metodo-plin">
              <CreditCard :size="24" />
            </div>
            <div class="metodo-content">
              <div class="metodo-label">Plin</div>
              <div class="metodo-monto">S/ {{ formatearMonto(resumen.ventasPlin) }}</div>
            </div>
          </div>

          <div class="metodo-item">
            <div class="metodo-icon metodo-transferencia">
              <Building2 :size="24" />
            </div>
            <div class="metodo-content">
              <div class="metodo-label">Transferencia</div>
              <div class="metodo-monto">S/ {{ formatearMonto(resumen.ventasTransferencia) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de transacciones -->
      <div class="transacciones-card card">
        <div class="card-header-section">
          <div class="card-title">
            <Receipt :size="24" class="title-icon" />
            <h2>Transacciones del Día</h2>
          </div>
          <span class="badge badge-primary">{{ resumen.transacciones.length }} transacciones</span>
        </div>

        <div v-if="resumen.transacciones.length === 0" class="empty-transactions">
          <FileText :size="48" class="empty-icon" />
          <p>No hay transacciones registradas</p>
        </div>

        <div v-else class="table-container">
          <table class="tabla-transacciones">
            <thead>
              <tr>
                <th>
                  <Clock :size="16" />
                  <span>Hora</span>
                </th>
                <th>
                  <User :size="16" />
                  <span>Vecino</span>
                </th>
                <th>
                  <Package :size="16" />
                  <span>Paquete</span>
                </th>
                <th>
                  <DollarSign :size="16" />
                  <span>Monto</span>
                </th>
                <th>
                  <CreditCard :size="16" />
                  <span>Método</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tx, index) in resumen.transacciones" :key="index">
                <td class="td-hora">{{ tx.hora }}</td>
                <td class="td-vecino">{{ tx.vecino }}</td>
                <td class="td-paquete">
                  <span class="paquete-badge">
                    <Clock :size="14" />
                    {{ tx.horas }} {{ tx.horas === 1 ? 'hora' : 'horas' }}
                  </span>
                </td>
                <td class="td-monto">S/ {{ formatearMonto(tx.monto) }}</td>
                <td class="td-metodo">
                  <span :class="['badge-metodo', `badge-${tx.metodoPago.toLowerCase()}`]">
                    {{ formatearMetodoPago(tx.metodoPago) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Botón para cerrar caja -->
      <div class="acciones">
        <button @click="mostrarFormCerrar = true" class="btn btn-error btn-lg">
          <Lock :size="20" />
          <span>Cerrar Caja del Día</span>
        </button>
      </div>
    </main>

    <!-- Modal: Abrir Caja -->
    <div v-if="mostrarFormAbrir" class="modal-overlay" @click="cancelarApertura">
      <div class="modal-content card" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <Unlock :size="28" class="title-icon text-success" />
            <h3>Abrir Caja</h3>
          </div>
          <button @click="cancelarApertura" class="btn-close">
            <X :size="20" />
          </button>
        </div>

        <form @submit.prevent="abrirCaja" class="modal-body">
          <p class="modal-description">
            Ingresa el saldo inicial en efectivo con el que comienzas el día.
          </p>

          <div class="form-group">
            <label for="saldoInicial" class="label">
              <Banknote :size="16" />
              <span>Saldo Inicial (S/) *</span>
            </label>
            <input
              id="saldoInicial"
              v-model.number="formAbrir.saldoInicial"
              type="number"
              class="input"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
              autofocus
            />
            <span class="input-help">Ejemplo: 50.00</span>
          </div>

          <div class="modal-footer">
            <button type="button" @click="cancelarApertura" class="btn btn-ghost">
              <X :size="18" />
              <span>Cancelar</span>
            </button>
            <button type="submit" :disabled="procesando" class="btn btn-primary">
              <Loader2 v-if="procesando" :size="18" class="spinner" />
              <Check v-else :size="18" />
              <span>{{ procesando ? 'Abriendo...' : 'Abrir Caja' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Cerrar Caja -->
    <div v-if="mostrarFormCerrar" class="modal-overlay" @click="mostrarFormCerrar = false">
      <div class="modal-content card" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <Lock :size="28" class="title-icon text-error" />
            <h3>Cerrar Caja</h3>
          </div>
          <button @click="mostrarFormCerrar = false" class="btn-close">
            <X :size="20" />
          </button>
        </div>

        <form @submit.prevent="cerrarCaja" class="modal-body">
          <!-- Resumen -->
          <div class="resumen-cierre">
            <div class="resumen-item">
              <div class="resumen-label">
                <Calculator :size="18" />
                <span>Efectivo Esperado</span>
              </div>
              <div class="resumen-value">S/ {{ formatearMonto(resumen?.efectivoEsperado || 0) }}</div>
            </div>
          </div>

          <!-- Saldo Declarado -->
          <div class="form-group">
            <label for="saldoDeclarado" class="label">
              <Banknote :size="16" />
              <span>Saldo Declarado (Efectivo Contado) (S/) *</span>
            </label>
            <input
              id="saldoDeclarado"
              v-model.number="formCerrar.saldoDeclarado"
              type="number"
              class="input"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
              autofocus
            />
            <span class="input-help">Cuenta el efectivo físico y registra el monto exacto</span>
          </div>

          <!-- Diferencia Preview -->
          <div v-if="formCerrar.saldoDeclarado !== null" class="diferencia-preview" :class="{
            'diferencia-positiva': diferencia > 0,
            'diferencia-negativa': diferencia < 0,
            'diferencia-cero': diferencia === 0,
          }">
            <div class="diferencia-icon">
              <TrendingUp v-if="diferencia > 0" :size="24" />
              <TrendingDown v-else-if="diferencia < 0" :size="24" />
              <Equal v-else :size="24" />
            </div>
            <div class="diferencia-content">
              <div class="diferencia-label">Diferencia</div>
              <div class="diferencia-value">S/ {{ formatearMonto(Math.abs(diferencia)) }}</div>
              <div class="diferencia-status">
                <span v-if="diferencia > 0">(Sobrante)</span>
                <span v-else-if="diferencia < 0">(Faltante)</span>
                <span v-else>(Sin diferencias)</span>
              </div>
            </div>
          </div>

          <!-- Observaciones -->
          <div class="form-group">
            <label for="observaciones" class="label">
              <FileText :size="16" />
              <span>Observaciones</span>
            </label>
            <textarea
              id="observaciones"
              v-model="formCerrar.observaciones"
              class="input"
              rows="3"
              placeholder="Ej: Faltante por vuelto incorrecto, sobrante no identificado..."
            ></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" @click="mostrarFormCerrar = false" class="btn btn-ghost">
              <X :size="18" />
              <span>Cancelar</span>
            </button>
            <button type="submit" :disabled="procesando" class="btn btn-error">
              <Loader2 v-if="procesando" :size="18" class="spinner" />
              <Lock v-else :size="18" />
              <span>{{ procesando ? 'Cerrando...' : 'Cerrar Caja' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { cajaService } from '../services/api'
import {
  Wallet,
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  LockKeyhole,
  Unlock,
  Banknote,
  TrendingUp,
  DollarSign,
  Receipt,
  CreditCard,
  Smartphone,
  Building2,
  FileText,
  Clock,
  User,
  Package,
  Lock,
  LogOut,
  X,
  Check,
  Calculator,
  TrendingDown,
  Equal,
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')
const procesando = ref(false)

const cajaAbierta = ref<any>(null)
const resumen = ref<any>(null)

const mostrarFormAbrir = ref(false)
const mostrarFormCerrar = ref(false)

const formAbrir = ref({
  saldoInicial: 0,
})

const formCerrar = ref({
  saldoDeclarado: null as number | null,
  observaciones: '',
})

const diferencia = computed(() => {
  if (!resumen.value || formCerrar.value.saldoDeclarado === null) return 0
  return formCerrar.value.saldoDeclarado - resumen.value.efectivoEsperado
})

const formatearMonto = (monto: number) => {
  return monto.toFixed(2)
}

const formatearMetodoPago = (metodo: string) => {
  const metodos: Record<string, string> = {
    EFECTIVO: 'Efectivo',
    YAPE: 'Yape',
    PLIN: 'Plin',
    TRANSFERENCIA: 'Transferencia',
  }
  return metodos[metodo] || metodo
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const cargarCaja = async () => {
  loading.value = true
  error.value = ''

  try {
    const responseActual = await cajaService.actual()
    cajaAbierta.value = responseActual.data

    if (cajaAbierta.value) {
      const responseResumen = await cajaService.resumen()
      resumen.value = responseResumen.data
    }
  } catch (err: any) {
    if (err.response?.status === 404) {
      cajaAbierta.value = null
      resumen.value = null
    } else {
      error.value = err.response?.data?.error || 'Error al cargar la caja'
      console.error('Error cargando caja:', err)
    }
  } finally {
    loading.value = false
  }
}

const abrirCaja = async () => {
  procesando.value = true
  error.value = ''

  try {
    await cajaService.abrir({
      saldoInicial: formAbrir.value.saldoInicial,
    })

    mostrarFormAbrir.value = false
    formAbrir.value.saldoInicial = 0

    await cargarCaja()
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Error al abrir la caja'
    console.error('Error abriendo caja:', err)
  } finally {
    procesando.value = false
  }
}

const cancelarApertura = () => {
  mostrarFormAbrir.value = false
  formAbrir.value.saldoInicial = 0
}

const cerrarCaja = async () => {
  if (formCerrar.value.saldoDeclarado === null) {
    error.value = 'Debes ingresar el saldo declarado'
    return
  }

  procesando.value = true
  error.value = ''

  try {
    await cajaService.cerrar({
      saldoDeclarado: formCerrar.value.saldoDeclarado,
      observaciones: formCerrar.value.observaciones || undefined,
    })

    mostrarFormCerrar.value = false
    formCerrar.value.saldoDeclarado = null
    formCerrar.value.observaciones = ''

    await cargarCaja()

    alert('Caja cerrada exitosamente')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Error al cerrar la caja'
    console.error('Error cerrando caja:', err)
  } finally {
    procesando.value = false
  }
}

onMounted(() => {
  cargarCaja()
})
</script>

<style scoped>
.caja-page {
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

/* Error Alert */
.error-alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: rgba(239, 83, 80, 0.1);
  border: 2px solid var(--color-error);
  color: var(--color-error);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin: var(--spacing-xl);
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
}

.error-alert h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  margin: 0;
  margin-bottom: var(--spacing-xs);
}

.error-alert p {
  margin: 0;
  font-size: var(--text-sm);
}

/* Content */
.content {
  padding: var(--spacing-xl);
  max-width: 1600px;
  margin: 0 auto;
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
  min-height: 500px;
}

.empty-icon {
  color: var(--color-neutral-light);
  margin-bottom: var(--spacing-md);
}

.empty-state h2 {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0;
}

.empty-state p {
  font-size: var(--text-base);
  color: var(--color-neutral);
  margin: 0;
  margin-bottom: var(--spacing-lg);
  max-width: 500px;
}

/* Scorecards */
.scorecards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.scorecard {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all var(--transition-base);
  border: 2px solid var(--color-background);
}

.scorecard:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.scorecard-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.scorecard-neutral .scorecard-icon {
  background: rgba(102, 102, 102, 0.1);
  color: var(--color-neutral);
}

.scorecard-success .scorecard-icon {
  background: rgba(26, 205, 172, 0.1);
  color: var(--color-success);
}

.scorecard-warning .scorecard-icon {
  background: rgba(255, 167, 38, 0.1);
  color: var(--color-warning);
}

.scorecard-primary .scorecard-icon {
  background: rgba(18, 96, 165, 0.1);
  color: var(--color-primary);
}

.scorecard-content {
  flex: 1;
  min-width: 0;
}

.scorecard-label {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.scorecard-value {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  line-height: 1;
}

/* Card Header Section */
.card-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--color-background);
  margin-bottom: var(--spacing-lg);
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

/* Métodos Card */
.metodos-card {
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.metodos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.metodo-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-background-light);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.metodo-item:hover {
  background: var(--color-background);
  transform: translateX(4px);
}

.metodo-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.metodo-efectivo {
  background: rgba(26, 205, 172, 0.1);
  color: var(--color-success);
}

.metodo-yape {
  background: rgba(18, 96, 165, 0.1);
  color: var(--color-info);
}

.metodo-plin {
  background: rgba(239, 83, 80, 0.1);
  color: var(--color-error);
}

.metodo-transferencia {
  background: rgba(102, 102, 102, 0.1);
  color: var(--color-neutral);
}

.metodo-content {
  flex: 1;
}

.metodo-label {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.metodo-monto {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
}

/* Transacciones Card */
.transacciones-card {
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.empty-transactions {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
}

.empty-transactions .empty-icon {
  color: var(--color-neutral-light);
  margin-bottom: var(--spacing-md);
}

.empty-transactions p {
  font-size: var(--text-base);
  color: var(--color-neutral);
}

.table-container {
  overflow-x: auto;
}

.tabla-transacciones {
  width: 100%;
  border-collapse: collapse;
}

.tabla-transacciones thead {
  background: var(--color-background-light);
  border-radius: var(--radius-md);
}

.tabla-transacciones th {
  padding: var(--spacing-md);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-neutral);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--color-background);
}

.tabla-transacciones th {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.tabla-transacciones td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-background);
  color: var(--color-neutral-dark);
  font-size: var(--text-sm);
}

.tabla-transacciones tbody tr {
  transition: background var(--transition-base);
}

.tabla-transacciones tbody tr:hover {
  background: var(--color-background-light);
}

.td-hora {
  font-weight: 500;
  color: var(--color-neutral);
}

.td-vecino {
  font-weight: 600;
}

.paquete-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(18, 96, 165, 0.1);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: var(--text-xs);
}

.td-monto {
  font-weight: 700;
  font-family: var(--font-mono);
}

.badge-metodo {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-efectivo {
  background: rgba(26, 205, 172, 0.1);
  color: var(--color-success);
}

.badge-yape {
  background: rgba(18, 96, 165, 0.1);
  color: var(--color-info);
}

.badge-plin {
  background: rgba(239, 83, 80, 0.1);
  color: var(--color-error);
}

.badge-transferencia {
  background: rgba(102, 102, 102, 0.1);
  color: var(--color-neutral-dark);
}

/* Acciones */
.acciones {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-2xl);
  font-size: var(--text-lg);
}

.btn-error {
  background: var(--color-error);
  color: white;
  border-color: var(--color-error);
}

.btn-error:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
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
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xl);
  border-bottom: 2px solid var(--color-background);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.text-success {
  color: var(--color-success);
}

.text-error {
  color: var(--color-error);
}

.modal-title h3 {
  font-size: var(--text-2xl);
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: var(--color-background);
  color: var(--color-neutral-dark);
}

.modal-body {
  padding: var(--spacing-xl);
  overflow-y: auto;
}

.modal-description {
  font-size: var(--text-base);
  color: var(--color-neutral);
  margin-bottom: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-dark);
  margin-bottom: var(--spacing-xs);
}

.input-help {
  font-size: var(--text-xs);
  color: var(--color-neutral);
  margin-top: var(--spacing-xs);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-top: 2px solid var(--color-background);
}

/* Resumen Cierre */
.resumen-cierre {
  background: var(--color-background-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.resumen-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.resumen-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.resumen-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  font-family: var(--font-mono);
}

/* Diferencia Preview */
.diferencia-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  border: 2px solid;
}

.diferencia-positiva {
  background: rgba(26, 205, 172, 0.1);
  border-color: var(--color-success);
  color: var(--color-success);
}

.diferencia-negativa {
  background: rgba(239, 83, 80, 0.1);
  border-color: var(--color-error);
  color: var(--color-error);
}

.diferencia-cero {
  background: rgba(102, 102, 102, 0.1);
  border-color: var(--color-neutral);
  color: var(--color-neutral-dark);
}

.diferencia-icon {
  flex-shrink: 0;
}

.diferencia-content {
  flex: 1;
}

.diferencia-label {
  font-size: var(--text-sm);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.diferencia-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  font-family: var(--font-mono);
  margin-bottom: var(--spacing-xs);
}

.diferencia-status {
  font-size: var(--text-sm);
  font-weight: 600;
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

  .scorecards {
    grid-template-columns: 1fr;
  }

  .metodos-grid {
    grid-template-columns: 1fr;
  }

  .table-container {
    overflow-x: scroll;
  }

  .tabla-transacciones {
    min-width: 600px;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .modal-footer .btn {
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

  .scorecard-value {
    font-size: var(--text-2xl);
  }
}
</style>
