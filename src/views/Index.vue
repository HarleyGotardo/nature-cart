<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { RouterLink } from 'vue-router';

const sampleData = ref([]);
const error = ref(null);

onMounted(async () => {
  let { data: sample, error: err } = await supabase
    .from('sample')
    .select('*');
  
  if (err) {
    error.value = err.message;
  } else {
    sampleData.value = sample;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <header class="text-center mb-8">
      <h1 class="text-5xl font-bold mb-4">Nature Cart</h1>
      <p class="text-lg text-gray-700">Your forest products companion</p>
    </header>

    <div class="mb-8">
      <RouterLink to="/">
        <button class="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-700">Login</button>
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4">
      <div class="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold mb-2">Editable Maps</h2>
        <p class="text-gray-600">Pinpoint the location of forest products.</p>
      </div>
      <div class="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold mb-2">Recording Collections</h2>
        <p class="text-gray-600">Records the forest product collections with ease.</p>
      </div>
      <div class="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 class="text-xl font-semibold mb-2">Administrative and Other Roles Access</h2>
        <p class="text-gray-600">Can be accessed by different variations of roles.</p>
      </div>
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-else class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Sample Data</h2>
      <ul>
        <li v-for="item in sampleData" :key="item.id" class="text-gray-700">{{ item.name }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}
</style>