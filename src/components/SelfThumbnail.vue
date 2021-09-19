<template>
  <div class="thumbnail" :class="{ active: selfActive }">
    <div>
      <font-awesome-icon icon="user-alt" class="self-icon" />
      <span
        v-if="votingEnabled"
        class="user-badge badge rounded-pill badge-info"
        >{{ votes }}</span
      >
    </div>
    <div>{{ selfUsername }}</div>
  </div>
</template>

<script>
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
@import "@/assets/variables.scss";

.user-badge {
  position: absolute;
  margin-left: -13px;
}
.active {
  color: $petrol-1 !important;
}
.thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: $petrol-6;
}
.self-icon {
  font-size: 2.5em;
}
</style>
