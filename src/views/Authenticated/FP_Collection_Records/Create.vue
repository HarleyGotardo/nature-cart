<script setup>
import { CommonConstant } from "@/components/constants/common.constant";
import { CoordinatesConstant } from "@/components/constants/coordinates.constant";
import { DatabaseNamesConstant } from "@/components/constants/databaseNames.constant";
import { RouterNamesConstant } from "@/components/constants/routerNames.constant";
import { SeparatorConstant } from "@/components/constants/separators.constant";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { nextTick, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient'
import Swal from 'sweetalert2'

const router = useRouter();
const name = ref(SeparatorConstant.EMPTY_STRING);
const description = ref(SeparatorConstant.EMPTY_STRING);
const type = ref(CommonConstant.SINGLE_STRING.T);
const quantity = ref(SeparatorConstant.EMPTY_STRING);
const locationName = ref(SeparatorConstant.EMPTY_STRING);
const price = ref(SeparatorConstant.EMPTY_STRING);
const error = ref(null);
const isModalOpen = ref(false);
const modalField = ref(SeparatorConstant.EMPTY_STRING);
const modalValue = ref(null);
let coordinatesObj = ref(null);
const coordinates = ref("");
let mapInstance = null;


/**
 * Handles the submission of the form.
 */
const handleSubmit = async () => {
  const currentDate = new Date();
  const formattedDate = format(
    currentDate,
    CommonConstant.DATE_FORMAT.ISO_8601
  );
  const payload = {
    name: name.value,
    description: description.value,
    type: type.value,
    quantity: quantity.value,
    location_name: locationName.value,
    latitude: coordinatesObj.value.lat,
    longitude: coordinatesObj.value.lng,
    price: price.value,
    created_at: formattedDate,
    updated_at: formattedDate,
  };
  const { error: insertError } = await supabase
    .from(DatabaseNamesConstant.FOREST_PRODUCTS)
    .insert([payload]);

    if (insertError) {
    error.value = insertError.message
  } else {
    Swal.fire({
      icon: CommonConstant.SWAL.ICON,
      title: CommonConstant.SWAL.TITLE,
      text: CommonConstant.SWAL.TEXT,
      timer: CommonConstant.SWAL.TIMER,
      showConfirmButton: CommonConstant.SWAL.SHOW_CONFIRM_BUTTON
    }).then(() => {
      router.push(RouterNamesConstant.FOREST_PRODUCTS)
    })
  }
};

/**
 * Opens the modal to set the value of a field.
 *
 * @param {string} field The name of the field to set.
 */
const openModal = (field) => {
  modalField.value = field;
  modalValue.value = name.value;
  isModalOpen.value = true;

  nextTick(() => {
    initializeMap();
  });
};

/**
 * Closes the modal.
 */
const closeModal = () => {
  isModalOpen.value = false;
  modalField.value = "";
  modalValue.value = null;

  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
};

/**
 * Saves the value of the modal input field to the corresponding form field and closes the modal.
 */
const saveModalValue = () => {
  name.value = modalValue.value;
  closeModal();
};

/**
 * Initializes the Leaflet map.
 *
 * @return {void}
 */
const initializeMap = () => {
  const mapContainer = document.getElementById("map");
  let currentMark = null;

  if (!mapContainer) {
    return;
  }

  if (mapInstance) {
    return;
  }

  if (
    CommonConstant.INTEGERS.ZERO === mapContainer.offsetHeight ||
    CommonConstant.INTEGERS.ZERO === mapContainer.offsetWidth
  ) {
    return;
  }

  mapInstance = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    dragging: true,
  }).setView(
    CoordinatesConstant.VISAYAS_STATE_UNIVERSITY_COORDINATES,
    CommonConstant.MAP_ZOOM_LEVEL.SIXTEEN
  );

  L.tileLayer(CommonConstant.MAP_LAYER, {
    maxZoom: CommonConstant.MAP_ZOOM_LEVEL.NINETEEN,
  }).addTo(mapInstance);

  mapInstance.on("click", (mapEvent) => {
    const latLngObj = {
      lat: mapEvent.latlng.lat,
      lng: mapEvent.latlng.lng,
    };

    if (currentMark) {
      mapInstance.removeLayer(currentMark);
    }

    currentMark = L.marker([latLngObj.lat, latLngObj.lng]).addTo(mapInstance);

    L.popup()
      .setLatLng(mapEvent.latlng)
      .setContent(
        `
        ${CommonConstant.COMPONENT_TEXTS.YOU_CLICKED_THE_MAP_AT} 
        ${latLngObj.lat.toFixed(CommonConstant.INTEGERS.TWO)}, 
        ${latLngObj.lng.toFixed(CommonConstant.INTEGERS.TWO)}.
      `
      )
      .openOn(mapInstance);

    coordinatesObj.value = latLngObj;
    coordinates.value = `${latLngObj.lat}, ${latLngObj.lng}`;

    watch(coordinatesObj, (newValue) => {
      if (newValue) {
        const { lat, lng } = newValue;
        coordinates.value = `${lat}, ${lng}`;
      }
    });
  });
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6">
      {{ CommonConstant.COMPONENT_TEXTS.CREATE_FOREST_PRODUCT }}
    </h2>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">{{
          CommonConstant.COMPONENT_TEXTS.NAME
        }}</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700"
          >{{ CommonConstant.COMPONENT_TEXTS.DESCRIPTION }}</label
        >
        <textarea
          id="description"
          v-model="description"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        ></textarea>
      </div>
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700">{{
          CommonConstant.COMPONENT_TEXTS.TYPE
        }}</label>
        <select
          id="type"
          v-model="type"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="T">{{ CommonConstant.COMPONENT_TEXTS.TIMBER }}</option>
          <option value="NT">
            {{ CommonConstant.COMPONENT_TEXTS.NON_TIMBER }}
          </option>
        </select>
      </div>
      <div>
        <label for="quantity" class="block text-sm font-medium text-gray-700">{{
          CommonConstant.COMPONENT_TEXTS.QUANTITY
        }}</label>
        <input
          id="quantity"
          v-model="quantity"
          type="number"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label
          for="locationName"
          class="block text-sm font-medium text-gray-700"
          >{{ CommonConstant.COMPONENT_TEXTS.LOCATION_NAME }}</label
        >
        <input
          id="locationName"
          v-model="locationName"
          type="text"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label
          for="coordinates"
          class="block text-sm font-medium text-gray-700"
          >{{ CommonConstant.COMPONENT_TEXTS.COORDINATES }}</label
        >
        <input
          id="coordinates"
          type="text"
          readonly
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          @click="openModal('coordinates')"
          v-model="coordinates"
        />
      </div>
      <div>
        <label for="price" class="block text-sm font-medium text-gray-700">{{
          CommonConstant.COMPONENT_TEXTS.PRICE
        }}</label>
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
          {{ CommonConstant.COMPONENT_TEXTS.CREATE }}
        </button>
      </div>
    </form>
  </div>

  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white rounded-lg p-6 max-w-4xl w-full">
      <h3 class="text-lg font-bold mb-4">
        {{ CommonConstant.COMPONENT_TEXTS.SET }} {{ modalField }}
      </h3>
      <div id="map" class="h-[500px] w-full"></div>
      <div class="flex justify-end mt-4 space-x-2">
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-300 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {{ CommonConstant.COMPONENT_TEXTS.CANCEL }}
        </button>
        <button
          @click="saveModalValue"
          class="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {{ CommonConstant.COMPONENT_TEXTS.SAVE }}
        </button>
      </div>
    </div>
  </div>
</template>
