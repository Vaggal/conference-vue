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
    secondsLeft: Number
  },
  watch: {
    secondsLeft: function () {
      this.startTimer();
    }
  },
  mounted() {
    this.startTimer();
  }
};
</script>

<style scoped lang='scss'>
</style>
