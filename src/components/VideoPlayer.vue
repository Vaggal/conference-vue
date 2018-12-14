<template>
  <div>
    <video :id="peerIndexId" autoplay></video>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  data() {
    return {
      peerIndexId: 'peer' + this.peerIndex
    };
  },
  props: {
    peerIndex: Number,
    peerStream: MediaStream
  },
  mounted() {
    let peerVideoElement = document.getElementById(this.peerIndexId);
    peerVideoElement.srcObject = this.peerStream;
  }
};
</script>

<style scoped lang='scss'>

</style>
