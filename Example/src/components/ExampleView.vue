<template>
  <v-card class="timer-wrapper">
    <v-card-title>
      Testing SDK
    </v-card-title>

    <v-card-text>
      <v-container fluid>
        <v-row align="center">
          <v-col
            class="d-flex"
            cols="12"
          >
            <v-select
              :items="categories"
              label="Category"
              v-model="category"
            ></v-select>
          </v-col>
        </v-row>
        <v-row align="center" v-if="category">
          <v-col
            class="d-flex"
            cols="12"
          >
            <v-select
              :items="methods[category]"
              label="Method"
              v-model="method"
              @change="onChangeMethod"
            ></v-select>
          </v-col>
        </v-row>
        <v-row align="left" v-if="schema.fields">
          <vue-form-generator tag="div" :schema="schema" :model="this.optionModel"></vue-form-generator>
        </v-row>
        <v-row align="center">
          <v-col
            class="d-flex"
            cols="12"
          >
            <v-btn @click.stop="callSDK"><v-icon>mdi-send</v-icon></v-btn>
          </v-col>
        </v-row>
        <v-row v-if="responseData">
          <v-col
            class="d-flex"
            cols="12"
          >
            <json-viewer :value="responseData" expand-depth="3"></json-viewer>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>

</template>

<script>
import VueFormGenerator from "vue-form-generator";
import JsonViewer from "vue-json-viewer";
import scheme from './scheme';
import 'vue-form-generator/dist/vfg.css'

export default {
  name: 'ExampleView',
  components: {
		"vue-form-generator": VueFormGenerator.component,
    JsonViewer
	},
  data() {
    return {
      categories: ['ui', 'viewport', 'settings', 'objects', 'events'],
      methods: {
        ui: ['openDrawer', 'closeDrawer', 'openTreeView', 'closeTreeView', 'openFilterView', 'closeFilterView', 'openDialog', 'closeDialog'],
        viewport: ['get', 'set', 'setWithAnimation', 'zoomToObject', 'setZoomLevel', 'getZoomLevel'],
        settings: ['enableBackgroundImage', 'setBackgroundImage', 'getBackgroundImage', 'enableGrid', 'disableGrid', 'updateGridOptions', 'enableNavigationControl', 'disableNavigationControl', 'moveToProject', 'enablePublicLink', 'disablePublicLink', 'getPublicStatus', 'getWidgetLink', 'getWidgetEmbedSnippet', 'enableWidgetComments', 'disableWidgetComments'],
        objects: ['create', 'get', 'update', 'bringForward', 'bringToFront', 'sendBackward', 'sendToBack', 'lock', 'unlock', 'showEditor', 'hideEditor', 'createSymbol', 'duplicate', 'changeType', 'createGroup', 'addToGroup'],
        events: ['SELECTETION_UPDATED', 'OBJECTS_CREATED', 'OBJECTS_DELETED', 'ALL_OBJECTS_LOADED']
      },
      category: null,
      method: null,
      schema: {
        fields: null
      },
      optionModel: null,
      responseData: null
    }
  },
  mounted() {
  },
  methods: {
    callSDK() {
      if (this.category && this.method) {
        const schemeInfo = scheme[this.category] ? scheme[this.category][this.method] : null;
        // Get additional method information and take care of addtional handling
        if (schemeInfo) {
          // Callback case
          if (schemeInfo.type === 'callback') {
            const that = this;
            const callbackFunc = function(data) {
              that.responseData = data;
              delete that.responseData.callbackType;
            };
            const option = this.optionModel;
            const args = this.optionModel ? [this.optionModel, callbackFunc] : [callbackFunc];
            vulcanSDK.chart[this.category][this.method].apply(null, args);
            return;
          }
          if (schemeInfo.type === 'model') {
            const option = this.optionModel;
            vulcanSDK.chart[this.category][this.method].apply(null, [option]);
            return;
          }
        }
        vulcanSDK.chart[this.category][this.method].call();
      }
    },
    onChangeMethod() {
      if (this.category && this.method) {
        const schemeInfo = scheme[this.category] ? scheme[this.category][this.method] : null;
        // Get additional method information and take care of addtional handling
        if (schemeInfo && schemeInfo.model) {
          this.optionModel = { ...schemeInfo.model };
          this.schema.fields = schemeInfo.fields;
        } else {
          this.optionModel = null;
          this.schema.fields = null;
        }
      }
    }
  },
}
</script>

<style scoped>
.vue-form-generator {
  text-align: left;
  padding: 20px;
  width: 100%;
}

.vue-form-generator fieldset {
  border: none;
}
</style>
