<template>
  <div
    class="thumbnail"
    :class="{ active: peerActive, votable: votingEnabled && !voted }"
    @click="incrementVotes"
  >
    <div>
      <font-awesome-icon icon="user" class="peer-icon" />
      <span v-if="votingEnabled" class="user-badge badge badge-pill badge-info">
        {{ votes }}
      </span>
    </div>
    <div>{{ peerUsername }}</div>
  </div>
</template>

<script>
export default {
  name: "PeerThumbnail",
  props: {
    votingEnabled: Boolean,
    peerId: {
      type: Number,
      default: 0,
    },
    peerUsername: {
      type: String,
      default: "",
    },
    peerActive: Boolean,
    peerVotes: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      voted: false,
      votes: this.peerVotes,
    };
  },
  watch: {
    peerVotes: function () {
      if (this.peerVotes == 0) {
        this.voted = false;
      }
      this.votes = this.peerVotes;
    },
  },
  methods: {
    incrementVotes() {
      if (this.votingEnabled && !this.voted) {
        this.voted = true;
        this.votes++;
        this.$emit("votes-increment", this.peerId);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.user-badge {
  position: absolute;
  margin-left: -13px;
}
.active {
  color: $petrol-1;
}
.thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $petrol-6;
}
.votable {
  cursor: pointer;
}
.peer-icon {
  font-size: 2.5em;
}
</style>
