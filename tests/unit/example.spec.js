import { shallowMount } from "@vue/test-utils";
import ChatComponent from "@/components/Chat.vue";

describe("Chat.vue", () => {
  it("renders 'Chat with peers'", () => {
    const msg = "Chat with peers";
    const wrapper = shallowMount(ChatComponent, {});
    expect(wrapper.text()).toMatch(msg);
  });
});
