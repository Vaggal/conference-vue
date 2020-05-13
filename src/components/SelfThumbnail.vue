<template>
  <div :class="{ active: selfActive }">
    <font-awesome-icon icon="user-alt" class="fa-3x" />
    <span v-if="votingEnabled" class="user-badge badge badge-pill badge-info">{{ votes }}</span>
  </div>
</template>

<script>
export default {
  name: "SelfThumbnail",
  props: {
    votingEnabled: Boolean,
    selfActive: Boolean,
    selfVotes: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      votes: this.selfVotes,
    };
  },
  watch: {
    selfVotes: function () {
      this.votes = this.selfVotes;
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
