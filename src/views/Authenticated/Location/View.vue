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
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">View Location</h2>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div v-else-if="location">
      <div class="mb-4">
        <h3 class="text-xl font-semibold">{{ location.name }}</h3>
        <p><strong>Latitude:</strong> {{ location.latitude }}</p>
        <p><strong>Longitude:</strong> {{ location.longitude }}</p>
      </div>
      <div id="locationMap" class="h-[400px] w-full mb-4"></div>
    </div>
  </div>
</template>

<style>
@import 'leaflet/dist/leaflet.css';
</style>