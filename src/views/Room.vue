<template>
  <div class="home container-fluid">
    <div class="row">
      <span
        v-show="error"
      >Allow the browser to use your web cam and after that share the URL from the address bar with the people you want to talk with.</span>
      <br>
      <span>{{error}}</span>
    </div>

    <div class="row justify-content-center">
      <div
        class="col-xs-auto"
        v-for="(peer, key) in peers"
        :key="key"
        @click="activatePeerStream(key)"
      >
        <peer-thumbnail
          v-on:votes-increment="incrementVotes($event)"
          v-bind:peer-id="peer.id"
          v-bind:peer-votes="votes[peer.id]"
        ></peer-thumbnail>
      </div>
      <div class="col-xs-auto">
        <self-thumbnail v-bind:self-votes="votes[selfId]"></self-thumbnail>
      </div>
    </div>

    <div class="row video-wrapper">
      <div class="col-sm">
        <video id="videoLocal" autoplay muted></video>
      </div>
      <div class="col-sm">
        <video-player
          v-if="activePeerExists"
          v-bind:peer-index="activePeer.id"
          v-bind:peer-stream="activePeer.stream"
        ></video-player>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue';
import PeerThumbnail from '@/components/PeerThumbnail.vue';
import SelfThumbnail from '@/components/SelfThumbnail.vue';

import $ from 'jquery';
import 'bootstrap';

import Room from '@/modules/Room';
import InteractiveVideo from '@/modules/InteractiveVideo';
import LocalVideoStream from '@/modules/LocalVideoStream';

export default {
  name: 'room',
  data() {
    return {
      error: '',
      peers: [],
      votes: {},
      activePeer: {},
      selfId: undefined
    };
  },
  methods: {
    incrementVotes(peerId) {
      Room.trigger('votes.increment', [peerId]);
    },
    activePeerExists() {
      return Object.keys(this.activePeer).length > 0
    },
    activatePeerStream(peerIndex) {
      // If there is an already active peer we disable their streams before enabling the streams of the new active peer
      if (this.activePeerExists()) {
        this.activePeer.stream.getTracks().forEach((track) => {
          track.enabled = false;
        });
      }

      this.activePeer = this.peers[peerIndex];
      this.activePeer.stream.getTracks().forEach((track) => {
        track.enabled = true;
      });
    }
  },
  beforeMount() {
    if (!window.RTCPeerConnection || !navigator.getUserMedia) {
      this.error = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
      return;
    }

    var localStream;

    LocalVideoStream.get().then((stream) => {
      localStream = stream;
      Room.init(localStream);

      if (!this.$route.params.roomId) {
        Room.createRoom().then((roomId) => {
          this.selfId = Room.getSelfId();
          this.$router.push({
            name: 'active-room',
            params: { roomId: roomId }
          });
        });
      } else {
        Room.joinRoom(this.$route.params.roomId).then(() => {
          this.selfId = Room.getSelfId();
        });
      }

      let videoLocal = document.getElementById('videoLocal');
      videoLocal.srcObject = localStream;
    }, () => {
      this.error = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
    });

    Room.on('peer.track', (peer) => {
      let isNewPeer = true;

      this.peers.forEach((existingPeer) => {
        // Peer already exists so we just add the track to their MediaStream object
        if (existingPeer.id === peer.id) {
          isNewPeer = false;
          console.log('Adding new track for client');
          peer.track.enabled = false; // We need the stream to be disable by default
          existingPeer.stream.addTrack(peer.track);
        }
      });

      // Peer is new so we create their MediaStream, add the first track and update the peers list
      if (isNewPeer) {
        console.log('Adding new client and first track');
        let peerMediaStream = new MediaStream();
        peerMediaStream.addTrack(peer.track);

        this.peers.push({
          id: peer.id,
          stream: peerMediaStream
        });
      }
    });

    Room.on('peer.disconnected', (peer) => {
      console.log('Client disconnected, removing stream');
      this.peers = this.peers.filter((p) => {
        return p.id !== peer.id;
      });
    });

    Room.on('votes.update', (votes) => {
      this.votes = votes;
    });
  },
  mounted() {
    let videoLocalElement = document.getElementById('videoLocal');
    InteractiveVideo.setup(videoLocalElement);
  },
  components: {
    VideoPlayer,
    PeerThumbnail,
    SelfThumbnail
  }
};
</script>

<style lang='scss'>
.home {
  height: 100vh;
  background: #9e0000;
}
.video-wrapper {
  background: black;
}
</style>
