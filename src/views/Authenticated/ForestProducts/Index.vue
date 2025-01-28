<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const forestProducts = ref([])
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = 14

const fetchForestProducts = async (page) => {
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage - 1

  let { data, error: fetchError } = await supabase
    .from('forest_products')
    .select(`
      *,
      fp_and_location (
        location (
          id,
          name
        )
      )
    `)
    .range(start, end)

  if (fetchError) {
    error.value = fetchError.message
  } else {
    // Transform the data to include locations
    forestProducts.value = data.map(product => ({
      ...product,
      locations: product.fp_and_location.map(fp => fp.location)
    }))
  }
}

onMounted(() => {
  fetchForestProducts(currentPage.value)
})

const nextPage = () => {
  currentPage.value++
  fetchForestProducts(currentPage.value)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchForestProducts(currentPage.value)
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 ml-14 mt-1">Forest Products</h2>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="px-4 py-2 text-left">ID</th>
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Type</th>
            <th class="px-4 py-2 text-left">Quantity</th>
            <th class="px-4 py-2 text-left">Locations</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in forestProducts" :key="product.id" class="border-b">
            <td class="px-4 py-2">{{ product.id }}</td>
            <td class="px-4 py-2">{{ product.name }}</td>
            <td class="px-4 py-2">{{ product.type === 'T' ? 'Timber' : 'Non-Timber' }}</td>
            <td class="px-4 py-2">{{ product.quantity }}</td>
            <td class="px-4 py-2">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="location in product.locations" 
                  :key="location.id"
                  class="bg-gray-100 px-2 py-1 rounded-full text-sm"
                >
                  {{ location.name }}
                </span>
              </div>
            </td>
            <td class="px-4 py-2">
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
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded-lg">Previous</button>
        <button @click="nextPage" :disabled="forestProducts.length < itemsPerPage" class="px-4 py-2 bg-gray-300 rounded-lg">Next</button>
      </div>
    </div>
  </div>
</template>