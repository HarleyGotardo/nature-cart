import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  actions: {
    setUser(user) {
      this.user = user
      localStorage.setItem('auth', JSON.stringify(user)) // Store user in localStorage
    },
    clearUser() {
      this.user = null
      localStorage.removeItem('auth') // Remove user from localStorage
    },
    getUser() {
      if (!this.user) {
        const auth = localStorage.getItem('auth')
        if (auth) {
          this.user = JSON.parse(auth)
        }
      }
      return this.user
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  persist: true
})