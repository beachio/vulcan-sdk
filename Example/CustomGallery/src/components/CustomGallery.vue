<template>
  <v-card min-height="100%" class="timer-wrapper">
    <v-card-title>
      Custom Gallery
    </v-card-title>

    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col
            class="d-flex flex-column"
            cols="12"
          >
            <v-text-field v-model="query" @keyup.enter.native="fetchImages" placeholder="Type something..." solo>
              <template v-slot:append>
                <v-fade-transition group leave-absolute>
                  <v-progress-circular
                    v-if="loading"
                    size="24"
                    color="info"
                    indeterminate
                    key="0"
                  />
                  <v-btn @click="fetchImages" icon key="1">
                    <v-icon>mdi-search-web</v-icon>
                  </v-btn>
                </v-fade-transition>
              </template>
            </v-text-field>
            <div class="custom-gallery__search-result">
              <div
                class="custom-gallery__search-item"
                v-for="(image, index) in images"
                :key="index"
                :style="{backgroundImage: `url(${image.urls.thumb})`}"
                @dragstart="dragStart"
                @dragend="dragEnd(image, $event)"
              >
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>

</template>

<script>
import axios from 'axios';

const SERVER_URL = 'http://localhost:1337'
const PER_PAGE = 20;
export default {
  name: 'CustomGallery',
  components: {
	},
  data() {
    return {
      query: '',
      images: [],
      loading: false,
      responseData: null
    }
  },
  mounted() {
  },
  methods: {
    async fetchImages() {
      if (this.query && this.query.length > 0) {
        const response = await axios.get(`${SERVER_URL}/search/?query=${this.query}&per_page=${PER_PAGE}`);
        if (response && response.data) this.images = response.data.results || [];
      }
    },
    dragStart() {
      window.top.postMessage("dragging!", "*");
    },
    dragEnd(image, event) {
      const data = {
        mouse:{
          x: event.pageX,
          y: event.pageY,
        },
        image
      }
      window.top.postMessage(JSON.stringify(data), "*");
    }
  },
}
</script>

<style scoped>
.custom-gallery__search-result {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.custom-gallery__search-item {
  margin: 10px;
  cursor: pointer;
  width: 95px;
  height: 65px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: relative;
}

</style>
