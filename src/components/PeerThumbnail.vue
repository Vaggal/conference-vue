<template>
  <div @click="incrementVotes" v-bind:class="{ active: peerActive }">
    <font-awesome-icon icon="user" class="fa-3x"/>
    <span v-if="votingEnabled" class="user-badge badge badge-pill badge-info">{{ votes }}</span>
  </div>
</template>

<script>
export default {
  name: 'PeerThumbnail',
  data() {
    return {
      votes: this.peerVotes
    }
  },
  props: {
    votingEnabled: Boolean,
    peerId: Number,
    peerActive: Boolean,
    peerVotes: Number
  },
  watch: {
    peerVotes: function () {
      this.votes = this.peerVotes;
    }
  },
  methods: {
    incrementVotes() {
      if (this.votingEnabled) {
        this.votes++;
        this.$emit('votes-increment', this.peerId);
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.user-badge {
  position: absolute;
  margin-left: -13px;
}
.active {
  color: #fff;
}
</style>
