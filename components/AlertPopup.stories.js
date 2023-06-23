import AlertPopup from './AlertPopup.vue';

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
  template: '<AlertPopup v-bind="$props" />',
});


export const Primary = Template.bind({});

