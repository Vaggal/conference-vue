import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import adapter from 'webrtc-adapter';

import {
  library
} from '@fortawesome/fontawesome-svg-core';

import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';

import {
  faUser
} from "@fortawesome/free-solid-svg-icons";

library.add(faUser);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
