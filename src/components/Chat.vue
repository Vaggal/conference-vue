<template>
  <div class="chat">
    <div class="card">
      <div class="card-header msg_head">
        <div class="d-flex bd-highlight">
          <div class="user_info">
            <span>Chat with peers</span>
          </div>
        </div>
        <span id="action_menu_btn">
          <i class="fas fa-ellipsis-v"></i>
        </span>
        <div class="action_menu">
          <ul></ul>
        </div>
      </div>
      <div class="card-body msg_card_body">
        <div
          v-for="(comment, key) in comments"
          :key="key"
          class="d-flex mb-4"
          :class="[
            comment.userId == selfId
              ? 'justify-content-start'
              : 'justify-content-end',
          ]"
        >
          <div class="img_cont_msg">
            <img
              src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
              class="rounded-circle user_img_msg"
            />
          </div>
          <div
            :class="[
              comment.userId == selfId ? 'msg_cotainer' : 'msg_cotainer_send',
            ]"
          >
            {{ comment.message }}
            <span
              :class="[comment.userId == selfId ? 'msg_time' : 'msg_time_send']"
              >{{ comment.date }}</span
            >
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="input-group">
          <div class="input-group-append">
            <span class="input-group-text attach_btn">
              <i class="fas fa-paperclip"></i>
            </span>
          </div>
          <textarea
            v-model="message"
            class="form-control type_msg"
            placeholder="Write your message..."
          ></textarea>
          <div class="input-group-append" @click="sendComment($event)">
            <span class="input-group-text send_btn">
              <i class="fas fa-location-arrow"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
  props: {
    comments: {
      type: Array,
      default: () => [],
    },
    selfId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  watch: {},
  updated() {},
  methods: {
    sendComment() {
      this.$emit("new-comment", this.message);
    },
  },
};
</script>

<style scoped lang="scss">
body,
html {
  height: 100%;
  margin: 0;
  background: #7f7fd5;
  background: -webkit-linear-gradient(to right, #91eae4, #86a8e7, #7f7fd5);
  background: linear-gradient(to right, #91eae4, #86a8e7, #7f7fd5);
}

.chat {
  margin-top: auto;
  margin-bottom: auto;
}
.card {
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.contacts_body {
  padding: 0.75rem 0 !important;
  overflow-y: auto;
  white-space: nowrap;
}
.msg_card_body {
  overflow-y: auto;
}
.card-header {
  // border-radius: 15px 15 px 0 0 !important;
  border-bottom: 0 !important;
}
.card-footer {
  // border-radius: 0 0 15px 15px !important;
  border-top: 0 !important;
}
.container {
  align-content: center;
}
.type_msg {
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  height: 60px !important;
  overflow-y: auto;
}
.type_msg:focus {
  box-shadow: none !important;
  outline: 0px !important;
}
.attach_btn {
  // border-radius: 15px 0 0 15px !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
}
.send_btn {
  // border-radius: 0 15px 15px 0 !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: white !important;
  cursor: pointer;
}
.contacts {
  list-style: none;
  padding: 0;
}
.contacts li {
  width: 100% !important;
  padding: 5px 10px;
  margin-bottom: 15px !important;
}
.active {
  background-color: rgba(0, 0, 0, 0.3);
}
.user_img {
  height: 70px;
  width: 70px;
  border: 1.5px solid #f5f6fa;
}
.user_img_msg {
  height: 40px;
  width: 40px;
  border: 1.5px solid #f5f6fa;
}
.img_cont {
  position: relative;
  height: 70px;
  width: 70px;
}
.img_cont_msg {
  height: 40px;
  width: 40px;
}
.user_info {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 15px;
}
.user_info span {
  font-size: 20px;
  color: white;
}
.user_info p {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}
.video_cam {
  margin-left: 50px;
  margin-top: 5px;
}
.video_cam span {
  color: white;
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
}
.msg_cotainer {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
  // border-radius: 25px;
  border-radius: 3.5px;
  background-color: #82ccdd;
  padding: 10px;
  position: relative;
}
.msg_cotainer_send {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 10px;
  // border-radius: 25px;
  border-radius: 3.5px;
  background-color: #78e08f;
  padding: 10px;
  position: relative;
}
.msg_time {
  position: absolute;
  left: 0;
  bottom: -15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
}
.msg_time_send {
  position: absolute;
  right: 0;
  bottom: -15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
}
.msg_head {
  position: relative;
}
#action_menu_btn {
  position: absolute;
  right: 10px;
  top: 10px;
  color: white;
  cursor: pointer;
  font-size: 20px;
}
.action_menu {
  z-index: 1;
  position: absolute;
  padding: 15px 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  // border-radius: 15px;
  top: 30px;
  right: 15px;
  display: none;
}
.action_menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.action_menu ul li {
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 5px;
}
.action_menu ul li i {
  padding-right: 10px;
}
.action_menu ul li:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
}
@media (max-width: 576px) {
  .contacts_card {
    margin-bottom: 15px !important;
  }
}
</style>
