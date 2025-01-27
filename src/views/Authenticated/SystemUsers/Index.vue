
<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const users = ref([])
const roles = ref([])
const selectedRole = ref('')
const searchQuery = ref('')
const filteredUsers = computed(() => {
  let filtered = users.value

  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role.id === selectedRole.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  return filtered
})

const fetchUsers = async () => {
  let { data, error } = await supabase
    .from('users')
    .select(`
      id,
      first_name,
      last_name,
      email,
      role:roles (
        id,
        name
      )
    `)

  if (error) {
    console.error('Error fetching users:', error)
  } else {
    users.value = data
  }
}

const fetchRoles = async () => {
  let { data, error } = await supabase
    .from('roles')
    .select('id, name')

  if (error) {
    console.error('Error fetching roles:', error)
  } else {
    roles.value = data
  }
}

onMounted(async () => {
  await fetchUsers()
  await fetchRoles()
})
</script>

<template>
    <div>
      <h2 class="text-2xl font-bold mb-4 ml-14 mt-1">System Users</h2>
      <div class="mb-4">
        <label for="role" class="block text-sm font-medium text-gray-700">Filter by Role</label>
        <select
          id="role"
          v-model="selectedRole"
          @change="filterUsersByRole"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">All Roles</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="search" class="block text-sm font-medium text-gray-700">Search Users</label>
        <input
          id="search"
          v-model="searchQuery"
          @input="filterUsersByRole"
          type="text"
          placeholder="Search by name or email"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">First Name</th>
            <th class="py-2 px-4 border-b">Last Name</th>
            <th class="py-2 px-4 border-b">Email</th>
            <th class="py-2 px-4 border-b">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="4" class="py-2 px-4 border-b text-center">No user found</td>
          </tr>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="py-2 px-4 border-b text-center">{{ user.first_name }}</td>
            <td class="py-2 px-4 border-b text-center">{{ user.last_name }}</td>
            <td class="py-2 px-4 border-b text-center">{{ user.email }}</td>
            <td class="py-2 px-4 border-b text-center">{{ user.role.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  
  <style scoped>
  /* Add any necessary styles here */
  </style>