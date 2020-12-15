<template>
  <div class="chat">
    <div class="card chat-card">
      <div class="card-header msg_head">
        <span>Chat with peers</span>
      </div>
      <div class="card-body msg_card_body">
        <div
          v-for="(comment, key) in comments"
          :key="key"
          class="d-flex mb-4"
          :class="[
            comment.userId == selfId
              ? 'justify-content-start flex-row-reverse'
              : 'justify-content-start flex-row',
          ]"
        >
          <div class="img_cont_msg flex-shrink-0">
            <span>{{ comment.username.charAt(0) }}</span>
          </div>
          <div
            :class="[
              comment.userId == selfId ? 'msg_cotainer_send' : 'msg_cotainer',
            ]"
          >
            <div class="msg_username_container">
              <span
                :class="[
                  comment.userId == selfId
                    ? 'msg_username_send'
                    : 'msg_username',
                ]"
                >{{ comment.username }}</span
              >
            </div>
            <div class="msg">
              {{ comment.message }}
            </div>
            <span
              :class="[comment.userId == selfId ? 'msg_time_send' : 'msg_time']"
              >{{ comment.fromNow }}</span
            >
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="input-group">
          <textarea
            v-model="message"
            class="form-control type_msg"
            placeholder="Write your message..."
          ></textarea>
          <div class="input-group-append" @click="sendComment($event)">
            <span class="input-group-text send_btn">
              <font-awesome-icon icon="location-arrow" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import autosize from "autosize";
import fromnow from "fromnow";

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
  mounted() {
    let textarea = document.querySelector("textarea");
    autosize(textarea);
    textarea.addEventListener("keydown", (e) => {
      if (!e.ctrlKey && e.keyCode === 13) {
        e.preventDefault();
        this.sendComment();
      } else if (e.ctrlKey && e.keyCode === 13) {
        this.message += "\n";
      }
    });
    setInterval(() => {
      this.comments.forEach((comment) => {
        let agoString = fromnow(comment.date) === "just now" ? "" : " ago";
        comment.fromNow = fromnow(comment.date) + agoString;
      });
    }, 1000);
  },
  methods: {
    sendComment() {
      if (this.message.trim().length > 0) {
        this.$emit("new-comment", this.message);
      }
      this.message = "";
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/variables.scss";

.chat {
  height: 100vh;
  margin-top: auto;
  margin-bottom: auto;
}
.chat-card {
  height: 100%;
  background-color: $background-tint-4 !important;
}
.contacts_body {
  padding: 0.75rem 0 !important;
  overflow-y: auto;
  white-space: nowrap;
}
.msg_card_body {
  height: 100%;
  overflow-y: auto;
}
.card-header {
  font-size: 20px;
  color: $petrol-1;
  // border-radius: 15px 15 px 0 0 !important;
  text-align: center;
  border-bottom: 0 !important;
  background-color: $background-tint-2;
}
.card-footer {
  // border-radius: 0 0 15px 15px !important;
  border-top: 0 !important;
}
.container {
  align-content: center;
}
.type_msg {
  background-color: $background-tint-3 !important;
  border: 0 !important;
  color: $petrol-1;
  overflow-y: auto;
}
.type_msg:focus {
  box-shadow: none !important;
  outline: 0px !important;
}
.send_btn {
  // border-radius: 0 15px 15px 0 !important;
  background-color: $background-tint-3 !important;
  border: 0 !important;
  color: $petrol-1;
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
  background-color: $background-tint-3;
}
.user_img {
  height: 70px;
  width: 70px;
  border: 1.5px solid $petrol-1;
}
.user_img_msg {
  height: 40px;
  width: 40px;
  border: 1.5px solid $petrol-1;
}
.img_cont {
  position: relative;
  height: 70px;
  width: 70px;
}
.img_cont_msg {
  height: 40px;
  width: 40px;
  border: 1.5px solid $petrol-1;
  border-radius: 50% !important;
  display: flex;
  align-items: center;
  color: $petrol-1;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
  background-color: gray;
  // margin-right: 2px;
}
.video_cam {
  margin-left: 50px;
  margin-top: 5px;
}
.video_cam span {
  color: $petrol-1;
  font-size: 20px;
  cursor: pointer;
  margin-right: 20px;
}
.msg_cotainer,
.msg_cotainer_send {
  word-break: break-all;
  margin-top: auto;
  margin-bottom: auto;
  // border-radius: 25px;
  border-radius: 3.5px;
  position: relative;
  white-space: pre-wrap;
}
.msg_cotainer {
  margin-left: 10px;
  background-color: #82ccdd;
}
.msg_cotainer_send {
  margin-right: 10px;
  background-color: #78e08f;
}
.msg_username_container {
  position: relative;
}
.msg_username,
.msg_username_send {
  position: absolute;
  left: 14px;
  color: rgba(14, 14, 14, 0.5);
  font-size: 10px;
}
.msg_time_send,
.msg_time {
  position: absolute;
  right: 0;
  bottom: -15px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 10px;
}
.msg {
  padding: 10px;
  min-width: 65px;
}
.msg_head {
  position: relative;
}
@media (max-width: 576px) {
  .contacts_card {
    margin-bottom: 15px !important;
  }
}
</style>
