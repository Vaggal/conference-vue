import Vue from "vue";
import Router from "vue-router";
import Room from "@/views/Room.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/room/:roomId",
      name: "active-room",
      component: Room,
    },
    {
      path: "/room",
      name: "room",
      component: Room,
    },
    {
      path: "*",
      name: "default-room",
      component: Room,
    },
  ],
});
