// src/stores/dashboard.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { consumosService } from '../services/api'

export interface ConsumoActivo {
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

export const useDashboardStore = defineStore('dashboard', () => {
  const consumosActivos = ref<ConsumoActivo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const cargarConsumosActivos = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await consumosService.activos()
      consumosActivos.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar consumos'
      console.error('Error cargando consumos:', err)
    } finally {
      loading.value = false
    }
  }

  const obtenerConsumosPorInstalacion = (instalacion: string) => {
    return consumosActivos.value.filter((c) => c.instalacion === instalacion)
  }

  const obtenerCarrilesOcupados = (instalacion: string) => {
    return consumosActivos.value
      .filter((c) => c.instalacion === instalacion && c.carril !== null)
      .map((c) => c.carril)
  }

  const getEstadoCarril = (consumo: ConsumoActivo) => {
    if (consumo.tiempoRestante > 15) return 'verde'
    if (consumo.tiempoRestante > 5) return 'amarillo'
    return 'rojo'
  }

  return {
    consumosActivos,
    loading,
    error,
    cargarConsumosActivos,
    obtenerConsumosPorInstalacion,
    obtenerCarrilesOcupados,
    getEstadoCarril,
  }
})
