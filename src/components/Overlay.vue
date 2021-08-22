<template>
  <div class="overlay" :class="{ invisible: usernameSaved }">
    <div class="centering-wrapper">
      <div class="header-container">
        <h1 class="header">THESIS CHAT</h1>
      </div>
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
              ref="usernameInput"
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
    this.$refs.usernameInput.focus();
  },
  methods: {
    saveUsername() {
      this.usernameSaved = true;
      this.$emit("save-username", this.username);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/variables.scss";

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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.header-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header {
  font-family: "Montserrat", Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-shadow: 0 0 0.15em $yellow;
  user-select: none;
  white-space: nowrap;
}
#username-form {
  justify-content: center;
}
.note {
  color: $petrol-1;
}
</style>
