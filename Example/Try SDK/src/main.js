import Vue from 'vue';
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'

import ModuleLibrary from 'vfg-field-object';

import "./assets/styles.css";
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(Vuetify);
const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#df4e9e",
        secondary: "#424242",
        accent: "#525fa6",
        error: "#FF5252",
        info: "#2196F3",
        success: "#6eccb9",
        warning: "#FFC107"
      }
    }
  }
});

Vue.use(VueFormGenerator)

Vue.use(ModuleLibrary);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');
