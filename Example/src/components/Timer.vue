<template>
  <v-card height="490" class="timer-wrapper">
    <v-card-title>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col>
          <div class="base-timer">
            <svg
              class="base-timer__svg"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g class="base-timer__circle">
                <circle
                  class="base-timer__path-elapsed"
                  cx="50"
                  cy="50"
                  r="45"
                />
                <path
                  :stroke-dasharray="circleDasharray"
                  :class="remainingPathColor"
                  class="base-timer__path-remaining"
                  d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                  "/>
              </g>
            </svg>
            <span class="base-timer__label">
              {{ formattedTimeLeft }}
            </span>
            <!-- <div @click="handleClick">
              <div ref="me" contenteditable @input.stop="handleInput" @blur="handleDone" @keydown.enter="handleDone" @keypress.stop="handleKeyPress"  v-text="formattedTimeLeft" v-show="editing"></div>
              <span v-html="formattedTimeLeft" class="editable" v-if="!editing"></span>
            </div> -->
            <v-row justify="center" class="my-4">
              <v-btn class="button" depressed @click="addTime(10)">
                +10sec
              </v-btn>
              <v-btn class="button" depressed @click="addTime(60)">
                +1m
              </v-btn>
              <v-btn class="button" depressed @click="addTime(120)">
                +2m
              </v-btn>
              <v-btn class="button" depressed @click="addTime(300)">
                +5m
              </v-btn>
              <v-btn class="button" depressed @click="reset">
                <v-icon>mdi-reload</v-icon>
              </v-btn>
            </v-row>
            <v-row justify="center" class="my-4">
              <v-btn
                @click="setTimer"
                v-if="!timerActive || storage.timerPaused"
                color="primary"
                :disabled="timeLeft == 0"
              >
                <v-icon class="">mdi-play-circle</v-icon>  Start Timer
              </v-btn>
              <v-btn
                @click="pauseTimer"
                v-else
              >
                <v-icon class="">mdi-pause</v-icon>  Pause Timer
              </v-btn>
            </v-row>
          </div>
        </v-col>
        <!-- <v-col>
          <v-card>
            <v-card-title>
              Timer Settings
            </v-card-title>
            <v-card-text>

            </v-card-text>
          </v-card>
        </v-col> -->
      </v-row>
    </v-card-text>
    <v-btn icon class="calendar" @click.stop="callSDK"><v-icon>mdi-calendar-edit</v-icon></v-btn>
  </v-card>

</template>

<script>
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  stopped: {
    color: "grey"
  },
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const audioFiles = [
  {
    url: "https://vulcan-marketing.s3.eu-west-2.amazonaws.com/sound1.mp3",
    name: "Beep1"
  },
  {
    url: "https://vulcan-marketing.s3.eu-west-2.amazonaws.com/sound2.mp3",
    name: "Beep2"
  },
  {
    url: "https://vulcan-marketing.s3.eu-west-2.amazonaws.com/sound3.mp3",
    name: "Beep3"
  },
];

const TIME_LIMIT = 600;

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
      timerInterval: null,
      timeLeft: 0,
      timerActive: false,
      showingEnding: false,
      editing: false,
      selectedAudio: 0,
      audioPlayer: null
    }
  },
  mounted() {
    this.audioPlayer = new Audio(this.selectedAudioFile);

    if (!this.storage.timerPaused) {
      this.$set(this.storage, 'timerPaused', false);
    }
    if (!this.storage.timerValue) {
      this.$set(this.storage, 'timerValue', 0);
    }
    if (!this.storage.timePaused) {
      this.$set(this.storage, 'timePaused', 0);
    }

    if (this.storage.timeEnd) {
      if (this.storage.timePaused && this.storage.timerPaused) {
        this.timeLeft = this.storage.timePaused;
      } else {
        this.timeLeft = this.storage.timeEnd - Math.floor(new Date().getTime() / 1000);
        this.timeLeft = Math.max(0, this.timeLeft);
      }

      if (this.timeLeft > 0) {
        this.timerActive = true;
        if (!this.storage.timerPaused) {
          this.startTimer();
        }
      } else {
        this.storage.timerValue = 0;
        this.storage.timeEnd = 0;
      }
    } else {
      this.$set(this.storage, 'timeEnd', 0);
      this.timeLeft = this.storage.timerValue;
    }
  },
  methods: {
    setTimer() {
      if (this.timeLeft <= 0) {
        return;
      }

      this.timerActive = true;
      this.startTimer();
    },
    startTimer() {
      this.storage.timerPaused = false;
      this.storage.timeEnd = Math.floor(new Date().getTime() / 1000) + this.timeLeft;

      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0)
          this.onTimesUp();
      }, 1000);
    },
    pauseTimer() {
      clearInterval(this.timerInterval);
      this.storage.timerPaused = true;
      this.storage.timePaused = this.timeLeft;
    },
    onTimesUp() {
      clearInterval(this.timerInterval);
      this.showingEnding = true;
      this.timerActive = false;
      this.storage.timerPaused = false;
      this.storage.timerValue = 0;
      this.storage.timeEnd = 0;
      this.audioPlayer.play();
      setTimeout(() => this.showingEnding = false, 1000);
    },
    /*    handleInput() {
            },
            handleKeyPress(e) {
              //console.log('handleKeyPress')
            },
            handleClick() {
              this.editing = true;
              setTimeout(() => this.$refs.me.focus(), 10);
            },
            handleDone(e) {
              this.storage.timerValue = e.target.innerText;
              this.timeLeft = e.target.innerText;
              this.editing = false;
            },*/
    addTime(seconds) {
      this.timeLeft += seconds;
      this.storage.timerValue += seconds;
      if (this.timerActive) {
        this.storage.timeEnd += seconds;
      }
    },
    reset() {
      clearInterval(this.timerInterval);
      this.timeLeft = 0;
      this.storage.timerValue = 0;
      this.storage.timeEnd = 0;
      this.timerActive = false;
      this.storage.timerPaused = false;
    },
    callSDK() {
      vulcanSDK.chart.createObject(
        {
          type: "Rect",
          width: "300",
          height: "100",
          text: "This is custom object created from Forge hosted plugin",
          backgroundColor: '#aeaeae'
        }
      );
    }
  },
  computed: {
    formattedTimeLeft() {
      const timeLeft = this.timeLeft;
      // The largest round integer less than or equal  to the result of time divided being by 60.
      const minutes = Math.floor(timeLeft / 60);
      // Seconds are the remainder of the time divided by 60 (modulus operator)
      let seconds = timeLeft % 60;
      // If the value of seconds is less than 10, then display seconds with a leading zero
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      // The output in MM:SS format
      return `${minutes}:${seconds}`;
    },
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} ${FULL_DASH_ARRAY}`;
    },
    timeFraction() {
      if (!this.storage.timerValue)
        return 1;
      const rawTimeFraction = this.timeLeft / this.storage.timerValue;
      return rawTimeFraction //-        (1 / this.timeLeft) * (1 - rawTimeFraction);
    },
    remainingPathColor() {
      const { stopped, alert, warning, info } = COLOR_CODES;
      if (!this.timerActive && !this.showingEnding) {
        return stopped.color;
      } else if (this.timeLeft <= alert.threshold) {
        return alert.color;
      } else if (this.timeLeft <= warning.threshold) {
        return warning.color;
      } else {
        return info.color;
      }
    },
    selectedAudioFile() {
      const audioObject = audioFiles[parseInt(this.audioEffect)];
      return audioObject.url;
    }
  },
  watch: {
    audioEffect() {
      this.audioPlayer.src = this.selectedAudioFile;
    }
  }
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
