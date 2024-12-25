<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()
const isRecordsDropdownOpen = ref(false)
const isForestProductsDropdownOpen = ref(false)
const isCollectorsDropdownOpen = ref(false)
const isSystemUsersDropdownOpen = ref(false)

const toggleRecordsDropdown = () => {
  isRecordsDropdownOpen.value = !isRecordsDropdownOpen.value
}

const toggleForestProductsDropdown = () => {
  isForestProductsDropdownOpen.value = !isForestProductsDropdownOpen.value
}

const toggleCollectorsDropdown = () => {
  isCollectorsDropdownOpen.value = !isCollectorsDropdownOpen.value
}

const toggleSystemUsersDropdown = () => {
  isSystemUsersDropdownOpen.value = !isSystemUsersDropdownOpen.value
}

const confirmLogout = () => {
  Swal.fire({
    title: 'Confirm Logout',
    text: "Are you sure you want to log out?",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Log Out'
  }).then((result) => {
    if (result.isConfirmed) {
      authStore.clearUser()
      Swal.fire(
        'Logged Out!',
        'You have been logged out.',
        'success'
      ).then(() => {
        router.push({ name: 'Index' })
      })
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4">
      <div class="flex items-center gap-2 mb-8">
        <div class="w-8 h-8 bg-emerald-400 rounded-lg"></div>
        <h1 class="text-xl font-bold">Nature Cart</h1>
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <router-link to="/authenticated/dashboard" class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Dashboard</span>
        </router-link>
        
        <div>
          <button @click="toggleRecordsDropdown" class="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Records</span>
            <svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="isRecordsDropdownOpen" class="ml-6 space-y-2">
            <router-link to="/authenticated/records/record1" class="block p-2 hover:bg-gray-100 rounded-lg">Record 1</router-link>
            <router-link to="/authenticated/records/record2" class="block p-2 hover:bg-gray-100 rounded-lg">Record 2</router-link>
            <!-- Add other record links here -->
          </div>
        </div>

        <div>
          <button @click="toggleForestProductsDropdown" class="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Forest Products</span>
            <svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="isForestProductsDropdownOpen" class="ml-6 space-y-2">
            <router-link to="/authenticated/forest-products/product1" class="block p-2 hover:bg-gray-100 rounded-lg">Product 1</router-link>
            <router-link to="/authenticated/forest-products/product2" class="block p-2 hover:bg-gray-100 rounded-lg">Product 2</router-link>
            <!-- Add other product links here -->
          </div>
        </div>

        <div>
          <button @click="toggleCollectorsDropdown" class="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Registered Collectors</span>
            <svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="isCollectorsDropdownOpen" class="ml-6 space-y-2">
            <router-link to="/authenticated/collectors/collector1" class="block p-2 hover:bg-gray-100 rounded-lg">Collector 1</router-link>
            <router-link to="/authenticated/collectors/collector2" class="block p-2 hover:bg-gray-100 rounded-lg">Collector 2</router-link>
            <!-- Add other collector links here -->
          </div>
        </div>

        <div>
          <button @click="toggleSystemUsersDropdown" class="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>System Users</span>
            <svg class="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="isSystemUsersDropdownOpen" class="ml-6 space-y-2">
            <router-link to="/authenticated/system-users/user1" class="block p-2 hover:bg-gray-100 rounded-lg">User 1</router-link>
            <router-link to="/authenticated/system-users/user2" class="block p-2 hover:bg-gray-100 rounded-lg">User 2</router-link>
            <!-- Add other user links here -->
          </div>
        </div>

        <!-- Add other navigation items -->
      </nav>

      <!-- User Profile -->
      <div class="absolute bottom-8 left-4 right-4">
        <div class="flex items-center gap-3 p-3 border-t">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-medium">Juan Dela Cruz</p>
            <p class="text-sm text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          @click="confirmLogout"
          class="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Log Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="ml-64 p-8 w-full">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-emerald-50;
}
</style>