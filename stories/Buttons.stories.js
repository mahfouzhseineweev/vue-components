import Buttons from '../src/runtime/components/Buttons.vue';
import rotateIcon from '../src/runtime/assets/images/rotate.svg';

export default {
  component: Buttons,
  title: 'Components/Form Components/Buttons',
  args: {
    iconStyle: {
      activeIconStyle: '',
      inActiveIconStyle: '',
      src: rotateIcon
    }
  }
};

const Template = (args, { argTypes }) => ({
  components: { Buttons },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<Buttons v-bind="args" />',
});


export const Primary = Template.bind({});

