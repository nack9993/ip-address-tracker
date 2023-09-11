<template>
  <div class="h-full w-full body-background px-6 flex flex-col items-center">
    <div class="flex justify-center text-3xl text-white font-medium py-7">
      IP Address Tracker
    </div>
    <div class="flex justify-center w-full max-w-[560px] pb-12">
      <form @submit.prevent="searchIP" class="relative w-full">
        <input
          type="text"
          class="h-14 px-5 w-full rounded-lg z-0 focus:shadow focus:outline-none"
          placeholder="Search for any IP address"
          v-model="inputValue"
        />
        <div class="absolute top-0 right-0">
          <button
            class="cursor-not-allowed h-14 w-14 text-white hover:bg-red-600 rounded-tr-lg rounded-br-lg font-mono font-semibold bg-black"
            type="submit"
          >
            <div class="flex justify-center">
              <div class="icon-arrow"></div>
            </div>
          </button>
        </div>
      </form>
    </div>

    <!-- <div v-if="this.api_data !== null" class="grid grid-cols-4 box-container relative"> -->
    <div
      class="flex flex-col md:flex-row items-center bg-white rounded-2xl p-8 md:p-12 w-full gap-4 md:justify-between max-w-[1000px]"
    >
      <div class="flex flex-col items-center md:items-start">
        <div class="text-[9px] font-semibold text-gray-500">IP ADDRESS</div>
        <!-- <p>{{ this.api_data.ip }}</p> -->
        <p class="text-xl font-semibold">192.212.174.101</p>
      </div>
      <div class="flex flex-col items-center md:items-start">
        <h3 class="text-[9px] font-semibold text-gray-500">LOCATION</h3>
        <!-- <p>{{ this.api_data.location.region }}, {{ this.api_data.location.country }}</p> -->
        <p class="text-xl font-semibold">Brooklyn, Ny 10001</p>
      </div>
      <div class="flex flex-col items-center md:items-start">
        <h3 class="text-[9px] font-semibold text-gray-500">TIMEZONE</h3>
        <!-- <p>UTC {{ this.api_data.location.timezone }}</p> -->
        <p class="text-xl font-semibold">UTC -05:00</p>
      </div>
      <div class="flex flex-col items-center md:items-start">
        <h3 class="text-[9px] font-semibold text-gray-500">ISP</h3>
        <!-- <p>{{ this.api_data.isp }}</p> -->
        <p class="text-xl font-semibold">SpaceX Starlink</p>
      </div>
      <!-- map div -->
      <div ref="mapDiv" class="map-container -z-10 bottom-0 left-0"></div>
    </div>
  </div>
</template>

<script>
import EventService from "@/api";
import customMarker from "@/assets/imgs/icon-location.svg";
import { Loader } from "@googlemaps/js-api-loader";

export default {
  data() {
    return {
      inputValue: "",
      map: null,
      api_data: null,
      mock_data_Location: {
        lat: 40.6782,
        lng: 73.9442,
      },
    };
  },
  methods: {
    async searchIP() {
      await EventService.getIPTrackerAPI(this.inputValue)
        .then((response) => {
          this.api_data = response.data;
          // use the map function when searching.
          // this.initMap();
        })
        .catch(() => {
          console.log(error);
        });
    },
    async initMap() {
      const loader = new Loader({
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
        version: "weekly",
      });

      await loader.load().then(() => {
        const mapOptions = {
          center: this.mock_data_Location,
          zoom: 6,
        };

        // Add the map
        this.map = new google.maps.Map(this.$refs.mapDiv, mapOptions);

        // Add a marker to the map
        const markerPosition = this.mock_data_Location;
        const marker = new google.maps.Marker({
          position: markerPosition,
          map: this.map,
          icon: customMarker,
          title: "Marker",
        });
      });
    },
  },
  computed: {
    isValidIpAddress() {
      const IP_Pattern =
        /^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-fA-F]|[a-fA-F][a-fA-F0-9\-]*[a-fA-F0-9])\.)*([A-Fa-f]|[A-Fa-f][A-Fa-f0-9\-]*[A-Fa-f0-9])$|^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::)))))$/;
      return IP_Pattern.test(this.inputValue);
    },
  },
  mounted() {
    // Mounted at this to show the map, in case api expired.
    this.initMap();
  },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap");

body {
  font-family: "Rubik", sans-serif;
}

.body-background {
  background-image: url("/assets/imgs/pattern-bg-desktop.png");
  background-repeat: no-repeat;
}

.icon-arrow {
  content: url("/assets/imgs/icon-arrow.svg");
}

.map-container {
  width: 100%;
  height: 80%;
  position: absolute;
}
</style>
