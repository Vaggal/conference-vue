<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import "@/../node_modules/bootstrap/scss/bootstrap.scss";
@import "@/assets/variables.scss";

html,
body,
#app {
  height: 100%;
  overflow: hidden;
}
.custom-select {
  background-color: $petrol-1 !important;
}
.custom-select:focus,
.form-control:focus {
  border-color: $petrol-4 !important;
  box-shadow: 0 0 0 0.1rem $petrol-6 !important;
}
.btn-primary {
  color: $petrol-1 !important;
  background-color: $petrol-5 !important;
  border-color: $petrol-5 !important;
}
</style>
