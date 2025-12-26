<template>
  <div class="login-container">
    <div class="login-background">
      <!-- Decorative shapes -->
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="login-content">
      <!-- Header with logo placeholder -->
      <div class="login-header">
        <div class="logo-container">
          <Shield :size="48" :stroke-width="2" class="logo-icon" />
        </div>
        <h1 class="system-title">Sistema Deportivo Municipal</h1>
        <h2 class="facility-name">Charilla del Estanque</h2>
        <p class="subtitle">Municipalidad de Santiago de Surco</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="usuario" class="label">Usuario</label>
          <div class="input-wrapper">
            <User :size="20" class="input-icon" />
            <input
              id="usuario"
              v-model="usuario"
              type="text"
              class="input input-with-icon"
              placeholder="Ingrese su usuario"
              autocomplete="username"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="label">Contraseña</label>
          <div class="input-wrapper">
            <Lock :size="20" class="input-icon" />
            <input
              id="password"
              v-model="password"
              type="password"
              class="input input-with-icon"
              placeholder="Ingrese su contraseña"
              autocomplete="current-password"
              required
            />
          </div>
        </div>

        <div v-if="error" class="error-alert">
          <AlertCircle :size="20" />
          <span>{{ error }}</span>
        </div>

        <button type="submit" :disabled="loading" class="btn btn-primary btn-login">
          <LogIn v-if="!loading" :size="20" />
          <Loader2 v-else :size="20" class="spinner" />
          <span>{{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
        </button>
      </form>

      <!-- Footer -->
      <div class="login-footer">
        <div class="footer-info">
          <Building2 :size="16" />
          <span>Centro Deportivo Municipal - Surco</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Shield, User, Lock, LogIn, AlertCircle, Loader2, Building2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const usuario = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(usuario.value, password.value)
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--spacing-md);
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: var(--radius-full);
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: var(--color-secondary);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: white;
  bottom: -150px;
  right: -150px;
  animation-delay: 5s;
}

.shape-3 {
  width: 200px;
  height: 200px;
  background: var(--color-secondary);
  top: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.login-content {
  position: relative;
  z-index: 1;
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  animation: slideUp 0.5s ease-out;
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

.login-header {
  background: linear-gradient(to bottom, var(--color-primary), var(--color-primary-dark));
  padding: var(--spacing-2xl) var(--spacing-xl);
  text-align: center;
  color: white;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  margin-bottom: var(--spacing-lg);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.logo-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.system-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  letter-spacing: -0.02em;
}

.facility-name {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-secondary);
}

.subtitle {
  font-size: var(--text-sm);
  opacity: 0.9;
  font-weight: 400;
}

.login-form {
  padding: var(--spacing-2xl) var(--spacing-xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--spacing-md);
  color: var(--color-neutral);
  pointer-events: none;
  z-index: 1;
}

.input-with-icon {
  padding-left: calc(var(--spacing-md) * 2 + 20px);
}

.btn-login {
  width: 100%;
  margin-top: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--text-base);
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

.login-footer {
  background: var(--color-background-light);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-top: 1px solid var(--color-background);
}

.footer-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--color-neutral);
  font-size: var(--text-sm);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .login-container {
    padding: var(--spacing-sm);
  }

  .login-header {
    padding: var(--spacing-xl) var(--spacing-lg);
  }

  .logo-container {
    width: 64px;
    height: 64px;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
  }

  .system-title {
    font-size: var(--text-xl);
  }

  .facility-name {
    font-size: var(--text-lg);
  }

  .subtitle {
    font-size: var(--text-xs);
  }

  .login-form {
    padding: var(--spacing-xl) var(--spacing-lg);
  }

  .shape-1,
  .shape-2,
  .shape-3 {
    display: none;
  }
}

/* Landscape mobile */
@media (max-height: 600px) and (orientation: landscape) {
  .login-container {
    align-items: flex-start;
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .login-header {
    padding: var(--spacing-lg);
  }

  .logo-container {
    width: 56px;
    height: 56px;
    margin-bottom: var(--spacing-sm);
  }

  .system-title {
    font-size: var(--text-lg);
    margin-bottom: var(--spacing-xs);
  }

  .facility-name {
    font-size: var(--text-base);
    margin-bottom: 0;
  }

  .subtitle {
    font-size: var(--text-xs);
  }

  .login-form {
    padding: var(--spacing-lg);
  }

  .form-group {
    margin-bottom: var(--spacing-md);
  }
}
</style>
