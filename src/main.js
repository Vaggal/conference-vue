import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
// eslint-disable-next-line no-unused-vars
import adapter from "webrtc-adapter";
import "./components";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
