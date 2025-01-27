<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import NatureCartLogo from '@/components/logo/NatureCartLogo.vue'
import Records from '@/components/SideBarItems/Records.vue'
import ForestProducts from '@/components/SideBarItems/ForestProducts.vue'
import SweetAlert from '@/components/SweetAlert.vue'

const router = useRouter()
const authStore = useAuthStore()
const isRecordsDropdownOpen = ref(false)
const isForestProductsDropdownOpen = ref(false)
const isCollectorsDropdownOpen = ref(false)
const isSystemUsersDropdownOpen = ref(false)
const isSidebarOpen = ref(false) // New state for sidebar visibility

const user = computed(() => authStore.getUser())

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

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

const handleLogout = async () => {
  authStore.clearUser()
  router.push({ name: 'Index' })
}

const goToProfile = () => {
  router.push({ name: 'Profile' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 relative">
    <!-- Burger Menu Button -->
    <button 
      @click="toggleSidebar"
      :class="`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg transition-opacity duration-300 ${
        isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`"
    >
      <svg 
        class="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          v-if="!isSidebarOpen" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 transition-transform duration-300 ease-in-out z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`"
    >
      <div class="flex items-center gap-2 mb-8">
        <div class="w-8 h-8 rounded-lg">
          <NatureCartLogo />
        </div>
        <h1 class="text-xl font-bold">Nature Cart</h1>
      </div>

      <!-- Navigation -->
      <nav class="space-y-2">
        <router-link to="/authenticated/dashboard" class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <img src="@/assets/dashboard.png" alt="Dashboard" class="w-6 h-6" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/authenticated/map" class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <img src="@/assets/forest-map.png" alt="Dashboard" class="w-6 h-6" />
          <span>Forest Products Map</span>
        </router-link>

        <router-link to="/authenticated/system-users" class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
          <img src="@/assets/user.png" alt="icon" class="w-6 h-6" />
          <span>System Users</span>
        </router-link>
        
        <Records
          :isDropdownOpen="isRecordsDropdownOpen"
          @toggleDropdown="toggleRecordsDropdown"
          label="Collection Records"
        >
          <router-link to="/authenticated/collection-records" class="block p-2 hover:bg-gray-100 rounded-lg">All Records</router-link>
          <router-link to="/authenticated/collection-records/create" class="block p-2 hover:bg-gray-100 rounded-lg">Create</router-link>
          <router-link to="/authenticated/collection-records/trash" class="block p-2 hover:bg-gray-100 rounded-lg">Recycle Bin</router-link>
        </Records>

        <ForestProducts
          :isDropdownOpen="isForestProductsDropdownOpen"
          @toggleDropdown="toggleForestProductsDropdown"
          label="Forest Products"
        >
          <router-link to="/authenticated/forest-products" class="block p-2 hover:bg-gray-100 rounded-lg">All Records</router-link>
          <router-link to="/authenticated/forest-products/create" class="block p-2 hover:bg-gray-100 rounded-lg">Create</router-link>
        </ForestProducts>
      </nav>

      <!-- User Profile -->
      <div class="absolute bottom-8 left-4 right-4">
        <div @click="goToProfile" class="flex items-center gap-3 p-3 border-t cursor-pointer hover:bg-gray-100 rounded-lg">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-medium">{{ user ? `${user.first_name} ${user.last_name}` : 'User' }}</p>
            <p class="text-sm text-gray-500">Role ID: {{ user ? user.role_id : 'Role' }}</p>
          </div>
        </div>
        <SweetAlert
          title="Confirm Logout"
          text="Are you sure you want to log out?"
          icon="warning"
          confirmButtonText="Log Out"
          @confirmed="handleLogout"
        >
          Log Out
        </SweetAlert>
      </div>
    </aside>

    <!-- Main Content -->
    <main 
      :class="`transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-64'
      } p-4 md:p-8`"
    >
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.router-link-active {
  @apply bg-emerald-50;
}

/* Add smooth transition for sidebar */
aside {
  transition: transform 0.3s ease-in-out;
}

/* Prevent scrolling when sidebar is open on mobile */
.overflow-hidden {
  overflow: hidden;
}
</style>