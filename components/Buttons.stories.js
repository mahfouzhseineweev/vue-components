import Buttons from './Buttons.vue';

export default {
  component: Buttons,
  title: 'Components/Form Components/Buttons',
  args: {
    iconStyle: {
      activeIconStyle: '',
      inActiveIconStyle: '',
      src: require('../assets/images/rotate.svg')
    }
  }
};

const Template = (args, { argTypes }) => ({
  components: { Buttons },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<Buttons v-bind="$props" />',
});


export const Primary = Template.bind({});

