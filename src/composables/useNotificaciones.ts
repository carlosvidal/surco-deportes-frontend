// src/composables/useNotificaciones.ts

import { ref } from 'vue'

export interface Notificacion {
  id: string
  tipo: 'critica' | 'advertencia' | 'info' | 'exito'
  titulo: string
  mensaje: string
  timestamp: Date
  leida: boolean
}

const notificaciones = ref<Notificacion[]>([])

export function useNotificaciones() {
  function agregarNotificacion(
    tipo: Notificacion['tipo'],
    titulo: string,
    mensaje: string
  ) {
    const notificacion: Notificacion = {
      id: `${Date.now()}-${Math.random()}`,
      tipo,
      titulo,
      mensaje,
      timestamp: new Date(),
      leida: false,
    }

    notificaciones.value.unshift(notificacion)

    // Auto-dismiss después de 10 segundos para notificaciones no críticas
    if (tipo !== 'critica') {
      setTimeout(() => {
        eliminarNotificacion(notificacion.id)
      }, 10000)
    }

    return notificacion
  }

  function eliminarNotificacion(id: string) {
    const index = notificaciones.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notificaciones.value.splice(index, 1)
    }
  }

  function marcarComoLeida(id: string) {
    const notificacion = notificaciones.value.find((n) => n.id === id)
    if (notificacion) {
      notificacion.leida = true
    }
  }

  function limpiarTodas() {
    notificaciones.value = []
  }

  function notificarAutoCheckout(vecinoNombre: string, carril?: number) {
    agregarNotificacion(
      'info',
      'Auto-checkout realizado',
      `${vecinoNombre}${carril ? ` - Carril ${carril}` : ''} - Tiempo límite excedido`
    )
  }

  function notificarTiempoRestante(vecinoNombre: string, minutos: number, carril?: number) {
    const tipo: Notificacion['tipo'] = minutos <= 5 ? 'critica' : 'advertencia'
    agregarNotificacion(
      tipo,
      `¡Tiempo por vencer!`,
      `${vecinoNombre}${carril ? ` - Carril ${carril}` : ''} - ${minutos} minuto${
        minutos !== 1 ? 's' : ''
      } restante${minutos !== 1 ? 's' : ''}`
    )
  }

  return {
    notificaciones,
    agregarNotificacion,
    eliminarNotificacion,
    marcarComoLeida,
    limpiarTodas,
    notificarAutoCheckout,
    notificarTiempoRestante,
  }
}
