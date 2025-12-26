<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content card" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-title">
          <UserPlus v-if="!vecino" :size="28" class="title-icon" />
          <Edit2 v-else :size="28" class="title-icon" />
          <h3>{{ vecino ? 'Editar Vecino' : 'Registrar Nuevo Vecino' }}</h3>
        </div>
        <button @click="$emit('close')" class="btn-close">
          <X :size="20" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-grid">
          <!-- DNI -->
          <div class="form-group">
            <label for="dni" class="label">
              <CreditCard :size="16" />
              <span>DNI *</span>
            </label>
            <input
              id="dni"
              v-model="form.dni"
              type="text"
              class="input"
              placeholder="12345678"
              maxlength="8"
              pattern="[0-9]{8}"
              :disabled="!!vecino"
              required
            />
            <span v-if="vecino" class="input-help">El DNI no puede ser modificado</span>
          </div>

          <!-- Nombre -->
          <div class="form-group">
            <label for="nombre" class="label">
              <User :size="16" />
              <span>Nombre *</span>
            </label>
            <input
              id="nombre"
              v-model="form.nombre"
              type="text"
              class="input"
              placeholder="Juan"
              required
            />
          </div>

          <!-- Apellidos -->
          <div class="form-group">
            <label for="apellidos" class="label">
              <User :size="16" />
              <span>Apellidos *</span>
            </label>
            <input
              id="apellidos"
              v-model="form.apellidos"
              type="text"
              class="input"
              placeholder="Pérez García"
              required
            />
          </div>

          <!-- Distrito -->
          <div class="form-group">
            <label for="distrito" class="label">
              <MapPin :size="16" />
              <span>Distrito *</span>
            </label>
            <div class="select-wrapper">
              <select id="distrito" v-model="form.distrito" class="input" required>
                <option value="">Seleccionar distrito...</option>
                <option value="Santiago de Surco">Santiago de Surco</option>
                <option value="Miraflores">Miraflores</option>
                <option value="San Isidro">San Isidro</option>
                <option value="San Borja">San Borja</option>
                <option value="La Molina">La Molina</option>
                <option value="Surquillo">Surquillo</option>
                <option value="Barranco">Barranco</option>
                <option value="Chorrillos">Chorrillos</option>
                <option value="Otro">Otro</option>
              </select>
              <ChevronDown :size="20" class="select-icon" />
            </div>
            <span v-if="form.distrito === 'Santiago de Surco'" class="input-help input-help-success">
              <Check :size="14" />
              Este vecino califica para tarifa de Surco
            </span>
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label for="telefono" class="label">
              <Phone :size="16" />
              <span>Teléfono</span>
            </label>
            <input
              id="telefono"
              v-model="form.telefono"
              type="tel"
              class="input"
              placeholder="987654321"
              pattern="[0-9]{9}"
              maxlength="9"
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="label">
              <Mail :size="16" />
              <span>Email</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="input"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <!-- Contacto de Emergencia -->
          <div class="form-group">
            <label for="contactoEmergencia" class="label">
              <AlertCircle :size="16" />
              <span>Contacto de Emergencia</span>
            </label>
            <input
              id="contactoEmergencia"
              v-model="form.contactoEmergencia"
              type="text"
              class="input"
              placeholder="María Pérez (madre)"
            />
          </div>

          <!-- Teléfono de Emergencia -->
          <div class="form-group">
            <label for="telefonoEmergencia" class="label">
              <PhoneCall :size="16" />
              <span>Teléfono de Emergencia</span>
            </label>
            <input
              id="telefonoEmergencia"
              v-model="form.telefonoEmergencia"
              type="tel"
              class="input"
              placeholder="912345678"
              pattern="[0-9]{9}"
              maxlength="9"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-alert">
          <AlertTriangle :size="20" />
          <span>{{ error }}</span>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" @click="$emit('close')" class="btn btn-ghost">
            <X :size="18" />
            <span>Cancelar</span>
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <Loader2 v-if="loading" :size="18" class="spinner" />
            <Save v-else :size="18" />
            <span>{{ loading ? 'Guardando...' : 'Guardar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { vecinosService } from '../../services/api'
import {
  UserPlus,
  Edit2,
  X,
  CreditCard,
  User,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  PhoneCall,
  AlertTriangle,
  Loader2,
  Save,
  Check,
  ChevronDown,
} from 'lucide-vue-next'

interface Props {
  vecino?: any
  dniInicial?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'saved'])

const form = ref({
  dni: props.dniInicial || '',
  nombre: '',
  apellidos: '',
  distrito: '',
  telefono: '',
  email: '',
  contactoEmergencia: '',
  telefonoEmergencia: '',
})

const loading = ref(false)
const error = ref('')

onMounted(() => {
  if (props.vecino) {
    form.value = {
      dni: props.vecino.dni,
      nombre: props.vecino.nombre,
      apellidos: props.vecino.apellidos,
      distrito: props.vecino.distrito,
      telefono: props.vecino.telefono || '',
      email: props.vecino.email || '',
      contactoEmergencia: props.vecino.contactoEmergencia || '',
      telefonoEmergencia: props.vecino.telefonoEmergencia || '',
    }
  }
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const esSurco = form.value.distrito === 'Santiago de Surco'

    const data = {
      ...form.value,
      esSurco,
    }

    if (props.vecino) {
      await vecinosService.actualizar(props.vecino.dni, data)
    } else {
      await vecinosService.crear(data)
    }

    emit('saved')
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Error al guardar vecino'
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
  max-width: 800px;
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

/* Modal Header */
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

.title-icon {
  color: var(--color-primary);
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

/* Modal Body */
.modal-body {
  padding: var(--spacing-xl);
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-dark);
}

.input::placeholder {
  color: var(--color-neutral-light);
}

.input:disabled {
  background: var(--color-background);
  cursor: not-allowed;
  opacity: 0.6;
}

.input-help {
  font-size: var(--text-xs);
  color: var(--color-neutral);
  margin-top: var(--spacing-xs);
}

.input-help-success {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-success);
  font-weight: 600;
}

/* Select Wrapper */
.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-wrapper select {
  appearance: none;
  padding-right: calc(var(--spacing-md) * 2 + 20px);
}

.select-icon {
  position: absolute;
  right: var(--spacing-md);
  color: var(--color-neutral);
  pointer-events: none;
}

/* Error Alert */
.error-alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(239, 83, 80, 0.1);
  border: 2px solid var(--color-error);
  color: var(--color-error);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  font-size: var(--text-sm);
  font-weight: 600;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-8px);
  }
  75% {
    transform: translateX(8px);
  }
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  border-top: 2px solid var(--color-background);
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
@media (max-width: 768px) {
  .modal-content {
    max-height: 95vh;
  }

  .modal-header {
    padding: var(--spacing-lg);
  }

  .modal-title h3 {
    font-size: var(--text-xl);
  }

  .modal-body {
    padding: var(--spacing-lg);
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .modal-footer {
    padding: var(--spacing-lg);
    flex-direction: column-reverse;
  }

  .modal-footer .btn {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .modal-title {
    gap: var(--spacing-sm);
  }

  .title-icon {
    width: 24px;
    height: 24px;
  }

  .modal-title h3 {
    font-size: var(--text-lg);
  }
}
</style>
