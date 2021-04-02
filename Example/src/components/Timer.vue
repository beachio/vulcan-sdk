<template>
  <v-card height="490" class="timer-wrapper">
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
            ></v-select>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col
            class="d-flex"
            cols="12"
          >
            <v-btn @click.stop="callSDK"><v-icon>mdi-send</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-container>        
    </v-card-text>
  </v-card>

</template>

<script>
export default {
  name: 'SimpleTimer',
  props: {
    audioEffect: {
      type: String,
      default: "0"
    },
    storage: Object
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
      method: null
    }
  },
  mounted() {
  },
  methods: {
    callSDK() {
      if (this.category && this.method) vulcanSDK.chart[this.category][this.method].call();
    }
  },
}
</script>

<style scoped>
.timer-wrapper {
  position: relative;
}

/* styles here */
/* Sets the containers height and width */
.base-timer {
  position: relative;
  width: 300px;
  height: 300px;
}
/* Removes SVG styling that would hide the time label */
.base-timer__circle {
  fill: none;
  stroke: none;
}
/* The SVG path that displays the timer's progress */
.base-timer__path-elapsed {
  stroke-width: 7px;
  stroke: #cbcbcb;
}
.base-timer__path-remaining {
  stroke-width: 7px;
  stroke-linecap: round;
  transform: rotate(90deg);
  transform-origin: center;
  transition: 1s linear all;
  fill-rule: nonzero;
  stroke: currentColor;
}
.base-timer__path-remaining.green {
  color: rgb(65, 184, 131);
}
.base-timer__path-remaining.orange {
  color: orange;
}
.base-timer__path-remaining.red {
  color: red;
}
.base-timer__path-remaining.grey {
  color: #cbcbcb;
}
.base-timer__svg {
  /* Flips the svg and makes the animation to move left-to-right */
  transform: scaleX(-1);
}
.base-timer__label {
  position: absolute;

  /* Size should match the parent container */
  width: 300px;
  height: 300px;
  /* Keep the label aligned to the top */
  top: 0;
  /* Create a flexible box that centers content vertically and horizontally */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Sort of an arbitrary number; adjust to your liking */
  font-size: 48px;
}

.button {
  min-width: 48px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
  border-radius: 0 !important;
}

.calendar {
  position: absolute;
  top: 30px;
  right: 30px;
}
</style>
