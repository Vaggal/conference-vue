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
              :disabled="conversationIsSet()"
              @change="conversationTypeSelected($event)"
            >
              <option selected>Choose...</option>
              <option value="byturn">By Turn</option>
              <option value="loose">Loose</option>
            </select>
          </div>
        </form>
        <div v-if="conversationIsSet()" class="text-center">
          Conversation is set to:
          <br />
          <strong>{{ conversation.friendlyType }}</strong>
        </div>
        <Countdown
          v-if="countdown.secondsLeft !== undefined"
          :seconds-left="countdown.secondsLeft"
          :update-id="countdown.updateId"
        ></Countdown>
      </div>
      <div id="mainArea" class="col-xs col-sm-7 d-flex flex-column">
        <div id="video-wrapper" class="row d-flex flex-grow-1">
          <div v-show="error" id="errorAlert" class="alert alert-warning">
            <span>{{ error }}</span>
          </div>
          <div id="localVideoContainer">
            <video id="localVideo" autoplay muted></video>
          </div>
          <div
            v-if="conversationIsSet() && !conversationIsLoose()"
            class="col d-flex"
          >
            <div class="row flex-grow-1">
              <div
                class="col-xs col-sm d-flex justify-content-center embed-responsive"
              >
                <VideoPlayer
                  v-if="activePeerExists"
                  :peer-index="activePeer.id"
                  :peer-stream="activePeer.stream"
                ></VideoPlayer>
              </div>
            </div>
          </div>
          <!-- this will be used when we will want to display more than one peers at the same time -->
          <div
            v-if="conversationIsSet() && conversationIsLoose()"
            class="col d-flex"
          >
            <div class="row flex-grow-1">
              <div
                v-for="(peer, key) in peers"
                :key="key"
                class="col-xs col-sm d-flex justify-content-center embed-responsive m-1"
              >
                <VideoPlayer
                  :peer-index="key"
                  :peer-stream="peer.stream"
                  :conversation-type="conversation.type"
                ></VideoPlayer>
              </div>
            </div>
          </div>
        </div>

        <div class="row mt-1">
          <div class="col-8 offset-2">
            <div class="row justify-content-center">
              <div v-for="(peer, key) in peers" :key="key" class="col-auto">
                <PeerThumbnail
                  :voting-enabled="
                    conversationIsSet() && !conversationIsLoose()
                  "
                  :peer-id="peer.id"
                  :peer-username="peer.username"
                  :peer-active="peer.active"
                  :peer-votes="votes[peer.id]"
                  @votes-increment="incrementVotes($event)"
                ></PeerThumbnail>
              </div>
            </div>
          </div>
          <div class="col-2 d-flex justify-content-center">
            <SelfThumbnail
              :voting-enabled="conversationIsSet() && !conversationIsLoose()"
              :self-username="self.username"
              :self-active="self.active"
              :self-votes="votes[self.id]"
            ></SelfThumbnail>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <Chat
          :comments="comments"
          :self-id="self.id"
          @new-comment="sendComment"
        ></Chat>
      </div>
    </div>
    <Overlay @save-username="saveUsername"> </Overlay>
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer.vue";
import PeerThumbnail from "@/components/PeerThumbnail.vue";
import SelfThumbnail from "@/components/SelfThumbnail.vue";
import Countdown from "@/components/Countdown.vue";
import Chat from "@/components/Chat.vue";

// import $ from 'jquery';
import "bootstrap";
import { v4 as uuidv4 } from "uuid";

import Room from "@/modules/Room";
import InteractiveVideo from "@/modules/InteractiveVideo";
import LocalVideoStream from "@/modules/LocalVideoStream";
import Overlay from "../components/Overlay.vue";

export default {
  name: "Room",
  components: {
    VideoPlayer,
    PeerThumbnail,
    SelfThumbnail,
    Countdown,
    Chat,
    Overlay,
  },
  data() {
    return {
      error: "",
      self: {
        username: "",
        id: undefined,
        stream: undefined,
        active: false,
      },
      peers: [],
      activePeer: {},
      votes: {},
      conversation: {
        type: "",
      },
      countdown: {
        secondsLeft: undefined,
        updateId: undefined,
      },
      comments: [],
    };
  },
  beforeMount() {},
  mounted() {
    document.getElementById("username-input").focus();
    let localVideoElement = document.getElementById("localVideo");
    InteractiveVideo.setup(localVideoElement);
  },
  methods: {
    isNumeric(value) {
      return /^\d+$/.test(value);
    },
    incrementVotes(peerId) {
      Room.trigger("votes.increment", [peerId]);
    },
    activePeerExists() {
      return Object.keys(this.activePeer).length > 0;
    },
    conversationIsSet() {
      return this.conversation.type !== "";
    },
    conversationIsLoose() {
      return this.conversation.type === "loose";
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
    conversationTypeSelected(event) {
      if (event.target.value === "byturn" || event.target.value === "loose") {
        Room.trigger("conversation.type.selected", [
          this.self.id,
          event.target.value,
        ]);
      }
    },
    activatePeer(peerToActivate) {
      this.activePeer.id = peerToActivate.id;
      this.activePeer.username = peerToActivate.username;
      this.activePeer.stream = peerToActivate.stream.clone();
      this.activePeer.stream.getTracks().forEach((track) => {
        track.enabled = true;
      });
      this.activePeer.active = true;
      peerToActivate.active = true;
      if (peerToActivate.id == this.self.id) {
        this.self.active = true;
      }
    },
    deactivatePeer() {
      this.activePeer.active == false;
      this.activePeer.stream.getTracks().forEach((track) => {
        track.enabled = false;
      });

      let peerToDeactivate = this.getPeerFromId(this.activePeer.id);
      peerToDeactivate.active = false;

      // If the active peer is the client then we should not disable the tracks because the self video will stop
      if (peerToDeactivate.id != this.self.id) {
        peerToDeactivate.stream.getTracks().forEach((track) => {
          track.enabled = false;
        });
      }
    },
    sendComment(message) {
      Room.trigger("new-comment", [message, this.self.id, this.self.username]);
    },
    saveUsername(username) {
      this.self.username = username;
      Room.setSelfUsername(this.self.username);
      this.setupSocketCommunication();
    },
    setupSocketCommunication() {
      if (!window.RTCPeerConnection || !navigator.getUserMedia) {
        this.error =
          "WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.";
        return;
      }

      LocalVideoStream.get()
        .then((stream) => {
          this.self.stream = stream;
          Room.init(this.self.stream);

          if (!this.$route.params.roomId) {
            Room.createRoom()
              .then((roomId) => {
                this.self.id = Room.getSelfId();
                this.$router.push({
                  name: "active-room",
                  params: { roomId: roomId },
                });
              })
              .catch((error) => {
                console.log("Error creating room: ", error);
              });
          } else {
            Room.joinRoom(this.$route.params.roomId)
              .then(() => {
                this.self.id = Room.getSelfId();
              })
              .catch((error) => {
                console.log("Error joining room: ", error);
              });
          }

          let localVideo = document.getElementById("localVideo");
          localVideo.srcObject = this.self.stream;
        })
        .catch((error) => {
          console.log("Error getting local video stream: ", error);
          this.error =
            "No audio/video permissions. Please refresh your browser and allow the audio/video capturing.";
        });

      Room.on("add.peer", (peer) => {
        let peerMediaStream = new MediaStream();

        this.peers.push({
          id: peer.id,
          username: peer.username,
          stream: peerMediaStream,
          active: false,
        });
      });

      Room.on("peer.track", (peer) => {
        this.peers.forEach((existingPeer) => {
          // Peer already exists so we just add the track to their MediaStream object
          if (existingPeer.id === peer.id) {
            console.log("Adding new track for client");
            peer.track.enabled = false; // We need the stream to be disabled by default
            existingPeer.stream.addTrack(peer.track);
          }
        });
      });

      Room.on("peer.disconnected", (peer) => {
        console.log("Client disconnected, removing stream");
        this.peers = this.peers.filter((p) => {
          return p.id !== peer.id;
        });
      });

      Room.on("comment", (comment) => {
        comment.fromNow = "just now";
        this.comments.push(comment);
      });

      Room.on("votes.update", (votes) => {
        this.votes = votes;
      });

      Room.on("conversation.type.set", (conversation) => {
        if (conversation.type === "loose") {
          this.peers.forEach((peer) => {
            peer.active = true;
            peer.stream.getTracks().forEach((track) => {
              track.enabled = true;
            });
          });
          this.conversation = conversation;
          this.conversation.friendlyType = "Loose";
        } else if (conversation.type === "byturn") {
          this.conversation = conversation;
          this.conversation.friendlyType = "By Turn";
        }
      });

      Room.on("time.left", (secondsLeft) => {
        this.countdown.secondsLeft = secondsLeft;
        this.countdown.updateId = uuidv4();
      });

      Room.on("active.peer", (peerId) => {
        if (peerId != this.activePeer.id) {
          if (this.activePeerExists()) {
            this.deactivatePeer();
          }

          let peerToActivate = this.getPeerFromId(peerId);
          this.activatePeer(peerToActivate);
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

.home {
  background: $petrol-5;
  color: $petrol-1;
}
#video-wrapper {
  position: relative;
  background: $background-tint-4;
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
  margin-left: 0.8%;
  margin-top: 0.8%;
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.75);
  touch-action: none;
}
#errorAlert {
  position: absolute;
  right: 0;
  z-index: 5;
}
</style>
