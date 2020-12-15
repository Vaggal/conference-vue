<template>
  <div class="overlay" :class="{ invisible: usernameSaved }">
    <div class="centering-wrapper">
      <div class="form-container">
        <div class="note mb-2">
          Please set a username before entering the chat
        </div>
        <form
          id="username-form"
          class="form-inline"
          @submit.prevent="saveUsername()"
        >
          <div class="form-group">
            <input
              id="username-input"
              v-model="username"
              type="text"
              class="form-control"
              aria-describedby="username"
              placeholder="Enter username"
            />
          </div>
          <button
            type="button"
            class="btn btn-primary ml-1"
            @click="saveUsername()"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Overlay",
  data() {
    return {
      usernameSaved: false,
      username: "",
    };
  },
  mounted() {
    document.getElementById("username-input").focus();
  },
  methods: {
    saveUsername() {
      this.usernameSaved = true;
      this.$emit("save-username", this.username);
    },
  },
};
</script>

<style>
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  background: black;
  top: 0;
  left: 0;
  z-index: 1;
}
.centering-wrapper {
  display: flex;
  justify-content: center;
  height: 100%;
}
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#username-form {
  justify-content: center;
}
.note {
  color: #fff;
}
</style>
