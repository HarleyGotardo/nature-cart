<template>
  <div class="max-w-3xl mx-auto p-6">
    <!-- Profile Card -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Header with background -->
      <div class="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

      <!-- Error Alert -->
      <div v-if="error" 
           class="mx-6 -mt-4 p-4 bg-red-50 border border-red-100 rounded-lg">
        <div class="flex items-center text-red-700">
          <svg class="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          {{ error }}
        </div>
      </div>

      <div v-if="user" class="px-6 pb-6">
        <!-- Profile Image Section -->
        <div class="flex flex-col items-center -mt-16">
          <div class="relative">
            <img
              src="@/assets/profile.png"
              alt="Profile Image"
              class="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div class="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md">
              <div class="p-1.5 bg-green-100 rounded-full">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <!-- Name and Role -->
          <h1 class="mt-4 text-2xl font-bold text-gray-900">
            {{ user.first_name }} {{ user.last_name }}
          </h1>
          <div class="mt-1 px-3 py-1 bg-blue-50 rounded-full">
            <span class="text-sm font-medium text-blue-700">{{ user.role.name }}</span>
          </div>
        </div>

        <!-- Contact and Details -->
        <div class="mt-8">
          <div class="grid grid-cols-1 gap-4">
            <!-- Email -->
            <div class="flex items-center p-4 bg-gray-50 rounded-lg">
              <div class="p-2 bg-white rounded-md shadow-sm">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-500">Email Address</p>
                <p class="text-gray-900">{{ user.email }}</p>
              </div>
            </div>

            <!-- Dates Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Created Date -->
              <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <div class="p-2 bg-white rounded-md shadow-sm">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Member Since</p>
                  <p class="text-gray-900">{{ new Date(user.created_at).toLocaleDateString() }}</p>
                </div>
              </div>

              <!-- Updated Date -->
              <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <div class="p-2 bg-white rounded-md shadow-sm">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Last Updated</p>
                  <p class="text-gray-900">{{ new Date(user.updated_at).toLocaleDateString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.from-blue-500 {
  --tw-gradient-from: #3B82F6;
  --tw-gradient-to: #2563EB;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
</style>
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useAuthStore } from '@/stores/authStore'
  import { supabase } from '@/lib/supabaseClient'
  
  const user = ref(null)
  const error = ref(null)
  const authStore = useAuthStore()
  
  const fetchUserProfile = async () => {
    const authUser = authStore.getUser()
    if (authUser && authUser.id) {
      let { data, error: fetchError } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          email,
          created_at,
          updated_at,
          role:roles (
            id,
            name
          )
        `)
        .eq('id', authUser.id)
        .single()
  
      if (fetchError) {
        error.value = fetchError.message
      } else {
        user.value = data
      }
    } else {
      error.value = 'User not authenticated'
    }
  }
  
  onMounted(() => {
    fetchUserProfile()
  })
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>