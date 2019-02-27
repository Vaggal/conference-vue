<template>
  <div>
    <font-awesome-icon icon="user" class="fa-3x"/>
    <span class="user-badge badge badge-pill badge-info">{{ votes }}</span>
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
</style>
