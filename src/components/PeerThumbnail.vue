<template>
  <div :class="{ active: peerActive }" @click="incrementVotes">
    <font-awesome-icon icon="user" class="fa-3x" />
    <span v-if="votingEnabled" class="user-badge badge badge-pill badge-info">
      {{ votes }}
    </span>
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
    peerActive: Boolean,
    peerVotes: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      votes: this.peerVotes,
    };
  },
  watch: {
    peerVotes: function () {
      this.votes = this.peerVotes;
    },
  },
  methods: {
    incrementVotes() {
      if (this.votingEnabled) {
        this.votes++;
        this.$emit("votes-increment", this.peerId);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.user-badge {
  position: absolute;
  margin-left: -13px;
}
.active {
  color: #fff;
}
</style>
