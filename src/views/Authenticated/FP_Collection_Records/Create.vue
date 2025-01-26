<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { format } from 'date-fns'


const router = useRouter()

const name = ref('')
const description = ref('')
const type = ref('T')
const quantity = ref('')
const locationName = ref('')
const latitude = ref(10.744340)
const longitude = ref(124.791995)
const price = ref('')
const error = ref(null)

const handleSubmit = async () => {
  const now = new Date()
  const formattedDate = format(now, 'yyyy-MM-dd HH:mm:ss')

  const payload = {
    name: name.value,
    description: description.value,
    quantity: quantity.value,
    location_name: locationName.value,
    latitude: latitude.value,
    longitude: longitude.value,
    price: price.value,
    created_at: formattedDate,
    updated_at: formattedDate,
  }

  let { data, error } = await supabase
    .from('forest_products')
    .insert([payload]) 

  if (error) {
    console.error('Error creating forest product:', error.message)
    error.value = error.message
  } else {
    router.push('/authenticated/forest-products')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">Create Forest Product</h2>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          v-model="description"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        ></textarea>
      </div>
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
        <select
          id="type"
          v-model="type"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="T">Timber</option>
          <option value="NT">Non-Timber</option>
        </select>
      </div>
      <div>
        <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          id="quantity"
          v-model="quantity"
          type="number"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label for="locationName" class="block text-sm font-medium text-gray-700">Location Name</label>
        <input
          id="locationName"
          v-model="locationName"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label for="latitude" class="block text-sm font-medium text-gray-700">Latitude</label>
        <input
          id="latitude"
          v-model="latitude"
          type="number"
          readonly
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div>
        <label for="longitude" class="block text-sm font-medium text-gray-700">Longitude</label>
        <input
          id="longitude"
          v-model="longitude"
          type="number"
          readonly
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
        <input
          id="price"
          v-model="price"
          type="number"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div class="flex justify-end">
        <button
          type="submit"
          class="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Add any necessary styles here */
</style>