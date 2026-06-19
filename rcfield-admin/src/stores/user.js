import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || '')
  const isAdmin = computed(() => userRole.value === 'admin')
  const isSafetyOfficer = computed(() => userRole.value === 'safety_officer')
  const isMember = computed(() => userRole.value === 'member')

  async function login(username, password) {
    const res = await api.post('/auth/login', { username, password })
    token.value = res.data.access_token
    user.value = res.data.user
    localStorage.setItem('token', res.data.access_token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  async function fetchProfile() {
    const res = await api.get('/auth/profile')
    user.value = res.data
    localStorage.setItem('user', JSON.stringify(res.data))
  }

  return { token, user, isLoggedIn, userRole, isAdmin, isSafetyOfficer, isMember, login, logout, fetchProfile }
})
