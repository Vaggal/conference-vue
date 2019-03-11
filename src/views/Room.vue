<template>
  <div class="home container-fluid">
    <div class="row">
      <div id="typeArea" class="col-sm-2">
        <form>
          <div class="form-group align-items-center text-center">
            <label for="conversationType">Conversation Type</label>
            <select
              id="conversationType"
              class="custom-select mr-sm-2"
              @change="selectConversationType($event)"
              :disabled="conversationIsSet()"
            >
              <option selected>Choose...</option>
              <option value="byturn">By Turn</option>
              <option value="loose">Loose</option>
            </select>
          </div>
        </form>
        <div v-if="conversationIsSet()" class="text-center">Conversation is set to:
          <br>
          <strong>{{conversation.friendlyType}}</strong>
        </div>
      </div>
      <div id="mainArea" class="col-xs col-sm-7">
        <div id="video-wrapper" class="row">
          <div id="errorAlert" v-show="error" class="alert alert-warning" role="alert">
            <span>{{error}}</span>
          </div>
          <div id="localVideoContainer">
            <video id="localVideo" autoplay muted></video>
          </div>
          <div class="col-xs col-sm d-flex justify-content-center">
            <video-player
              v-if="activePeerExists"
              v-bind:peer-index="activePeer.id"
              v-bind:peer-stream="activePeer.stream"
            ></video-player>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-8 offset-2">
            <div class="row justify-content-center">
              <div class="col-auto" v-for="(peer, key) in peers" :key="key">
                <peer-thumbnail
                  v-on:votes-increment="incrementVotes($event)"
                  v-bind:voting-enabled="conversationIsSet()"
                  v-bind:peer-id="peer.id"
                  v-bind:peer-active="peer.active"
                  v-bind:peer-votes="votes[peer.id]"
                ></peer-thumbnail>
              </div>
            </div>
          </div>
          <div class="col-2 d-flex justify-content-center">
            <self-thumbnail
              v-bind:voting-enabled="conversationIsSet()"
              v-bind:self-active="self.active"
              v-bind:self-votes="votes[self.id]"
            ></self-thumbnail>
          </div>
        </div>
      </div>
      <div class="col-xs col-sm-2">
        <countdown v-if="secondsLeft !== undefined" v-bind:seconds-left="secondsLeft"></countdown>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue';
import PeerThumbnail from '@/components/PeerThumbnail.vue';
import SelfThumbnail from '@/components/SelfThumbnail.vue';
import Countdown from '@/components/Countdown.vue'; // TODO: Countdown should be run conditionally because it causes exception

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
      self: {
        id: undefined,
        stream: undefined,
        active: false
      },
      peers: [],
      activePeer: {},
      votes: {},
      conversation: {},
      secondsLeft: undefined
    };
  },
  methods: {
    isNumeric(value) {
      return /^\d+$/.test(value);
    },
    incrementVotes(peerId) {
      Room.trigger('votes.increment', [peerId]);
    },
    activePeerExists() {
      return Object.keys(this.activePeer).length > 0;
    },
    conversationIsSet() {
      return Object.keys(this.conversation).length > 0;
    },
    getPeerFromId(peerId) {
      if (this.self.id == peerId) {
        return this.self;
      }

      for (const existingPeer of this.peers) {
        if (existingPeer.id == peerId) {
          return existingPeer;
        }
      }
    },
    selectConversationType(event) {
      if (event.target.value === 'byturn' || event.target.value === 'loose') {
        Room.trigger('conversation.type.select', [event.target.value]);
      }
    }
  },
  beforeMount() {
    if (!window.RTCPeerConnection || !navigator.getUserMedia) {
      this.error = 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.';
      return;
    }

    LocalVideoStream.get().then((stream) => {
      this.self.stream = stream;
      Room.init(this.self.stream);

      if (!this.$route.params.roomId) {
        Room.createRoom().then((roomId) => {
          this.self.id = Room.getSelfId();
          this.$router.push({
            name: 'active-room',
            params: { roomId: roomId }
          });
        });
      } else {
        Room.joinRoom(this.$route.params.roomId).then(() => {
          this.self.id = Room.getSelfId();
        });
      }

      let localVideo = document.getElementById('localVideo');
      localVideo.srcObject = this.self.stream;
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
          stream: peerMediaStream,
          active: false
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

    Room.on('conversation.type', (conversation) => {
      this.conversation = conversation;

      if (conversation.type === 'loose') {
        this.conversation.friendlyType = 'Loose';
      } else if (conversation.type === 'byturn') {
        this.conversation.friendlyType = 'By Turn';
      }
    });

    Room.on('time.left', (secondsLeft) => {
      this.secondsLeft = secondsLeft;
    });

    Room.on('active.peer', (peerId) => {
      if (this.activePeerExists()) {
        this.activePeer.stream.getTracks().forEach((track) => {
          track.enabled = false;
        });
      }

      let peerToActivate = this.getPeerFromId(peerId);

      this.activePeer = peerToActivate;
      this.activePeer.active = true; // TODO: Check if we need to make it again false when the user turn inactive
      this.activePeer.stream.getTracks().forEach((track) => {
        track.enabled = true;
      });
    });
  },
  mounted() {
    let localVideoElement = document.getElementById('localVideo');
    InteractiveVideo.setup(localVideoElement);
  },
  components: {
    VideoPlayer,
    PeerThumbnail,
    SelfThumbnail,
    Countdown
  }
};
</script>

<style lang='scss'>
.home {
  height: 100vh;
  background: #9e0000;
}
#mainArea {
  height: 100vh;
}
#video-wrapper {
  position: relative;
  background: #000;
  height: 90%;
}
#localVideoContainer {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
}
#localVideo {
  width: 160px;
  height: 120px;
  box-shadow: 0px 0px 15px 1px rgba(0, 0, 0, 0.75);
}
#errorAlert {
  position: absolute;
  right: 0;
  z-index: 5;
}
</style>
