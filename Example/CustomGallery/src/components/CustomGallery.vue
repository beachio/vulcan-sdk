<template>
  <v-card min-height="100%" class="timer-wrapper">
    <v-card-title class="px-5">
      Custom Gallery
    </v-card-title>

    <v-card-text class="px-5">
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
          draggable
          class="custom-gallery__search-item"
          :class="{'active': activeImage && activeImage.id == image.id}"
          v-for="(image, index) in images"
          :key="index"
          :style="{backgroundImage: `url(${image.urls.thumb})`}"
          @dragend="dragEnd(image, $event)"
          @click="selectImage(image)"
        >
        </div>
      </div>
    </v-card-text>
  </v-card>

</template>

<script>
import axios from 'axios';

const SERVER_URL = 'http://localhost:1337';
const PER_PAGE = 20;
export default {
  name: 'CustomGallery',
  components: {
	},
  data() {
    return {
      query: '',
      images: [],
      activeImage: null,
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
    // Image Click event handler
    // Submit image data to parent to get prepared for 
    selectImage(image) {
      this.activeImage = image;
      const data = {
        action: 'imagePicker_selectImage',
        image: {
          body: {
            url: image.urls.full,
            quad: {
              url: image.urls.regular
            },
            thumb: {
              url: image.urls.thumb
            }
          }
        }
      }
      window.top.postMessage(data, "*");
    },
    // Image Drag End event handler
    // submit the image data to parent to create image Object
    dragEnd(image, event) {
      const data = {
        action: 'imagePicker_dragEnd',
        point:{
          x: event.pageX,
          y: event.pageY,
        },
        image: {
          body: {
            url: image.urls.full,
            quad: {
              url: image.urls.regular
            },
            thumb: {
              url: image.urls.thumb
            }
          }
        }
      }
      window.top.postMessage(data, "*");
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
  width: 80px;
  height: 65px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: relative;
}
.active {
  border: 2px solid #df4e9e;
}
</style>
