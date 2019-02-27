<template>
  <video :id="peerIndexId" autoplay></video>
</template>

<script>
export default {
  name: 'VideoPlayer',
  data() {
    return {
      peerIndexId: 'peer' + this.peerIndex
    };
  },
  methods: {
    setVideoStream() {
      let peerVideoElement = document.getElementById(this.peerIndexId);
      peerVideoElement.srcObject = this.peerStream;
    }
  },
  props: {
    peerIndex: Number,
    peerStream: MediaStream
  },
  watch: {
    peerIndex: function () { // We need this so that it will update peerIndexId and the the updated hook triggers
      this.peerIndexId = 'peer' + this.peerIndex;
    }
  },
  mounted() {
    this.setVideoStream();
  },
  updated() {
    this.setVideoStream();
  }
};
</script>

<style scoped lang='scss'>
</style>
