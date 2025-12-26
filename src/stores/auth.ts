// src/stores/auth.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const staff = ref<any>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)

  const loadFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    const storedStaff = localStorage.getItem('staff')

    if (storedToken && storedStaff) {
      token.value = storedToken
      staff.value = JSON.parse(storedStaff)
      isAuthenticated.value = true
    }
  }

  const login = async (usuario: string, password: string) => {
    const response = await authService.login(usuario, password)
    token.value = response.data.token
    staff.value = response.data.staff
    isAuthenticated.value = true

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('staff', JSON.stringify(response.data.staff))

    return response.data
  }

  const logout = () => {
    token.value = null
    staff.value = null
    isAuthenticated.value = false

    localStorage.removeItem('token')
    localStorage.removeItem('staff')
  }

  return {
    staff,
    token,
    isAuthenticated,
    loadFromStorage,
    login,
    logout,
  }
})
