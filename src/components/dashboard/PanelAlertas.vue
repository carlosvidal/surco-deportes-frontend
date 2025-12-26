<template>
  <div v-if="alertasStore.hayAlertas" class="panel-alertas">
    <div class="panel-header">
      <div class="panel-title">
        <AlertTriangle :size="24" :stroke-width="2.5" class="icono" />
        <div>
          <h3>Alertas Activas</h3>
          <p class="alertas-count">{{ alertasStore.totalAlertas }} alerta{{ alertasStore.totalAlertas !== 1 ? 's' : '' }}</p>
        </div>
      </div>
      <button @click="$emit('cerrar')" class="btn-cerrar">
        <X :size="20" />
      </button>
    </div>

    <div class="panel-body">
      <!-- Vencidos -->
      <div v-if="alertasStore.totalVencidos > 0" class="seccion">
        <div class="seccion-titulo vencido">
          <div class="titulo-content">
            <AlertCircle :size="18" :stroke-width="2.5" />
            <span>TIEMPO EXCEDIDO</span>
          </div>
          <span class="badge badge-error">{{ alertasStore.totalVencidos }}</span>
        </div>

        <div v-for="alerta in alertasStore.alertas.vencidos" :key="alerta.id" class="alerta-item vencido">
          <div class="alerta-info">
            <div class="alerta-vecino">
              <UserCircle :size="18" class="vecino-icon" />
              <span class="vecino-nombre">
                {{ alerta.vecino.nombre }} {{ alerta.vecino.apellidos }}
              </span>
            </div>
            <div class="alerta-ubicacion">
              <MapPin :size="16" />
              <span>{{ formatearInstalacion(alerta.instalacion) }}</span>
              <span v-if="alerta.carril" class="carril-badge">
                <Hash :size="12" />
                {{ alerta.carril }}
              </span>
            </div>
            <div class="alerta-tiempo">
              <Clock :size="16" />
              <span>Excedido por {{ Math.abs(alerta.tiempoRestante) }} min</span>
            </div>
          </div>
          <div class="alerta-acciones">
            <button @click="hacerCheckout(alerta.id)" class="btn btn-error btn-sm">
              <LogOut :size="16" />
              <span>Salida</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Críticos -->
      <div v-if="alertasStore.totalCriticas > 0" class="seccion">
        <div class="seccion-titulo critico">
          <div class="titulo-content">
            <AlertOctagon :size="18" :stroke-width="2.5" />
            <span>CRÍTICO</span>
          </div>
          <span class="badge badge-error">{{ alertasStore.totalCriticas }}</span>
        </div>

        <div v-for="alerta in alertasStore.alertas.criticos" :key="alerta.id" class="alerta-item critico">
          <div class="alerta-info">
            <div class="alerta-vecino">
              <UserCircle :size="18" class="vecino-icon" />
              <span class="vecino-nombre">
                {{ alerta.vecino.nombre }} {{ alerta.vecino.apellidos }}
              </span>
            </div>
            <div class="alerta-ubicacion">
              <MapPin :size="16" />
              <span>{{ formatearInstalacion(alerta.instalacion) }}</span>
              <span v-if="alerta.carril" class="carril-badge">
                <Hash :size="12" />
                {{ alerta.carril }}
              </span>
            </div>
            <div class="alerta-tiempo">
              <Clock :size="16" />
              <span>{{ alerta.tiempoRestante }} min restante{{ alerta.tiempoRestante !== 1 ? 's' : '' }}</span>
            </div>
          </div>
          <div class="alerta-acciones">
            <button @click="hacerCheckout(alerta.id)" class="btn btn-error btn-sm">
              <LogOut :size="16" />
              <span>Salida</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Advertencias -->
      <div v-if="alertasStore.totalAdvertencias > 0" class="seccion">
        <div class="seccion-titulo advertencia">
          <div class="titulo-content">
            <Info :size="18" :stroke-width="2.5" />
            <span>ADVERTENCIA</span>
          </div>
          <span class="badge badge-warning">{{ alertasStore.totalAdvertencias }}</span>
        </div>

        <div v-for="alerta in alertasStore.alertas.advertencias" :key="alerta.id" class="alerta-item advertencia">
          <div class="alerta-info">
            <div class="alerta-vecino">
              <UserCircle :size="18" class="vecino-icon" />
              <span class="vecino-nombre">
                {{ alerta.vecino.nombre }} {{ alerta.vecino.apellidos }}
              </span>
            </div>
            <div class="alerta-ubicacion">
              <MapPin :size="16" />
              <span>{{ formatearInstalacion(alerta.instalacion) }}</span>
              <span v-if="alerta.carril" class="carril-badge">
                <Hash :size="12" />
                {{ alerta.carril }}
              </span>
            </div>
            <div class="alerta-tiempo">
              <Clock :size="16" />
              <span>{{ alerta.tiempoRestante }} min restante{{ alerta.tiempoRestante !== 1 ? 's' : '' }}</span>
            </div>
          </div>
          <div class="alerta-acciones">
            <button @click="hacerCheckout(alerta.id)" class="btn btn-secondary btn-sm">
              <LogOut :size="16" />
              <span>Salida</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlertasStore } from '../../stores/alertas'
import { consumosService } from '../../services/api'
import { useDashboardStore } from '../../stores/dashboard'
import {
  AlertTriangle,
  X,
  AlertCircle,
  AlertOctagon,
  Info,
  UserCircle,
  MapPin,
  Hash,
  Clock,
  LogOut,
} from 'lucide-vue-next'

const alertasStore = useAlertasStore()
const dashboardStore = useDashboardStore()

const emit = defineEmits(['cerrar'])

const formatearInstalacion = (instalacion: string) => {
  const instalaciones: Record<string, string> = {
    PISCINA_ADULTOS: 'Piscina Adultos',
    PISCINA_NINOS: 'Piscina Niños',
    PADDLE: 'Paddle',
    GIMNASIO: 'Gimnasio',
  }
  return instalaciones[instalacion] || instalacion
}

const hacerCheckout = async (consumoId: number) => {
  try {
    await consumosService.checkout(consumoId)
    await dashboardStore.cargarConsumosActivos()
    await alertasStore.cargarAlertas()
  } catch (error: any) {
    alert(error.response?.data?.error || 'Error al realizar checkout')
  }
}
</script>

<style scoped>
.panel-alertas {
  position: fixed;
  top: 80px;
  right: var(--spacing-lg);
  width: 460px;
  max-width: calc(100vw - var(--spacing-xl));
  max-height: calc(100vh - 100px);
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  z-index: var(--z-popover);
  animation: slideInRight 0.3s ease-out;
  border: 2px solid var(--color-background);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 2px solid var(--color-background);
  background: linear-gradient(to bottom, #fef3c7, #fefce8);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.panel-title h3 {
  font-size: var(--text-xl);
  font-weight: 700;
  color: #78350f;
  margin: 0;
  line-height: 1;
}

.alertas-count {
  font-size: var(--text-sm);
  color: #92400e;
  margin: 0;
  margin-top: var(--spacing-xs);
}

.icono {
  color: #d97706;
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.btn-cerrar {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
  color: #78350f;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-cerrar:hover {
  background: rgba(120, 53, 15, 0.1);
}

.panel-body {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.seccion {
  margin-bottom: var(--spacing-lg);
}

.seccion:last-child {
  margin-bottom: 0;
}

.seccion-titulo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-sm);
  font-weight: 700;
  font-size: var(--text-sm);
  letter-spacing: 0.05em;
}

.titulo-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.seccion-titulo.vencido {
  background: rgba(239, 83, 80, 0.1);
  color: #991b1b;
  border: 2px solid var(--color-error);
}

.seccion-titulo.critico {
  background: rgba(239, 83, 80, 0.1);
  color: #991b1b;
  border: 2px solid var(--color-error);
}

.seccion-titulo.advertencia {
  background: rgba(255, 167, 38, 0.1);
  color: #78350f;
  border: 2px solid var(--color-warning);
}

.alerta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-sm);
  border: 2px solid;
  transition: all var(--transition-base);
}

.alerta-item:hover {
  transform: translateX(-2px);
  box-shadow: var(--shadow-md);
}

.alerta-item.vencido {
  background: rgba(239, 83, 80, 0.05);
  border-color: var(--color-error);
  animation: shake-alerta 2s ease-in-out infinite;
}

@keyframes shake-alerta {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

.alerta-item.critico {
  background: rgba(239, 83, 80, 0.05);
  border-color: var(--color-error);
}

.alerta-item.advertencia {
  background: rgba(255, 167, 38, 0.05);
  border-color: var(--color-warning);
}

.alerta-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
}

.alerta-vecino {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.vecino-icon {
  flex-shrink: 0;
  color: var(--color-neutral);
}

.vecino-nombre {
  font-weight: 700;
  color: var(--color-neutral-dark);
  font-size: var(--text-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alerta-ubicacion {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  color: var(--color-neutral);
}

.carril-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--color-neutral-dark);
  color: white;
  padding: 2px var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 700;
}

.alerta-tiempo {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-sm);
  font-weight: 700;
}

.alerta-item.vencido .alerta-tiempo {
  color: var(--color-error);
}

.alerta-item.critico .alerta-tiempo {
  color: var(--color-error);
}

.alerta-item.advertencia .alerta-tiempo {
  color: var(--color-warning);
}

.alerta-acciones {
  flex-shrink: 0;
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

/* Scrollbar styling */
.panel-body::-webkit-scrollbar {
  width: 8px;
}

.panel-body::-webkit-scrollbar-track {
  background: var(--color-background-light);
  border-radius: var(--radius-sm);
}

.panel-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: var(--radius-sm);
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .panel-alertas {
    top: 60px;
    right: var(--spacing-md);
    left: var(--spacing-md);
    width: auto;
    max-width: none;
  }

  .panel-header {
    padding: var(--spacing-md);
  }

  .panel-title h3 {
    font-size: var(--text-lg);
  }

  .panel-body {
    padding: var(--spacing-md);
  }

  .alerta-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .alerta-acciones {
    width: 100%;
  }

  .alerta-acciones .btn {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .vecino-nombre {
    font-size: var(--text-xs);
  }

  .alerta-ubicacion,
  .alerta-tiempo {
    font-size: var(--text-xs);
  }
}
</style>
