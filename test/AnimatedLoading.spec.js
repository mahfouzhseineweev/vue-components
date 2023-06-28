import { mount } from "@vue/test-utils";
import AnimatedLoading from "../components/AnimatedLoading.vue";

describe("AnimatedLoading", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(AnimatedLoading);
    expect(wrapper.vm).toBeTruthy();
  });
});
