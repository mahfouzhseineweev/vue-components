import HeaderContainer from './HeaderContainer.vue';

export default {
  component: HeaderContainer,
  title: 'Components/Media/HeaderContainer'
};

const Template = (args, { argTypes }) => ({
  components: { HeaderContainer },
  setup() {
    return { args };
  },
  props: Object.keys(argTypes),
  template: '<HeaderContainer v-bind="$props" />',
});


export const Primary = Template.bind({});

