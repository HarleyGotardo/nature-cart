<template>
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Profile Details</h2>
      <div v-if="error" class="text-red-500 mb-4 text-center">{{ error }}</div>
      <div v-if="user" class="flex flex-col items-center">
        <img
          src="@/assets/profile.png"
          alt="Profile Image"
          class="w-32 h-32 rounded-full mb-4"
        />
        <p class="text-lg font-semibold mb-2">{{ user.first_name }} {{ user.last_name }}</p>
        <p class="text-gray-600 mb-4">{{ user.email }}</p>
        <p class="text-gray-600 mb-4"><strong>Role:</strong> {{ user.role.name }}</p>
        <p class="text-gray-600 mb-4"><strong>Created At:</strong> {{ new Date(user.created_at).toLocaleDateString() }}</p>
        <p class="text-gray-600 mb-4"><strong>Updated At:</strong> {{ new Date(user.updated_at).toLocaleDateString() }}</p>
      </div>
    </div>
  </template>
  
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