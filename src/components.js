import Vue from "vue";
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
// eslint-disable-next-line vue/component-definition-name-casing
Vue.component("font-awesome-icon", FontAwesomeIcon);
