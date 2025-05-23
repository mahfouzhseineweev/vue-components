import AlertPopup from '../src/runtime/components/AlertPopup.vue';

export default {
  component: AlertPopup,
  title: 'Components/Media/AlertPopup'
};

const Template = (args, { argTypes }) => ({
  components: { AlertPopup },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<AlertPopup v-bind="args" />',
});


export const Primary = Template.bind({});

