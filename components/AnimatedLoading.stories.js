import AnimatedLoading from './AnimatedLoading.vue';

export default {
  component: AnimatedLoading,
  title: 'Components/Other/AnimatedLoading',
};

const Template = (args, { argTypes }) => ({
  components: { AnimatedLoading },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<AnimatedLoading v-bind="$props" />',
});


export const Primary = Template.bind({});

