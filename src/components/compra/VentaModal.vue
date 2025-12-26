<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content card" @click.stop>
      <div class="modal-header">
        <div class="modal-title">
          <ShoppingCart :size="28" :stroke-width="2.5" class="title-icon" />
          <h3>Vender Paquete de Horas</h3>
        </div>
        <button @click="$emit('close')" class="btn-cerrar">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <div class="vecino-card">
          <div class="vecino-card-header">
            <div class="vecino-avatar">
              <UserCircle :size="32" :stroke-width="2" />
            </div>
            <div class="vecino-info">
              <div class="vecino-nombre">{{ vecino.nombre }} {{ vecino.apellidos }}</div>
              <div class="vecino-detalles">
                <div class="detalle-item">
                  <CreditCard :size="14" />
                  <span>{{ vecino.dni }}</span>
                </div>
                <div class="detalle-item">
                  <MapPin :size="14" />
                  <span>{{ vecino.distrito }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="vecino.esSurco" class="vecino-badge">
            <Check :size="14" />
            <span>Vecino de Surco</span>
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="paquete" class="label">
              <Package :size="16" />
              <span>Paquete de Horas *</span>
            </label>
            <div class="select-wrapper">
              <select id="paquete" v-model="form.horas" class="input" required @change="calcularPrecio">
                <option value="">Seleccionar paquete...</option>
                <option :value="1">1 hora</option>
                <option :value="4">4 horas</option>
                <option :value="8">8 horas</option>
                <option :value="12">12 horas</option>
              </select>
              <ChevronDown :size="20" class="select-icon" />
            </div>
          </div>

          <div v-if="precioCalculado" class="precio-card">
            <div class="precio-header">
              <DollarSign :size="24" :stroke-width="2" class="precio-icon" />
              <div class="precio-info">
                <div class="precio-label">Total a Pagar</div>
                <div class="precio-valor">S/ {{ precioCalculado.toFixed(2) }}</div>
              </div>
            </div>
            <div class="precio-breakdown">
              <div class="breakdown-item">
                <Clock :size="16" />
                <span>{{ form.horas }} hora{{ Number(form.horas) !== 1 ? 's' : '' }}</span>
              </div>
              <div class="breakdown-item">
                <Tag :size="16" />
                <span>{{ vecino.esSurco ? 'Tarifa Surco' : 'Tarifa Externa' }}</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="metodoPago" class="label">
              <Wallet :size="16" />
              <span>Método de Pago *</span>
            </label>
            <div class="metodos-pago">
              <label
                v-for="metodo in metodosPago"
                :key="metodo.value"
                :class="['metodo-option', { active: form.metodoPago === metodo.value }]"
              >
                <input
                  type="radio"
                  :value="metodo.value"
                  v-model="form.metodoPago"
                  class="metodo-input"
                />
                <div class="metodo-content">
                  <component :is="metodo.icon" :size="24" :stroke-width="2" class="metodo-icon" />
                  <span class="metodo-label">{{ metodo.label }}</span>
                </div>
              </label>
            </div>
          </div>

          <div
            v-if="form.metodoPago && form.metodoPago !== 'EFECTIVO'"
            class="form-group"
          >
            <label for="referencia" class="label">
              <Hash :size="16" />
              <span>Número de Operación *</span>
            </label>
            <input
              id="referencia"
              v-model="form.referencia"
              type="text"
              class="input"
              placeholder="Ej: 123456789"
              required
            />
          </div>

          <div v-if="error" class="error-message">
            <AlertCircle :size="20" />
            <span>{{ error }}</span>
          </div>

          <div class="modal-actions">
            <button type="button" @click="$emit('close')" class="btn btn-secondary">
              <X :size="18" />
              <span>Cancelar</span>
            </button>
            <button type="submit" :disabled="loading || !precioCalculado" class="btn btn-primary">
              <Loader2 v-if="loading" :size="18" class="spinner" />
              <Check v-else :size="18" />
              <span>{{ loading ? 'Procesando...' : 'Registrar Venta' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { comprasService } from '../../services/api'
import {
  ShoppingCart,
  X,
  UserCircle,
  CreditCard,
  MapPin,
  Check,
  Package,
  ChevronDown,
  DollarSign,
  Clock,
  Tag,
  Wallet,
  Banknote,
  Smartphone,
  Building2,
  Hash,
  AlertCircle,
  Loader2,
} from 'lucide-vue-next'

interface Props {
  vecino: any
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'venta-registrada'])

const form = ref({
  horas: '',
  metodoPago: '',
  referencia: '',
})

const loading = ref(false)
const error = ref('')

// Métodos de pago con sus iconos
const metodosPago = [
  { value: 'EFECTIVO', label: 'Efectivo', icon: Banknote },
  { value: 'YAPE', label: 'Yape', icon: Smartphone },
  { value: 'PLIN', label: 'Plin', icon: CreditCard },
  { value: 'TRANSFERENCIA', label: 'Transferencia', icon: Building2 },
]

// Precios según PRD
const PRECIOS = {
  SURCO: {
    1: 10,
    4: 36,
    8: 68,
    12: 96,
  },
  OTRO: {
    1: 15,
    4: 54,
    8: 102,
    12: 144,
  },
}

const precioCalculado = computed(() => {
  if (!form.value.horas) return null

  const horas = Number(form.value.horas)
  const tabla = props.vecino.esSurco ? PRECIOS.SURCO : PRECIOS.OTRO
  return tabla[horas as keyof typeof tabla] || null
})

const calcularPrecio = () => {
  // Trigger computed property update
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = {
      vecinoDni: props.vecino.dni,
      horas: Number(form.value.horas),
      metodoPago: form.value.metodoPago,
      referencia: form.value.referencia || undefined,
    }

    await comprasService.registrarVenta(data)
    emit('venta-registrada')
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Error al registrar la venta'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  animation: fadeIn var(--transition-base);
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
  width: 90%;
  max-width: 560px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp var(--transition-slow);
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 2px solid var(--color-background);
  background: linear-gradient(to bottom, #f0f9ff, #ffffff);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.title-icon {
  color: var(--color-primary);
}

.modal-title h3 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin: 0;
}

.btn-cerrar {
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

.btn-cerrar:hover {
  background: var(--color-background);
  color: var(--color-neutral-dark);
}

.modal-body {
  padding: var(--spacing-xl);
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

/* Vecino Card */
.vecino-card {
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  border: 2px solid #bae6fd;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.vecino-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
}

.vecino-avatar {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  flex-shrink: 0;
}

.vecino-info {
  flex: 1;
  min-width: 0;
}

.vecino-nombre {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-neutral-dark);
  margin-bottom: var(--spacing-xs);
}

.vecino-detalles {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.detalle-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-neutral);
}

.vecino-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: var(--color-secondary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
}

/* Form Groups */
.form-group {
  margin-bottom: var(--spacing-lg);
}

.label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.select-wrapper {
  position: relative;
}

.select-icon {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-neutral);
  pointer-events: none;
}

.input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-base);
  line-height: 1.5;
  color: var(--color-neutral-dark);
  background-color: white;
  border: 2px solid #E0E0E0;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(18, 96, 165, 0.1);
}

select.input {
  appearance: none;
  cursor: pointer;
  padding-right: var(--spacing-xl);
}

/* Precio Card */
.precio-card {
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border: 2px solid var(--color-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  animation: slideUp var(--transition-base);
}

.precio-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid rgba(26, 205, 172, 0.2);
}

.precio-icon {
  width: 48px;
  height: 48px;
  background: var(--color-secondary);
  color: white;
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  flex-shrink: 0;
}

.precio-info {
  flex: 1;
}

.precio-label {
  font-size: var(--text-sm);
  color: var(--color-neutral);
  margin-bottom: var(--spacing-xs);
}

.precio-valor {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-secondary-dark);
  line-height: 1;
}

.precio-breakdown {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-neutral-dark);
  font-weight: 500;
}

/* Métodos de Pago */
.metodos-pago {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.metodo-option {
  position: relative;
  cursor: pointer;
}

.metodo-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.metodo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-md);
  border: 2px solid #E0E0E0;
  border-radius: var(--radius-lg);
  background: white;
  transition: all var(--transition-base);
}

.metodo-option:hover .metodo-content {
  border-color: var(--color-primary-light);
  background: rgba(18, 96, 165, 0.05);
}

.metodo-option.active .metodo-content {
  border-color: var(--color-primary);
  background: rgba(18, 96, 165, 0.1);
  box-shadow: 0 0 0 3px rgba(18, 96, 165, 0.1);
}

.metodo-icon {
  color: var(--color-neutral);
  transition: color var(--transition-base);
}

.metodo-option.active .metodo-icon {
  color: var(--color-primary);
}

.metodo-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-dark);
  text-align: center;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(239, 83, 80, 0.1);
  color: var(--color-error);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 2px solid var(--color-error);
  margin-bottom: var(--spacing-lg);
  font-size: var(--text-sm);
  font-weight: 500;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 2px solid var(--color-background);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--text-base);
  font-weight: 600;
  line-height: 1.5;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-primary:hover:not(:disabled) {
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

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-background);
  border-color: var(--color-neutral);
}

.spinner {
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

/* Mobile Responsive */
@media (max-width: 640px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header {
    padding: var(--spacing-md) var(--spacing-lg);
  }

  .modal-title h3 {
    font-size: var(--text-lg);
  }

  .modal-body {
    padding: var(--spacing-lg);
  }

  .vecino-card {
    padding: var(--spacing-md);
  }

  .vecino-card-header {
    flex-direction: column;
    text-align: center;
  }

  .vecino-avatar {
    width: 56px;
    height: 56px;
  }

  .vecino-nombre {
    font-size: var(--text-base);
  }

  .vecino-detalles {
    justify-content: center;
  }

  .precio-valor {
    font-size: var(--text-2xl);
  }

  .metodos-pago {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .precio-header {
    flex-direction: column;
    text-align: center;
  }

  .precio-breakdown {
    justify-content: center;
  }
}
</style>
