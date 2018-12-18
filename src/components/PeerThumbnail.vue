<template>
  <div @click="incrementVotes">
    <font-awesome-icon icon="user" class="fa-3x"/>
    <span class="user-badge badge badge-pill badge-info">{{ votes }}</span>
  </div>
</template>

<script>
export default {
  name: 'PeerThumbnail',
  data() {
    return {
      votes: 0
    }
  },
  methods: {
    incrementVotes() {
      this.votes++;
    }
  },
  props: {}
};
</script>

<style scoped lang='scss'>
.user-badge {
  position: absolute;
  margin-left: -13px;
}
</style>
