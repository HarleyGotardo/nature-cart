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
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">View Forest Product</h2>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div v-else-if="forestProduct">
      <div class="mb-4">
        <h3 class="text-xl font-semibold">{{ forestProduct.name }}</h3>
        <p><strong>ID:</strong> {{ forestProduct.id }}</p>
        <p><strong>Created At:</strong> {{ forestProduct.created_at }}</p>
        <p><strong>Updated At:</strong> {{ forestProduct.updated_at }}</p>
        <p><strong>Description:</strong> {{ forestProduct.description }}</p>
        <p><strong>Price:</strong> ₱{{ forestProduct.price }}</p>
        <p><strong>Quantity:</strong> {{ forestProduct.quantity }}</p>
        <p><strong>Type:</strong> {{ forestProduct.type === 'T' ? 'Timber' : 'Non-Timber' }}</p>
      </div>
      <div class="mb-4">
        <h3 class="text-xl font-semibold">Locations</h3>
        <ul>
          <li v-for="location in locations" :key="location.id">
            <p><strong>Name:</strong> {{ location.name }}</p>
            <p><strong>Latitude:</strong> {{ location.latitude }}</p>
            <p><strong>Longitude:</strong> {{ location.longitude }}</p>
          </li>
        </ul>
      </div>
      <div id="locationMap" class="h-[400px] w-full mb-4"></div>
    </div>
  </div>
</template>

<style>
@import 'leaflet/dist/leaflet.css';
</style>