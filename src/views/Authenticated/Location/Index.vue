<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const router = useRouter()
const locations = ref([])
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 7

const fetchLocations = async (page) => {
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage - 1

  let { data, error: fetchError } = await supabase
    .from('location')
    .select('*')
    .range(start, end)

  if (fetchError) {
    error.value = fetchError.message
  } else {
    locations.value = data
  }
}

const nextPage = () => {
  currentPage.value++
  fetchLocations(currentPage.value)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchLocations(currentPage.value)
  }
}

const viewLocation = (locationId) => {
  router.push(`/authenticated/locations/${locationId}`)
}

onMounted(() => {
  fetchLocations(currentPage.value)
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 ml-14 mt-1">Locations</h2>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Latitude</th>
            <th class="px-4 py-2 text-left">Longitude</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="location in locations" 
            :key="location.id" 
            class="border-b hover:bg-gray-50 cursor-pointer hover:bg-green-200"
            @click="viewLocation(location.id)"
          >
            <td class="px-4 py-2">{{ location.id }}</td>
            <td class="px-4 py-2">{{ location.name }}</td>
            <td class="px-4 py-2">{{ location.latitude }}</td>
            <td class="px-4 py-2">{{ location.longitude }}</td>
            <td class="px-4 py-2" @click.stop>
              <div class="flex space-x-2">
                <button class="text-blue-500 hover:text-blue-700">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button class="text-red-500 hover:text-red-700">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between mt-4">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          @click="nextPage" 
          :disabled="locations.length < itemsPerPage"
          class="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>