<script setup>
import { ref, onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from '@/lib/supabaseClient'

const forestProducts = ref([])

const fetchForestProducts = async () => {
  let { data, error } = await supabase
    .from('forest_products')
    .select('longitude, latitude, name')

  if (error) {
    console.error('Error fetching forest products:', error)
  } else {
    forestProducts.value = data
  }
}

onMounted(async () => {
  await fetchForestProducts()

  const map = L.map("map", {
    dragging: true,
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    touchZoom: true,
    boxZoom: true,
    keyboard: true,
  }).setView([10.744340, 124.791995], 16);
  
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  forestProducts.value.forEach(product => {
    L.marker([product.latitude, product.longitude])
      .addTo(map)
      .bindPopup(`<b>${product.name}</b>`)
  })
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 ml-14 mt-1">Forest Product Map</h2>
    <!-- Map container -->
    <div id="map" class="h-[500px] w-full"></div>
  </div>
</template>

<style scoped>
#map {
  height: 500px;
  z-index: 1;
}
</style>