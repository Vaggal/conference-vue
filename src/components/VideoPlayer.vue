<template>
  <video ref="peerVideo" class="embed-responsive-item" autoplay></video>
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
    return {};
  },
  watch: {
    peerIndex: function () {
      this.setVideoStream();
    },
  },
  mounted() {
    this.setVideoStream();
  },
  methods: {
    setVideoStream() {
      this.$refs.peerVideo.srcObject = this.peerStream;
    },
  },
};
</script>

<style scoped lang="scss"></style>
