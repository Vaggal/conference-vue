<template>
  <div class="home">
    <div style="padding: 17px; padding-top: 0px;">
      <span
        v-show="error"
      >Allow the browser to use your web cam and after that share the URL from the address bar with the people you want to talk with.</span>
      <br>
      <span>{{error}}</span>
    </div>

    <div class="video-wrapper">
      <div class="col-md-4" v-for="(peer, key) in peers" :key="key">
        <video-player></video-player>
      </div>
    </div>

    <div class="video-wrapper">
      <div class="col-md-2">
        <video id="videoLocal" autoplay muted></video>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue';
import $ from 'jquery';

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

        let videoLocal = $('#videoLocal')[0];
        videoLocal.srcObject = stream;
        videoLocal.play();
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

      setTimeout(() => {
        var peerIndex = this.peers.length - 1;
        var peerVideo = $('#peerVideo' + peerIndex)[0];
        peerVideo.srcObject = this.peers[peerIndex].stream;
      }, 3000);
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
