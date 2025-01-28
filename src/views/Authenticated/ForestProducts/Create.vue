<script setup>
import { CommonConstant } from "@/components/constants/common.constant";
import { DatabaseNamesConstant } from "@/components/constants/databaseNames.constant";
import { RouterNamesConstant } from "@/components/constants/routerNames.constant";
import { SeparatorConstant } from "@/components/constants/separators.constant";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient'
import Swal from 'sweetalert2'

const router = useRouter();
const name = ref(SeparatorConstant.EMPTY_STRING);
const description = ref(SeparatorConstant.EMPTY_STRING);
const type = ref(CommonConstant.SINGLE_STRING.T);
const quantity = ref(SeparatorConstant.EMPTY_STRING);
const price = ref(SeparatorConstant.EMPTY_STRING);
const error = ref(null);
const locations = ref([]);
const selectedLocation = ref(null);

// Fetch all locations
const fetchLocations = async () => {
  const { data, error } = await supabase
    .from('location')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error fetching locations:', error);
  } else {
    locations.value = data;
  }
};

onMounted(() => {
  fetchLocations();
});

const handleSubmit = async () => {
  const currentDate = new Date();
  const formattedDate = format(
    currentDate,
    CommonConstant.DATE_FORMAT.ISO_8601
  );

  // First, insert the forest product
  const { data: fpData, error: fpError } = await supabase
    .from('forest_products')
    .insert([{
      name: name.value,
      description: description.value,
      type: type.value,
      quantity: quantity.value,
      price: price.value,
      created_at: formattedDate,
      updated_at: formattedDate,
    }])
    .select()
    .single();

  if (fpError) {
    error.value = fpError.message;
    return;
  }

  // Then, insert the forest product and location relationship
  const { error: fpLocationError } = await supabase
    .from('fp_and_location')
    .insert([{
      forest_product_id: fpData.id,
      location_id: selectedLocation.value
    }]);

  if (fpLocationError) {
    error.value = fpLocationError.message;
    return;
  }

  Swal.fire({
    icon: CommonConstant.SWAL.ICON,
    title: CommonConstant.SWAL.TITLE,
    text: CommonConstant.SWAL.TEXT,
    timer: CommonConstant.SWAL.TIMER,
    showConfirmButton: CommonConstant.SWAL.SHOW_CONFIRM_BUTTON
  }).then(() => {
    router.push(RouterNamesConstant.FOREST_PRODUCTS)
  });
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">Create Forest Product</h2>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Existing name input -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <!-- Existing description input -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          v-model="description"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        ></textarea>
      </div>

      <!-- Existing type select -->
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

      <!-- Existing quantity input -->
      <div>
        <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          id="quantity"
          v-model="quantity"
          type="number"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <!-- New Location select -->
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
        <select
          id="location"
          v-model="selectedLocation"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Select a location</option>
          <option v-for="location in locations" :key="location.id" :value="location.id">
            {{ location.name }}
          </option>
        </select>
      </div>

      <!-- Existing price input -->
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
        <input
          id="price"
          v-model="price"
          type="number"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <!-- Submit button -->
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