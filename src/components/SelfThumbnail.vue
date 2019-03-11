<template>
  <div v-bind:class="{ active: selfActive }">
    <font-awesome-icon icon="user-alt" class="fa-3x"/>
    <span v-if="votingEnabled" class="user-badge badge badge-pill badge-info">{{ votes }}</span>
  </div>
</template>

<script>
export default {
  name: 'SelfThumbnail',
  data() {
    return {
      votes: this.selfVotes
    }
  },
  props: {
    votingEnabled: Boolean,
    selfActive: Boolean,
    selfVotes: Number
  },
  watch: {
    selfVotes: function () {
      this.votes = this.selfVotes;
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
