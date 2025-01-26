<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 ml-14 mt-1">Dashboard</h2>
    <!-- Map container -->
    <div id="map" class="h-[500px] w-full"></div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "Dashboard",
  setup() {
    onMounted(() => {
      const map = L.map("map", {
        dragging: false,
        zoomControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
      })
      .setView([10.744340, 124.791995], 16);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
    });
  },
};
</script>
