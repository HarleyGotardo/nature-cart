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
const locationId = route.params.id
const location = ref(null)
const error = ref(null)
const mapInstance = ref(null)

const fetchLocation = async () => {
  let { data, error: fetchError } = await supabase
    .from('location')
    .select('*')
    .eq('id', locationId)
    .single()

  if (fetchError) {
    error.value = fetchError.message
  } else {
    location.value = data
    nextTick(() => {
      initializeMap(data.latitude, data.longitude)
    })
  }
}

const initializeMap = (lat, lng) => {
  if (mapInstance.value) {
    mapInstance.value.remove()
  }

  mapInstance.value = L.map('locationMap').setView([lat, lng], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(mapInstance.value)

  L.marker([lat, lng])
    .addTo(mapInstance.value)
    .bindTooltip(location.value.name, {
      permanent: true,
      direction: 'top',
      className: 'bg-white px-2 py-1 rounded shadow-lg'
    })
}

onMounted(() => {
  fetchLocation()
})
</script>
<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Location Details</h2>
      <p class="mt-2 text-gray-600">View detailed information about this location</p>
    </div>

    <!-- Error Alert -->
    <div v-if="error" 
         class="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-lg">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <p class="ml-3">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="location" class="space-y-6">
      <!-- Location Info Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6">
          <div class="flex items-start space-x-4">
            <!-- Location Icon -->
            <div class="p-3 bg-blue-50 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <!-- Location Details -->
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900">{{ location.name }}</h3>
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-500">Latitude</p>
                  <p class="mt-1 font-mono text-gray-900">{{ location.latitude }}</p>
                </div>
                <div class="p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-500">Longitude</p>
                  <p class="mt-1 font-mono text-gray-900">{{ location.longitude }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Map View</h3>
            <div class="px-3 py-1 bg-blue-50 rounded-full">
              <span class="text-sm text-blue-700">Interactive Map</span>
            </div>
          </div>
          <div id="locationMap" 
               class="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200">
          </div>
          <p class="mt-3 text-sm text-gray-500">
            Click and drag to pan, use scroll wheel to zoom
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaflet-container {
  font-family: inherit;
}

.leaflet-tooltip {
  @apply bg-white px-3 py-1.5 rounded-lg shadow-lg border-none text-sm font-medium !important;
}
</style>