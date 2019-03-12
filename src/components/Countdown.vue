<template>
  <div>{{minutes}}:{{seconds}}</div>
</template>

<script>
import { Timer } from 'easytimer.js';

export default {
  name: 'Countdown',
  data() {
    return {
      timer: new Timer(),
      minutes: 0,
      seconds: 0
    }
  },
  methods: {
    startTimer() {
      // We always need to stop the timer as it will not start again on the next update.
      this.timer.stop();
      this.timer.start({
        startValues: {
          seconds: this.secondsLeft
        },
        precision: 'seconds',
        target: 0,
        countdown: true
      });
      this.timer.addEventListener('secondsUpdated', (e) => {
        this.minutes = this.timer.getTotalTimeValues().minutes;
        this.seconds = this.timer.getTotalTimeValues().seconds;
      });
    }
  },
  props: {
    secondsLeft: Number,
    updateId: String
  },
  watch: {
    updateId: {
      immediate: true,
      handler: function () {
        this.startTimer();
      }
    }
  }
};
</script>

<style scoped lang='scss'>
</style>
