<template>
  <v-app id="app">
    <v-main>
      <ExampleView />
    </v-main>
  </v-app>
</template>

<script>
import ExampleView from './components/ExampleView.vue';

export default {
  name: 'App',
  components: {
    ExampleView
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
