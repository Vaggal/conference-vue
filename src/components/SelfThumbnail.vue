<template>
  <div class="thumbnail" :class="{ active: selfActive }">
    <div>
      <font-awesome-icon icon="user-alt" class="fa-3x" />
      <span
        v-if="votingEnabled"
        class="user-badge badge badge-pill badge-info"
        >{{ votes }}</span
      >
    </div>
    <div>{{ selfUsername }}</div>
  </div>
</template>

<script>
// TODO: we need flexbox implementation for self and peer thumbnails
// TODO: Why do we need selfVotes property AND votes variable???
export default {
  name: "SelfThumbnail",
  props: {
    votingEnabled: Boolean,
    selfActive: Boolean,
    selfUsername: {
      type: String,
      default: "",
    },
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
.thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: frgb(160, 160, 160);
}
</style>
