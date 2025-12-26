// src/stores/alertas.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { consumosService } from '../services/api'

export interface ConsumoConAlerta {
  id: number
  vecinoDni: string
  vecino: {
    nombre: string
    apellidos: string
  }
  instalacion: string
  carril: number | null
  entradaAt: string
  tiempoTranscurrido: number
  tiempoRestante: number
}

export interface Alertas {
  criticos: ConsumoConAlerta[]
  advertencias: ConsumoConAlerta[]
  vencidos: ConsumoConAlerta[]
  total: number
}

export const useAlertasStore = defineStore('alertas', () => {
  const alertas = ref<Alertas>({
    criticos: [],
    advertencias: [],
    vencidos: [],
    total: 0,
  })

  const loading = ref(false)
  const error = ref('')

  const totalCriticas = computed(() => alertas.value.criticos.length)
  const totalAdvertencias = computed(() => alertas.value.advertencias.length)
  const totalVencidos = computed(() => alertas.value.vencidos.length)
  const totalAlertas = computed(() => alertas.value.total)

  const hayAlertas = computed(() => totalAlertas.value > 0)
  const hayAlertasCriticas = computed(() => totalCriticas.value > 0 || totalVencidos.value > 0)

  async function cargarAlertas() {
    loading.value = true
    error.value = ''

    try {
      const response = await consumosService.alertas()
      alertas.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar alertas'
      console.error('Error cargando alertas:', err)
    } finally {
      loading.value = false
    }
  }

  function limpiarAlertas() {
    alertas.value = {
      criticos: [],
      advertencias: [],
      vencidos: [],
      total: 0,
    }
  }

  return {
    // State
    alertas,
    loading,
    error,

    // Computed
    totalCriticas,
    totalAdvertencias,
    totalVencidos,
    totalAlertas,
    hayAlertas,
    hayAlertasCriticas,

    // Actions
    cargarAlertas,
    limpiarAlertas,
  }
})
