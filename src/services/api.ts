// src/services/api.ts

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('staff')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ==================== AUTH ====================
export const authService = {
  login: (usuario: string, password: string) =>
    api.post('/auth/login', { usuario, password }),
  verify: () => api.get('/auth/verify'),
}

// ==================== VECINOS ====================
export const vecinosService = {
  buscarPorDni: (dni: string) => api.get(`/vecinos/${dni}`),
  crear: (data: any) => api.post('/vecinos', data),
  actualizar: (dni: string, data: any) => api.put(`/vecinos/${dni}`, data),
  historial: (dni: string) => api.get(`/vecinos/${dni}/historial`),
  buscar: (query: string) => api.get(`/vecinos/buscar?q=${query}`),
  familia: (dni: string) => api.get(`/vecinos/${dni}/familia`),
}

// ==================== CONSUMOS ====================
export const consumosService = {
  checkin: (data: {
    vecinoDni: string
    instalacion: string
    carril?: number
  }) => api.post('/consumos/checkin', data),
  checkout: (id: number) => api.put(`/consumos/${id}/checkout`),
  anular: (id: number, motivo: string) =>
    api.post(`/consumos/${id}/anular`, { motivo }),
  activos: () => api.get('/consumos/activos'),
  alertas: () => api.get('/consumos/alertas'),
  activosPorInstalacion: (instalacion: string) =>
    api.get(`/consumos/activos/${instalacion}`),
  cerrarVencidos: () => api.post('/consumos/cerrar-vencidos'),
}

// ==================== COMPRAS ====================
export const comprasService = {
  registrarVenta: (data: {
    vecinoDni: string
    horas: number
    metodoPago: string
    referencia?: string
  }) => api.post('/compras', data),
  obtenerPorId: (id: number) => api.get(`/compras/${id}`),
  anular: (id: number, motivo: string) =>
    api.post(`/compras/${id}/anular`, { motivo }),
}

// ==================== CAJA ====================
export const cajaService = {
  abrir: (data: { fecha?: string; saldoInicial: number }) =>
    api.post('/caja/abrir', data),
  cerrar: (data: {
    fecha?: string
    saldoDeclarado: number
    observaciones?: string
  }) => api.post('/caja/cerrar', data),
  actual: () => api.get('/caja/actual'),
  resumen: (fecha?: string) =>
    api.get('/caja/resumen', { params: { fecha } }),
}

// ==================== MÉTRICAS ====================
export const metricasService = {
  getDashboard: (dias?: number) =>
    api.get('/metricas/dashboard', { params: { dias } }),
  getMetricasHoy: () => api.get('/metricas/hoy'),
  getMetricasMes: () => api.get('/metricas/mes'),
  getVecinosFrecuentes: (limite?: number, dias?: number) =>
    api.get('/metricas/vecinos-frecuentes', { params: { limite, dias } }),
}
