<template>
  <v-app id="app">
    <v-main>
      <CustomGallery />
    </v-main>
  </v-app>
</template>

<script>
import CustomGallery from './components/CustomGallery.vue';

export default {
  name: 'App',
  components: {
    CustomGallery
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
