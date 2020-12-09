<template>
  <div class="base-timer">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer-circle">
        <circle class="base-timer-path-elapsed" cx="50" cy="50" r="45"></circle>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="svg-text">
          {{ minutes }}:{{ seconds }}
        </text>
        <path
          id="base-timer-path-remaining"
          stroke-dasharray="283"
          class="base-timer-path-remaining"
          :class="currentColor"
          d="M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0"
        ></path>
      </g>
    </svg>
  </div>
</template>

<script>
import { Timer } from "easytimer.js";

export default {
  name: "Countdown",
  props: {
    secondsLeft: {
      type: Number,
      default: 0,
    },
    updateId: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      timer: new Timer(),
      minutes: 0,
      seconds: 0,
      colorCodes: {
        info: {
          color: "green",
        },
        warning: {
          color: "orange",
          threshold: 10,
        },
        alert: {
          color: "red",
          threshold: 5,
        },
      },
      currentColor: "green",
      fullDashArray: 283,
    };
  },
  watch: {
    updateId: {
      immediate: true,
      handler: function () {
        this.startTimer();
      },
    },
  },
  methods: {
    startTimer() {
      this.currentColor = this.colorCodes.info.color;
      // We always need to stop the timer as it will not start again on the next update.
      this.timer.stop();
      this.timer.start({
        startValues: {
          seconds: this.secondsLeft,
        },
        precision: "seconds",
        target: 0,
        countdown: true,
      });
      this.timer.addEventListener("secondsUpdated", () => {
        let timeValues = this.timer.getTimeValues();
        this.minutes = timeValues.minutes;
        this.seconds = ("0" + timeValues.seconds).slice(-2);

        let totalTimeValues = this.timer.getTotalTimeValues();
        let timeLeft =
          this.secondsLeft - (this.secondsLeft - totalTimeValues.seconds);

        this.setCircleDasharray(timeLeft);
        this.setRemainingPathColor(timeLeft);
      });
    },
    setRemainingPathColor(timeLeft) {
      if (timeLeft <= this.colorCodes.alert.threshold) {
        this.currentColor = this.colorCodes.alert.color;
      } else if (timeLeft <= this.colorCodes.warning.threshold) {
        this.currentColor = this.colorCodes.warning.color;
      }
    },

    calculateTimeFraction(timeLeft) {
      const rawTimeFraction = timeLeft / this.secondsLeft;
      return rawTimeFraction - (1 / this.secondsLeft) * (1 - rawTimeFraction);
    },

    setCircleDasharray(timeLeft) {
      const circleDasharray = `${(
        this.calculateTimeFraction(timeLeft) * this.fullDashArray
      ).toFixed(0)} 283`;
      document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
    },
  },
};
</script>

<style scoped lang="scss">
.base-timer-circle {
  fill: none;
  stroke: none;
}

.base-timer-path-elapsed {
  stroke-width: 5px;
  stroke: grey;
}

.base-timer-path-remaining {
  stroke-width: 5px;
  stroke-linecap: round;
  transform: rotate(90deg);
  transform-origin: center;
  transition: 1s linear all;
  fill-rule: nonzero;
  stroke: currentColor;
}

.base-timer-path-remaining.green {
  color: rgb(65, 184, 131);
}

.base-timer-path-remaining.orange {
  color: orange;
}

.base-timer-path-remaining.red {
  color: red;
}

.svg-text {
  stroke: grey;
  fill: grey;
}
</style>
