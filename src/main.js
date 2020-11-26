import Vue from "vue";
import App from "@/App.vue";
import router from "@/router";
// eslint-disable-next-line no-unused-vars
import adapter from "webrtc-adapter";

import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faUser,
  faUserAlt,
  faEllipsisV,
  faLocationArrow,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";

library.add([faUser, faUserAlt, faEllipsisV, faLocationArrow, faPaperclip]);
Vue.component("FontAwesomeIcon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
