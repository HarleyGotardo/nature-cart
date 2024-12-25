<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import NatureCartLogo from '@/components/logo/NatureCartLogo.vue'
import bcrypt from 'bcryptjs'
import Swal from 'sweetalert2'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const usersTable = ref([])

// Fetch users from Supabase
const fetchUsers = async () => {
  let { data: users, error } = await supabase
    .from('users')
    .select('*')

  if (error) {
    console.error('Error fetching users:', error)
  } else {
    usersTable.value = users
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push({ name: 'Dashboard' })
  } else {
    fetchUsers()
  }
})

const handleSubmit = async () => {
  const user = usersTable.value.find(user => user.email === email.value)

  if (user && await bcrypt.compare(password.value, user.password)) {
    authStore.setUser(user)
    Swal.fire({
      icon: 'success',
      title: 'Login Successful',
      text: 'You have successfully logged in!',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      router.push({ name: 'Dashboard' })
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Invalid email or password',
      timer: 2000,
      showConfirmButton: false
    })
  }
}
</script>

<style scoped>
.mask-silhouette {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

.text-justify {
  text-align: justify;
}
</style>

<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- Left Section - Login Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-12">
      <div class="max-w-md w-full mx-auto">
        <div class="flex items-center mb-8">
          <div class="w-8 h-8">
            <NatureCartLogo width="64" height="64" />
          </div>
          <h1 class="text-2xl md:text-4xl font-bold ml-2">Login to Nature Cart</h1>
        </div>

        <div class="mb-8">
          <p class="text-lg md:text-2xl text-gray-600">Please enter your login information.</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="space-y-6">
            <div>
              <label
                for="email"
                class="block text-sm md:text-md font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                v-model="email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label
                for="password"
                class="block text-sm md:text-md font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                v-model="password"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Log In
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            No account?
            <a href="#" class="text-green-600 hover:text-green-500">
              Request for account registration
            </a>
          </p>
        </div>
      </div>
    </div>

    <!-- Right Section - Branding -->
    <div class="w-full md:w-1/2 bg-green-50 flex flex-col justify-center items-center px-4 md:px-0">
      <div class="text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          VSU - Department of Forest Science
        </h2>
        <div class="flex flex-col md:flex-row gap-8 justify-center">
          <!-- VSU Logo -->
          <div class="w-32 h-32 md:w-40 md:h-40 bg-yellow-400 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="@/assets/vsu_logo.png" alt="VSU Logo" class="w-full h-full object-contain" />
          </div>
          <!-- Leaf Logo -->
          <div class="w-32 h-32 md:w-40 md:h-40 bg-white-400 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="@/assets/DFS_logo.png" alt="VSU Logo" class="w-full h-full object-contain" />
          </div>
        </div>
        <!-- Feature Cards -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-4 md:px-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-2">
              <div class="w-12 h-12 rounded-full mr-2">            
                <img src="@/assets/verify.png" alt="VSU Logo" class="w-full h-full object-contain" />
              </div>
              <h3 class="text-lg md:text-xl font-bold">Track Forest Product Collection Records</h3>
            </div>
            <p class="text-gray-600 text-justify">Log and monitor forest product collection with precision. Keep detailed records of quantities, types, and collection dates to streamline management and enhance reporting.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-2">
              <div class="w-12 h-12 rounded-full mr-2">            
                <img src="@/assets/location.png" alt="VSU Logo" class="w-full h-full object-contain" />
              </div>
              <h3 class="text-lg md:text-xl font-bold">Locate the Locations of Forest Products</h3>
            </div>
            <p class="text-gray-600 text-justify">Pinpoint and map exact locations of forest product sources. Facilitate easy tracking, conduct spatial analysis, and optimize resource planning across forested areas.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-2">
              <div class="w-12 h-12 rounded-full mr-2">            
                <img src="@/assets/registered.png" alt="VSU Logo" class="w-full h-full object-contain" />
              </div>
              <h3 class="text-lg md:text-xl font-bold">Register Forest Product Collectors</h3>
            </div>
            <p class="text-gray-600 text-justify">Maintain a comprehensive database of authorized forest product collectors. Ensure accurate registration with complete personal and professional details.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>