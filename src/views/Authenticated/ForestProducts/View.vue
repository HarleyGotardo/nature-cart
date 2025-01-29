<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for Leaflet default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const route = useRoute()
const productId = route.params.id
const forestProduct = ref(null)
const locations = ref([])
const error = ref(null)
const mapInstance = ref(null)

const fetchForestProduct = async () => {
  let { data, error: fetchError } = await supabase
    .from('forest_products')
    .select('id, created_at, updated_at, name, description, price, quantity, type')
    .eq('id', productId)
    .single()

  if (fetchError) {
    error.value = fetchError.message
  } else {
    forestProduct.value = data
    fetchLocations()
  }
}

const fetchLocations = async () => {
  let { data, error: fetchError } = await supabase
    .from('fp_and_location')
    .select('location (id, name, latitude, longitude)')
    .eq('forest_product_id', productId)

  if (fetchError) {
    error.value = fetchError.message
  } else {
    locations.value = data.map(fp => fp.location)
    nextTick(() => {
      initializeMap()
    })
  }
}

const initializeMap = () => {
  if (mapInstance.value) {
    mapInstance.value.remove()
  }

  mapInstance.value = L.map('locationMap')

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(mapInstance.value)

  const bounds = L.latLngBounds(locations.value.map(location => [location.latitude, location.longitude]))

  locations.value.forEach(location => {
    L.marker([location.latitude, location.longitude])
      .addTo(mapInstance.value)
      .bindTooltip(location.name, {
        permanent: true,
        direction: 'top',
        className: 'bg-white px-2 py-1 rounded shadow-lg'
      })
  })

  mapInstance.value.fitBounds(bounds)
}

onMounted(() => {
  fetchForestProduct()
})
</script>
<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Forest Product Details</h2>
      <div v-if="forestProduct" 
           class="px-3 py-1 rounded-full text-sm font-medium"
           :class="forestProduct.type === 'T' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'">
        {{ forestProduct.type === 'T' ? 'Timber' : 'Non-Timber' }}
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="error" 
         class="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <p class="ml-3">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="forestProduct" class="space-y-6">
      <!-- Product Information Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-2xl font-semibold text-gray-900">{{ forestProduct.name }}</h3>
            <span class="text-sm text-gray-500">ID: {{ forestProduct.id }}</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Created At</p>
                  <p class="text-gray-900">{{ forestProduct.created_at }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <div class="p-2 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Updated At</p>
                  <p class="text-gray-900">{{ forestProduct.updated_at }}</p>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Price</p>
                  <p class="text-xl font-semibold text-gray-900">₱{{ forestProduct.price.toLocaleString() }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3">
                <div class="p-2 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Quantity Available</p>
                  <p class="text-xl font-semibold text-gray-900">{{ forestProduct.quantity }} units</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="mt-6 pt-6 border-t border-gray-100">
            <h4 class="text-sm font-medium text-gray-500 mb-2">Description</h4>
            <p class="text-gray-700">{{ forestProduct.description }}</p>
          </div>
        </div>
      </div>

      <!-- Locations Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Product Locations</h3>
          
          <div class="grid gap-4 mb-6">
            <div v-for="location in locations" 
                 :key="location.id" 
                 class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-white rounded-md">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ location.name }}</h4>
                  <div class="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-500">
                    <p>Lat: {{ location.latitude }}</p>
                    <p>Long: {{ location.longitude }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Map Container -->
          <div id="locationMap" class="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200"></div>
        </div>
      </div>
    </div>
  </div>
</template> 

<style>
@import 'leaflet/dist/leaflet.css';
</style>