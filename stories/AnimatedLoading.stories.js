import AnimatedLoading from '../src/runtime/components/AnimatedLoading.vue';

export default {
  component: AnimatedLoading,
  title: 'Components/Other/AnimatedLoading',
};

const Template = (args, { argTypes }) => ({
  args: {

  },
  components: { AnimatedLoading },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<AnimatedLoading v-bind="args" />',
});


export const Primary = Template.bind({});

