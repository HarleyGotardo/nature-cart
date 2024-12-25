import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  actions: {
    setUser(user) {
      this.user = user
    },
    clearUser() {
      this.user = null
    },
    getUser() {
      return this.user
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  persist: true
})