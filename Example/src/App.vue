<template>
  <v-app id="app">
    <v-main>
      <Timer :storage="timerStorage" />
    </v-main>
  </v-app>
</template>

<script>
import Timer from './components/Timer.vue';

export default {
  name: 'App',
  components: {
    Timer
  },
  data() {
    let timerStorage = {};
    try {
      timerStorage = JSON.parse(localStorage.timer);
    } catch (e) {}
    return {
      timerStorage
    }
  },
  watch: {
    timerStorage: {
      handler() {
        localStorage.timer = JSON.stringify(this.timerStorage);
      },
      deep: true
    }
  }
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
