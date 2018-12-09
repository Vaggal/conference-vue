<template>
  <div class="home container-fluid">
    <div class="row">
      <span
        v-show="error"
      >Allow the browser to use your web cam and after that share the URL from the address bar with the people you want to talk with.</span>
      <br>
      <span>{{error}}</span>
    </div>

    <div class="row video-wrapper">
      <div class="col-sm d-flex justify-content-center">
        <video id="videoLocal" autoplay muted></video>
      </div>
    </div>

    <div class="row video-wrapper">
      <div class="col-sm d-flex justify-content-center" v-for="(peer, key) in peers" :key="key">
        <video-player v-bind:peer-index="key" v-bind:peer-stream="peer.stream"></video-player>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue';
import $ from 'jquery';
import 'bootstrap';

import Room from '@/modules/Room';
import VideoStream from '@/modules/VideoStream';
import CustomAdapter from '@/modules/CustomAdapter'; // TODO: replace with adapter.js package

export default {
  name: 'room',
  data() {
    return {
      error: '',
      peers: []
    };
  },
  methods: {
  },
  beforeMount() {
    if (!window.RTCPeerConnection || !navigator.getUserMedia) {
      this.error =
        'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
      return;
    }

    var stream;

    VideoStream.get().then(
      (s) => {
        stream = s;
        Room.init(stream);
        if (!this.$route.params.roomId) {
          Room.createRoom().then((roomId) => {
            this.$router.push({
              name: 'active-room',
              params: { roomId: roomId }
            });
          });
        } else {
          Room.joinRoom(this.$route.params.roomId);
        }

        let videoLocal = document.getElementById('videoLocal');
        videoLocal.srcObject = stream;
      },
      () => {
        this.error =
          'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
      }
    );
    Room.on('peer.stream', (peer) => {
      console.log('Client connected, adding new stream');
      this.peers.push({
        id: peer.id,
        stream: peer.stream
      });
    });
    Room.on('peer.disconnected', (peer) => {
      console.log('Client disconnected, removing stream');
      this.peers = this.peers.filter((p) => {
        return p.id !== peer.id;
      });
    });
  },
  components: { VideoPlayer }
};
</script>

<style lang='scss'>

</style>