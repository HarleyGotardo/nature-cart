ature-carts/src/views/Authenticated/Auth_Layout.vue
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import NatureCartLogo from '@/components/logo/NatureCartLogo.vue'
import Records from '@/components/SideBarItems/Records.vue'
import ForestProducts from '@/components/SideBarItems/ForestProducts.vue'
import Collectors from '@/components/SideBarItems/Collectors.vue'
import SystemUsers from '@/components/SideBarItems/SystemUsers.vue'
import SweetAlert from '@/components/SweetAlert.vue'

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

const handleLogout = () => {
  authStore.clearUser()
  router.push({ name: 'Index' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4">
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
        
        <Records
          :isDropdownOpen="isRecordsDropdownOpen"
          @toggleDropdown="toggleRecordsDropdown"
          label="Records"
        >
          <router-link to="/authenticated/records/record1" class="block p-2 hover:bg-gray-100 rounded-lg">Record 1</router-link>
          <router-link to="/authenticated/records/record2" class="block p-2 hover:bg-gray-100 rounded-lg">Record 2</router-link>
        </Records>

        <ForestProducts
          :isDropdownOpen="isForestProductsDropdownOpen"
          @toggleDropdown="toggleForestProductsDropdown"
          label="Forest Products"
        >
          <router-link to="/authenticated/forest-products/product1" class="block p-2 hover:bg-gray-100 rounded-lg">Product 1</router-link>
          <router-link to="/authenticated/forest-products/product2" class="block p-2 hover:bg-gray-100 rounded-lg">Product 2</router-link>
        </ForestProducts>

        <Collectors
          :isDropdownOpen="isCollectorsDropdownOpen"
          @toggleDropdown="toggleCollectorsDropdown"
          label="Collectors"
        >
          <router-link to="/authenticated/collectors/collector1" class="block p-2 hover:bg-gray-100 rounded-lg">Collector 1</router-link>
          <router-link to="/authenticated/collectors/collector2" class="block p-2 hover:bg-gray-100 rounded-lg">Collector 2</router-link>
        </Collectors>

        <SystemUsers
          :isDropdownOpen="isSystemUsersDropdownOpen"
          @toggleDropdown="toggleSystemUsersDropdown"
          label="System Users"
        >
          <router-link to="/authenticated/system-users/user1" class="block p-2 hover:bg-gray-100 rounded-lg">User 1</router-link>
          <router-link to="/authenticated/system-users/user2" class="block p-2 hover:bg-gray-100 rounded-lg">User 2</router-link>
        </SystemUsers>
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