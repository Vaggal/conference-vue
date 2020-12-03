<template>
  <video :id="peerIndexId" autoplay></video>
</template>

<script>
export default {
  name: "VideoPlayer",
  props: {
    peerIndex: {
      type: Number,
      default: 1000,
    },
    peerStream: MediaStream,
  },
  data() {
    return {
      peerIndexId: "peer" + this.peerIndex,
    };
  },
  watch: {
    peerIndex: function () {
      // We need this so that it will update peerIndexId and the updated hook triggers
      this.peerIndexId = "peer" + this.peerIndex;
    },
  },
  updated() {
    this.setVideoStream();
  },
  mounted() {
    this.setVideoStream();
  },
  methods: {
    setVideoStream() {
      let peerVideoElement = document.getElementById(this.peerIndexId);
      peerVideoElement.srcObject = this.peerStream;
    },
  },
};
</script>

<style scoped lang="scss">
video {
  width: 100%;
}
</style>
